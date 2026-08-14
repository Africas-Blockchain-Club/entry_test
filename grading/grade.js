#!/usr/bin/env node
/**
 * Auto-marker for the Blockchain Developer Entry Test.
 *
 *   node grading/grade.js
 *
 * Marks everything and prints a score out of 100. No human marking.
 *
 * Reads:
 *   grading/report.json      mocha JSON from the grading suite (contracts)
 *   grading/own.json         mocha JSON from the candidate's own tests
 *   grading/answers.key.json hashed MCQ key
 *   PartA_MCQ_Answers.md     the candidate's answers
 *
 * Writes:
 *   grading/report.md        the full breakdown
 *   grading/score.json       machine-readable totals
 *   $GITHUB_STEP_SUMMARY     the report, when running in GitHub Actions
 *
 * Writes grading/score.json for the local assessor tool (assessor/assess.js).
 *
 * This is a RANKED SELECTION, not a pass/fail gate - the script always exits 0
 * and never prints a pass mark.
 *
 * MCQ ANSWER LOCKING
 * ------------------
 * MCQ answers are marked from the FIRST commit in which all eight questions are
 * answered, not from the latest commit. Pushing new answers afterwards changes
 * nothing. This is what stops the score being brute-forced one letter at a time,
 * and it is stated plainly in the README so nobody is caught out by it.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const REPORT_JSON = path.join(__dirname, "report.json");
const OWN_JSON = path.join(__dirname, "own.json");
const REASONING_JSON = path.join(__dirname, "reasoning.json");
const SCORE_JSON = path.join(__dirname, "score.json");
const KEY_FILE = path.join(__dirname, "answers.key.json");
const REPORT_MD = path.join(__dirname, "report.md");
const MCQ_FILE = "PartA_MCQ_Answers.md";

const MCQ_TOTAL = 24; // 3 per correct letter
const MCQ_QUESTIONS = 8;
const MARKS_PER_MCQ = MCQ_TOTAL / MCQ_QUESTIONS;
const CODE_TOTAL = 50;
const REASONING_TOTAL = 23; // marked by Claude - see grading/mark-reasoning.js
const OWN_TEST_TOTAL = 3;

// --- small helpers ---------------------------------------------------------

function readJsonLoosely(file) {
  // Hardhat may print compiler noise before mocha's JSON. Start at the first {.
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const start = raw.indexOf("{");
  if (start === -1) return null;
  try {
    return JSON.parse(raw.slice(start));
  } catch {
    return null;
  }
}

function git(cmd) {
  try {
    return execSync(`git ${cmd}`, { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

const marksFromTitle = (t) => {
  const m = t.match(/^\s*\[(\d+)\]/);
  return m ? parseInt(m[1], 10) : 0;
};
const cleanTitle = (t) => t.replace(/^\s*\[\d+\]\s*/, "");

// --- Part B: contract tests ------------------------------------------------

function gradeCode() {
  const report = readJsonLoosely(REPORT_JSON);
  if (!report) {
    return {
      awarded: 0,
      rows: [],
      compiled: false,
      note:
        "The grading tests could not run at all. This nearly always means your contracts do not compile. Run `npx hardhat compile` locally and fix the errors - every code mark depends on it.",
    };
  }

  const rows = [];
  let awarded = 0;

  for (const t of report.passes || []) {
    const marks = marksFromTitle(t.title);
    awarded += marks;
    rows.push({
      suite: t.fullTitle.replace(t.title, "").trim(),
      title: cleanTitle(t.title),
      marks,
      got: marks,
      ok: true,
    });
  }
  for (const t of [...(report.failures || []), ...(report.pending || [])]) {
    rows.push({
      suite: t.fullTitle.replace(t.title, "").trim(),
      title: cleanTitle(t.title),
      marks: marksFromTitle(t.title),
      got: 0,
      ok: false,
      why: (t.err && (t.err.message || "").split("\n")[0]) || "did not pass",
    });
  }

  return { awarded, rows, compiled: true, note: null };
}

// --- Part A: MCQ -----------------------------------------------------------

function parseAnswers(text) {
  // Ignore the worked example in the instructions and the backticked mentions.
  text = text.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");

  const answers = new Array(MCQ_QUESTIONS).fill(null);
  const sections = text.split(/^###\s*Question\s*(\d+)/gm);
  for (let i = 1; i < sections.length; i += 2) {
    const q = parseInt(sections[i], 10);
    const body = sections[i + 1] || "";
    const m = body.match(/^\*\*Your Answer:\*\*\s*(.*)$/m);
    if (!m) continue;
    const letter = m[1].trim().match(/^\(?([A-Da-d])\)?[.)]?\s*$/);
    if (letter && q >= 1 && q <= MCQ_QUESTIONS) answers[q - 1] = letter[1].toUpperCase();
  }
  return answers;
}

