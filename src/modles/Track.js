const mongoose = require("mongoose"); // imporitng the mongoose library

// Creating the Point Schema
const pointSchema = new mongoose.Schema({
  timestamp: Number,
  coords: {
    latitude: Number,
    longitude: Number,
    altitude: Number,
    accuracy: Number,
    heading: Number,
    speed: Number,
  },
});

// Creating the Track Schema
const trackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    default: "",
  },
  locations: [pointSchema],
});

// Load up the Schema into our DataBase. i.e creating the dataBase according to the above defined properties
mongoose.model("Track", trackSchema);
