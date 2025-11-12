import React from "react";
import Login from "./login/Login";
import Cookies from "universal-cookie";
import PropTypes from "prop-types";

const Protectedroute = (props) => {
  const cookies = new Cookies();
  const sessionToken = cookies.get("auth.session-token");

  if (!sessionToken) return <Login />;
  return <div>{props.children}</div>;
};

Protectedroute.propTypes = {
  children: PropTypes.node,
};

export default Protectedroute;
