# Terminal Navigation Commands Cheat Sheet

This document contains essential terminal commands for navigating folders, working with files, and managing a QA automation repository.

Recommended location in the repository:

```text
docs/terminal-navigation-commands.md
```

Context: QA Automation Transition Repo — Playwright + TypeScript.

---

# 1. Core Commands to Learn First

These commands are the minimum terminal basics you should know by heart before working with Playwright, npm, and Git.

## Check current folder

```bash
pwd
```

**Description:** Prints the current working directory.

Example:

```text
/Users/stas/Documents/qa-automation-portfolio
```

Use this when you are not sure where you are in the terminal.

---

## List files and folders

```bash
ls
```

**Description:** Shows files and folders in the current directory.

More detailed view:

```bash
ls -la
```

**Description:** Shows all files, including hidden files such as `.git` and `.gitignore`.

---

## Move into a folder

```bash
cd folder-name
```

Example:

```bash
cd docs
```

**Description:** Changes the current directory to the selected folder.

---

## Move one folder up

```bash
cd ..
```

**Description:** Moves from the current folder to its parent folder.

Example:

```bash
cd docs
cd ..
```

---

## Move two folders up

```bash
cd ../..
```

**Description:** Moves two levels up in the folder structure.

Example:

```bash
cd tests/ui
cd ../..
```

This returns you from `tests/ui` to the repository root.

---

## Move to the home folder

```bash
cd ~
```

**Description:** Moves to your user home directory.

On macOS, it usually looks like:

```text
/Users/your-user-name
```

---

## Create a folder

```bash
mkdir folder-name
```

Example:

```bash
mkdir docs
```

**Description:** Creates a new folder.

---

## Create nested folders

```bash
mkdir -p tests/api tests/ui pages fixtures utils config docs
```

**Description:** Creates multiple folders and nested folders. The `-p` flag prevents errors if folders already exist.

---

## Create a file

```bash
touch file-name.md
```

Examples:

```bash
touch README.md
touch docs/setup-notes.md
touch tests/ui/basic-smoke.spec.ts
```

**Description:** Creates an empty file.

---

## Copy a file

```bash
cp source-file destination-file
```

Example:

```bash
cp ~/Downloads/playwright-terminal-commands-en.md docs/playwright-terminal-commands.md
```

**Description:** Copies a file from one location to another.

---

## Move or rename a file

```bash
mv old-name.md new-name.md
```

Example:

```bash
mv playwright-terminal-commands-en.md playwright-terminal-commands.md
```

Move a file into a folder:

```bash
mv playwright-terminal-commands.md docs/
```

**Description:** Moves or renames files and folders.

---

## Remove a file safely

```bash
rm -i file-name.md
```

**Description:** Deletes a file with confirmation.

Avoid using plain `rm` until you are confident.

---

## Clear the terminal

```bash
clear
```

Alternative shortcut:

```text
Ctrl + L
```

**Description:** Clears the terminal screen.

---

# 2. Navigation Commands

## Go to Downloads

```bash
cd ~/Downloads
```

**Description:** Opens the Downloads folder from your home directory.

---

## Go to Documents

```bash
cd ~/Documents
```

**Description:** Opens the Documents folder from your home directory.

---

## Go to your QA automation repository

Example if the repo is inside Documents:

```bash
cd ~/Documents/qa-automation-portfolio
```

Then check:

```bash
pwd
ls
git status
```

**Description:** Opens your project folder and verifies that you are inside the correct Git repository.

---

## Return to the previous folder

```bash
cd -
```

**Description:** Returns to the last directory you were in.

This is useful if you accidentally moved to the wrong folder.

---

## Use current directory

```bash
.
```

**Description:** A single dot means “current directory”.

Example:

```bash
code .
```

This opens the current folder in VS Code.

---

## Use parent directory

```bash
..
```

**Description:** Two dots mean “parent directory”.

Example:

```bash
cd ..
```

---

## Work with folder names that contain spaces

Use quotes:

```bash
cd "My Folder"
```

