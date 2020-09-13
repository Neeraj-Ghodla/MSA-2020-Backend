import express, { Request, Response } from "express";

const router = express.Router();
const Movie = require("../models/Movie");

interface IMovie {
  movieID: String;
  comments: Array<String>;
  date: Date;
}

// Handle GET movie
router.get("/", async (req: Request, res: Response) => {
  const { movieID } = req.query;
  let movie: IMovie = await Movie.findOne({ movieID });
  if (!movie) {
    const newMovie = new Movie({ comments: [], movieID });
    await newMovie.save();
  }
  movie = await Movie.findOne({ movieID });
  return res.send(movie);
});

// Handle add comment
router.post("/add", async (req: Request, res: Response) => {
  const { movieID, comment } = req.body;
  let movie: IMovie = await Movie.findOne({ movieID });
  if (!movie) {
    const newMovie = new Movie({ comments: [], movieID });
    await newMovie.save();
  }
  await Movie.updateOne({ movieID }, { $push: { comments: comment } });
  movie = await Movie.findOne({ movieID });
  return res.send(movie);
});

module.exports = router;
