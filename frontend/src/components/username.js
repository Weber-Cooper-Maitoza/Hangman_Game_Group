import React, { useState } from "react";
import { useNavigate } from "react-router";


export default function UserName() {
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    const x ={
      username: username
    }
    console.log(x)
    const response = await fetch(`http://localhost:5001/start`,
      {
        method: "POST",
        credentials: 'include',
        headers: {
				"Content-Type": "application/json",
			},
        body: JSON.stringify(x),
      }
    );
    if(response.status === 301){
      window.alert(await response.json())
    }
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