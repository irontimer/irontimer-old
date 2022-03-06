/** @format */

import "./Button.scss";

function Button() {
  return (
    <div className="button">
      <button onClick={() => console.log("Test")}>Test Button</button>
    </div>
  );
}

export default Button;
