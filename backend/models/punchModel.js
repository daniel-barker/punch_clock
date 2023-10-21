import express from "express";

const punchSchema = mongoose.Schema(
  {
    punchIn: {
      type: Date,
      required: true,
    },
    punchOut: {
      type: Date,
      required: true,
    },
    punchDuration: {
      type: Number,
      required: true,
    },
    punchType: {
      type: String,
      required: true,
    },
    punchNotes: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Punch = mongoose.model("Punch", punchSchema);

export default Punch;
