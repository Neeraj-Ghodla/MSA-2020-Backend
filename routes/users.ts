import express, { Request, Response } from "express";
import passport from "passport";
import bcrypt from "bcryptjs";

const router = express.Router();
const User = require("../models/User");

interface IUser {
  _id: Number;
  email: String;
  password: String;
  likedMovies: Array<String>;
  dislikedMovies: Array<String>;
  date: Date;
}

/**
 * @swagger
 *  paths:
 *   /users/login:
 *     post:
 *       summary: Logs in a user.
 *       tags:
 *         - users
 *       consumes:
 *         - application/json
 *       parameters:
 *         - in: body
 *           name: user
 *           description: the user to login
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *       responses:
 *         200:
 *           description: Created
 */
router.post(
  "/login",
  passport.authenticate("local"),
  (req: Request, res: Response): Response => res.send(req.user)
);

/**
 * @swagger
 *  paths:
 *   /users/register:
 *     post:
 *       summary: Creates a new user.
 *       tags:
 *         - users
 *       consumes:
 *         - application/json
 *       parameters:
 *         - in: body
 *           name: user
 *           description: the user to register
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *       responses:
 *         200:
 *           description: Created
 */
router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Check if the user exists
  const user: IUser = await User.findOne({ email });
  if (user) return res.send("Email already registered");
  else {
    const newUser = new User({ email, password });
    // hash the password
    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(newUser.password, salt);
      newUser.password = hash;
    } catch (err) {
      console.log(err);
      return res.send(err);
    }

    // Save the newUser
    try {
      return res.send(await newUser.save());
    } catch (err) {
      console.log(err);
      return res.send(err);
    }
  }
});

/**
 * @swagger
 *  paths:
 *   /users/liked:
 *     put:
 *       summary: Like a movie
 *       tags:
 *         - users
 *       consumes:
 *         - application/json
 *       parameters:
 *         - in: body
 *           name: user and movie
 *           description: useid and movieid
 *           schema:
 *             type: object
 *             required:
 *               - userID
 *               - movieID
 *             properties:
 *               userID:
 *                 type: string
 *               movieID:
 *                 type: string
 *       responses:
 *         200:
 *           description: Movie liked
 */
router.put("/liked", async (req: Request, res: Response) => {
  const { movieID, userID } = req.body;
  let user: IUser = await User.findOne({ _id: userID });
  if (user.likedMovies.includes(movieID))
    await User.updateOne({ _id: userID }, { $pull: { likedMovies: movieID } });
  else
    await User.updateOne(
      { _id: userID },
      {
        $addToSet: { likedMovies: movieID },
        $pull: { dislikedMovies: movieID },
      }
    );
  user = await User.findOne({ _id: userID });
  return res.send(user);
});

/**
 * @swagger
 *  paths:
 *   /users/disliked:
 *     put:
 *       summary: Dislike a movie
 *       tags:
 *         - users
 *       consumes:
 *         - application/json
 *       parameters:
 *         - in: body
 *           name: user and movie
 *           description: useid and movieid
 *           schema:
 *             type: object
 *             required:
 *               - userID
 *               - movieID
 *             properties:
 *               userID:
 *                 type: string
 *               movieID:
 *                 type: string
 *       responses:
 *         200:
 *           description: Movie disliked
 */
router.put("/disliked", async (req: Request, res: Response) => {
  const { movieID, userID } = req.body;
  // check if the movie is already disliked
  let user: IUser = await User.findOne({ _id: userID });
  if (user.dislikedMovies.includes(movieID))
    await User.updateOne(
      { _id: userID },
      { $pull: { dislikedMovies: movieID } }
    );
  else
    await User.updateOne(
      { _id: userID },
      {
        $addToSet: { dislikedMovies: movieID },
        $pull: { likedMovies: movieID },
      }
    );
  user = await User.findOne({ _id: userID });
  return res.send(user);
});

/**
 * @swagger
 *  paths:
 *   /users/delete:
 *     delete:
 *       summary: Delete a user
 *       tags:
 *         - users
 *       consumes:
 *         - application/json
 *       parameters:
 *         - in: body
 *           name: user
 *           description: useid
 *           schema:
 *             type: object
 *             required:
 *               - userID
 *             properties:
 *               userID:
 *                 type: string
 *       responses:
 *         200:
 *           description: Movie disliked
 */
router.delete("/delete", async (req: Request, res: Response) => {
  const { userID } = req.body;
  const { deleteCount } = await User.deleteOne({ _id: userID });
  if (deleteCount === 1) return res.send("User successfully deleted");
  else return res.send("User not found...");
});

module.exports = router;
