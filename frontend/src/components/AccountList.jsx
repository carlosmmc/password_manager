import React, { useState } from "react";
import AccountDetails from "./AccountDetails.jsx";
import { Col } from "react-bootstrap";

const AccountList = ({ accounts }) => {
  // do decryption in here

  const sorted = accounts.sort((a, b) => {
    if (a.data > b.data) {
      return 1;
    } else {
      return -1;
    }
  });

  return (
    <>
      <Col></Col>
      <Col md={6}>
        <table id="form" className="table table-hover">
          <thead>
            <tr className="table-primary">
              <th scope="row">App Name</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((account, i) => (
              <AccountDetails details={account} key={i} />
            ))}
          </tbody>
        </table>
      </Col>
      <Col></Col>
    </>
  );
};

export default AccountList;
