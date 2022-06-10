// solid-js
import { Component } from "solid-js";
import { Route, Routes } from "solid-app-router";

// styles
import "./scss/index.scss";
import "./scss/components/Button.scss";
import "./scss/components/NotificationCenter.scss";
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
import { NotificationCenter } from "./ts/components/notification-center";
import { Top } from "./ts/components/top";
import { Account } from "./ts/pages/account";
import { Settings } from "./ts/pages/settings";
import { SignIn } from "./ts/pages/sign-in";
import { Timer } from "./ts/pages/timer";
import "./ts/state/effect";

export const App: Component = () => {
  return (
    <>
      <NotificationCenter />
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
