import React from "react";
import { Button, Form, Stack } from "react-bootstrap";

const HomePage = () => {
  return (
    <>
      <h3 className="subtitle">Welcome! Please sign in</h3>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Master Password</Form.Label>
          <Form.Control type="password" placeholder="Enter password" />
        </Form.Group>
        <Stack direction="horizontal" gap={5}>
          <Button variant="primary" type="submit">
            Log in
          </Button>
          <Button variant="success" href="/register">
            Register
          </Button>
          <Button variant="success">Register with Google</Button>
        </Stack>
      </Form>
    </>
  );
};

export default HomePage;