const isComplete = (a) => a.filter(Boolean).length === MCQ_QUESTIONS;

/**
 * Walk history oldest-first and return the first commit where all eight
 * answers are present, along with the answers from that commit.
 */
function lockedAnswers() {
  const current = fs.existsSync(path.join(ROOT, MCQ_FILE))
    ? parseAnswers(fs.readFileSync(path.join(ROOT, MCQ_FILE), "utf8"))
    : new Array(MCQ_QUESTIONS).fill(null);

  const log = git(`log --reverse --format=%H -- ${MCQ_FILE}`);
  if (!log) {
    // No git history available (shallow clone, or run outside a repo).
    return { answers: current, sha: null, locked: false, changes: null };
  }

  const shas = log.split("\n").filter(Boolean);
  let changes = 0;
  let previous = null;

  for (const sha of shas) {
    const blob = git(`show ${sha}:${MCQ_FILE}`);
    if (blob === null) continue;
    const answers = parseAnswers(blob);
    const fingerprint = answers.join("");
    if (previous !== null && fingerprint !== previous) changes++;
    previous = fingerprint;

    if (isComplete(answers)) {
      return { answers, sha: sha.slice(0, 7), locked: true, changes };
    }
  }

  return { answers: current, sha: null, locked: false, changes };
}

function gradeMcq() {
  const { answers, sha, locked, changes } = lockedAnswers();

  let key = null;
  try {
    key = JSON.parse(fs.readFileSync(KEY_FILE, "utf8"));
  } catch {
    return { awarded: 0, rows: [], keyMissing: true, sha, locked, changes };
  }

  let awarded = 0;
  const rows = answers.map((given, i) => {
    const q = i + 1;
    const expected = key.hashes[String(q)];
    const ok =
      given !== null &&
      crypto.createHash("sha256").update(key.salt + q + given).digest("hex") === expected;
    if (ok) awarded += MARKS_PER_MCQ;
    return { q, given: given || "-", ok };
  });

  return { awarded, rows, keyMissing: false, sha, locked, changes };
}

// --- Written work (completeness only, auto-checked) ------------------------

function gradeOwnTest() {
  const dir = path.join(ROOT, "test");
  const ownFiles = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith(".js") && f !== "example.test.js")
    : [];
  const own = readJsonLoosely(OWN_JSON);
  const ownPasses = own && own.stats ? own.stats.passes : 0;
  const ok = ownFiles.length >= 1 && ownPasses > 0;
  return {
    awarded: ok ? OWN_TEST_TOTAL : 0,
    ok,
    detail: `${ownFiles.length} file(s) besides the example, ${ownPasses} passing test(s) overall`,
  };
}

// --- Reasoning, marked by Claude (grading/mark-reasoning.js) --------------

function gradeReasoning() {
  const data = readJsonLoosely(REASONING_JSON);
  if (!data || !data.marked) {
    return { marked: false, awarded: 0, items: [], reason: data ? data.reason : "not run" };
  }
  return { marked: true, awarded: data.awarded, items: data.items || [] };
}

// --- report ----------------------------------------------------------------

