# Cleveland Trip — Swipe to Plan

A mobile-first, Tinder-style web app for planning a trip to Cleveland with friends. Swipe through 110+ activities (food, bars, museums, sports, day trips, golf), like the ones you want, and see what the rest of the group is voting for in real time.

Built as a static site so it can be hosted free on **GitHub Pages**, with optional **Firebase** for the shared group voting. Installable as a **Progressive Web App** — works offline, gets its own home-screen icon, and feels like a native app.

> 🚀 **Just want to ship it?** See [`DEPLOY.md`](./DEPLOY.md) for the one-command (gh CLI) or step-by-step (GitHub UI) deploy.

---

## Quick start (5 min)

### 1. Generate the app icons (one-time, 30 seconds)

The PWA needs PNG icons for iOS home-screen install. To generate them:

1. Open `generate-icons.html` in your browser (just double-click the file).
2. Click **Generate & Download**. Three PNGs appear in your Downloads folder.
3. Move those three files (`icon-192.png`, `icon-512.png`, `apple-touch-icon.png`) into this project folder, next to `index.html`.

You can delete `generate-icons.html` once you've done this.

### 2. Put it on GitHub

```bash
cd "Cleveland Trip App"
git init
git add .
git commit -m "Initial commit"
# Create a new repo on github.com (e.g. "cle-trip"), then:
git remote add origin https://github.com/YOUR_USERNAME/cle-trip.git
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**.
2. Under **Source**, choose **Deploy from a branch**.
3. Select **main** branch and **/ (root)** folder. Click **Save**.
4. Wait ~1 min, then your site is live at:
   `https://YOUR_USERNAME.github.io/cle-trip/`

Send that URL to the group. Done.

### 4. Tell everyone to install it as an app

The site works in a regular browser tab, but installing it gives you a real app icon, full-screen launch (no browser bars), and offline support — useful when you're at Cedar Point with two bars of signal.

**On iPhone (Safari):**
1. Open the GitHub Pages URL in Safari.
2. Tap the Share button (square with arrow up) at the bottom.
3. Scroll down → **Add to Home Screen**.
4. Tap **Add**. The CLE Trip icon appears on your home screen.

**On Android (Chrome):**
1. Open the URL in Chrome.
2. Chrome will usually prompt you with "Install app" automatically. If not: tap the ⋮ menu → **Install app** (or **Add to Home screen**).

### 5. (Recommended) Wire up Firebase for shared "Group" votes

Without Firebase the app still works perfectly — each person sees their own picks. To see what *everyone* liked:

1. Go to https://console.firebase.google.com and click **Add project**. Free tier is plenty.
2. Skip Google Analytics; finish project creation.
3. In the left sidebar: **Build → Realtime Database → Create Database**.
   - Pick a region near you (us-east1 is fine).
   - Choose **Start in test mode** for now.
4. Top-left → **Project settings** (gear icon) → scroll to **Your apps** → click the **`</>` (Web)** icon.
   - Register a Web app called `cle-trip`. Skip Firebase Hosting.
   - Copy the `firebaseConfig` object it shows you.
5. Open `firebase-config.js` in this repo and paste over the placeholder values.
6. (Recommended) Lock writes to the `/likes` path. In the **Realtime Database → Rules** tab:

   ```json
   {
     "rules": {
       "likes": {
         ".read": true,
         ".write": true,
         "$activityId": {
           ".validate": "newData.isNumber() && newData.val() >= 0"
         }
       }
     }
   }
   ```

7. Commit and push:
   ```bash
   git add firebase-config.js
   git commit -m "Add Firebase config"
   git push
   ```

GitHub Pages will redeploy in ~30 sec. The **Group** tab now shows live counts as people swipe.

---

## How it works

- **Discover** — full-screen swipeable cards. Drag right (or tap ♥) to like, drag left (or tap ✕) to pass. Tap the *i* button for more info.
- **Filters** — chips at the top let you focus on Food, Bars, Culture, Sports, Day Trips, or Golf.
- **Empty state** — once you've swiped through everything in the current filter, you can **Take another look** to revisit your passes, or **Start over**.
- **Likes tab** — your own picks, saved to your phone (`localStorage`).
- **Group tab** — anonymous, real-time vote count per activity (powered by Firebase).

