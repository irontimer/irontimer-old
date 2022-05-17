/** @format */

import { Component } from "solid-js";
import "./Button.scss";

export const Button: Component = () => {
  return (
    <div class="button">
      <button onClick={() => console.log("Test")}>Test Button</button>
    </div>
  );
};
