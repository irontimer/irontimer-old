/**
 * /* @refresh reload
 *
 * @format
 */

import { render } from "solid-js/web";
import { Router } from "solid-app-router";

import { App } from "./app";

const root = document.getElementById("root");

if (root === null) {
  throw new Error("No root element found");
}

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  root
);
