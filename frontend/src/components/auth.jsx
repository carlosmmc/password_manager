import React from 'react'
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useState } from "react";

const auth = () => {
  return (
    <div>auth</div>
  )
}

export default auth