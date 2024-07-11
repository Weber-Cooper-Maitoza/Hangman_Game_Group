const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.ATLAS_URI;
const { open } = require("node:fs/promises");

let _db;

module.exports = {
	connectToServer: function (callback) {
		console.log("Attempting to Connect to Scores database");

		// Create a MongoClient with a MongoClientOptions object to set the Stable API version
		const client = new MongoClient(uri, {
			serverApi: {
				version: ServerApiVersion.v1,
				strict: true,
				deprecationErrors: true,
			},
		});

		async function run() {
			try {
				// Connect the client to the server	(optional starting in v4.7)
				await client.connect();
				// Send a ping to confirm a successful connection
				await client.db("admin").command({ ping: 1 });
				console.log(
					"Pinged your deployment. You successfully connected to MongoDB!"
				);
				_db = client.db("hangman");
				if (!(await _db.collection("words").findOne())) {
					loadWords()
					console.log("Words Loading")
				}
			} finally {
				// Ensures that the client will close when you finish/error
				//console.log("Closing the client")
				//await client.close();
			}
		}
		run().catch(console.dir);
	},

	getDb: function () {
		return _db;
	},
};

async function loadWords() {
	const file = await open("./db/anagram_dictionary.txt");

	for await (const line of file.readLines()) {
		if (line.length > 5 && line.length < 10) {
			let myobj = {
				_id: line,
				wordlength: line.length,
			};
			_db.collection("words").insertOne(myobj);
		}
	}

	console.log("words loaded")
}
