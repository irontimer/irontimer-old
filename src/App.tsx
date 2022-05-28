/** @format */

// solid-js
import { Component } from "solid-js";
import { Route, Routes } from "solid-app-router";

// styles
import "./scss/index.scss";
import "./scss/components/Button.scss";
import "./scss/components/Popup.scss";
import "./scss/components/Text.scss";
import "./scss/components/TimerInput.scss";
import "./scss/components/TimerStopwatch.scss";
import "./scss/components/Top.scss";
import "./scss/pages/Account.scss";
import "./scss/pages/Settings.scss";
import "./scss/pages/SignIn.scss";
import "./scss/pages/Timer.scss";

// tsx
import { Top } from "./ts/components/Top";
import { Account } from "./ts/pages/Account";
import { Settings } from "./ts/pages/Settings";
import { SignIn } from "./ts/pages/SignIn";
import { Timer } from "./ts/pages/Timer";

export const App: Component = () => {
  return (
    <>
      <Top />
      <Routes>
        <Route path="/" element={<Timer />}></Route>
        <Route path="/account" element={<Account />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/settings" element={<Settings />}></Route>
      </Routes>
    </>
  );
};
