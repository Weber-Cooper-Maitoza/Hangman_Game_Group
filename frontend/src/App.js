import React from "react";
import { Route, Routes } from "react-router-dom";

import UserName from "./components/username.js";
import Hangman from "./components/hangman.js";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<UserName />} />
        <Route path="/hangman" element={<Hangman />} />
      </Routes>
    </div>
  );
}

export default App;
