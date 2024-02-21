import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { setPersistence, browserSessionPersistence } from "firebase/auth";
import AccountList from "../components/AccountList.jsx";
import { signOutEvent, useAuth } from "../helpers/helpers.js";
import { Col, Row, Button } from "react-bootstrap";
import VerifyEmail from "../components/auth/VerifyEmail.jsx";
import Loader from "../components/shared/Loader.jsx";

const AccountOverviewPage = () => {
  const navigate = useNavigate();

  const { auth, isSignedIn, pending, user, hasMfa, isEmailVerified } = useAuth();
  setPersistence(auth, browserSessionPersistence).catch((error) => {
    console.error(error);
  });

  

  const [apps, setApps] = useState([]);

  const loadApps = async () => {
    if (isSignedIn && isEmailVerified && hasMfa) {
      const response = await fetch("/api/v1/accounts/1234/items").catch(
        (error) => {
          console.log(error);
        }
      );
      const data = await response.json();
      setApps(data);
    } else {
      return null;
    }
  };
  useEffect(() => {
    loadApps();
  }, []);

  if (pending) {
    return (<><Loader /></>)

  }

  return (
    <>
      <Row>
        <Col>
          <h3 id="subtitle">Account Overview</h3>
        </Col>
        <Col xs={6}></Col>
        <Col>
          {isSignedIn && hasMfa && (
            <Button
              type="button"
              style={{ position: "relative", top: 2 + "vh" }}
              className="btn btn-secondary"
              onClick={signOutEvent}
            >
              Sign out
            </Button>
          )}
        </Col>
      </Row>
      <Row>{isSignedIn && hasMfa && <AccountList accounts={apps} />}</Row>
      {isSignedIn && (
        <>
          {!isEmailVerified && <VerifyEmail email={auth.currentUser.email} />}
          {isEmailVerified && !hasMfa && (
            <Button
              style={{ position: "static", bottom: 30 + "px" }}
              type="button"
              className="btn btn-secondary"
              onClick={(e) => {
                e.preventDefault();
                navigate("/mfa");
              }}
            >
              {hasMfa ? "Back to Sign In Page" : "Create MFA"}
            </Button>
          )}

          <button
            type="button"
            className="btn btn-secondary"
            onClick={signOutEvent}
          >
            Sign out
          </button>
        </>
      )}
      {!isSignedIn && (
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
      )}
    </>
  );
};

export default AccountOverviewPage;
