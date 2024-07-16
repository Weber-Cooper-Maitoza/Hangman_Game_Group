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
  const[inWord, setInWord] = useState()

  const [guessingLetter, setGuessingLetter] = useState({
    letter: "",
  })

  const navigate = useNavigate();


	useEffect(() => {
		async function loadBoardGame() {
			// const response = await fetch(
			// 	"http://localhost:4000/account_details",
			// 	{
			// 		method: "POST",
			// 		credentials: "include",
			// 	}
			// );
			// if (response.status === 301) {
			// 	navigate("/Username");
			// 	return;
			// }

      setWord({
        word: ['h','h','*', '*', '*', '*', '*', '*'],
        lettersGuessed: ['h', 'i', 'j']
      })

      

		}
		loadBoardGame();
	}, [navigate]);

  useEffect(()=>{
    if(!word.word.includes("*") && word.word.length !== 0){
      navigate("/scores")
    }
  }, [navigate, word.word])



  async function giveUp(e) {
    e.preventDefault();
    const response = await fetch(`http://localhost:5001/getWord`);
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const responseWord = await response.json();
    await fetch(``,
      {
        method: "GET",
        credentials: 'include'
      }
    );
    
    navigate("/lost");
  }

  async function guessLetter(e){
    e.preventDefault();
    const guess = guessingLetter.letter.toLowerCase()

    	// const response = await fetch(
			// 	"http://localhost:4000/account_details",
			// 	{
			// 		method: "POST",
			// 		credentials: "include",
			// 	})

    
    setWord({
      word: ['h','h','*', '*'],
      lettersGuessed: ['h', 'i', 'j', 'k']
    })


  }

  function setCharacter(e){
    const letter = e.target.value
    if(!/^[a-zA-Z]*$/g.test(letter)){
      return
    }
    setGuessingLetter({letter:letter})
  }

  return(
    <div>
      <p><span style={{color: "red"}}>TODO:</span> make hangman.</p>
      <div className="hangman-word">
        {
          word.word.map((letter) => (
            <Letter letter={letter}/>
          ))  
        }
      </div>
      <div>
        <h3>Letters Guessed:</h3>
        {word.lettersGuessed.map((letter, idx) => (
          <span>{letter.toUpperCase()}{idx === word.lettersGuessed.length-1 ? "": ", "} </span>
        ))
        }

      </div>
      <br/>

      <form onSubmit={guessLetter}>
          <input type="text" id="gletter" name="gletter" maxLength={1} value={guessingLetter.letter} onChange={(e) => (setCharacter(e))}/>
          <br/>
          <input type="submit" value="Guess Letter"/>

      </form>

        <br/>
        <form onSubmit={giveUp}>
            <input
              type="submit"
              value="give up"
            />
        </form>
        
    </div>
  );
}


function Letter({letter}){
  if(letter === '*'){
    return <span style={{
      	fontSize: "large",
        borderBottom: "2px solid black",
        width: '1.5em',
        margin: "0 0.2em"
    }}> </span>
  }
  return <span style={{
    fontSize: "large",
    borderBottom: "2px solid black",
    width: '1.5em',
    margin: "0 0.2em",
    textAlign: 'center'
  }}>{letter.toUpperCase()}</span>

}