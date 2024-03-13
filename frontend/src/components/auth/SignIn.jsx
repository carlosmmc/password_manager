import React, { useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import {
  signInWithEmailAndPassword,
  getMultiFactorResolver,
  PhoneMultiFactorGenerator,
  PhoneAuthProvider,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { handleRecaptcha } from "../../helpers/helpers.js";
import SendTextMFA from "./SendTextMFA.jsx";
import { setupMasterKey, idHash } from "../../helpers/encDec.js";

const SignIn = ({ auth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [mfaTextSent, setMfaTextSent] = useState(false);
  const [mfaResolver, setMfaResolver] = useState();
  const [errorShow, setErrorShow] = useState(false);

  const handleGoogle = (e) => {
    e.preventDefault()
    const provider = new GoogleAuthProvider();
    auth.languageCode = "en";
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

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
                // generate secret key id
                let skID;
                idHash(email).then((hash) => { skID = hash });
                // get Secret Key
                let sk = localStorage.getItem(skID);
                if (sk === null) {
                  // ask for secret key
                    sk = window.prompt("We don't recognize this device. Please enter your Secret Key.");
                }
                // Compute master key
                setupMasterKey(password, sk).then(() => {
                })
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
          <Button
            className="signin-signup-button"
            variant="primary"
            onClick={handleSignIn}
          >
            Log in
          </Button >
          {/* <Button className="signin-signup-button" onClick={handleGoogle}>Google</Button> */}
      </Form>
    </>
  );
};

export default SignIn;
