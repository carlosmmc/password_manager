import React, {useState} from 'react'
import {
    PhoneMultiFactorGenerator,
    PhoneAuthProvider,
  } from "firebase/auth";

const SendTextMFA = ({ verificationId, resolver }) => {
    const [verificationCode, setVerificationCode] = useState()
    const handleVerificationCodeSubmit = (e) => {
        e.preventDefault()
        const cred = PhoneAuthProvider.credential(
            verificationId,
            verificationCode
          );
          const multiFactorAssertion =
            PhoneMultiFactorGenerator.assertion(cred);
          // Complete sign-in.
          return resolver.resolveSignIn(multiFactorAssertion)
          .then(function (userCredential) {
            // User successfully signed in with the second factor phone number.
            console.log("mfa signed in")
        });
    }
  return (
    <>
    <div>We sent a 6-digit verification code to your phone number at xxxx . 
        Please check for your text and enter the code. The code is valid for 15 minutes.
</div>
<input onChange={(e) => {setVerificationCode(e.target.value)}}></input>
    <button onClick={handleVerificationCodeSubmit}>Submit Code</button>

    </>
  )
}

export default SendTextMFA