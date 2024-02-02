import React, { useState } from "react";
import AccountDetails from "./AccountDetails.jsx";

const AccountList = ({ accounts }) => {
  return (
    <>
      <table className="table table-hover">
        <thead>
          <tr className="table-primary">
            <th scope="row">App Name</th>
            <th>Website</th>
            <th>Email Used</th>
            <th>Username</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, i) => (
            <AccountDetails details={account} key={i} />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AccountList;