### Anonymity
Per your spec, votes are anonymous — no logins, no names. Each browser keeps its own swipe history locally so it doesn't double-count, and only an incremented counter goes to Firebase.

---

## File structure

```
Cleveland Trip App/
├── index.html            # App shell
├── styles.css            # Mobile-first CSS
├── app.js                # Swipe logic, navigation, state
├── activities.js         # The 112-activity dataset (edit me!)
├── firebase-config.js    # Paste your Firebase config here
├── manifest.json         # PWA manifest (name, icons, colors)
├── sw.js                 # Service worker (offline + caching)
├── icon.svg              # Source icon (Cleveland skyline)
├── icon-192.png          # Generated by generate-icons.html
├── icon-512.png          # Generated by generate-icons.html
├── apple-touch-icon.png  # Generated by generate-icons.html
├── generate-icons.html   # One-click PNG generator (run once)
├── image-map.js          # Procedural image map (id → URL)
├── fetch-images.html     # Browser tool to populate image-map.js
└── README.md             # This file
```

### Procedural images

Card backgrounds resolve in this order:
1. `activity.image` (set per-entry in `activities.js`) — hand-curated
2. `IMAGE_MAP[id]` (in `image-map.js`) — populated by the picker tool
3. `CATEGORY_FALLBACKS[category]` (in `image-map.js`) — generic per-category default
4. CSS gradient + emoji (always-works fallback)

To populate images for all activities (or top up after adding new ones):

1. Open `fetch-images.html` in your browser.
   - Easiest: serve the project locally (`python3 -m http.server 8000`) and visit `http://localhost:8000/fetch-images.html` — works in all browsers.
   - Or open the file directly in Firefox or Safari (Chrome blocks `file://` script loading).
2. Click **Auto-fetch from Wikipedia**. This runs through every activity that doesn't already have an image and queries the Wikipedia REST API. Famous landmarks (Rock Hall, Cedar Point, West Side Market, etc.) get great results. ~30-50% hit rate is normal.
3. (Optional, for the rest) Get a free Pexels API key at [pexels.com/api](https://www.pexels.com/api/) — takes 60 seconds. Paste it into the field and click **Auto-fetch from Pexels**. Returns relevant stock photos for the remaining activities.
4. Review the grid. For any activity, you can:
   - **Skip** — clear the image (will use gradient)
   - **Re-search** — try Wikipedia/Pexels again
   - Paste a custom URL into the input
5. Click **Export image-map.js** — downloads the new file.
6. Move the downloaded file from your Downloads folder into the project root, replacing the existing `image-map.js`.
7. Commit and push.

The tool is idempotent — running it again only fetches images for activities that don't already have one, so you can re-run any time you add new activities.

### Adding or editing activities
Open `activities.js`. Each entry looks like:

```js
{
  id: 'unique-slug',
  title: 'West Side Market',
  category: 'food',          // food | bars | museums | sports | nearby | golf
  emoji: '🥩',                // optional — overrides the category default
  image: 'https://...',       // optional — falls back to gradient + emoji
  description: '...',         // 2-3 sentences
  info: 'Address • Hours • Price',
  tags: ['lunch', 'iconic']
}
```

Add as many as you want — the UI scales automatically.

---

## Local development

You can preview the app locally with any static server:

```bash
# Python
python3 -m http.server 8000
# or Node
npx serve .
```

Then open http://localhost:8000 in your browser. Use Chrome DevTools' device toolbar (Cmd+Shift+M) to simulate iPhone.

**Service worker note:** Service workers cache aggressively, which is great in production but annoying in dev. Open DevTools → Application → Service Workers, then check **Update on reload**. When you change app code, also bump `CACHE_VERSION` in `sw.js` so users on the live site get the new files.

---

## What's NOT included (and why)

- **No accounts / no logins.** You said anonymous — keeps friction at zero.
- **No comments / no chat.** This is a swipe app, not Slack. Group chat will happen wherever your group already chats.
- **No itinerary builder.** The "Group" tab gives you the consensus list; planning the actual day-by-day is a human job. (Easy add-on if you want it later.)

Have fun in Cleveland!
