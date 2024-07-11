import React from "react";
import { Route, Routes } from "react-router-dom";

import UserName from "./components/username.js";
import Hangman from "./components/hangman.js";
import Scores from "./components/scores.js"
import Lost from "./components/lost.js"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<UserName />} />
        <Route path="/hangman" element={<Hangman />} />
        <Route path="/scores" element={<Scores />} />
        <Route path="/lost" element={<Lost />} />
      </Routes>
    </div>
  );
}

export default App;
