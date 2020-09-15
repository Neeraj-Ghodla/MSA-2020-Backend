import express from "express";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
const MongoStore = require("connect-mongo")(session);
import cors from "cors";
import bodyParser from "body-parser";
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// INIT APP
const app = express();

// INIT DB
mongoose.connect(require("./config/keys").MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const dbConnection = mongoose.connection;
dbConnection.on("error", (err: Error) => console.log(err));
dbConnection.once("open", () => console.log("DB Connected..."));

// PASSPORT MIDDLEWARE
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// APP CONFIG
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(
  session({
    secret: "cats",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: dbConnection }),
  })
);
app.use(bodyParser.json());
app.use(passport.initialize());

// PORT
const PORT = process.env.PORT || 3000;

// ROUTES
// app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/movie", require("./routes/movies"));

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "MovieDB API",
      description: "MSA-2020 MovieDB API Information",
      contact: {
        name: "Neeraj Ghodla",
      },
      servers: ["http://localhost:3000"],
    },
  },
  apis: ["./dist/routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// START SERVER
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
