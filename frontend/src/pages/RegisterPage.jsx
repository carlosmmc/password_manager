import React from "react";
import { Button, Form } from "react-bootstrap";

const RegisterPage = () => {
  return (
    <>
      <h3 className="subtitle">Account Registration</h3>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Master Password</Form.Label>
          <Form.Control type="password" placeholder="Enter password" />
          <Form.Text className="text-muted">
            Master password must be at least 10 characters long, containing each
            of the following characters at least once:​
            <li>Upper case​</li>
            <li>Lower case​​</li>
            <li>Number​: 0-9 ​​</li>
            <li>Special character: !@#$%^&*</li>
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </>
  );
};

export default RegisterPage;
