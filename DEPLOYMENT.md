# Deployment Instructions

## 1. Firebase Setup
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project or select your existing one.
3.  Navigate to **Project Settings** > **General** > **Your apps** > **SDK setup and configuration**.
4.  Copy the `firebaseConfig` object.
5.  Open `src/firebase.js` in your project and replace the placeholder config with your actual keys.

## 2. Install Firebase CLI
If you haven't already, install the Firebase CLI globally:
```bash
npm install -g firebase-tools
```

## 3. Login and Initialize
1.  Login to Firebase:
    ```bash
    firebase login
    ```
2.  Initialize Firebase in your project root:
    ```bash
    firebase init
    ```
    -   Select **Hosting**.
    -   Select **Use an existing project** and choose your project.
    -   What do you want to use as your public directory? `dist`
    -   Configure as a single-page app (rewrite all urls to /index.html)? `Yes`
    -   Set up automatic builds and deploys with GitHub? `No` (unless you want to)

## 4. Build and Deploy
1.  Build the project:
    ```bash
    npm run build
    ```
2.  Deploy to Firebase:
    ```bash
    firebase deploy
    ```

Your app should now be live!
