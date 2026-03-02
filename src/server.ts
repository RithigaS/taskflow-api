import mongoose from "mongoose";
import app from "./app";

const PORT = 5000;

mongoose
  .connect("mongodb://127.0.0.1:27017/task_db")
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(() => {
    console.error("error occured mongo db not connected");
  });
