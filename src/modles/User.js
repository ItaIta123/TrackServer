// This file is defining the MongoDB data

const moongose = require("mongoose"); // importing Mongoose library
const bcrypt = require("bcrypt"); // library for hashing the passwords

// tell moongose about the different properties every user in out Database is going to have:
const userSchema = new moongose.Schema({
  email: {
    // property #1
    type: String,
    unique: true,
    required: true,
  },
  password: {
    // property #2
    type: String,
    unique: false,
    required: true,
  },
});

// Setting up a "pre save hook", i.e. a function that will run right before we are trying to save user information into our database
// this pre save hook will hash our user's passwords when they sign up
userSchema.pre("save", function (next) {
  const user = this; //"this" is the value of each user that will use our HTTP requests. (it will change with any differrent user)
  if (!user.isModified("password")) {
    return next();
  }
  // SALT generator: 10 is the complexity of the solt
  bcrypt.genSalt(10, (err, salt) => {
    // if there is an error during the proccess of generating the SALT:
    if (err) {
      return next(err);
    }
    // Hashing the user password and attaching to it the SALT
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      // if there are no errors, changing the user's password to a Hashed+SALT password
      user.password = hash;
      next();
    });
  });
});

// Automate the password checking proccess. (remember that when a user logs in using his password we will hash this password and compare it the the already hased passwords saved in our dataBase)
userSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;
  // Promise function is a built in funtion used to conveniant use the async fucntion (read upon Promise function online)
  // resolve will be called if the code inside the {} will have no errors. Otherwise the reject function will be called
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      // if there was an err:
      if (err) {
        return reject(err);
      }
      // if the user's password and the password in the dataBase do not match:
      if (!isMatch) {
        return reject(false);
      }
      // If they do match:
      resolve(true);
    });
  });
};

// associate all the above propertis of a user with moongose library:
moongose.model("User", userSchema);
