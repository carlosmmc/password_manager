import { auth, ui, uiConfig } from "./firebase.js";
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

  function checkUserSignedIn(user) {
    if (user) {
      console.log(`Signed in as: ${user.displayName} (${user.email})`);

      setSignIn(true);
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

  return { auth, isSignIn };
}
