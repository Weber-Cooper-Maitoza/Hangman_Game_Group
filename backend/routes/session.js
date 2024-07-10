const express = require("express");
const routes = express.Router();

routes.route("/session_set/:username").get(async function (req, res) {
  req.session.username = req.params.username;
  // let status = "";
  // if (!req.session.username) {
  //   req.session.username = req.params.username;
  // } else {
  //   status = "Error: couldn't use username: " + req.session.username;
  // }
  // const resultObj = { status: status };
  // res.json(resultObj);
})

routes.route("/session_get").get(async function (req, res) {
  const resultObj = { username: req.session.username };
  res.json(resultObj);
  // let username = "";
  // if (req.session.username) {
  //   username = req.session.username;
  // }
  // const resultObj = { username: username };
  // res.json(resultObj);
})

routes.route("/session_delete").get(async function (req, res) {
  req.session.destroy();
  // let status = "No session set";
  // const resultObj = { status: status };
  // res.json(resultObj);
})

module.exports = routes;