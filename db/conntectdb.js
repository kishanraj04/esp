import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas Connected ✅");
  })
  .catch((err) => {
    console.error("Connection Error ❌", err);
  });

export default mongoose;
