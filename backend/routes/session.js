const express = require("express");
const routes = express.Router();

routes.route("/session_set_username/:username").get(async (req, res) => {
  try {
    req.session.username = req.params.username;
    res.json();
  } catch(err) {
    throw err;
  }
})

routes.route("/session_get_word").get(async (req, res) => {
  try {
    const resultObj = { word: req.session.word };
    res.json(resultObj);
  } catch(err) {
    throw err;
  }
})

routes.route("/session_get_username").get(async (req, res) => {
  try {
    const resultObj = { username: req.session.username };
    res.json(resultObj);
  } catch(err) {
    throw err;
  }
})

routes.route("/session_delete").get(async (req, res) => {
  req.session.destroy();
  let status = "No session set";
  const resultObj = { status: status };
  res.json(resultObj);
})

module.exports = routes;