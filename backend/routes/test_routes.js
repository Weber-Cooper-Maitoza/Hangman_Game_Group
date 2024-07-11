const express = require("express");
const routes = express.Router();
const dbo = require("../db/conn");

routes.route("/getWord").get(async (req, res) => {
	try {
		let db_connect = dbo.getDb().collection("words");
		const result = await db_connect
			.aggregate([{ $sample: { size: 1 } }])
			.toArray();
		console.log(result[0]);
		res.json(result[0]);
	} catch (err) {
		throw err;
	}
});
routes.route("/getWith/:length").get(async (req, res) => {
	try {
		let db_connect = dbo.getDb().collection("words");
		const result = await db_connect
			.aggregate([
				{$match: {wordlength: +req.params.length}},
				{$sample: { size: 1 } }
			])
			.toArray();
		console.log(result[0]);
		return res.json(result[0])
	} catch (err) {
		throw err;
	}
});

module.exports = routes;
