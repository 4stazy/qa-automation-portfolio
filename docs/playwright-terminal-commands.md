# Playwright Terminal Commands Cheat Sheet

This file can be saved as:

- `docs/playwright-terminal-commands.md`
- or as a section inside `README.md`

Context: Day 3 — Node.js + Playwright + TypeScript setup.

---

## 1. Check Node.js and npm installation

```bash
node -v
npm -v
```

**Expected result:** the terminal shows installed versions, for example:

```bash
v22.x.x
10.x.x
```

If the command does not work, Node.js is not installed or your terminal cannot find Node.js in PATH.

---

## 2. Create a project folder

```bash
mkdir qa-automation-transition
cd qa-automation-transition
```

Or, if the repository has already been cloned from GitHub:

```bash
cd qa-automation-portfolio
```

---

## 3. Initialize a Playwright project

```bash
npm init playwright@latest
```

Recommended answers during setup:

```text
Do you want to use TypeScript or JavaScript? TypeScript
Where to put your end-to-end tests? tests
Add a GitHub Actions workflow? false / No
Install Playwright browsers? true / Yes
```

After setup, Playwright should create the basic project files:

```text
package.json
package-lock.json
playwright.config.ts
tests/
```

---

## 4. Install Playwright browsers manually if needed

If browsers were not installed during setup, or tests fail because browsers are missing:

```bash
npx playwright install
```

---

## 5. Create the recommended repository structure

### macOS / Linux / Git Bash

```bash
mkdir -p tests/api tests/ui pages fixtures utils config docs
```

### Windows PowerShell

```powershell
New-Item -ItemType Directory -Force -Path tests/api, tests/ui, pages, fixtures, utils, config, docs
```

Recommended structure:

```text
qa-automation-transition/
  tests/
    api/
    ui/
  pages/
  fixtures/
  utils/
  config/
  docs/
  playwright.config.ts
  package.json
  package-lock.json
  README.md
```

---

## 6. Create the first UI smoke test file

### macOS / Linux / Git Bash

```bash
touch tests/ui/basic-smoke.spec.ts
```

### Windows PowerShell

```powershell
New-Item -ItemType File -Force -Path tests/ui/basic-smoke.spec.ts
```

---

## 7. Run all Playwright tests

```bash
npx playwright test
```

**Expected result:**

```text
1 passed
```

Or multiple passed tests if default example tests still exist.

---

## 8. Run a specific spec file

```bash
npx playwright test tests/ui/basic-smoke.spec.ts
```

Use this command when you want to run only one test file.

---

## 9. Run a test in headed mode

```bash
npx playwright test tests/ui/basic-smoke.spec.ts --headed
```

**When to use:** when you want to see the browser and understand what the test is doing.

---

## 10. Run a test in debug mode

```bash
npx playwright test tests/ui/basic-smoke.spec.ts --debug
```

**When to use:** when a test fails and you need to debug the scenario step by step.

---

## 11. Open the HTML report

```bash
npx playwright show-report
```

**When to use:** after a test run to inspect passed/failed tests, errors, screenshots, or traces if enabled.

---

## 12. Show Playwright help

```bash
npx playwright test --help
```

Useful for checking available flags:

```text
--headed
--debug
--project
--grep
--reporter
```

---

## 13. Run tests in a specific browser project

If `playwright.config.ts` contains a `chromium` project:

```bash
npx playwright test --project=chromium
```

---

## 14. Install dependencies after cloning the repository

If you or another person cloned the repository from GitHub:

```bash
npm install
npx playwright install
```

Then run:

```bash
npx playwright test
```

---

## 15. Add useful scripts to package.json

You can add the following scripts to `package.json`:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:ui": "playwright test tests/ui",
    "test:api": "playwright test tests/api",
    "report": "playwright show-report"
  }
}
```

After that, you can run shorter commands:

```bash
npm test
npm run test:headed
npm run test:ui
npm run test:api
npm run report
```

---

# Git Commands

## 16. Check git status

```bash
git status
```

**What to check:**

- changed files;
- untracked files;
- staged files;
- whether the working tree is clean.

---

## 17. Initialize git if the folder is not a git repository yet

```bash
git init
```

---

## 18. Add all files to staging

```bash
git add .
```

---

## 19. Create the first commit

```bash
git commit -m "chore: initialize playwright project structure"
```

This commit should include:

```text
package.json
package-lock.json
playwright.config.ts
tests/
docs/
README.md
project folders
```

---

## 20. Commit the first UI smoke test

```bash
git add .
git commit -m "test: add first ui smoke test"
```

This commit should include:

```text
tests/ui/basic-smoke.spec.ts
```

---

## 21. Commit README and docs updates

```bash
git add README.md docs/
git commit -m "docs: add setup notes and run commands"
```

---

## 22. View commit history

```bash
git log --oneline
```

Expected example:

```text
a1b2c3d docs: add setup notes and run commands
e4f5g6h test: add first ui smoke test
i7j8k9l chore: initialize playwright project structure
```

---

## 23. Connect the local repository to GitHub

If the repository already exists on GitHub, add the remote:

```bash
git remote add origin https://github.com/YOUR_USERNAME/qa-automation-transition.git
```

For your portfolio repository, it may look like this:

```bash
git remote add origin https://github.com/4stazy/qa-automation-portfolio.git
```

Check the remote:

```bash
git remote -v
```

---

## 24. Rename the branch to main

```bash
git branch -M main
```

---

## 25. Push to GitHub

```bash
git push -u origin main
```

After the first push, you can use:

```bash
git push
```

---

## 26. Typical workflow after making changes

```bash
git status
git add .
git commit -m "your commit message"
git push
```

Example:

```bash
git status
git add .
git commit -m "docs: update playwright commands cheat sheet"
git push
```

---

# Recommended Day 3 Command Flow

Use this flow for Day 3:

```bash
node -v
npm -v

mkdir qa-automation-transition
cd qa-automation-transition

npm init playwright@latest

mkdir -p tests/api tests/ui pages fixtures utils config docs

touch tests/ui/basic-smoke.spec.ts
touch docs/setup-notes.md
touch README.md

npx playwright test
npx playwright show-report

git status
git add .
git commit -m "chore: initialize playwright project structure"
```

If GitHub remote is not connected yet:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

# Common Problems

## Problem: `node: command not found`

Node.js is not installed or the terminal cannot find it.

Check:

```bash
node -v
npm -v
```

## Problem: Playwright browsers are missing

Run:

```bash
npx playwright install
```

## Problem: test file not found

Check the path:

```bash
ls tests/ui
```

For Windows PowerShell:

```powershell
Get-ChildItem tests/ui
```

## Problem: git says “nothing to commit”

Check:

```bash
git status
```

Maybe you have not changed any files, or everything has already been committed.

## Problem: remote origin already exists

Check the current remote:

```bash
git remote -v
```

If you need to replace the remote:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

---

# Minimum Expected Result for Day 3

By the end of Day 3, you should have:

```text
Playwright installed
Project structure created
tests/api exists
tests/ui exists
basic-smoke.spec.ts exists
npx playwright test executed
README.md created or updated
docs/setup-notes.md created
first commit created
GitHub repository updated
```
