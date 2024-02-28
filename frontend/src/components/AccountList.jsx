import React, { useState, useEffect } from "react";
import AccountDetails from "./AccountDetails.jsx";
import { Col } from "react-bootstrap";

const AccountList = () => {
  // do decryption in here

  const [apps, setApps] = useState([]);
  const loadApps = async () => {
    const response = await fetch("password-manager-osu.wl.r.appspot.com/api/v1/accounts/a8fc5384-1dbe-4763-b0ab-40bffb02f5a4/items")

    // const data = await response.body.json();
    setApps([{"cty":"b5+jwk+json","data":"yzab","enc":null,"id":"f37e85bf-cd37-4fe7-a684-93659a0e7d2c","kid":"27342754-60e8-4f9b-8be9-61c8d7dc3041","self":"http://password-manager-osu.wl.r.appspot.com/api/v1/accounts/a8fc5384-1dbe-4763-b0ab-40bffb02f5a4/items/f37e85bf-cd37-4fe7-a684-93659a0e7d2c"}]);
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
