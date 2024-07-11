import React, { useEffect, useState } from "react";
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

export default function UserName() {
  const navigate = useNavigate();
  const [word, setWord] = useState({
    word: "",
    // wordlength: ""
  });

  useEffect(() => {
    async function run() {
      const response = await fetch("http://localhost:5001/session_get_word",
        {
          method: "GET",
          credentials: 'include'
        }
      );
      const wordOBJ = await response.json();
      setWord(wordOBJ);
      
    }
    run();
    return;
  }, []);

  async function highScores(e) {
    e.preventDefault();
    navigate("/scores");
    return;
  }

  return(
    <div>
      <h1>You Lost &#128532;</h1>
      <h3>Your Word Was: {word.word}</h3>
        <form onSubmit={highScores}>
            <input
              type="submit"
              value="High Scores"
            />
        </form>
    </div>
  );
}