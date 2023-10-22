const punchSchema = new mongoose.Schema(
  {
    punchIn: {
      type: Date,
      required: true,
      default: Date.now,
    },
    punchOut: {
      type: Date,
    },
    username: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
