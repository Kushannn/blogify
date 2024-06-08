require("dotenv").config();

const path = require("path");

const userRouter = require("./routes/user.js");
const blogRouter = require("./routes/blog.js");
const Blog = require("./models/blog.js");

const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const express = require("express");
const { checkForAuthentication } = require("./middlewares/authentication.js");

const app = express();
const PORT = process.env.PORT || 8081;

// async () => {
//   mongoose.connect(process.env.MONGO_URL).then((e) => {
//     console.log("MongoDb connected");
//   });
// };

(async function () {
  await mongoose.connect(process.env.MONGO_URL).then((e) => {
    console.log("MongoDb connected");
  });
})();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  return res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(PORT, () => `Server Started at ${PORT}`);
