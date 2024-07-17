import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Lost() {
	const navigate = useNavigate();

	const [word, setWord] = useState({
		word: [],
		lettersGuessed: []
	});

	useEffect(() => {
		async function run() {
      const response = await fetch("http://localhost:5001/game", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			//console.log(response)
			if (response.status === 301) {
				window.alert(await response.json());
				navigate("/");
				return;
			} else if (!response.ok) {
				const messge = `An error occured: ${response.statusText}`;
				window.alert(messge);
				return;
			}
			let x = await response.json();
      //x.lettersGuessed.sort()
			setWord(x);
		}
		run();
		return;
	}, []);

	async function highScores(e) {
		e.preventDefault();
		navigate("/scores");
		return;
	}

	return (
		<div>
			<h1>You Lost &#128532;</h1>
			<h3>Your Word Was: {word.word}</h3>
			<form onSubmit={highScores}>
				<input type="submit" value="High Scores" />
			</form>
		</div>
	);
}