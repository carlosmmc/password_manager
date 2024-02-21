import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import {
  getAuth,
  signInWithEmailAndPassword,
  getMultiFactorResolver,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  PhoneMultiFactorGenerator,
  PhoneAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase.js";
import { handleRecaptcha } from "../../helpers/helpers.js";
import SendTextMFA from "./SendTextMFA.jsx";
import { resolvePath } from "react-router-dom";

const SignIn = ({ auth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [mfaTextSent, setMfaTextSent] = useState(false);
  const [mfaResolver, setMfaResolver] = useState();

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    handleRecaptcha(e);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch(function (error) {
        if (error.code == "auth/multi-factor-auth-required") {
          const resolver = getMultiFactorResolver(auth, error);
          // Ask user which second factor to use.
          console.log(resolver);
          if (
            resolver.hints[0].factorId === PhoneMultiFactorGenerator.FACTOR_ID
          ) {
            const phoneInfoOptions = {
              multiFactorHint: resolver.hints[0],
              session: resolver.session,
            };
            const phoneAuthProvider = new PhoneAuthProvider(auth);
            const recaptchaVerifier = window.recaptchaVerifier;
            // Send SMS verification code
            return phoneAuthProvider
              .verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier)
              .then(function (verificationId) {
                setVerificationId(verificationId);
                setMfaResolver(resolver);
                setMfaTextSent(true);
              })
              .then(function (userCredential) {
                // User successfully signed in with the second factor phone number.
              });
          } else {
            // Unsupported second factor.
          }
        } else if (error.code == "auth/wrong-password") {
          // Handle other errors such as wrong password.
        }
      });
  };

  return (
    <>
      <h3 id="subtitle">Welcome! Please sign in</h3>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
          autoComplete={"username"}
            type={"email"}
            placeholder="Enter email"
            onChange={handleEmailInput}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Master Password</Form.Label>
          <Form.Control
          autoComplete={"password"}
            type={"password"}
            placeholder="Enter password"
            onChange={handlePasswordInput}
          />
        </Form.Group>
        <Stack direction="horizontal" gap={5}>
          <Button variant="primary" onClick={handleSignIn}>
            Log in
          </Button>
          {mfaTextSent && (
            <>
              <SendTextMFA
                verificationId={verificationId}
                resolver={mfaResolver}
              />
            </>
          )}
        </Stack>
      </Form>
    </>
  );
};

export default SignIn;
