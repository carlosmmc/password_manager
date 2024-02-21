import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import {
  getAuth,
  signInWithEmailAndPassword,
  getMultiFactorResolver,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  PhoneMultiFactorGenerator,
  PhoneAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase.js";
import { handleRecaptcha } from "../../helpers/helpers.js";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

  console.log(auth.currentUser);

  const actionCodeSettings = {
    url: "http://localhost:3000/",
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
        });
        sendEmailVerification(user, actionCodeSettings)
        .then(() => {
          console.log("sent");
        })
        .catch((error) => {
          console.log(`not sent! error: ${error}`);
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
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
        <Button variant="primary" onClick={handleSignUp}>
          Confirm
        </Button>
      </Form>
    </>
  );
};

export default SignUp;
