import React from "react";
import { handleEmailVerification } from "../../helpers/helpers.js";
import { Button } from "react-bootstrap";

const VerifyEmail = ({ email }) => {
  return (
    <>
    <div id="auth-block"> 
      <p>
        An email has sent to your email address at {email}, please click the
        link to verify your email address.
      </p>
      <p>
        If you confirmed your email, please refresh the page.
      </p>
      <Button onClick={handleEmailVerification}>
        Resend email verification
      </Button>
     </div>
    </>
  );
};

export default VerifyEmail;
