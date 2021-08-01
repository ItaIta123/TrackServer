const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth"); // to make sure only users which are looged in can create a track

const Track = mongoose.model("Track"); // Notice here that I do not require that entire Track.js file (were I created the mongoose Track DB). This is because we do not want to run again and again the last line there of creating the Track DB collection multiple times.

const router = express.Router();

// We want to make sure that all the routes in this file will require the user to be looged in (using the requireAuth file):
router.use(requireAuth);

// Hnadle the get requst of a user to all his tracks:
router.get("/tracks", async (req, res) => {
  // get the current user's information:
  // the user's id can be found in req.user (that's from the requireAuth file)
  const tracks = await Track.find({ userId: req.user._id });
  // send the tracks' info:
  res.send(tracks);
});

// Handler for creating a new Track:
router.post("/tracks", async (req, res) => {
  const { name, locations } = req.body;
  // check for name and locations
  if (!name || !locations) {
    return res
      .status(422)
      .send({ error: "You must provide a name and locations" });
  }
  try {
    // if there are name and locations, assign them to a new Track instance:
    const track = new Track({
      name: name,
      locations: locations,
      userId: req.user._id,
    });
    //Save the track instance to our data base:
    await track.save();
    res.send(track);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

// export the router:
module.exports = router;