function main() {
  const code = gradeCode();
  const mcq = gradeMcq();
  const ownTest = gradeOwnTest();
  const reasoning = gradeReasoning();

  const total = mcq.awarded + code.awarded + ownTest.awarded + reasoning.awarded;
  const ceiling = reasoning.marked ? total : total + REASONING_TOTAL;

  const L = [];
  L.push("# Entry Test - Score");
  L.push("");
  L.push(`## ${total} / 100 so far`);
  L.push("");
  L.push(
    reasoning.marked
      ? "This is your full score. Every section is broken down below."
      : `That is the automatically marked part. Your written reasoning is worth a further **${REASONING_TOTAL} marks** and is marked after you submit, so your final score will be between ${total} and ${ceiling}.`
  );
  L.push("");
  L.push(
    "> Places are limited and we take the strongest submissions, so there is no score at which you can stop working. Keep pushing until time is called - every mark below is one you can still take."
  );
  L.push("");
  L.push("| Section | Marks |");
  L.push("|---|---|");
  L.push(`| Part A - MCQ answers | ${mcq.awarded} / ${MCQ_TOTAL} |`);
  L.push(`| Part B - contracts | ${code.awarded} / ${CODE_TOTAL} |`);
  L.push(`| Your own test | ${ownTest.awarded} / ${OWN_TEST_TOTAL} |`);
  L.push(
    `| Written reasoning | ${reasoning.marked ? `${reasoning.awarded} / ${REASONING_TOTAL}` : `pending (${REASONING_TOTAL} available)`} |`
  );
  L.push(`| **Total** | **${total} / 100** |`);
  L.push("");
  L.push("---");
  L.push("");

  // MCQ
  L.push(`## Part A: MCQ - ${mcq.awarded} / ${MCQ_TOTAL}`);
  L.push("");
  if (mcq.keyMissing) {
    L.push("> The answer key file is missing, so the MCQs could not be marked.");
  } else {
    L.push("| Q | Your answer | Correct |");
    L.push("|---|---|---|");
    for (const r of mcq.rows) L.push(`| ${r.q} | ${r.given} | ${r.ok ? "yes" : "no"} |`);
    L.push("");
    if (mcq.locked) {
      L.push(
        `> Marked from commit \`${mcq.sha}\` - the first push where all eight were answered. **Your answers are locked at that commit**, so changing them now will not change this score.`
      );
    } else {
      L.push(
        "> **Not yet locked.** You have not pushed a complete set of eight answers. Whichever push first contains all eight is the one that counts, so make sure you are happy with every answer before you push them together."
      );
    }
  }
  L.push("");

  // Code
  L.push(`## Part B: contracts - ${code.awarded} / ${CODE_TOTAL}`);
  L.push("");
  if (!code.compiled) {
    L.push(`> ${code.note}`);
  } else {
    let suite = null;
    L.push("| | Test | Marks |");
    L.push("|---|---|---|");
    for (const r of [...code.rows].sort((a, b) => a.suite.localeCompare(b.suite))) {
      if (r.suite !== suite) {
        suite = r.suite;
        L.push(`| | **${suite}** | |`);
      }
      L.push(`| ${r.ok ? "PASS" : "FAIL"} | ${r.title} | ${r.got} / ${r.marks} |`);
    }
    const failed = code.rows.filter((r) => !r.ok);
    if (failed.length) {
      L.push("");
      L.push("<details><summary>Why the failing tests failed</summary>");
      L.push("");
      for (const r of failed) L.push(`- **${r.title}** - ${r.why}`);
      L.push("");
      L.push("</details>");
    }
  }
  L.push("");

  // Own test
  L.push(`## Your own test - ${ownTest.awarded} / ${OWN_TEST_TOTAL}`);
  L.push("");
  L.push(
    `${ownTest.ok ? "PASS" : "FAIL"} - ${ownTest.detail}. You need at least one test file of your own in \`test/\` (not \`example.test.js\`), and the suite must have at least one passing test.`
  );
  L.push("");

  // Reasoning
  L.push(
    `## Written reasoning - ${reasoning.marked ? `${reasoning.awarded} / ${REASONING_TOTAL}` : `pending, ${REASONING_TOTAL} available`}`
  );
  L.push("");
  if (reasoning.marked) {
    L.push("| Item | Marks | Comment |");
    L.push("|---|---|---|");
    for (const r of reasoning.items) {
      L.push(`| ${r.label} | ${r.marks} / ${r.max} | ${r.justification.replace(/\|/g, "-")} |`);
    }
  } else {
    L.push(
      "> Your reasoning boxes, the randomness section of your design document, and the attacker section of your test plan are worth **23 marks**. They are marked after you submit, so they do not appear in the score above."
    );
    L.push("");
    L.push(
      "> They are not a formality. **Leave a reasoning box blank and it scores zero** - that is 23 marks gone. Write two or three honest sentences for each one. Saying \"I ran out of time\" or \"yes, this attack works against my code\" earns marks; claiming everything is secure when it is not earns none."
    );
  }
  L.push("");

  const out = L.join("\n");
  fs.writeFileSync(REPORT_MD, out);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, out);
  console.log(out);

  // Machine-readable, for assessor/assess.js
  fs.writeFileSync(
    SCORE_JSON,
    JSON.stringify(
      {
        total,
        ceiling,
        reasoning_marked: reasoning.marked,
        sections: {
          mcq: { awarded: mcq.awarded, total: MCQ_TOTAL },
          code: { awarded: code.awarded, total: CODE_TOTAL, compiled: code.compiled },
          own_test: { awarded: ownTest.awarded, total: OWN_TEST_TOTAL },
          reasoning: { awarded: reasoning.awarded, total: REASONING_TOTAL, marked: reasoning.marked },
        },
        mcq_locked_commit: mcq.sha || null,
        mcq_answer_changes: mcq.changes,
      },
      null,
      2
    )
  );

  // This is a ranked selection, not a pass/fail gate - never fail the run.
  process.exit(0);
}

main();
