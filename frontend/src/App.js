import React from "react";
import { Route, Routes } from "react-router-dom";

import UserName from "./components/username.js";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<UserName />} />
      </Routes>
    </div>
  );
}

export default App;
