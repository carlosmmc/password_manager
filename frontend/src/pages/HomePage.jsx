import React, { useState, useEffect, useRef } from "react";
import "firebase/compat/auth";
import "firebaseui/dist/firebaseui.css";
import { uiConfig, ui, auth, getSignInStatus } from "../firebase.js";
import {
  setPersistence,
  browserSessionPersistence,
  RecaptchaVerifier,
} from "firebase/auth";
import { useAuth, signOutEvent } from "../helpers/helpers.js";
import useRecaptcha from "../hooks/useRecaptcha.jsx";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import SignIn from "../components/auth/SignIn.jsx";
import VerifyEmail from "../components/auth/VerifyEmail.jsx";
import MultiFactorAuth from "../components/auth/EnrollMFA.jsx";
import SignUp from "../components/auth/SignUp.jsx";
import { Button } from "react-bootstrap";
import Loader from "../components/shared/Loader.jsx";

const HomePage = ({}) => {
  const { auth, isSignedIn, pending, user, hasMfa, isEmailVerified } = useAuth();
  setPersistence(auth, browserSessionPersistence).catch((error) => {
    console.error(error);
  });
  const [signUp, setSignUp] = useState(false);

  console.log(isSignedIn)

  const navigate = useNavigate();

  if (pending){
    return (<><Loader /></>)
  }

  if (!isSignedIn) {
    return (<>
      {!isSignedIn && !signUp && (<><SignIn auth={auth} /> <Button className="btn btn-secondary" onClick={(e) => {e.preventDefault(); setSignUp(true)}}>Sign Up</Button></>)}
      {!isSignedIn && signUp && (<><SignUp auth={auth} /><Button className="btn btn-secondary" onClick={(e) => {e.preventDefault(); setSignUp(false)}}>Back to Sign In</Button></>)}
      <div id="rcc"></div>
    </>)
  }

  return (
    <>
      {isSignedIn && (
        <>
          <h3 id="subtitle">Welcome, {user.displayName} </h3>
          {!isEmailVerified && <VerifyEmail email={auth.currentUser.email} />}
          {isEmailVerified && !hasMfa && <MultiFactorAuth />}

          <button
            type="button"
            className="btn btn-secondary"
            onClick={signOutEvent}
          >
            Sign out
          </button>
        </>
      )}
      <div id="rcc"></div>
    </>
  );
};

export default HomePage;
