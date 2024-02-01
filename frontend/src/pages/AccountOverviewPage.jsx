import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";
import {
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from "firebase/auth";
// import * as firebase from "firebase";


const AccountOverviewPage = () => {
  const navigate = useNavigate();
  const [logOut, setLogOut] = useState(true)


  return (
    <>
      <div>Account Overview</div>

      {logOut && <button
        id="signout"
        onClick={(e) => {
          e.preventDefault();
          auth.signOut().then(() => {
            console.log("logged out!");
          });
          setLogOut(!logOut)
          //window.location.reload();
        }}
      >
        Sign out
      </button>}
    </>
  );
};

export default AccountOverviewPage;