Or escape the space:

```bash
cd My\ Folder
```

**Description:** Required when folder names contain spaces.

---

## Use Tab autocomplete

Start typing a file or folder name and press:

```text
Tab
```

Example:

```bash
cd Doc
```

Press `Tab`, and the terminal may autocomplete it to:

```bash
cd Documents
```

**Description:** Saves time and reduces typing mistakes.

---

# 3. Working with Files and Folders

## Show files in a folder

```bash
ls folder-name
```

Example:

```bash
ls docs
```

**Description:** Lists files inside a specific folder.

---

## Create multiple files

```bash
touch README.md docs/setup-notes.md docs/terminal-navigation-commands.md
```

**Description:** Creates several files in one command.

---

## Copy a folder

```bash
cp -r source-folder destination-folder
```

Example:

```bash
cp -r docs docs-backup
```

**Description:** Copies a folder recursively.

---

## Move a folder

```bash
mv old-folder-name new-folder-name
```

Example:

```bash
mv documentation docs
```

**Description:** Renames or moves a folder.

---

## Remove an empty folder

```bash
rmdir folder-name
```

**Description:** Deletes an empty folder.

---

## Remove a folder with files

```bash
rm -rf folder-name
```

**Description:** Deletes a folder and everything inside it.

**Warning:** Use this command very carefully. It does not ask for confirmation and can delete important files.

Safer option:

```bash
rm -ri folder-name
```

---

# 4. Viewing File Content

## Print a file in the terminal

```bash
cat README.md
```

**Description:** Prints the whole file content in the terminal.

Best for short files.

---

## View a file page by page

```bash
less README.md
```

**Description:** Opens a file in scrollable mode.

Useful keys:

```text
Space    next page
b        previous page
q        quit
```

---

## Show the first lines of a file

```bash
head README.md
```

Show the first 20 lines:

```bash
head -20 README.md
```

**Description:** Useful for quickly checking the beginning of a file.

---

## Show the last lines of a file

```bash
tail README.md
```

Show the last 20 lines:

```bash
tail -20 README.md
```

**Description:** Useful for checking the end of a file.

---

# 5. Searching Files and Text

## Find a file by name

```bash
find . -name "README.md"
```

Find all Playwright spec files:

```bash
find . -name "*.spec.ts"
```

**Description:** Searches for files starting from the current directory.

---

## Search text inside files

```bash
grep -r "Playwright" .
```

Search inside docs only:

```bash
grep -r "npx playwright test" docs
```

**Description:** Finds text inside files.

---

## Case-insensitive search

```bash
grep -ri "playwright" .
```

**Description:** Searches text and ignores uppercase/lowercase differences.

---

# 6. VS Code and macOS Helpers

## Open current folder in VS Code

```bash
code .
```

**Description:** Opens the current folder in Visual Studio Code.

If this command does not work, enable the `code` command in VS Code.

---

## Open current folder in Finder

```bash
open .
```

**Description:** Opens the current folder in macOS Finder.

---

## Open a specific file in VS Code

```bash
code README.md
```

Example:

```bash
code docs/terminal-navigation-commands.md
```

**Description:** Opens a file directly in VS Code.

---

# 7. Useful Terminal Shortcuts

## Stop a running command

```text
Ctrl + C
```

**Description:** Stops the current running process.

Useful if a command hangs or you started the wrong process.

---

## Clear the terminal

```text
Ctrl + L
```

**Description:** Clears the terminal screen.

---

## Go to the beginning of the command line

```text
Ctrl + A
```

---

## Go to the end of the command line

```text
Ctrl + E
```

---

## Search command history

```text
Ctrl + R
```

**Description:** Searches previously used terminal commands.

---

## Show command history

```bash
history
```

**Description:** Prints previously used commands.

---

## Repeat the previous command

```bash
!!
```

**Description:** Runs the last command again.

---

# 8. Windows PowerShell Alternatives

If you use Windows PowerShell instead of Git Bash or macOS terminal, some commands are different.

## Show current folder

