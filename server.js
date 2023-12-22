const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");
const app = express();

const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const applications = require("./routes/api/applications")

// const auth = require("./routes/api/auth");
app.use(express.json());
app.use(cors());
const mongo_url = config.get("mongo_url");
mongoose.set("strictQuery", true);
mongoose
  .connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// app.use("/api/auth", auth);
app.use("/api/user/", users);
app.use("/api/admin", posts);
app.use("/api/applications", applications);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));
