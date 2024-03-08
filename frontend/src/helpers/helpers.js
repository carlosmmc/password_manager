import { auth } from "../firebase.js";
import { RecaptchaVerifier } from "firebase/auth";
import { useEffect, useState } from "react";
import { getUserId } from "./requests.js";

/**
 * onClick event function to sign out user
 * @param {*} e Event
 */
export const signOutEvent = (e) => {
  e.preventDefault();
  auth.signOut().then(() => {});
};

/**
 * Helper hook to check and update user login status.
 * @returns Firebase user auth and sign in status
 */
export function useAuth() {
  const [authState, setAuthState] = useState({
    isSignedIn: false,
    pending: true,
    user: null,
  });
  const [hasMfa, setHasMfa] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [accountInfo, setAccountInfo] = useState();

  const checkUserSignedIn = async (user) => {
    if (user) {
      const emailAddr = user.email;
      console.log(`Signed in as: ${user.displayName} (${emailAddr})`);
      setAuthState({ isSignedIn: true, pending: false, user: user });
      if (user.multiFactor.enrolledFactors.length > 0) {
        setHasMfa(true);
      }
      if (user.emailVerified) {
        setIsEmailVerified(true);
      }
      if (user.multiFactor.enrolledFactors.length > 0 && user.emailVerified) {
        const res = { id: "a8fc5384-1dbe-4763-b0ab-40bffb02f5a4" };
        // getUserId(emailAddr)
        if (res.id) {
          setAccountInfo(res);
        }
      }
    } else {
      setAuthState({ isSignedIn: false, pending: false, user: null });
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(function (user) {
      checkUserSignedIn(user);
    });

    return () => unsubscribe();
  }, []);

  return { auth, ...authState, hasMfa, isEmailVerified, accountInfo };
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
    url: "/",
    handleCodeInApp: true,
  };
  auth.currentUser
    .sendEmailVerification(actionCodeSettings)
    .then(function () {
      // Verification email sent.
    })
    .catch(function (error) {
      // Error occurred. Inspect error.code.
      console.log(error);
    });
};




