import asyncHandler from "../middleware/asyncHandler.js";
import Punch from "../models/punchModel.js";
import Project from "../models/projectModel.js";

// @desc Get all punches
// @route GET /api/punches
// @access Private/admin
const getPunches = asyncHandler(async (req, res) => {
  const punches = await Punch.find({})
    .populate("user", "id username")
    .populate("project", "name description");
  res.status(200).json(punches);
});

// @desc Get all punches by user
// @route GET /api/punches
// @access Private

const getPunchesByUser = asyncHandler(async (req, res) => {
  const punches = await Punch.find({ user: req.user._id })
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
  const { project, note } = req.body;

  const projectExists = await Project.findById(project);
  if (!projectExists) {
    return res.status(404).json({ message: "Project not found." });
  }

  const existingPunch = await Punch.findOne({
    user: req.user._id,
    punchOut: undefined,
  });

  if (existingPunch) {
    return res.status(400).json({
      message:
        "You're already punched in to a project. Please punch out before punching in again.",
    });
  }

  const punch = new Punch({
    user: req.user._id,
    project,
    note,
  });

  const createdPunch = await punch.save();
  res.status(201).json(createdPunch);
});

// @desc Punch Out
// @route PUT /api/punches/punchout
// @access Private
const punchOut = asyncHandler(async (req, res) => {
  const punch = await Punch.findOne({
    user: req.user._id,
    punchOut: null,
  }).sort({ punchIn: -1 });

  if (punch) {
    punch.punchOut = Date.now();
    const updatedPunch = await punch.save();
    res.status(200).json(updatedPunch);
  } else {
    res.status(404).json({ message: "No active punch found" });
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
    await punch.deleteOne({ _id: punch._id });
    res.status(200).json({ message: "Punch removed successfully" });
  } else {
    res.status(404).json({ message: "Punch not found" });
  }
});

export {
  getPunches,
  getPunchByID,
  getPunchesByUser,
  punchIn,
  punchOut,
  updatePunch,
  deletePunch,
};
