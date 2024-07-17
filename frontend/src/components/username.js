import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function UserName() {
	const [username, setUsername] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		async function reset() {
			console.log("Reset");
			const response = await fetch(`http://localhost:5001/endGame`, {
				method: "GET",
				credentials: "include",
			});
		}

		reset();
	}, []);

	async function onSubmit(e) {
		e.preventDefault();
		const response = await fetch(`http://localhost:5001/start`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
        username: username,
      }),
		});
		if (response.status === 301) {
			window.alert(await response.json());
		}
		if (!response.ok) {
			const messge = `An error occured: ${response.statusText}`;
			window.alert(messge);
			return;
		}
		navigate("/hangman");
	}

	return (
		<div>
			<form onSubmit={onSubmit}>
				<div>
					<label>Enter Username: </label>
					<input
						type="text"
						id="username"
            			autoComplete="off"
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div>
					<input type="submit" value="Play Game"/>
				</div>
			</form>
		</div>
	);
}
