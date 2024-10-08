const express = require("express");
const scoresRoutes = express.Router();
const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;

//1. route that taks req.session.username and sets session, grabs word from database
// sets up correctWord and word, returns success status 200
scoresRoutes.route("/start").post(async (req, res) => {
	try {
		const username = req.body.username;
		if (!username) {
			return res.status(301).json("Username is required to play!");
		}
		req.session.username = username;
		let db_connect = dbo.getDb().collection("words");
		const word = await db_connect
			.aggregate([{ $sample: { size: 1 } }])
			.toArray();
		const data = word[0];
		console.log(data);

		if (!word) {
			return res.status(301).json("No word was found");
		}

		req.session.correctWord = data._id;
		req.session.word = Array(data.wordlength).fill("*");
		req.session.lettersGuessed = [];
		req.session.movesLeft = 11;

		res.status(200).json("Game has been started");
	} catch (err) {
		return res.status(301).json("Error starting the game " + err);
	}
});

//2. route that returns word and letterGuessed
scoresRoutes.route("/game").post(async (req, res) => {
	if (!req.session.username) {
		return res.status(301).json("Username has not been set");
	}
	res.status(200).json({
		word: req.session.word,
		lettersGuessed: req.session.lettersGuessed,
		movesLeft: req.session.movesLeft
	});
});
//2.5
scoresRoutes.route("/gameDetails").post(async (req, res) => {
	if (!req.session.username) {
		return res.status(301).json("Username has not been set");
	}
	res.status(200).json({
		word: req.session.correctWord,
		lettersGuessed: req.session.lettersGuessed,
		movesLeft: req.session.movesLeft,
		numberOfGuesses: req.session.numberOfGuesses,
	});
});

//3. Route that takes a letter, checks if player has already made that guess
//checks if the letter is in the correct word, fills where/ if it is
//if word doesnt include * push details to the scores database
//returns word, lettersGuessed and boolean inWord
scoresRoutes.route("/guess").post(async (req, res) => {
	if (!req.session.username) {
		return res.status(301).json("Username has not been set");
	}
	const guess = req.body.guess;
	if (req.session.lettersGuessed.includes(guess)) {
		return res.status(301).json("Letter has already been guess, try again");
	}
	let inWord = false;

	//check if guess is in word
	for (let i = 0; i < req.session.correctWord.length; i++) {
		if (req.session.correctWord[i] == guess) {
			req.session.word[i] = guess;
			inWord = true;
		}
	}
	req.session.numberOfGuesses+=1

	if(!inWord){
		req.session.lettersGuessed.push(guess);
		req.session.movesLeft -= 1;
	}

	//check if whole word has been guessed
	if (!req.session.word.includes("*")) {
		let db_connect = dbo.getDb("hangman");
		const num = req.session.numberOfGuesses;
		const length = req.session.correctWord.length;
		let myobj = {
			username: req.session.username,
			numofguesses: num,
			wordlength: length,
			inword: inWord
		};
		db_connect.collection("scores").insertOne(myobj);
		//return res.status(200).json("Game over! Word has been guessed!")
	}

	res.status(200).json({
		word: req.session.word,
		lettersGuessed: req.session.lettersGuessed,
		inword: inWord,
		movesLeft: req.session.movesLeft
	});
});

//4. checks the session for length of correct word
//returns an array of top then with that length
scoresRoutes.post("/scores", async (req, res) => {
	console.log("Scores!!");

	if (!req.session.username) {
		return res.status(301).json("Username has not been set!");
	}

	const wordLength = req.session.correctWord.length;

	try {
		const scoresCollection = dbo.getDb("hangman").collection("scores");
		const topScores = await scoresCollection
			.aggregate([
				{ $match: { wordlength: wordLength } },
				{ $sort: { numofguesses: 1 } },
				{ $limit: 10 },
			])
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
});

//6. test route
scoresRoutes.post("/high_scores", async (req, res) => {
	console.log("Scores!!");

	const wordLength = +req.body.length;

	try {
		const scoresCollection = dbo.getDb("hangman").collection("scores");
		const topScores = await scoresCollection
			.aggregate([
				{ $match: { wordlength: wordLength } },
				{ $sort: { numofguesses: 1 } },
				{ $limit: 10 },
			])
			.toArray();

		res.status(200).json(topScores);
	} catch (err) {
		res.status(301).json("Error getting the top scores " + err);
	}
});

scoresRoutes.get("/get_word", async (req, res) => {
	if (!req.session.username) {
		return res.status(301).json("Username has not been set!");
	}

	res.status(200).json({correctWord: req.session.correctWord});
});

module.exports = scoresRoutes;
