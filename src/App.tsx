/** @format */

import { Component, onMount } from "solid-js";
import { Route, Routes } from "solid-app-router";
import "./App.scss";

// components
import { Top } from "./components/Top";

// pages
import { Account } from "./pages/Account";
import { Timer } from "./pages/Timer";
import { Settings } from "./pages/Settings";

// signals
import { generateScramble, setScramble } from "./state/scramble";
import { getPuzzle } from "./state/puzzle";
import { Login } from "./pages/Login";

export const App: Component = () => {
  onMount(() => {
    setScramble(generateScramble(getPuzzle()));
  });

  return (
    <div class="App">
      <Top />
      <div class="content">
        <Routes>
          <Route path="/" element={<Timer />}></Route>
          <Route path="/account" element={<Account />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/settings" element={<Settings />}></Route>
        </Routes>
      </div>
    </div>
  );
};
