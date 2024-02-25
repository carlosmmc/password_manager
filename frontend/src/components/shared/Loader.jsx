import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <>
      <h2>
        Loading <Spinner role="status"></Spinner>
      </h2>
    </>
  );
};

export default Loader;
