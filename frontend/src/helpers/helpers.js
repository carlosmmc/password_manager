import { auth, ui, uiConfig, actionCodeSettings } from "../firebase.js";
import {
  setPersistence,
  browserSessionPersistence,
  RecaptchaVerifier,
  sendEmailVerification,
} from "firebase/auth";
import { useEffect, useState } from "react";

/**
 * onClick event function to sign out user
 * @param {*} e Event
 */
export const signOutEvent = (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log("logged out!");
  });
};

/**
 * Helper hook to check and update user login status.
 * @returns Firebase user auth and sign in status
 */
export function useAuth() {
  const [authState, setAuthState] = useState({isSignedIn: false, pending: true, user:null});
  const [hasMfa, setHasMfa] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  function checkUserSignedIn(user) {
    if (user) {
      console.log(`Signed in as: ${user.displayName} (${user.email})`);
      setAuthState({isSignedIn: true, pending: false, user:user});
      if (user.multiFactor.enrolledFactors.length > 0) {
        setHasMfa(true);
      }
      if (user.emailVerified) {
        setIsEmailVerified(true);
      }
    } else {
      console.log("Logged out");
      setAuthState({isSignedIn: false, pending: false, user:null});
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(function (user) {
      checkUserSignedIn(user);
    });

    return () => unsubscribe();
  }, []);

  return { auth, ...authState, hasMfa, isEmailVerified };
}

export const handleRecaptcha = (e) => {
  e.preventDefault();
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "rcc", {
      size: "invisible",
    });
    window.recaptchaVerifier.render().then(function (widgetId) {
      window.recaptchaWidgetId = widgetId;
    });
  }
};

export const handleEmailVerification = (e) => {
  e.preventDefault();
  const actionCodeSettings = {
    url: "http://localhost:3000/",
    handleCodeInApp: true,
  };
  auth.currentUser
    .sendEmailVerification(actionCodeSettings)
    .then(function () {
      // Verification email sent.
      window.alert("Email sent")
      console.log("sent");
    })
    .catch(function (error) {
      // Error occurred. Inspect error.code.
      console.log(error);
    });
};
