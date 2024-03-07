import React, { useState } from "react";
import { Modal, Button, Col, Row, InputGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { a1Details } from "../sampledata.js";
import { generatePassword } from "../helpers/randomPassword.js";
import { editCredential } from "../helpers/requests.js";
import { IoMdEye, IoMdEyeOff, IoMdRefresh, IoMdCopy } from "react-icons/io";

const AccountDetails = ({ details }) => {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState("");
  const handleClose = () => {
    setShow(false);
  };

  const handleSaveChanges = (e) => {
    e.preventDefault()
    // encrypt here
    editCredential()
  }

  const handleShow = () => {
    setShow(true);
    setValue(a1Details[0]);
    setRandomPw("");
    setPwShow(false);
    setSliderValue(16);
    setUpperCheck(true);
    setLowerCheck(true);
    setNumCheck(true);
    setSpCharCheck(false);
  };
  
  console.log(details)

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

  return (
    <>
      <tr className="table-active">
        <th scope="row" onClick={handleShow}>
          {details.data}
        </th>
      </tr>
      <Modal show={show} onHide={handleClose} dialogClassName="my-modal">
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group >
                  <Form.Label>App Name</Form.Label>
                  <Form.Control
                    defaultValue={details.data}
                    type="appName"
                    required={true}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group  controlId="websiteUrl">
                  <Form.Label>Website URL (Optional)</Form.Label>
                  <Form.Control defaultValue={value.website} type="url" />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email </Form.Label>
                  <Form.Control
                    defaultValue={value.email}
                    type="email"
                    required={true}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Label>Password</Form.Label>
                <InputGroup >
                  <Form.Control
                    defaultValue={value.password}
                    type={pwShow ? "text" : "password"}
                    placeholder="Password"
                  />
                  <Button variant="outline-secondary" id="button-show">
                    {!pwShow && <IoMdEye onClick={handlePwShow} />}
                    {pwShow && <IoMdEyeOff onClick={handlePwShow} />}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    id="button-copy"
                    onClick={(e) => {
                      copyText(value.password);
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
                    <InputGroup >
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
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AccountDetails;
