import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    pin: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    allowedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    documentState: {
      type: String,
      default: "//write your c logic here...",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Room", roomSchema);
