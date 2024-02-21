import React from "react";
import { Button, Form } from "react-bootstrap";
import {
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { useAuth, signOutEvent } from "../helpers/helpers.js";

const SignUpPage = () => {
  const { auth, isSignIn, pending, user, hasMfa, isEmailVerified } = useAuth();
  setPersistence(auth, browserSessionPersistence).catch((error) => {
    console.error(error);
  });
  // createUserWithEmailAndPassword(auth, email, password)
  // .then((userCredential) => {
  //   // Signed up 
  //   const user = userCredential.user;
  //   // ...
  // })
  // .catch((error) => {
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  //   // ..
  // });


  return (
    <>
      <h3 className="subtitle">Sign up for an account</h3>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            autoComplete="username"
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Master Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            autoComplete="new-password"
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
        <Button variant="primary" >
          Register
        </Button>
      </Form>
    </>
  );
};

export default SignUpPage;
