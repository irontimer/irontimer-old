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
import { generateScramble, setScramble } from "./signal/scramble";
import { getPuzzle } from "./signal/puzzle";

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
          <Route path="/settings" element={<Settings />}></Route>
        </Routes>
      </div>
    </div>
  );
};
