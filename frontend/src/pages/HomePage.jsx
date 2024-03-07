import React, { useState } from "react";
import "firebase/compat/auth";
import "firebaseui/dist/firebaseui.css";
import { setPersistence, browserSessionPersistence } from "firebase/auth";
import { useAuth, signOutEvent } from "../helpers/helpers.js";
import "firebase/compat/auth";
import SignIn from "../components/auth/SignIn.jsx";
import VerifyEmail from "../components/auth/VerifyEmail.jsx";
import MultiFactorAuth from "../components/auth/EnrollMFA.jsx";
import SignUp from "../components/auth/SignUp.jsx";
import { Button } from "react-bootstrap";
import Loader from "../components/shared/Loader.jsx";

const HomePage = () => {
  const { auth, isSignedIn, pending, user, hasMfa, isEmailVerified, accountInfo } =
    useAuth();
  setPersistence(auth, browserSessionPersistence).catch((error) => {
    console.error(error);
  });
  const [signUp, setSignUp] = useState(false);


  if (pending) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div>
        {!isSignedIn && !signUp && (
          <>
            <SignIn auth={auth} />
            <Button
              className="btn btn-secondary"
              onClick={(e) => {
                e.preventDefault();
                setSignUp(true);
              }}
            >
              Sign Up
            </Button>
          </>
        )}
        {!isSignedIn && signUp && (
          <>
            <SignUp auth={auth} />
            <Button
              className="btn btn-secondary"
              onClick={(e) => {
                e.preventDefault();
                setSignUp(false);
              }}
            >
              Back to Sign In
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      {isSignedIn && (
        <>
          <h3 id="subtitle">Welcome, {user.displayName} </h3>
          {!isEmailVerified && <VerifyEmail email={auth.currentUser.email} />}
          {isEmailVerified && !hasMfa && <MultiFactorAuth />}

          <button
            type="button"
            onClick={signOutEvent}
            className="signin-signup-button btn btn-secondary"
          >
            Sign out
          </button>
        </>
      )}
    </div>
  );
};

export default HomePage;
