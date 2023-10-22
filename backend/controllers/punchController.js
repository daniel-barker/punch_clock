import asyncHandler from "../middleware/asyncHandler";
import Punch from "../models/punchModel";
import User from "../models/userModel";

// @desc Get all punches
// @route GET /api/punches
// @access Private/admin
const getPunches = asyncHandler(async (req, res) => {
  const punches = await Punch.find({})
    .populate("user", "id username")
    .populate("project", "name description");
  res.status(200).json(punches);
});

// @desc Get punch by ID
// @route GET /api/punches/:id
// @access Private
const getPunchByID = asyncHandler(async (req, res) => {
  const punch = await Punch.findById(req.params.id)
    .populate("user", "id username")
    .populate("project", "name description");

  if (punch) {
    res.status(200).json(punch);
  } else {
    res.status(404).json({ message: "Punch not found" });
  }
});

// @desc Punch in
// @route POST /api/punches
// @access Private/admin

const punchIn = asyncHandler(async (req, res) => {
  const { user, project, note } = req.body;

  const punch = new Punch({
    user,
    project,
    note,
  });

  const createdPunch = await punch.save();
  res.status(201).json(createdPunch);
});

// @desc Punch Out
// @route PUT /api/punches/:id/punchout
// @access Private
const punchOut = asyncHandler(async (req, res) => {
  const punch = await Punch.findById(req.params.id);

  if (punch) {
    if (!punch.punchOut) {
      // Only update if punchOut hasn't been set yet
      punch.punchOut = Date.now();
      const updatedPunch = await punch.save();
      res.status(200).json(updatedPunch);
    } else {
      res.status(400).json({ message: "Already punched out" });
    }
  } else {
    res.status(404).json({ message: "Punch not found" });
  }
});

// @desc Update a punch
// @route PUT /api/punches/:id
// @access Private
const updatePunch = asyncHandler(async (req, res) => {
  const punch = await Punch.findById(req.params.id);

  if (punch) {
    if (req.body.punchIn) punch.punchIn = req.body.punchIn;
    if (req.body.punchOut) punch.punchOut = req.body.punchOut;
    if (req.body.user) punch.user = req.body.user;
    if (req.body.project) punch.project = req.body.project;
    if (req.body.note) punch.note = req.body.note;

    const updatedPunch = await punch.save();
    res.status(200).json(updatedPunch);
  } else {
    res.status(404).json({ message: "Punch not found" });
  }
});

// @desc Delete a punch
// @route DELETE /api/punches/:id
// @access Private
const deletePunch = asyncHandler(async (req, res) => {
  const punch = await Punch.findById(req.params.id);

  if (punch) {
    await punch.remove();
    res.status(200).json({ message: "Punch removed successfully" });
  } else {
    res.status(404).json({ message: "Punch not found" });
  }
});

export {
  getPunches,
  getPunchByID,
  punchIn,
  punchOut,
  updatePunch,
  deletePunch,
};
