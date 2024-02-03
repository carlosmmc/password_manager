import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// import * as firebase from "firebase";
import AccountList from "../components/AccountList.jsx";
import { signOutEvent, useAuth } from "../helpers.js";
import { Col, Row, Button } from "react-bootstrap";

const AccountOverviewPage = () => {
  const navigate = useNavigate();

  const { auth, isSignIn } = useAuth();

  const [apps, setApps] = useState([]);

  const loadApps = async () => {
    const response = await fetch("/api/v1/accounts/1234/items");
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
          {isSignIn && (
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
{isSignIn && <AccountList accounts={apps} />}
      </Row>

      {!isSignIn && (
        <>
          <h4>Please sign in</h4>
          <Button
            style={{ position: "static", bottom: 30 + "px" }}
            className="align-self-md-center"
            type="button"
            class="btn btn-secondary"
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
