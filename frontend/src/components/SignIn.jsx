import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import {
  getAuth,
  signInWithEmailAndPassword,
  getMultiFactorResolver,
} from "firebase/auth";
import { auth } from "../firebase";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

  console.log(auth.currentUser);

  const handleSignIn = (e) => {
    e.preventDefault()
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
          // if (resolver.hints[selectedIndex].factorId ===
          //     PhoneMultiFactorGenerator.FACTOR_ID) {
          //     const phoneInfoOptions = {
          //         multiFactorHint: resolver.hints[selectedIndex],
          //         session: resolver.session
          //     };
          //     const phoneAuthProvider = new PhoneAuthProvider(auth);
          //     // Send SMS verification code
          //     return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier)
          //         .then(function (verificationId) {
          //             // Ask user for the SMS verification code. Then:
          //             const cred = PhoneAuthProvider.credential(
          //                 verificationId, verificationCode);
          //             const multiFactorAssertion =
          //                 PhoneMultiFactorGenerator.assertion(cred);
          //             // Complete sign-in.
          //             return resolver.resolveSignIn(multiFactorAssertion)
          //         })
          //         .then(function (userCredential) {
          //             // User successfully signed in with the second factor phone number.
          //         });
          // } else if (resolver.hints[selectedIndex].factorId ===
          //            TotpMultiFactorGenerator.FACTOR_ID) {
          //     // Handle TOTP MFA.
          //     // ...
          // } else {
          //     // Unsupported second factor.
          // }
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
            type="email"
            placeholder="Enter email"
            onChange={handleEmailInput}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Master Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            onChange={handlePasswordInput}
          />
        </Form.Group>
        <Stack direction="horizontal" gap={5}>
          <Button variant="primary" onClick={handleSignIn}>
            Log in
          </Button>
          <Button variant="success" href="/register">
            Register
          </Button>
          <Button variant="success">Register with Google</Button>
        </Stack>
      </Form>
    </>
  );
};

export default SignIn;
