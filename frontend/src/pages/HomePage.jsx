import React from "react";
import "firebase/compat/auth";
import "firebaseui/dist/firebaseui.css";
import { uiConfig, ui } from "../firebase.js";


const HomePage = () => {
  ui.start("#firebaseui-auth-container", uiConfig);

  return (
    <>
      <h3 className="subtitle">Welcome! Please sign in</h3>
      <div id="firebaseui-auth-container"></div>
      <button id="signout" hidden={true}>
        Sign out
      </button>
    </>
  );
};

export default HomePage;
