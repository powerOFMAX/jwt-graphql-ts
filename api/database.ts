import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose
  .connect(
    `${process.env.URLDB}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((db) => console.log("Database Connected"))
  .catch((err) => console.log(err, "error"));
