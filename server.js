const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const passport = require("passport");
const flash = require("express-flash");
const logger = require("morgan");
const homeRoutes = require("./routes/home");
const adminRoutes = require("./routes/admin");
const newsRoutes = require("./routes/news");
const storyRoutes = require("./routes/stories");
const projectRoutes = require("./routes/projects");
const eventRoutes = require("./routes/events");
const connectDB = require("./config/database");

require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

connectDB();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use("/", homeRoutes);
app.use("/admin", adminRoutes);
app.use("/news", newsRoutes);
app.use("/stories", storyRoutes);
app.use("/projects", projectRoutes);
app.use("/events", eventRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is listening");
});
