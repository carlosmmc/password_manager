import { auth, ui, uiConfig } from "./firebase.js";
import { useState } from "react";

export const signOutEvent = (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log("logged out!");
  });
};

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
  var unsubscribe = auth.onAuthStateChanged(function (user) {
    checkUserSignedIn(user);
  });
  auth.onAuthStateChanged(function (user) {
    checkUserSignedIn(user);
  });
  unsubscribe();

  return { auth, isSignIn };
}

export const useClickDetails = () =>{
  const[detailsExpand, setDetailsExpand] = useState(false)

}