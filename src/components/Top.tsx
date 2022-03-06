/** @format */

import { Link } from "react-router-dom";
import "./Top.scss";
import {
  faUser,
  faHouse,
  faRightToBracket,
  faCube
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const pages = ["Timer", "Home", "Account", "Login"];

const icons = [
  <FontAwesomeIcon icon={faCube} />,
  <FontAwesomeIcon icon={faHouse} />,
  <FontAwesomeIcon icon={faUser} />,
  <FontAwesomeIcon icon={faRightToBracket} />
];

function Top() {
  return (
    <div className="top">
      <div className="logo">test</div>
      <h1 className="title">IronTimer</h1>
      <div className="nav">
        {pages.map((page, index) => (
          <div key={page} className="page">
            <Link
              className="page-link"
              to={`/${page === "Home" ? "" : page.toLowerCase()}`}
            >
              {icons[index]}
            </Link>
          </div>
        ))}
      </div>
      <div className="space"></div>
      <div className="config"></div>
    </div>
  );
}

export default Top;
