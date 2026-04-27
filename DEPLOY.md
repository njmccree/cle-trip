# Deploy to GitHub Pages

This is the short version. Pick **Path A** if you have the GitHub CLI (`gh`) installed — it's literally one command. Pick **Path B** otherwise.

> **Before you start:** open `generate-icons.html` in your browser, click **Generate & Download**, and move the three PNGs (`icon-192.png`, `icon-512.png`, `apple-touch-icon.png`) into this folder. Without them the PWA install icon will be a generic globe.

---

## Path A — One command (GitHub CLI)

If you don't have `gh`, install it:
- **macOS:** `brew install gh`
- **Windows:** `winget install --id GitHub.cli`
- **Linux:** see [cli.github.com](https://cli.github.com)

Then, in this folder:

```bash
gh auth login                                    # one-time, follow the prompts
gh repo create cle-trip --public --source=. --remote=origin --push
gh api -X POST repos/:owner/cle-trip/pages -f source[branch]=main -f source[path]=/
```

That creates the repo, pushes the code, and turns on Pages.

Your site will be live at `https://YOUR_USERNAME.github.io/cle-trip/` in about 60 seconds.

---

## Path B — Manual (GitHub UI + git)

### 1. Create the repo on github.com

1. Go to https://github.com/new.
2. **Repository name:** `cle-trip` (or whatever you want).
3. Set it **Public** (Pages requires public on the free plan).
4. **Don't** initialize with README, .gitignore, or LICENSE — we already have those.
5. Click **Create repository**.

GitHub will show a "quick setup" page. Copy the repo URL (looks like `https://github.com/YOUR_USERNAME/cle-trip.git`).

### 2. Push from your terminal

In this folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cle-trip.git
git push -u origin main
```

If git asks for a password, use a [Personal Access Token](https://github.com/settings/tokens) (not your account password) — or set up SSH and use the SSH URL instead.

### 3. Turn on GitHub Pages

1. Go to your repo → **Settings** (top tabs) → **Pages** (left sidebar).
2. Under **Source**, choose **Deploy from a branch**.
3. Branch: **main**, folder: **/ (root)**.
4. Click **Save**.

After ~60 seconds, refresh the Pages settings page — you'll see "Your site is live at `https://YOUR_USERNAME.github.io/cle-trip/`".

---

## After it's live

- **Send the URL to the group.**
- **Have everyone install it as an app** (instructions in `README.md` → "Tell everyone to install it as an app").
- **Set up Firebase** if you want shared "Group" voting (instructions in `README.md` → step 5).

## Updating the site later

After you change anything (adding activities, tweaking styles, etc.):

```bash
git add .
git commit -m "Describe what you changed"
git push
```

GitHub Pages redeploys automatically in ~30-60 seconds.

**One gotcha:** if you change `app.js`, `styles.css`, `index.html`, or `activities.js`, also bump the `CACHE_VERSION` constant in `sw.js` (e.g., `'cle-trip-v3'` → `'cle-trip-v4'`). Otherwise everyone who already installed the app will keep seeing the old cached version.
