import React from "react";
import "./styles.css";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  console.log("PATH", currentPath);

  return (
    <div className="header-wrapper">
      <div className="gradient" />
      <div className="links">
        <Link
          to="/"
          style={{ color: currentPath == "/" ? "white" : "#8ea6bb" }}
        >
          Signup
        </Link>
        <Link
          to="/podcasts"
          style={{ color: currentPath == "/podcasts" ? "white" : "#8ea6bb" }}
        >
          Podcasts
        </Link>
        <Link
          to="/create-podcast"
          style={{
            color: currentPath == "/create-podcast" ? "white" : "#8ea6bb",
          }}
        >
          Start A Podcast
        </Link>
        <Link
          to="/profile"
          style={{ color: currentPath == "/profile" ? "white" : "#8ea6bb" }}
        >
          Profile
        </Link>
      </div>
    </div>
  );
}

export default Header;
