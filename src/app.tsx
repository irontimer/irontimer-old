// solid-js
import { Component } from "solid-js";
import { Route, Routes } from "solid-app-router";

// styles
import "./scss/index.scss";

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
