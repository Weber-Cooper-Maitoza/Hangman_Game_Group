import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import './scores.css'

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

	const [scoreList, SetScoreList] = useState([
		{
			username: "",
			numofguesses: "",
			wordlength: 0,
		},
	]);

	const [correctWord, setCorrectWord] = useState();

	useEffect(() => {

    SetScoreList(
      [
        {
          username: "Billy Bob joe",
          numofguesses: "9",
          wordlength: 12,
        },
        {
          username: "Billy Bob joe",
          numofguesses: "9",
          wordlength: 12,
        },        {
          username: "Billy Bob joe",
          numofguesses: "9",
          wordlength: 12,
        },
      ]
    )
  });

	return (
		<div>
			<p>Good Job! Your Word Was: {correctWord}</p>
      <button onClick={() => navigate("/")}>New Game</button>
			<h2>High Scores for length: {scoreList[0].wordlength}</h2>
			<table>
				<tr>
					<th>UserName</th>
					<th>Number of Guesses</th>
				</tr>
				{scoreList.map((score, idx) => (
					<Score score={score} idx={idx} />
				))}
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
