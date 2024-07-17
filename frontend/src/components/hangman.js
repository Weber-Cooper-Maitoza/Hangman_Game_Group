import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// A traditional hangman game is shown with slots indicating the number of letters.
// The user makes a choice. If the letter exists, all those letters are shown.
// If the letter doesn't exist, the hangman progresses and the word is added to a
// visible list of incorrect letters. if the letter was previously chosen, inform
// the user of this and let the user try again.

// Words must be randomly chosen from a list of words. Store all potential words in
// an existing database table or a file of numerous dictionary words.  The word itself
// should never be sent to the client except at the end of the game (we don't want a
// smart user inspecting DOM and finding the solution early.) The scores table should
// store the person's name, number of guesses, and number of letters in the word.

// Upon fully guessing the word, that name is then stored into a scores table.
// Then a top 10 high scores table is displayed for all successful games with
// words of similar length. The high scores shows the name, the number of guesses,
// and the word length.

// If the word was not succesfully guessed with all allowed moves, then inform
// the user of the correct word. Then allow the user to go to the top 10 high
// scores table as previously described.

export default function Hangman() {
	const [word, setWord] = useState({
		word: [],
		lettersGuessed: [],
	});
	const [inWord, setInWord] = useState();
	const [moves, setMoves] = useState(11);

	const [guessingLetter, setGuessingLetter] = useState({
		letter: "",
	});

	const navigate = useNavigate();

	useEffect(() => {
		async function loadBoardGame() {
			//console.log("start")
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
		loadBoardGame();
	}, [navigate]);

	useEffect(() => {
		if (!word.word.includes("*") && word.word.length !== 0) {
			console.log("broken");
			navigate("/scores");
		}
	}, [navigate, word.word]);

	async function guessLetter(e) {
		e.preventDefault();
		const guess = guessingLetter.letter.toLowerCase();
		if (guess === "") {
			return;
		}

		const response = await fetch("http://localhost:5001/guess", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ guess: guess }),
		});
		if (response.status === 301) {
			window.alert(await response.json());
			return;
		}
		let x = await response.json();
    //x.lettersGuessed.sort()
		if (!x.inword) {
			setMoves(moves - 1);
		}
		setWord(x);
		setGuessingLetter({ letter: "" });
	}

	function setCharacter(e) {
		const letter = e.target.value;
		if (!/^[a-zA-Z]*$/g.test(letter)) {
			return;
		}
		setGuessingLetter({ letter: letter });
	}

	return (
		<div>
			<div className="hangman-word">
				{word.word.map((letter, idx) => (
					<Letter letter={letter} index={idx} />
				))}
			</div>
			<div>
				<h3>Incorrect Letters Guessed:</h3>
				{word.lettersGuessed.map((letter, idx) => (
					<span key={idx}>
						{letter.toUpperCase()}
						{idx === word.lettersGuessed.length - 1? "": ", "}
					</span>
				))}
			</div>
			<br />

			<form onSubmit={guessLetter}>
				<input
					type="text"
					id="gletter"
					name="gletter"
					maxLength={1}
					value={guessingLetter.letter}
					onChange={(e) => setCharacter(e)}
				/>
				<br />
				<input type="submit" value="Guess Letter" />
				<p>Moves left: {moves}/11</p>
			</form>
		</div>
	);
}

function Letter({ letter, index }) {
	const spanStyle = {
		fontSize: "large",
		borderBottom: "2px solid black",
		width: "1.5em",
		margin: "0 0.2em",
		display: "inline-block",
		verticalAlign: "bottom",
		height: "1em", // Ensuring both have the same height
		lineHeight: "1em", // Ensuring the line height matches the height
	};

	if (letter === "*") {
		return (
			<span key={index} style={spanStyle}>
				{" "}
			</span>
		);
	}
	return (
		<span key={index} style={{ ...spanStyle, textAlign: "center" }}>
			{letter.toUpperCase()}
		</span>
	);
}
