import React, { useState } from "react";
import { PhoneMultiFactorGenerator, PhoneAuthProvider } from "firebase/auth";
import { InputGroup, Form, Button } from "react-bootstrap";

const SendTextMFA = ({ verificationId, resolver }) => {
  const [verificationCode, setVerificationCode] = useState();
  const [phoneVerificationError, setPhoneVerificationError] = useState(false);

  const maskedPhoneNum = resolver.hints[0].phoneNumber;
  const handleVerificationCodeSubmit = (e) => {
    e.preventDefault();
    const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
    // Complete sign-in.
    return resolver
      .resolveSignIn(multiFactorAssertion)
      .then(function (userCredential) {
        // User successfully signed in with the second factor phone number.
      })
      .catch((error) => {
        setPhoneVerificationError(true);
      });
  };
  return (
    <>
      <div>
        We sent a 6-digit verification code to your phone number at{" "}
        {maskedPhoneNum}. Please check for your text and enter the code.
      </div>
      <InputGroup className="mb-3">
        <Form.Control
          className="form-control"
          type="number"
          onChange={(e) => {
            setVerificationCode(e.target.value);
          }}
        />
      </InputGroup>
      <Button onClick={handleVerificationCodeSubmit}>Submit Code</Button>
      {phoneVerificationError && (
        <>
          <div id="warning">
            Your authentication is expired. Please sign in again
          </div>
        </>
      )}
    </>
  );
};

export default SendTextMFA;
