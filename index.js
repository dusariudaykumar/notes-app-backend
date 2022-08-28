const express = require("express");
require("dotenv").config();
const connextDB = require("./db/connectDB");
const cookiePraser = require("cookie-parser");
const app = express();
const isLoggedin = require("./middleware/isLoggedin");
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookies middleware
app.use(cookiePraser());

app.get("/", (req, res) => {
  res.send("hello");
});

//routes
const userRouter = require("./routes/user");
const notesRouter = require("./routes/notesRoutes");
const trashRouter = require("./routes/trashRoutes");
const archiveRouter = require("./routes/archiveRoutes");
app.use("/api/v1", userRouter);
app.use("/api/v1", isLoggedin, notesRouter);
app.use("/api/v1", isLoggedin, trashRouter);
app.use("/api/v1", isLoggedin, archiveRouter);
// app.get("/api/v1/user", isLoggedin, (req, res) => {
//   console.log(req.user);
//   res.json({ user: req.user });
//   res.json({ name: "uday", age: 21 });
// });
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connextDB(process.env.MONGODB_URL);
    app.listen(port, console.log(`app is running at ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
