import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";

const Header = () => {
  return (
    <>
      <Navbar
        expand="lg"
        className="bg-body-navbar navbar-expand-lg bg-primary"
        data-bs-theme="dark">
        <Container className="container-fluid">
          <Navbar.Brand className="navbar-brand" href="/">
            Secure Password Manager
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="navbarColor01">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/account">Account</Nav.Link>
              <NavDropdown
                title="About Us"
                id="basic-nav-dropdown"
                data-bs-theme="dark">
                {/* <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item> */}
                {/* <NavDropdown.Divider /> */}
                <NavDropdown.Item
                  onClick={() =>
                    window.open(
                      "https://github.com/carlosmmc/password_manager",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }>
                  View our work in GitHub
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
