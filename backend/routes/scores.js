const express = require("express");
const scoresRoutes = express.Router();
const dbo = require("../db/conn");
 
const ObjectId = require("mongodb").ObjectId;


//1. route that taks req.session.username and sets session, grabs word from database
// sets up correctWord and word, returns success status 200
scoresRoutes.route("/start").post(async (req,res) => {
  try{
      const username = req.body.username;
      if(!username){
        return res.status(301).json("Username is required to play!")
      }
      req.session.username = username;
      let db_connect = dbo.getDb().collection("words");
      const word = await db_connect.aggregate([{ $sample: { size: 1 } }]).toArray();
      const data = word[0]
      console.log(data);

      if (!word){
        return res.status(301).json("No word was found")
      }

      req.session.correctWord = data._id;
      req.session.word = Array(data.wordlength).fill("*");
      req.session.lettersGuessed = [];

      res.status(200).json("Game has been started");
  } catch(err){
      return res.status(301).json("Error starting the game " + err);
  }
});

//2. route that returns word and letterGuessed
scoresRoutes.route("/game").post(async (req, res) => {
  if(!req.session.username){
    return res.status(301).json("Username has not been set")
  }
  res.status(200).json({
    word: req.session.word,
    lettersGuessed: req.session.lettersGuessed
  });
});

//3. Rout that takes a letter, checks if player has already made that guess
//checks if the letter is in the correct word, fills where/ if it is 
//if word doesnt include * push details to the scores database
//returns word, lettersGuessed and boolean inWord
scoresRoutes.route("/guess").post(async (req, res) => {
  if(!req.session.username){
    return res.status(301).json("Username has not been set")
  }
  const guess = req.body.guess;
  if (req.session.lettersGuessed.includes(guess)){
    return res.status(301).json("Letter has already been guess, try again");
  }
  let inWord = false;

  //check if guess is in word 
  for(let i = 0; i< req.session.correctWord.length; i++){
    if(req.session.correctWord[i] == guess){
      req.session.word[i] = guess;
      inWord = true;
    }
  }
  req.session.lettersGuessed.push(guess);

  //check if whole word has been guessed
  if(!req.session.word.includes("*")){
    let db_connect = dbo.getDb("hangman");
    const num = req.session.lettersGuessed.length;
    const length = req.session.correctWord.length;
    let myobj = {
      username: req.session.username,
      numofguesses: num,
      wordlength: length
    };
    db_connect.collection("scores").insertOne(myobj);
    //return res.status(200).json("Game over! Word has been guessed!")
  }

  res.status(200).json({
    word: req.session.word,
    lettersGuessed: req.session.lettersGuessed,
    inword: inWord
  })
})

//4. checks the session for length of correct word
//returns an array of top then with that length
scoresRoutes.post('/scores', async (req, res) => {
  console.log("Scores!!")

  if (!req.session.username) {
      return res.status(301).json("Username has not been set!");
  }

  const wordLength = req.session.correctWord.length;

  try {
      const topScores = await scoresCollection.find({ wordLength: wordLength })
          .sort({ numOfGuesses: 1 }) 
          .limit(10)
          .toArray();

      res.status(200).json(topScores);
  } catch (err) {
      res.status(301).json("Error getting the top scores " + err);
  }
});

//5. Delete the session 
scoresRoutes.route("/endGame").get(async (req, res) => {
  req.session.destroy();
  let status = "No session set";
  const resultObj = { status: status };
  res.json(resultObj);
})




// FIXME: Might not need this because we can use sessions to do this.
scoresRoutes.route("/username/add").post(async (req, res) => {
  try {
   c
  } catch(err) {
    throw err;
  }
});

scoresRoutes.route("/getscores").get(async (req, res) => {
  try {
    let db_connect = dbo.getDb("hangman");
    const result = await db_connect.collection("scores").find().toArray();
    res.json(result);
  } catch(err) {
    throw err;
  }
});
 
module.exports = scoresRoutes;