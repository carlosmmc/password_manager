import { auth, ui, uiConfig, actionCodeSettings } from "./firebase.js";
import { setPersistence, browserSessionPersistence, RecaptchaVerifier} from "firebase/auth";
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
 * @param {*} home  Called on homepage or no (so firebaseui will be calld). Default to false
 * @returns Firebase user auth and sign in status
 */
export function useAuth(home = false) {
  const [isSignIn, setSignIn] = useState(false);
  const [hasMfa, setHasMfa] = useState(false);

  function checkUserSignedIn(user) {
    if (user) {
      console.log(`Signed in as: ${user.displayName} (${user.email})`);
      setSignIn(true);
      // if (user.emailVerigied === false) {
      //   console.log("not verified")
      //   auth.currentUser.sendEmailVerification(actionCodeSettings)
      //   .then(function() {
      //     // Verification email sent.
      //     console.log("sent")
      //   })
      //   .catch(function(error) {
      //     // Error occurred. Inspect error.code.
      //     console.log("not sent")
      //   });
      // }
      if (user.multiFactor.enrolledFactors.length > 0) {
          setHasMfa(true)
      }
    } else {
      console.log("Logged out");
      if (home) {
        ui.start("#firebaseui-auth-container", uiConfig);
        
      }
      setSignIn(false);
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(function (user) {
      checkUserSignedIn(user);
    });

    return () => unsubscribe();
  }, []);

  return { auth, isSignIn, hasMfa };
}

export const handleRecaptcha = (e) => {
  e.preventDefault()
  if (!window.recaptchaVerifier){
    window.recaptchaVerifier = new RecaptchaVerifier(auth,"rcc", {
      "size": "invisible"
    });
    window.recaptchaVerifier.render()
    .then(function (widgetId) {
      window.recaptchaWidgetId = widgetId
    })
  }
}


