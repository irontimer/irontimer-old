/**
 * /* @refresh reload
 *
 * @format
 */

import { render } from "solid-js/web";
import { Router } from "solid-app-router";

import "./index.scss";
import { App } from "./App";

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
