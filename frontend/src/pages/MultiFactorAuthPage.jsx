import React, { useState, useEffect, useRef } from "react";
import {
  setPersistence,
  browserSessionPersistence,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
} from "firebase/auth";
import { signOutEvent, useAuth, handleRecaptcha } from "../helpers.js";
import RegisterMfa from "../components/RegisterMfa.jsx";
import BackToSignInPage from "../components/BackToSignIn.jsx";

const MultiFactorAuthPage = () => {
  const { auth, isSignIn, hasMfa } = useAuth();
  setPersistence(auth, browserSessionPersistence).catch((error) => {
    console.error(error);
  });

  const user = auth.currentUser;

  const [verificationCode, getVerificationCode] = useState("");
  const [phoneNumber, getPhoneNumber] = useState("");
  const [verificationId, setVerificationId] = useState("");

  console.log(auth);

  const handleSendText = (e) => {
    handleRecaptcha(e);
    const recaptchaVerifier = window.recaptchaVerifier;

    multiFactor(user)
      .getSession()
      .then(function (multiFactorSession) {
        // Specify the phone number and pass the MFA session.
        const phoneInfoOptions = {
          phoneNumber: phoneNumber,
          session: multiFactorSession,
        };

        const phoneAuthProvider = new PhoneAuthProvider(auth);

        // Send SMS verification code.
        return phoneAuthProvider.verifyPhoneNumber(
          phoneInfoOptions,
          recaptchaVerifier
        );
      })
      .then(function (verificationId) {
        setVerificationId(verificationId);
      });
  };

  const handleEnterCode = (e) => {
    const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

    // Complete enrollment.
    const mfaDisplayName = user.displayName;
    return multiFactor(user).enroll(multiFactorAssertion, mfaDisplayName);
  };

  return (
    <>
      <div>MultiFactorAuthPage</div>
      {isSignIn && !hasMfa && (
        <RegisterMfa
          getPhoneNumber={getPhoneNumber}
          handleSendText={handleSendText}
          getVerificationCode={getVerificationCode}
          handleEnterCode={handleEnterCode}
        />
      )}
      {isSignIn && hasMfa}
      {!isSignIn && <BackToSignInPage />}

      <div id="rcc"></div>
    </>
  );
};

export default MultiFactorAuthPage;
