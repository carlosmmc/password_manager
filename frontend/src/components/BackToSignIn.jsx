import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";


const BackToSignInPage = () => {
    const navigate = useNavigate();
  return (
    <>
      <h4>Please sign in</h4>
      <Button
        style={{ position: "static", bottom: 30 + "px" }}
        type="button"
        className="btn btn-secondary"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
      >
        Back to Sign In Page
      </Button>
    </>
  );
};

export default BackToSignInPage;
