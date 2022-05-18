/** @format */

import { Component } from "solid-js";
import { Route, Routes } from "solid-app-router";
import "./App.scss";

// components
import { Top } from "./components/Top";

// pages
import { Account } from "./pages/Account";
import { Timer } from "./pages/Timer";

export const App: Component = () => {
  return (
    <div class="App">
      <Top />
      <div class="content">
        <Routes>
          <Route path="/" element={<Timer />}></Route>
          <Route path="/account" element={<Account />}></Route>
        </Routes>
      </div>
    </div>
  );
};
