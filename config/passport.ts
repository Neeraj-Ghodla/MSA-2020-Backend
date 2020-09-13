import bcrypt from "bcryptjs";
const LocalStrategy = require("passport-local").Strategy;

// Load User Model
const User = require("../models/User");

interface IUser {
  _id: Number;
  email: String;
  password: String;
  likedMovies: Array<String>;
  dislikedMovies: Array<String>;
  date: Date;
}

module.exports = (passport: any) => {
  passport.use(
    new LocalStrategy(
      async (email: String, password: String, done: Function) => {
        try {
          const user: IUser = await User.findOne({ email });
          if (!user) done(null, false);
          else
            bcrypt.compare(
              password,
              user.password,
              (err: Error, isMatch: Boolean) => {
                if (err) throw err;
                else if (isMatch) return done(null, user);
                else return done(null, false);
              }
            );
        } catch (error) {
          console.log(error);
        }
      }
    )
  );

  passport.serializeUser((user: IUser, done: Function) => {
    done(null, user._id);
  });

  passport.deserializeUser((id: Number, done: Function) => {
    User.findById(id, function (err: Error, user: IUser) {
      done(err, user);
    });
  });
};
