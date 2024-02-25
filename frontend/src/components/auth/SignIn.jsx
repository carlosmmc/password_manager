import React, { useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import {
  signInWithEmailAndPassword,
  getMultiFactorResolver,
  PhoneMultiFactorGenerator,
  PhoneAuthProvider,
} from "firebase/auth";
import { handleRecaptcha } from "../../helpers/helpers.js";
import SendTextMFA from "./SendTextMFA.jsx";

const SignIn = ({ auth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [mfaTextSent, setMfaTextSent] = useState(false);
  const [mfaResolver, setMfaResolver] = useState();
  const [errorShow, setErrorShow] = useState(false);

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
        // ...
      })
      .catch(function (error) {
        if (error.code === "auth/multi-factor-auth-required") {
          const resolver = getMultiFactorResolver(auth, error);
          // Ask user which second factor to use.
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
            setErrorShow("Unsupported MFA method.");
          }
        } else {
          setErrorShow("You entered wrong email or password.");
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
        {mfaTextSent && (
          <>
            <SendTextMFA
              verificationId={verificationId}
              resolver={mfaResolver}
            />
          </>
        )}
        {errorShow && <div id="warning">{errorShow}</div>}
        <Stack direction="horizontal" gap={5}>
          <Button
            id="signin-signup-button"
            variant="primary"
            onClick={handleSignIn}
          >
            Log in
          </Button>
        </Stack>
      </Form>
    </>
  );
};

export default SignIn;
