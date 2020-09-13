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

// Login Handle
router.post(
  "/login",
  passport.authenticate("local"),
  (req: Request, res: Response): Response => res.send(req.user)
);

// Register Handle
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

// Like Handle
router.post("/liked", async (req: Request, res: Response) => {
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

// Dislike Handle
router.post("/disliked", async (req: Request, res: Response) => {
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

module.exports = router;
