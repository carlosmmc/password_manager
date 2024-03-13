import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../firebase.js";
import { setupMasterKey, idHash } from "../../helpers/encDec.js";
import { generatePassword } from "../../helpers/randomPassword.js";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorShow, setErrorShow] = useState(false);

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

  const actionCodeSettings = {
    url: "https://password-manager-osu.wl.r.appspot.com/",
    handleCodeInApp: true,
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        updateProfile(user, {
          displayName: username,
        }).then(() => {
          console.log(`profile updated, username: ${username}`);
          // generate secret key id
          let skID;
          idHash(email).then((hash) => { skID = hash });
          // compute secret key
          const sk = generatePassword(16, true, true, true, true)
          window.alert(`Your Secret Key is:\n${sk}\nPlease write this down in a safe place. You will need it to recover your account.`);
          // Compute master key
          setupMasterKey(password, sk, skID).then(() => {
            console.log("retrieved key: ", sessionStorage.getItem("mk"));
          })
        });
        sendEmailVerification(user, actionCodeSettings)
          .then(() => {})
          .catch((error) => {
            console.log(`not sent! error: ${error}`);
          });
      })
      .catch((error) => {
        setErrorShow("Please check if a valid email address is entered");
      });
  };

  return (
    <>
      <h3 id="subtitle">Enter your information to sign up for an account</h3>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Your name</Form.Label>
          <Form.Control
            autoComplete={"name"}
            type="name"
            placeholder="Enter your name"
            required={true}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            autoComplete={"username"}
            type="email"
            placeholder="Enter email"
            required={true}
            onChange={handleEmailInput}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Master Password</Form.Label>
          <Form.Control
            autoComplete={"new-password"}
            type="password"
            placeholder="Enter password"
            onChange={handlePasswordInput}
          />
          <Form.Text className="text-muted">
            Master password must be at least 10 characters long, containing each
            of the following characters at least once:​
            <li>Upper case​</li>
            <li>Lower case​​</li>
            <li>Number​: 0-9 ​​</li>
            <li>Special character: !@#$%^&*</li>
          </Form.Text>
        </Form.Group>
        {errorShow && (
          <>
            <div id="warning">{errorShow}</div>
          </>
        )}
        <Button
          className="signin-signup-button"
          variant="primary"
          onClick={handleSignUp}
        >
          Confirm
        </Button>
      </Form>
    </>
  );
};

export default SignUp;
