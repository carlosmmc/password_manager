import React, { useState, useEffect, useRef } from "react";
import "firebase/compat/auth";
import "firebaseui/dist/firebaseui.css";
import { uiConfig, ui, auth, getSignInStatus } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { useAuth, signOutEvent } from "../helpers.js";

const HomePage = () => {
  const atHomePage = true;
  const { auth, isSignIn } = useAuth(atHomePage);

  return (
    <>
      {!isSignIn && <h3 id="subtitle">Welcome! Please sign in</h3>}
      {isSignIn && <h3 id="subtitle">Welcome, {auth.currentUser.displayName} </h3>}
      <div id="firebaseui-auth-container"></div>
      {isSignIn && <button type="button" class="btn btn-secondary" onClick={signOutEvent}>
        Sign out
      </button>}
    </>
  );
};

export default HomePage;
