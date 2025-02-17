import React from "react";

const WrapComponent = ({ condition, wrap, children }) => {
  if (condition) return wrap(children);
  return children;
};

export default WrapComponent;
