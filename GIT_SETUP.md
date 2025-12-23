# Git Setup Instructions

## Current Status
✅ Git repository initialized  
✅ `.gitignore` created (excludes `node_modules/`)  
✅ All files committed to local repository  

## Next Steps: Push to Remote Repository

### Option 1: If you already have a remote repository on GitHub/GitLab/Bitbucket

1. **Add the remote repository:**
   ```bash
   git remote add origin <YOUR_REPO_URL>
   ```
   Example:
   ```bash
   git remote add origin https://github.com/yourusername/collinson-qa-lead-test.git
   ```

2. **Push to remote:**
   ```bash
   git push -u origin main
   ```
   (Use `master` instead of `main` if your default branch is `master`)

### Option 2: Create a new repository on GitHub first

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Create a repository (don't initialize with README, .gitignore, or license)
   - Copy the repository URL

2. **Add the remote:**
   ```bash
   git remote add origin <YOUR_REPO_URL>
   ```

3. **Push to remote:**
   ```bash
   git push -u origin main
   ```

### Verify node_modules is excluded

After pushing, verify that `node_modules` is not in the repository:

```bash
# Check what's tracked
git ls-files | grep node_modules
# Should return nothing

# Or check the remote files
git ls-tree -r main --name-only | grep node_modules
# Should return nothing
```

### For others to use the repository

When someone clones the repository, they should run:

```bash
git clone <REPO_URL>
cd collinson-qa-lead-test
npm install
```

This will install all dependencies locally without needing `node_modules` in the repository.


