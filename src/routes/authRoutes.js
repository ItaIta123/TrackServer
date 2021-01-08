// This file is being used to handle the POST requests of the user with anything related to authentication such as signing up log in and etc

//importing the express library
const express = require("express");

// importing the jason web token library
const jwt = require("jsonwebtoken");

// Accsess the data in the MongoDB database in User.js:
const mongoose = require("mongoose");
const User = mongoose.model("User"); // creates an instance of the Database that we have created
// The above "User" is how we interact with all the users that are stored in our MongoDB

const router = express.Router(); // This is an object that allows us to accociate number of root handlers with it. It will be use here to connect to our 'app' object from the index.js file

//Anytime someone is making to POST request i.e singup/log-in we will run the following object:
// This is a "post requst handler"
router.post("/signup", async (req, res) => {
  const { email, password } = req.body; // req.body is the request (emaail&password the user is sending through the HTTP request)

  try {
    const user = new User({ email, password }); // creating a new user in the Database.
    await user.save(); // in order to initiate the save operation in the Database
    console.log(req.body); // print whatever is being sent by the user to the terminal
    // creating a token:
    const token = jwt.sign({ userId: user._id }, "YOUR_SECRET_KEY");
    // presenting it in the Postman app:
    res.send({ token: token });
  } catch (err) {
    // in the case when the user sends some invalid request (empty or already existed email) this error message will appear.
    return res.status(422).send(err.message);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  // Check for email and password:
  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email and password" });
  }
  //"scraping" the specific user's email from the MongoDB
  const user = await User.findOne({ email: email });
  // Check to see that the user's email is not null (which means his email is not in the DB)
  if (!user) {
    return res.status(422).send({ error: "Invalid password or email" });
  }
  // Now that we know this user exists in our DB (according to the email he provided)
  // We will compare the passowrds to see if there a match:
  try {
    await user.comparePassword(password); // This is a fucntion I created in the User.js file. it will return an err if the passwords to not match.
    // Now, if the password comparison was successful, we want to make sure we generate a Json Web Token and send it back so the user will be able to autonticate thenselves on future requests:
    const token = jwt.sign({ userId: user._id }, "YOUR_SECRET_KEY");
    // Sending the TOKEN:
    res.send({ token: token });
  } catch (err) {
    return res.status(422).send({ error: "Invalid password or email" });
  }
});

module.exports = router;
