// This file is used to initialize the express API, connection to the MongoDb Datbase, and create all the requests and responses settings.
// In order to run the server from the terimnal: npm run dev

require("./modles/User"); // run the entire User file at least once to create to define the User model
require("./modles/Track"); // run the entire User file at least once to create to define the Track model

const express = require("express"); // importing the express library
const mongoose = require("mongoose"); // importing the mongoose library
const bodyParser = require("body-parser"); // helper library that will help automatically parse information associated with the body property of incoming request. Simply put, makes the POST request the user snends (Email and password) to a Json file
const authRoutes = require("./routes/authRoutes"); // the authentication routes handler
const trackRoutes = require("./routes/trackRoutes"); // the Tracks routes handler
const requireAuth = require("./middlewares/requireAuth"); // Our token Authentication help function/file

// creating the express API object
const app = express();

// Associates all the requests occuring in our app with the authRouted handler
app.use(bodyParser.json()); // makes the request a Json info type. NEEDS TO BE BEFORE THE BELOW CODE
app.use(authRoutes);
app.use(trackRoutes);

//coonect to the mongoDB server:
const mongoUri =
  "<dbname>?retryWrites=true&w=majority";
mongoose.connect(mongoUri, {
  useNewUrlParser: true, // these two option are to prevent error messages appear in our terminal
  useCreateIndex: true,
  useUnifiedTopology: true,
});
// If connection is successful
mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance");
});

// If connection is not successful
mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo instance", err);
});

// Anytime someone  makes a GET type HTTP request to our root routh of our application we will run the function
// The function will run automatically with request (req) object that represents the HTTP request and ressponse (res) which represents the response to the request:
// Notice that I use the requireAuth middleware. When a user send a req the req qill go through the requireAuth middleware and in it attach the users ditalis into the req object. the requireAuth middleware is like a "checking" proccess of the req GET calles of the user.
app.get("/", requireAuth, (req, res) => {
  res.send(`Your emial: ${req.user.email}`);
});

// Make our app listen to a port on our machine:
app.listen(3000, () => {
  console.log("Listening on 3000");
});

// running in terminal: node src/index.js
// CHANGED TO // In order to run the server from the terimnal: npm run dev
