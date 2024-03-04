import React, { useState, useEffect } from "react";
import AccountDetails from "./AccountDetails.jsx";
import { Col } from "react-bootstrap";

const AccountList = () => {
  // do decryption in here

  const baseLink = "password-manager-osu.wl.r.appspot.com/api/v1/accounts/";
  const accountId = "ACCOUNTID";
  const [apps, setApps] = useState([]);
  const loadApps = async () => {
    const response = await fetch(baseLink + accountId + "/items");
    const data = await response.json()

    setApps(data);
  };
  useEffect(() => {
    loadApps();
  }, []);

  const sorted = apps.sort((a, b) => {
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
