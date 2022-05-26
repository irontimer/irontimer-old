/** @format */

// solid-js
import { Component } from "solid-js";
import { Route, Routes } from "solid-app-router";

// styles
import "./App.scss";

// components
import { Top } from "./components/Top";

// pages
import { Account } from "./pages/Account";
import { Timer } from "./pages/Timer";
import { Settings } from "./pages/Settings";
import { SignIn } from "./pages/SignIn";

export const App: Component = () => {
  return (
    <div class="App">
      <Top />
      <div class="content">
        <Routes>
          <Route path="/" element={<Timer />}></Route>
          <Route path="/account" element={<Account />}></Route>
          <Route path="/sign-in" element={<SignIn />}></Route>
          <Route path="/settings" element={<Settings />}></Route>
        </Routes>
      </div>
    </div>
  );
};
