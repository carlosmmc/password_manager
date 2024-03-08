import React, { useState, useEffect } from "react";
import AccountDetails from "./AccountDetails.jsx";
import { Col } from "react-bootstrap";
import { getOverviewList } from "../helpers/requests.js";

const AccountList = ({ accountInfo }) => {
  const [apps, setApps] = useState([]);

  const loadApps = async () => {
    if (accountInfo) {
      const data = await getOverviewList(accountInfo.id);
      setApps(data);
    }
  };
  useEffect(() => {
    loadApps();
  }, [accountInfo]);

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
              <AccountDetails
                itemInfo={account}
                key={i}
                userId={accountInfo.id}
                kid={accountInfo.kid}
              />
            ))}
          </tbody>
        </table>
      </Col>
      <Col></Col>
    </>
  );
};

export default AccountList;
