const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv")
dotenv.config(); // Ensure dotenv is loaded at the top

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use(express.json());
app.use(cors({
origin:"http://task-mern-app.s3-website.eu-north-1.amazonaws.com",
 optionsSuccessStatus: 200,
  credentials:true
}));

const mongoUrl = process.env.MONGODB_URL;
console.log('MONGODB_URL:', mongoUrl); // Log the mongoUrl to check its value

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) throw err;
  console.log("Mongodb connected...");
});

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/profile", profileRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
  );
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});
