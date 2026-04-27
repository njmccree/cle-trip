/* =========================================
   Firebase config — REPLACE WITH YOUR OWN
   ---------------------------------------------
   1. Go to https://console.firebase.google.com
   2. Create a new project (free tier is fine).
   3. In the left sidebar: Build → Realtime Database → Create database.
        - Start in TEST MODE for now (we'll lock it down below).
   4. In the left sidebar: Project settings (gear icon) → General →
      "Your apps" → click the </> icon to register a Web app.
        - Give it a name (e.g. "cle-trip"); skip Hosting.
        - Copy the firebaseConfig object that appears.
   5. Paste that object below, replacing the placeholder values.
   6. (Recommended) Tighten DB rules — Realtime Database → Rules tab:

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

   That keeps reads/writes scoped to the /likes path only.
   ========================================= */

window.FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
