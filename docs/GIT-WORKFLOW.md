# Git Workflow Reference

**Quick reference card for Git commands during the assessment**

---

## Essential Workflow (Every 15 Minutes)

```bash
# 1. Check what files you've changed
git status

# 2. Stage all changes
git add .

# 3. Example of a commit with descriptive message
git commit -m "Progress: implemented registerWorker function"

# 4. Push to GitLab
git push origin main
```

---

## Before You Start

### Check Your Git Configuration

```bash
# Verify your identity
git config user.name
git config user.email

# View all config
git config --list
```

### Verify Repository Setup

```bash
# Check remote URL (should be YOUR fork)
git remote -v

# Expected output:
# origin  https://gitlab.wethinkco.de/YOUR_USERNAME/entry_test.git
```

---

## During Assessment

### Staging Files

```bash
# Stage all changes
git add .

# Stage specific file
git add contracts/SkillsMarketplace.sol

# Stage multiple specific files
git add PartA_MCQ_Answers.md PartB_Design.md
```

### Committing Changes

```bash
# Commit with message
git commit -m "Progress: completed MCQ Part A"

# Commit specific files
git commit -m "Update: added postGig function" contracts/SkillsMarketplace.sol
```

#### Good Commit Messages

**Good:**
- "Progress: implemented worker registration"
- "Fix: resolved reentrancy vulnerability"
- "Complete: finished Part A MCQ"
- "Update: added test scenarios to PartB_Tests.md"

**Bad:**
- "update"
- "fix"
- "changes"

### Pushing to GitLab

```bash
# Push to main branch
git push origin main

# Force push (use carefully!)
git push -f origin main
```

---

## Viewing History

### Check Commit Log

```bash
# View commit history
git log

# Compact one-line view
git log --oneline

# Last 5 commits
git log --oneline -5

# View specific file history
git log --oneline -- contracts/SkillsMarketplace.sol
```

### Check What Changed

```bash
# See unstaged changes
git diff

# See staged changes
git diff --staged

# See changes in specific file
git diff contracts/SkillsMarketplace.sol
```

---

## Troubleshooting

### Undo Changes (Before Commit)

```bash
# Discard changes in specific file
git checkout -- contracts/SkillsMarketplace.sol

# Discard ALL changes (use carefully!)
git checkout -- .

# Unstage file (keep changes)
git reset HEAD contracts/SkillsMarketplace.sol
```

### Undo Last Commit (Not Pushed)

```bash
# Undo commit, keep changes
git reset --soft HEAD~1

# Undo commit, discard changes
git reset --hard HEAD~1
```

### Fix Last Commit Message

```bash
# Edit last commit message
git commit --amend -m "Progress: corrected message"

# Add files to last commit
git add forgotten_file.sol
git commit --amend --no-edit
```

### Merge Conflicts

```bash
# If you get merge conflicts after pull:
# 1. Open conflicted files in VS Code
# 2. Resolve conflicts manually
# 3. Stage resolved files
git add .

# 4. Complete merge
git commit -m "Resolved merge conflicts"
```

---

## Branch Management

### Working with Branches (Optional)

```bash
# List branches
git branch

# Create new branch
git branch feature-postGig

# Switch to branch
git checkout feature-postGig

# Create and switch in one command
git checkout -b feature-postGig

# Merge branch into main
git checkout main
git merge feature-postGig

# Delete branch
git branch -d feature-postGig
```

---

## Emergency Commands

### Something Went Wrong

```bash
# See what state you're in
git status

# Abort merge
git merge --abort

# Abort rebase
git rebase --abort

# Get back to clean state
git stash
```

### Lost Work Recovery

```bash
# View all actions (reflog)
git reflog

# Restore to specific point
git reset --hard HEAD@{2}
```

---

## VS Code Git Integration

### Using VS Code's Built-in Git

1. **View Changes:** Click Source Control icon (Ctrl+Shift+G)
2. **Stage Files:** Click `+` next to file
3. **Commit:** Enter message in box, press Ctrl+Enter
4. **Push:** Click `...` menu > Push

### VS Code Terminal

- Open: `` Ctrl+` `` (backtick)
- All Git commands work in integrated terminal

---

## Time-Saving Aliases (Optional)

```bash
# Set up shortcuts
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.cm "commit -m"
git config --global alias.aa "add ."

# Now use shortcuts
git st          # git status
git aa          # git add .
git cm "message" # git commit -m "message"
```

---

## Assessment-Specific Tips

### Every 15 Minutes

1. Save your files in VS Code
2. Run: `git add . && git commit -m "Progress: [what you did]" && git push`
3. Verify push succeeded

### Before Final Submission

```bash
# Make sure everything is committed
git status
# Should say: "nothing to commit, working tree clean"

# Push one final time
git push origin main

# Verify your commits on GitLab web interface
```

### Quick Status Check

```bash
# One command to see everything
git status && git log --oneline -3
```

---

## Common Error Messages

### "Permission denied (publickey)"

**Solution:** Use HTTPS instead of SSH, or set up SSH keys

```bash
# Change to HTTPS
git remote set-url origin https://gitlab.wethinkco.de/YOUR_USERNAME/entry_test.git
```

### "Your branch is behind 'origin/main'"

**Solution:** Pull first, then push

```bash
git pull origin main
git push origin main
```

### "fatal: not a git repository"

**Solution:** Navigate to correct directory

```bash
cd entry_test
```

---

## Quick Reference Table

| Command | What It Does |
|---------|-------------|
| `git status` | Show what files changed |
| `git add .` | Stage all changes |
| `git add <file>` | Stage specific file |
| `git commit -m "msg"` | Save changes with message |
| `git push origin main` | Upload to GitLab |
| `git pull origin main` | Download from GitLab |
| `git log --oneline` | View commit history |
| `git diff` | See what changed |
| `git checkout -- .` | Discard all changes |
| `git reset HEAD~1` | Undo last commit |

---
