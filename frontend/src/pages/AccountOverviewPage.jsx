import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { setPersistence, browserSessionPersistence } from "firebase/auth";
import AccountList from "../components/AccountList.jsx";
import { signOutEvent, useAuth } from "../helpers/helpers.js";
import { getUserId } from "../helpers/requests.js";
import { Col, Row, Button } from "react-bootstrap";
import VerifyEmail from "../components/auth/VerifyEmail.jsx";
import Loader from "../components/shared/Loader.jsx";
import AddCred from "../components/AddCred.jsx";

const AccountOverviewPage = () => {
  const navigate = useNavigate();

  const { auth, isSignedIn, pending, user, hasMfa, isEmailVerified } = useAuth();
  setPersistence(auth, browserSessionPersistence).catch((error) => {
    console.error(error);
  });


  const [accountInfo, setAccountInfo] = useState()

  const loadUserInfo = async (email) => {
    const data = await getUserId(email)
    setAccountInfo(data);
}

useEffect(() => {
  if (user){
    loadUserInfo(user.email);
  }

}, [user]);


  if (pending) {
    return (
      <>
        <Loader />
      </>
    );
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
            <div>
              {
                <AddCred userInfo={accountInfo}/>}
            </div>
          )}
        </Col>
      </Row>
      <Row>{isSignedIn && hasMfa && <AccountList accountInfo={accountInfo}/>}</Row>
      {isSignedIn && (
        <>
          {!isEmailVerified && <VerifyEmail email={auth.currentUser.email} />}
          {isEmailVerified && !hasMfa && (
            <>
              <p>You need to enroll in MFA first.</p>
              <Button
                className="signin-signup-button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                }}
              >
                Back to home page
              </Button>
            </>
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
