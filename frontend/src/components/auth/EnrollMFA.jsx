import React, { useState, useEffect, useRef } from "react";
import {
  setPersistence,
  browserSessionPersistence,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
} from "firebase/auth";
import { useAuth, handleRecaptcha, signOutEvent } from "../../helpers/helpers.js";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const EnrollMFA = ({ vid }) => {
  const { auth, isSignedIn, pending, user, hasMfa, isEmailVerified } =
    useAuth();
  setPersistence(auth, browserSessionPersistence).catch((error) => {
    console.error(error);
  });
  const navigate = useNavigate();

  const [sendText, setSendText] = useState(false);
  const [verificationCode, getVerificationCode] = useState("");
  const [phoneNumber, getPhoneNumber] = useState("");
  const [verificationId, setVerificationId] = useState(vid);

  console.log(hasMfa);

  const handleSendText = (e) => {
    e.preventDefault();
    handleRecaptcha(e);
    const recaptchaVerifier = window.recaptchaVerifier;
    if (!hasMfa) {
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
          console.log("sent")
        })
        .catch((error) => {
          return (
            <>
              <div
                className="modal show"
                style={{ display: "block", position: "initial" }}
              >
                <Modal.Dialog>
                  <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>
                      This operation is sensitive and requires recent
                      authentication. Log in again before retrying this request.
                    </p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary">Close</Button>
                    <Button variant="primary" onClick={signOutEvent}>Save changes</Button>
                  </Modal.Footer>
                </Modal.Dialog>
              </div>
            </>
          );
        });
    } else {
    }
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
          //successfully enrolled, maybe add a modal?
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
          <input
            onChange={(e) => {
              getPhoneNumber(e.target.value);
            }}
          ></input>
          <button onClick={handleSendText}>Confirm</button>
          {sendText && (
            <>
              <div>
                We've sent a text to your phone number: {phoneNumber}. Please
                enter the verification code.
              </div>
              <input
                onChange={(e) => {
                  getVerificationCode(e.target.value);
                }}
              ></input>
              <button onClick={handleEnterCode}>Submit code</button>
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

      <div id="rcc"></div>
    </>
  );
};

export default EnrollMFA;
