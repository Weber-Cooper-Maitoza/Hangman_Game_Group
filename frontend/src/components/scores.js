import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./scores.css";

// Upon fully guessing the word, that name is then stored into a scores table.
// Then a top 10 high scores table is displayed for all successful games with
// words of similar length. The high scores shows the name, the number of guesses,
// and the word length.

// If the word was not succesfully guessed with all allowed moves, then inform
// the user of the correct word. Then allow the user to go to the top 10 high
// scores table as previously described.

// After the high scores table is displayed, the game then asks if the user
// wishes to play again.

// Show the top 10 scores for the amount of letters in this word.  For example, if
// the word had 8 letters, then show the 8 letter high scores table.  Show how many
// guesses (either total or missed guesses), and report the best top 10 results.

export default function Scores() {
	const navigate = useNavigate();

	const [scoreList, setScoreList] = useState([
		{
			username: "",
			numofguesses: "",
			wordlength: 0,
		},
	]);

	const [gameDetails, setGameDetails] = useState({
		word: "",
		lettersGuessed: [],
		movesLeft: 0,
		numberOfGuesses: 0
	});

	useEffect(() => {
		async function loadDetails() {
			console.log("hello");
			const response = await fetch(`http://localhost:5001/gameDetails`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.status === 301) {
				navigate("/");
				return;
			} else if (!response.ok) {
				const messge = `An error occured: ${response.statusText}`;
				window.alert(messge);
				return;
			}
			const data = await response.json();

			setGameDetails(data);

			const respon2 = await fetch(`http://localhost:5001/scores`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			// FIXME: Wont be triggered since there is already a check for "/game" route
			if (respon2.status === 301) {
				window.alert(await respon2.json());
				return;
			} else if (!respon2.ok) {
				const message = `An error occured: ${respon2.statusText}`;
				window.alert(message);
				return;
			}
			const scores = await respon2.json();
			// FIXME: IDK if this is what we want but it sorts it correctly.
			// setScoreList(scores.sort((a,b) => { return a.numofguesses > b.numofguesses }));
			setScoreList(scores.sort());
		}
		loadDetails();
	}, [navigate]);

	return (
		<div>
			<WordDetails gameDetails={gameDetails}/>
			<button onClick={() => navigate("/")}>New Game</button>
			<h2>High Scores for length: {scoreList[0].wordlength}</h2>
			<table>
				<thead>
					<tr>
						<th>UserName</th>
						<th>Number of Guesses</th>
					</tr>
				</thead>
				<tbody>
					{scoreList.map((score, idx) => (
						<Score score={score} idx={idx} />
					))}
				</tbody>
			</table>
		</div>
	);
}

function Score({ score, idx }) {
	return (
		<tr>
			<td>{score.username}</td>
			<td>{score.numofguesses}</td>
		</tr>
	);
}

function WordDetails({ gameDetails }) {

	if (gameDetails.movesLeft < 1) {
		return (
			<>
				<p>You lost the correct word was: {gameDetails.word}</p>
				<p>Try again and next time win</p>
			</>
		);
	}

	return (
		<>
			<p>Good Job! Your Word Was: {gameDetails.word || ""}</p>
			<p>
				You got it in {gameDetails.numberOfGuesses || ""} guesses
			</p>
		</>
	);
}
