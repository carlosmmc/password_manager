import React from "react";

const AccountDetails = ({ details }) => {
  console.log(details.id);
  return (
    <tr className="table-active">
      <td>{details.data}</td>
    </tr>
  );
};

export default AccountDetails;
