/**
 * /* @refresh reload
 *
 * @format
 */

import { Router } from "solid-app-router";
import { render } from "solid-js/web";

import { App } from "./ts/app";

const root = document.getElementById("root");

if (root === null) {
  throw new Error("No root element found");
}

if (window.location.hostname === "127.0.0.1") {
  window.location.replace("http://localhost:3000");

  throw "Redirecting";
}

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  root
);
