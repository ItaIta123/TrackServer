// This file helps us validate the web token that the user is using. i.e. make sure the user sent a token and see if the user is who he says he is.
const jwt = require("jsonwebtoken"); // importing library
const mongoose = require("mongoose"); // importing Mongoose library
const User = mongoose.model("User"); // importing our 'User' object from the MongoDB data base

module.exports = (req, res, next) => {
  // next is the function this function will call if the user's token is correct
  const { authorization } = req.headers; // I created an Authorization header in the PostMan app that requires an authorization header with the value Bearer THE_USER_TOKEN_HERE
  // authorization = "Bearer sjdncsjdcnsadjknv"

  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in." });
  }
  // Takes only the Json token from the value of the authorization header that user sent in his req
  const token = authorization.replace("Bearer ", "");

  //Varify using the jwt library:
  jwt.verify(token, "YOUR_SECRET_KEY", async (err, payload) => {
    //payload is going to be any information we put in the json web token (in our case just a userId)
    if (err) {
      // if there is an error
      return res.status(401).send({ error: "You must be loggen in." });
    }
    // Extract the userId from the Json web token (payload)
    const { userId } = payload;
    // The below line will tell mongoose to look at our MongoDB collection and find a user which his ID is this userID
    const user = await User.findById(userId);

    // attach our user ID to the req object for future use in our app:
    req.user = user;

    //The Authentication is done and we're moving to the next() function
    next();
  });
};
