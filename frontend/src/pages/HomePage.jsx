import React, { useState, useEffect, useRef } from "react";
import "firebase/compat/auth";
import "firebaseui/dist/firebaseui.css";
import { uiConfig, ui, auth, getSignInStatus } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { useScript } from "../helpers.js";

const HomePage = () => {
  var unsubscribe = auth.onAuthStateChanged(function(user) { // do init stuff and then unsubscribe;
     unsubscribe();}); 

     var unsubscribe = auth.onAuthStateChanged(function(user) { // do init stuff and then unsubscribe;
      return}); 


  const buttonRef = useRef(null);
  function showButton() {
    if (buttonRef.current) {
      buttonRef.current.hidden = false;
    }
  }
  auth.onAuthStateChanged(
    function (user) {
      if (user) {
        // User is signed in, so display the "sign out" button and login info.
        showButton();
        // document.getElementById('login-info').hidden = false;
        console.log(`Signed in as ${user.displayName} (${user.email})`);
        user.getIdToken().then(function (token) {
          // Add the token to the browser's cookies. The server will then be
          // able to verify the token against the API.
          // SECURITY NOTE: As cookies can easily be modified, only put the
          // token (which is verified server-side) in a cookie; do not add other
          // user information.
          document.cookie = "token=" + token;
        });
      } else {
        console.log("signed out");
        // Show the Firebase login button.
        ui.start("#firebaseui-auth-container", uiConfig);
        // Update the login state indicators.
        // document.getElementById('login-info').hidden = true;
        // Clear the token cookie.
        document.cookie = "token=";
      }
    },
    function (error) {
      console.log(error);
      alert("Unable to log in: " + error);
    }
  );

  return (
    <>
      <h3 className="subtitle">Welcome! Please sign in</h3>
      <div id="firebaseui-auth-container"></div>
      <button
        ref={buttonRef}
        hidden={true}
        id="sign-out"
        onClick={(e) => {
          e.preventDefault();
          auth.signOut().then(() => {
            console.log("logged out!");
          });
          window.location.reload();
        }}
      >
        Sign out
      </button>
    </>
  );
};

export default HomePage;
