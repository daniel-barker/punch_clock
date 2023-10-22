import mongoose from "mongoose";

const punchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    punchIn: {
      type: Date,
      required: true,
      default: Date.now,
    },
    punchOut: {
      type: Date,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Punch = mongoose.model("Punch", punchSchema);

export default Punch;
