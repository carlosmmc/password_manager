import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";
import {
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from "firebase/auth";
// import * as firebase from "firebase";
import AccountList from "../components/AccountList.jsx";
import { signOutEvent, useAuth } from "../helpers.js";

const AccountOverviewPage = () => {
  const navigate = useNavigate();

  const { auth, isSignIn } = useAuth();

  const [apps, setApps] = useState([]);

  const loadApps = async () => {
    const response = await fetch("/api/v1/accounts/1234/items");
    const data = await response.json();
    setApps(data);
  };
  useEffect(() => {
    loadApps();
  }, []);

  return (
    <>
      <h3>Account Overview</h3>
      {!isSignIn && (
        <>
          <h3>Please sign in</h3>
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            Back to Sign In Page
          </button>
        </>
      )}

      {isSignIn && (
        <button id="signout" onClick={signOutEvent}>
          Sign out
        </button>
      )}

      {isSignIn && <AccountList accounts={apps} />}
    </>
  );
};

export default AccountOverviewPage;