```powershell
pwd
```

---

## List files and folders

```powershell
dir
```

or:

```powershell
Get-ChildItem
```

---

## Move into a folder

```powershell
cd docs
```

---

## Move one folder up

```powershell
cd ..
```

---

## Create a folder

```powershell
New-Item -ItemType Directory -Force -Path docs
```

Create multiple folders:

```powershell
New-Item -ItemType Directory -Force -Path tests/api, tests/ui, pages, fixtures, utils, config, docs
```

---

## Create a file

```powershell
New-Item -ItemType File -Force -Path docs/setup-notes.md
```

---

## Copy a file

```powershell
Copy-Item ~/Downloads/playwright-terminal-commands-en.md docs/playwright-terminal-commands.md
```

---

## Move or rename a file

```powershell
Move-Item old-name.md new-name.md
```

---

## Delete a file

```powershell
Remove-Item file-name.md
```

---

# 9. Commands for Your QA Automation Repository

## Open the repository

```bash
cd ~/Documents/qa-automation-portfolio
```

---

## Check that you are in the repository root

```bash
pwd
ls
git status
```

You should see files like:

```text
README.md
package.json
playwright.config.ts
tests
docs
```

---

## Go to docs

```bash
cd docs
```

---

## Return to repository root from docs

```bash
cd ..
```

---

## Go to UI tests

```bash
cd tests/ui
```

---

## Return to repository root from UI tests

```bash
cd ../..
```

---

## Go to API tests

```bash
cd tests/api
```

---

## Return to repository root from API tests

```bash
cd ../..
```

---

## List UI test files

```bash
ls tests/ui
```

---

## List docs files

```bash
ls docs
```

---

# 10. Recommended Daily Terminal Flow

Use this flow every time you start working with the repository:

```bash
cd ~/Documents/qa-automation-portfolio

pwd
ls
git status
```

Then run tests if needed:

```bash
npx playwright test
```

After making changes:

```bash
git status
git add .
git commit -m "docs: update terminal navigation commands"
git push
```

---

# 11. Common Mistakes

## Mistake: Running commands from the wrong folder

Always check:

```bash
pwd
ls
git status
```

Before running Playwright or Git commands.

---

## Mistake: Creating files outside the repository

If you run `touch README.md` in the wrong folder, the file will be created there.

Check your location first:

```bash
pwd
```

---

## Mistake: Forgetting to move back to the repository root

If you are inside:

```text
tests/ui
```

Move back to root:

```bash
cd ../..
```

---

## Mistake: Deleting files too aggressively

Avoid:

```bash
rm -rf
```

unless you are fully sure what you are deleting.

Prefer safer delete:

```bash
rm -i file-name
```

---

# 12. Minimum Commands to Memorize

```bash
pwd
ls
ls -la
cd folder-name
cd ..
cd ../..
cd ~
cd -
mkdir folder-name
mkdir -p folder/subfolder
touch file-name.md
cp source destination
mv old-name new-name
rm -i file-name
cat file-name
less file-name
find . -name "file-name"
grep -r "text" .
clear
code .
git status
```

---

# 13. Practice Task

From the repository root, complete this exercise:

```bash
pwd
ls
mkdir -p docs/practice
touch docs/practice/navigation-practice.md
ls docs/practice
cd docs/practice
pwd
cd ../..
pwd
rm -i docs/practice/navigation-practice.md
rmdir docs/practice
git status
```

Expected result:

- you created a practice folder;
- created a practice file;
- navigated into the folder;
- returned to the repository root;
- removed the practice file and folder;
- checked Git status.

---

# 14. Why This Matters for QA Automation

Terminal navigation is a basic engineering skill for automation QA.

You will use it to:

- open the project;
- run Playwright tests;
- manage documentation files;
- work with Git;
- inspect project structure;
- debug paths;
- run npm commands;
- verify test files;
- prepare portfolio-ready repository commits.

If you cannot confidently navigate folders in the terminal, Playwright, Git, and project setup will feel harder than they really are.
