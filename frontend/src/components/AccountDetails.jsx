import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Col, Row, InputGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { a1Details } from "../sampledata.js";

const AccountDetails = ({ details }) => {
  // console.log(details.id);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [sliderValue, setSliderValue] = useState(16);

  const handleSliderChange = (e) => {
    setSliderValue(e.target.value);
  };

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
                <Form.Group className="mb-3">
                  <Form.Label>App Name</Form.Label>
                  <Form.Control type="appName" required={true} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Website URL (Optional)</Form.Label>
                  <Form.Control type="url" />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email </Form.Label>
                  <Form.Control type="email"required={true}/>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <div style={{ height: 100 + "px" }}>
                  <Form.Label>Random Password Generated</Form.Label>
                    <InputGroup className="mb-3">
                      <Form.Control
                        className="form-control form-control-lg"
                        type="text"
                        aria-describedby="basic-addon2"
                        id={"randomPassword"}
                      />
                      <Button variant="outline-secondary" id="button-addon2">
                        Generate
                      </Button>
                    </InputGroup>
                  </div>
                </Row>
              </Col>
              <Col>
                <Row>
                <Form.Label>Password Requirement</Form.Label>
                  <Col>
                    <Form.Group className="mb-3" controlId="checkNumber">
                      <Form.Check type="checkbox" label="0-9" defaultChecked={"checked"} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="checkLowerCase">
                      <Form.Check type="checkbox" label="a-z" defaultChecked={"checked"} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="checkUpperCase">
                      <Form.Check type="checkbox" label="A-Z" defaultChecked={"checked"} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="checkSpecialChar">
                      <Form.Check type="checkbox" label="!@#$%^&*" />
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

            <Button variant="primary" type="submmit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AccountDetails;
