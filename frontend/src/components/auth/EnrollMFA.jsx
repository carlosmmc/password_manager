import React, { useState } from "react";
import {
  setPersistence,
  browserSessionPersistence,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
} from "firebase/auth";
import { useAuth, handleRecaptcha } from "../../helpers/helpers.js";
import { Button, InputGroup, Form } from "react-bootstrap";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const EnrollMFA = ({ vid }) => {
  const { auth, isSignedIn, user, hasMfa } = useAuth();
  setPersistence(auth, browserSessionPersistence).catch((error) => {
    console.error(error);
  });

  const [sendText, setSendText] = useState(false);
  const [verificationCode, getVerificationCode] = useState("");
  const [phoneNumber, getPhoneNumber] = useState();
  const [verificationId, setVerificationId] = useState(vid);
  const [phoneVerificationError, setPhoneVerificationError] = useState();

  const handleSendText = (e) => {
    e.preventDefault();
    try {
      handleRecaptcha(e);
    } catch (error) {
      setPhoneVerificationError("Recaptcha error. Please refresh the page.");
    }

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
        setSendText(true);
      })
      .catch((error) => {
        console.log(error);
        if (error.code === "auth/requires-recent-login") {
          setPhoneVerificationError(
            "This operation is sensitive and requires recent authentication. Log in again before retrying this request."
          );
        }
        if (error.code === "auth/invalid-phone-number") {
          setPhoneVerificationError(
            "Invalid phone number. Please enter a new one."
          );
        }
      });
  };

  const handleEnterCode = (e) => {
    const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

    // Complete enrollment.
    const mfaDisplayName = user.displayName;
    if (!hasMfa) {
      return multiFactor(user)
        .enroll(multiFactorAssertion, mfaDisplayName)
        .then(() => {
          //successfully enrolled
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  return (
    <>
      <div>
        Please enroll for multi-factor authentication using your phone number
      </div>
      {isSignedIn && !hasMfa && (
        <>
          <InputGroup className="mb-3">
            <PhoneInput
              placeholder="Enter phone number"
              defaultCountry="US"
              value={phoneNumber}
              onChange={getPhoneNumber}
            />
          </InputGroup>
          {phoneVerificationError && (
            <p id="warning">{phoneVerificationError}</p>
          )}
          <Button onClick={handleSendText}>Confirm</Button>
          {sendText && (
            <>
              <div>
                We've sent a text to your phone number: {phoneNumber}. Please
                enter the verification code.
              </div>
              <InputGroup className="mb-3">
                <Form.Control
                  className="form-control"
                  type="number"
                  onChange={(e) => {
                    getVerificationCode(e.target.value);
                  }}
                />
              </InputGroup>
              <Button onClick={handleEnterCode}>Submit code</Button>
            </>
          )}
        </>
      )}
      {isSignedIn && hasMfa && (
        <>
          <input
            onChange={(e) => {
              getVerificationCode(e.target.value);
            }}
          ></input>

          <button onClick={handleEnterCode}>Submit code</button>
        </>
      )}
    </>
  );
};

export default EnrollMFA;
