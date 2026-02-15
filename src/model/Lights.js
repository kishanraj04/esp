import mongoose from "mongoose";

const lightSchema = new mongoose.Schema({
  lightno:{type:Number,required:true},
  status: {
    type: String,
    enum: ["ON", "OFF"],
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Light = mongoose.model("Light", lightSchema);

export default Light;
