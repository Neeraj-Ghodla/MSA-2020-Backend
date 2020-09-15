import express, { Request, Response } from "express";

const router = express.Router();
const Movie = require("../models/Movie");

interface IMovie {
  movieID: String;
  comments: Array<String>;
  date: Date;
}

/**
 * @swagger
 *  paths:
 *   /movie:
 *     get:
 *       summary: Shows comments for a movie
 *       tags:
 *         - movie
 *       parameters:
 *         - in: query
 *           name: movieID
 *           description: movieid
 *       responses:
 *         200:
 *           description: A successful response
 */
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

/**
 * @swagger
 *  paths:
 *   /movie/add:
 *     post:
 *       summary: Adds a comment.
 *       tags:
 *         - movie
 *       consumes:
 *         - application/json
 *       parameters:
 *         - in: body
 *           name: movie
 *           description: add a comment
 *           schema:
 *             type: object
 *             required:
 *               - movieID
 *               - comment
 *             properties:
 *               movieID:
 *                 type: string
 *               comment:
 *                 type: string
 *       responses:
 *         200:
 *           description: Comment added.
 */
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
