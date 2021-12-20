require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");

//Models
const Role = require("./models/Role");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

//Defining all routes
app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);

//image route
app.use("/public", express.static(path.join(__dirname, "public")));

const mongodbUri = process.env.MONGODB_URI || "mongodb://localhost:27017/blogs";

mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to mongodb...");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to mongo", err);
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`App is listening on PORT ${PORT}`);
});

const role = [
  {
    name: "writer",
  },
];

Role.find()
  .then((existingRoles) => {
    if (existingRoles.length !== 1) {
      Role.insertMany(role).then((createdRoles) => {
        console.log("Roles successfully seeded!", createdRoles);
      });
    }
  })
  .catch((error) => console.log(error));
