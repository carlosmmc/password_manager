import React, { useState } from "react";
import { Modal, Button, Col, Row, InputGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { generatePassword } from "../helpers/randomPassword.js";
import { createCredential } from "../helpers/requests.js";
import { IoMdEye, IoMdEyeOff, IoMdRefresh, IoMdCopy } from "react-icons/io";

const AddCred = ({ accountInfo, userId }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
    setRandomPw("");
    setPwShow(false);
    setSliderValue(16);
    setUpperCheck(true);
    setLowerCheck(true);
    setNumCheck(true);
    setSpCharCheck(false);
  };

  const [sliderValue, setSliderValue] = useState(16);

  const handleSliderChange = (e) => {
    setSliderValue(e.target.value);
  };

  const [pwShow, setPwShow] = useState(false);

  const handlePwShow = (e) => {
    e.preventDefault();
    setPwShow(!pwShow);
  };

  const [numCheck, setNumCheck] = useState(true);
  const [upperCheck, setUpperCheck] = useState(true);
  const [lowerCheck, setLowerCheck] = useState(true);
  const [spCharCheck, setSpCharCheck] = useState(false);
  const [randomPw, setRandomPw] = useState("");

  const handlePwGenerate = (e) => {
    e.preventDefault();
    const pw = generatePassword(
      sliderValue,
      upperCheck,
      lowerCheck,
      numCheck,
      spCharCheck
    );
    setRandomPw(pw);
  };

  function copyText(stringToBeCopied) {
    navigator.clipboard.writeText(stringToBeCopied);
  }

  const [appName, setAppName] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleAddCred = async (e) => {
    e.preventDefault();
    const credDetails = {
      appName: appName,
      website: website,
      email: email,
      password: password,
    };
    console.log(credDetails);
    const sample = {
      kid: appName,
      enc: "A256GCM",
      cty: "b5+jwk+json",
      overview: website,
      details: email,
    };
    const changed = await createCredential(userId, sample);
    if (changed) {
      console.log("added");
      window.location.reload();
    } else {
      console.log("not added");
    }
  };

  return (
    <>
      <Button
        type="button"
        style={{ position: "relative", top: 2 + "vh" }}
        className="btn btn-primary"
        onClick={handleShow}
      >
        Add New Credential
      </Button>
      <Modal show={show} onHide={handleClose} dialogClassName="my-modal">
        <Modal.Header closeButton>
          <Modal.Title>Add New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>App Name</Form.Label>
                  <Form.Control
                    type="appName"
                    required={true}
                    onChange={(e) => setAppName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="websiteUrl">
                  <Form.Label>Website URL (Optional)</Form.Label>
                  <Form.Control
                    type="url"
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email </Form.Label>
                  <Form.Control
                    type="email"
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={pwShow ? "text" : "password"}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button variant="outline-secondary" id="button-show">
                    {!pwShow && <IoMdEye onClick={handlePwShow} />}
                    {pwShow && <IoMdEyeOff onClick={handlePwShow} />}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    id="button-copy"
                    onClick={(e) => {
                      copyText(password);
                    }}
                  >
                    <IoMdCopy />
                  </Button>
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <div style={{ height: 100 + "px" }}>
                    <Form.Label>Random Password Generated</Form.Label>
                    <InputGroup>
                      <Form.Control
                        className="form-control form-control-lg"
                        type="text"
                        aria-describedby="basic-addon2"
                        id={"randomPassword"}
                        defaultValue={randomPw}
                      />
                      <Button
                        variant="outline-secondary"
                        id="button-generate"
                        onClick={handlePwGenerate}
                      >
                        <IoMdRefresh />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        id="button-copy2"
                        onClick={(e) => {
                          copyText(randomPw);
                        }}
                      >
                        <IoMdCopy />
                      </Button>
                    </InputGroup>
                  </div>
                </Row>
                <Row>
                  <Col></Col>
                  <Col></Col>
                  <Col></Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Form.Label>Password Requirement</Form.Label>
                  <Col>
                    <Form.Group controlId="checkNumber">
                      <Form.Check
                        type="checkbox"
                        label="0-9"
                        defaultChecked={numCheck}
                        onChange={(e) => {
                          setNumCheck(!numCheck);
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="checkLowerCase">
                      <Form.Check
                        type="checkbox"
                        label="a-z"
                        defaultChecked={lowerCheck}
                        onChange={(e) => {
                          setLowerCheck(!lowerCheck);
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="checkUpperCase">
                      <Form.Check
                        type="checkbox"
                        label="A-Z"
                        defaultChecked={upperCheck}
                        onChange={(e) => {
                          setUpperCheck(!upperCheck);
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="checkSpecialChar">
                      <Form.Check
                        type="checkbox"
                        label="!@#$%^&*"
                        defaultChecked={spCharCheck}
                        onChange={(e) => {
                          setSpCharCheck(!spCharCheck);
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Form.Group id="slider">
                    <Form.Label>Password Length: {sliderValue}</Form.Label>
                    <Form.Range
                      min={8}
                      max={20}
                      value={sliderValue}
                      name="sliderBar"
                      onChange={handleSliderChange}
                      className="custom-slider"
                    />
                  </Form.Group>
                </Row>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={handleAddCred}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddCred;
