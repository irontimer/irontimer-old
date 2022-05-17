/** @format */

import { Component } from "solid-js";
import { Route, Routes } from "solid-app-router";
import "./App.scss";

// components
import { Top } from "./components/Top";

// pages
import { Home } from "./pages/Home";
import { Account } from "./pages/Account";
import { Timer } from "./pages/Timer";

export const App: Component = () => {
  return (
    <div class="App">
      <Top />
      <div class="content">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/account" element={<Account />}></Route>
          <Route path="/timer" element={<Timer />}></Route>
        </Routes>
      </div>
    </div>
  );
};
