/** @format */

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";

// components
import Top from "./components/Top";

// pages
import Home from "./pages/Home";
import Account from "./pages/Account";
import Timer from "./pages/Timer";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Top />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/account" element={<Account />}></Route>
            <Route path="/timer" element={<Timer />}></Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
