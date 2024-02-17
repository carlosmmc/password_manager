import React from "react";

const RegisterMfa = ({getPhoneNumber, handleSendText, getVerificationCode, handleEnterCode}) => {
  return (
    <>
      <input
        onChange={(e) => {
          getPhoneNumber(e.target.value);
        }}
      ></input>
      <button onClick={handleSendText}>Confirm</button>
      <input
        onChange={(e) => {
          getVerificationCode(e.target.value);
        }}
      ></input>

      <button onClick={handleEnterCode}>Submit code</button>
    </>
  );
};

export default RegisterMfa;
