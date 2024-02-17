import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { setPersistence, browserSessionPersistence } from "firebase/auth";
import AccountList from "../components/AccountList.jsx";
import { signOutEvent, useAuth } from "../helpers.js";
import { Col, Row, Button } from "react-bootstrap";

const AccountOverviewPage = () => {
  const navigate = useNavigate();

  const { auth, isSignIn, hasMfa } = useAuth();
  setPersistence(auth, browserSessionPersistence)
  .catch((error) => {
    console.error(error)
  });

  const [apps, setApps] = useState([]);

  const loadApps = async () => {
    const response = await fetch("/api/v1/accounts/1234/items").catch((error) => {
      console.log(error)
    });
    const data = await response.json();
    setApps(data);
  };
  useEffect(() => {
    loadApps();
  }, []);

  return (
    <>
      <Row>
        <Col>
          <h3 id="subtitle">Account Overview</h3>
        </Col>
        <Col xs={6}></Col>
        <Col>
          {isSignIn && hasMfa && (
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
      <Row>
{isSignIn && hasMfa && <AccountList accounts={apps} />}
      </Row>

      {!isSignIn || !hasMfa && (
        <>
          <h4>Please sign in</h4>
          <Button
            style={{ position: "static", bottom: 30 + "px" }}
            type="button"
            className="btn btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              hasMfa? navigate("/") : navigate("/mfa")
            }}
          >
            {hasMfa ? "Back to Sign In Page" : "Create MFA"}
          </Button>
        </>
      )}
    </>
  );
};

export default AccountOverviewPage;
