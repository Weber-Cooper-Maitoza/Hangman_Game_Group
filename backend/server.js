const express = require("express");
const app = express();
const cors = require("cors");

const session = require("express-session");
const MongoStore = require("connect-mongo");

require("dotenv").config({ path: "./config.env"});
const port = process.env.PORT;


app.use(cors(
  {
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "Authorization"],
  }
));

app.use(session(
  {
    secret: 'keyboard cat',
    saveUninitialized: false, // Dont create sessions untill something is stored
    resave: false, // dont save session if unmodified
    store: MongoStore.create({
      mongoUrl: process.env.ATLAS_URI
    })
  }
));

const dbo = require("./db/conn");

app.use(express.json());

app.use(require("./routes/scores.js"));
app.use(require("./routes/session.js"));

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.listen(port, () => {
	dbo.connectToServer(function (err) {
		if (err) {
			console.log(err);
		}
	});
	console.log(`Server is running on port ${port}`);
});
