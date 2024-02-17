import React, { useState, useEffect, useRef } from "react";
import "firebase/compat/auth";
import "firebaseui/dist/firebaseui.css";
import { uiConfig, ui, auth, getSignInStatus } from "../firebase.js";
import {
  setPersistence,
  browserSessionPersistence,
  RecaptchaVerifier,
} from "firebase/auth";
import { useAuth, signOutEvent } from "../helpers.js";
import useRecaptcha from "../hooks/useRecaptcha.jsx";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import SignIn from "../components/SignIn.jsx";
// import * as firebase from 'firebase/app';

const HomePage = ({}) => {
  const atHomePage = true;
  const { auth, isSignIn, hasMfa } = useAuth(atHomePage);
  setPersistence(auth, browserSessionPersistence).catch((error) => {
    console.error(error);
  });

  const navigate = useNavigate();
  const actionCodeSettings = {
    url: "http://localhost:3000/",
    handleCodeInApp: true,
  };

  const handleEmailVerification = (e) => {
    e.preventDefault();
    if (isSignIn) {
      console.log(auth.currentUser.multiFactor);
      console.log(auth.currentUser);
      auth.currentUser
        .sendEmailVerification(actionCodeSettings)
        .then(function () {
          // Verification email sent.
          console.log("sent");
        })
        .catch(function (error) {
          // Error occurred. Inspect error.code.
          console.log(error);
        });
    }
  };
  if (auth.currentUser) {
    console.log(auth.currentUser.multiFactor.enrolledFactors.length);
    if (auth.currentUser.multiFactor.enrolledFactors.length === 0) {
      // navigate("/mfa")
    }
  }

  return (
    <>
      {!isSignIn && <SignIn />}
      {isSignIn && (
        <h3 id="subtitle">Welcome, {auth.currentUser.displayName} </h3>
      )}
      <div id="firebaseui-auth-container"></div>
      {isSignIn && (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={signOutEvent}
        >
          Sign out
        </button>
      )}
      <div id="rcc"></div>
      <button onClick={handleEmailVerification}>send email verification</button>
    </>
  );
};

export default HomePage;
