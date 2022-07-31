// solid-js
import { Component } from "solid-js";
import { Route, Routes } from "solid-app-router";

// styles
import "../scss/index.scss";

// tsx
import { NotificationCenter } from "./components/notification-center";
import { Top } from "./components/top";
import { Account } from "./pages/account";
import { Settings } from "./pages/settings";
import { SignIn } from "./pages/sign-in";
import { Timer } from "./pages/timer";
import "./state/effect";
import "./utils/idle";

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
