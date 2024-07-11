import React, { useState } from "react";
import { useNavigate } from "react-router";

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
  const [scoreList, SetScoreList] = useState([]);

  return(
    <div>
      <p>TODO: display top 10 list of high scores.</p>
      <p>TODO: Play again button</p>
    </div>
  );
}