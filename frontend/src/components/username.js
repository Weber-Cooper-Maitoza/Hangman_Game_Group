import React, { useState } from "react";
import { useNavigate } from "react-router";


export default function UserName() {
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    const response = await fetch(`http://localhost:5001/session_set/${username}`,
      {
        method: "GET",
        credentials: 'include'
      }
    );
    if (!response.ok) {
      const messge = `An error occured: ${response.statusText}`;
      window.alert(messge);
      return;
    }
    navigate("/hangman");
  }

  return(
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <label>Enter Username: </label>
          <input
            type="text"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="submit"
            value="Play Game"
          />
        </div>
      </form>
    </div>
  );
}