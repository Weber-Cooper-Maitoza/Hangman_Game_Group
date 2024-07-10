const express = require("express");
const scoresRoutes = express.Router();
const dbo = require("../db/conn");
 
const ObjectId = require("mongodb").ObjectId;

// FIXME: Might not need this because we can use sessions to do this.
scoresRoutes.route("/username/add").post(async (req, res) => {
  try {
    let db_connect = dbo.getDb("hangman");
    let myobj = {
      username: req.body.username,
      numofguesses: req.body.numofguesses,
      wordlength: req.body.wordlength
    };
    // const check = await db_connect.collection("scores").findOne({email: req.body.email});
    // if (check != null) {
    //   res.json({check: false});
    //   return;
    // }
    db_connect.collection("scores").insertOne(myobj);
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