import React, { useState, useEffect } from "react";
import AccountDetails from "./AccountDetails.jsx";
import { Col } from "react-bootstrap";
import { getOverviewList } from "../helpers/requests.js";

const AccountList = ({accountInfo}) => {
  // do decryption in here

  const accountId = accountInfo.id;
  const [apps, setApps] = useState([]);
  const loadApps = async () => {
  const data = await getOverviewList(accountId)

    setApps(data);
  };
  useEffect(() => {
    loadApps();
  }, []);

  const sorted = apps.sort((a, b) => {
    if (a.results > b.results) {
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
