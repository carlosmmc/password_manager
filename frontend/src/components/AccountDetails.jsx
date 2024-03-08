import React, { useState, useEffect } from "react";
import { Modal, Button, Col, Row, InputGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { a1Details } from "../sampledata.js";
import { generatePassword } from "../helpers/randomPassword.js";
import { editCredential, getCredential } from "../helpers/requests.js";
import { IoMdEye, IoMdEyeOff, IoMdRefresh, IoMdCopy } from "react-icons/io";

const AccountDetails = ({ accountInfo, userId }) => {
  const [show, setShow] = useState(false);
  const value = a1Details[0];
  const handleClose = () => {
    setShow(false);
  };

  const itemId = accountInfo.id;

  const [details, setDetails] = useState({});
  const loadDetails = async () => {
    const data = await getCredential(userId, itemId);
    setDetails(data);
    setAppName(details.data);
    setWebsite(value.website);
    setEmail(value.email);
    setPassword(value.password);
  };
  useEffect(() => {
    loadDetails();
  }, []);

  const [appName, setAppName] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const credDetails = {
      appName: appName,
      website: website,
      email: email,
      password: password,
    };
    const sample = {
      id: "f37e85bf-cd37-4fe7-a684-93659a0e7d2c",
      kid: "27342754-60e8-4f9b-8be9-61c8d7dc3041",
      enc: "null",
      cty: "b5+jwk+json",
      overview: "rdfthyukjlA4nmajhgf",
      details: appName,
    };
    const changed = await editCredential(userId, itemId, credDetails);
    if (changed) {
      console.log("changed");
      window.location.reload();
    } else {
      console.log("not changed");
    }
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

  console.log(accountInfo);

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

  const handleDelete = (e) => {
    e.preventDefault()
    
  }

  return (
    <>
      <tr className="table-active">
        <th scope="row" onClick={handleShow}>
          {accountInfo.data}
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
                <Form.Group>
                  <Form.Label>App Name</Form.Label>
                  <Form.Control
                    defaultValue={details.data}
                    required={true}
                    onChange={(e) => setAppName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="websiteUrl">
                  <Form.Label>Website URL (Optional)</Form.Label>
                  <Form.Control
                    defaultValue={value.website}
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
                    defaultValue={value.email}
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
                    defaultValue={value.password}
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
          <Col>
            <Button className="btn btn-danger" onClick={handleDelete}>Delete</Button>
          </Col>
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
