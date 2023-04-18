import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function Protected({ children }) {
  const isSignedIn = useSelector((store) => store.auth.isAuthenticated);
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
}
export default Protected;
