import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema({
  movieID: {
    type: String,
    required: true,
  },
  comments: {
    type: [String],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;
