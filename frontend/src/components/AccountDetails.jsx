import React, { useState, useEffect } from "react";
import { Modal, Button, Col, Row, InputGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { generatePassword } from "../helpers/randomPassword.js";
import { editCredential, getCredential, deleteCredential } from "../helpers/requests.js";
import { IoMdEye, IoMdEyeOff, IoMdRefresh, IoMdCopy } from "react-icons/io";

const AccountDetails = ({ itemInfo, userId, kid }) => {
  const [show, setShow] = useState(false);
  const [clickedDetails, setClickedDetails] = useState(false)
  const [details, setDetails] = useState({});
  const [appName, setAppName] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sliderValue, setSliderValue] = useState(16);
  const [pwShow, setPwShow] = useState(false);
  const [numCheck, setNumCheck] = useState(true);
  const [upperCheck, setUpperCheck] = useState(true);
  const [lowerCheck, setLowerCheck] = useState(true);
  const [spCharCheck, setSpCharCheck] = useState(false);
  const [randomPw, setRandomPw] = useState("");

  const handleClose = () => {
    setShow(false);
  };

  const loadDetails = async () => {
    const data = await getCredential(userId, itemInfo.id);
    setDetails(data);
    setAppName(itemInfo.data);
    setWebsite(details.data);
    setEmail(details.id);
    setPassword(kid);
  };
  useEffect(() => {
    loadDetails();
  }, [clickedDetails]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const credDetails = {
      appName: appName,
      website: website,
      email: email,
      password: password,
    };
    // sample is set to test add without encryption
    const sample = {
      id: details.id,
      kid: kid,
      enc: "null",
      cty: "b5+jwk+json",
      overview: appName,
      details: website,
    };
    // change input from sample to credDetails when encryption is finished
    const changed = await editCredential(userId, itemInfo.id, sample);
    if (changed) {
      console.log("changed");
      window.location.reload();
    } else {
      console.log("not changed");
    }
  };

  const handleShow = () => {
    setShow(true);
    setClickedDetails(true)
    setRandomPw("");
    setPwShow(false);
    setSliderValue(16);
    setUpperCheck(true);
    setLowerCheck(true);
    setNumCheck(true);
    setSpCharCheck(false);
  };

  const handleSliderChange = (e) => {
    setSliderValue(e.target.value);
  };

  const handlePwShow = (e) => {
    e.preventDefault();
    setPwShow(!pwShow);
  };

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

  const handleDelete = async (e) => {
    e.preventDefault();
    const deleted = await deleteCredential(userId, itemInfo.id)
    if (deleted) {
      console.log("deleted")
      window.location.reload();
    } else {
      console.log("not deleted")
    }
  };

  return (
    <>
      <tr className="table-active">
        <th scope="row" onClick={handleShow}>
          {itemInfo.data}
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
                    defaultValue={itemInfo.data}
                    required={true}
                    onChange={(e) => setAppName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="websiteUrl">
                  <Form.Label>Website URL (Optional)</Form.Label>
                  <Form.Control
                    defaultValue={details.data}
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
                    defaultValue={details.id}
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
                    defaultValue={details.kid}
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
          <Col>
            <Button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </Button>
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
