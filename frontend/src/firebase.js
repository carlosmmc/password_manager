import { initializeApp } from "firebase/app";
import { getMultiFactorResolver } from "firebase/auth";
// import "firebase/compat/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebase from "firebase/compat/app";
// import 'firebase/compat/firestore';
import * as firebaseui from "firebaseui";

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const actionCodeSettings = {
  url: '/',
  iOS: {
    bundleId: 'com.example.ios'
  },
  android: {
    packageName: 'com.example.android',
    installApp: true,
    minimumVersion: '12'
  },
  handleCodeInApp: true
};

export const uiConfig = {
  // Whether to upgrade anonymous users should be explicitly provided.
  // The user must already be signed in anonymously before FirebaseUI is
  // rendered.
  autoUpgradeAnonymousUsers: true,
  signInSuccessUrl: "/account",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // signInFailure callback must be provided to handle merge conflicts which
    // occur when an existing credential is linked to an anonymous user.
    signInFailure: function (error) {
      // For merge conflicts, the error.code will be
      // 'firebaseui/anonymous-upgrade-merge-conflict'.
      if (error.code !== "firebaseui/anonymous-upgrade-merge-conflict") {
        return Promise.resolve();
      }
      if (error.code == 'auth/multi-factor-auth-required') {
        const resolver = getMultiFactorResolver(auth, error);
        
      }
      // The credential the user tried to sign in with.
      var cred = error.credential;
      // Copy data from anonymous user to permanent user and delete anonymous
      // user.
      // Finish sign-in after data is copied.
      return firebase.auth().signInWithCredential(cred);
    },
  },
};


firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const ui = new firebaseui.auth.AuthUI(auth);

// export const googleProvider = new GoogleAuthProvider();


// export const db = getFirestore(app);
// export const storage = getStorage(app);