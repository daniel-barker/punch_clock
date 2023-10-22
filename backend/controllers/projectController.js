import Project from "../models/projectModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc Get all projects
// @route GET /api/projects
// @access Admin

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({});
  res.status(200).json(projects);
});

// @desc Get all projects by username
// @route GET /api/projects
// @access Private

const getProjectsByUser = asyncHandler(async (req, res) => {
  const projects = await Project.find({ user: req.user._id });
  res.status(200).json(projects);
});

// @desc Get project by ID
// @route GET /api/projects/:id
// @access Private

const getProjectByID = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    "user",
    "username"
  );

  if (project) {
    res.status(200).json(project);
  } else {
    res.status(404).json({ message: "Project not found" });
  }
});

// @desc Create project
// @route POST /api/projects
// @access Private

const createProject = asyncHandler(async (req, res) => {
  const { title, description, github, image } = req.body;

  const existingTitle = await Project.findOne({
    user: req.user._id,
    title: title,
  });

  if (existingTitle) {
    return res
      .status(400)
      .json({ message: "You have already created a project with this name." });
  }

  const existingGithub = await Project.findOne({
    user: req.user._id,
    github: github,
  });

  if (existingGithub) {
    return res.status(400).json({
      message: "You have already created a project with this GitHub link.",
    });
  }

  const project = new Project({
    user: req.user._id,
    title,
    description,
    github,
    image,
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

// @desc Update project
// @route PUT /api/projects/:id
// @access Private

const updateProject = asyncHandler(async (req, res) => {
  const { title, description, github, image } = req.body;

  const project = await Project.findById(req.params.id);

  if (project) {
    project.title = title;
    project.description = description;
    project.github = github;
    project.image = image;

    const updatedProject = await project.save();
    res.status(200).json(updatedProject);
  } else {
    res.status(404).json({ message: "Project not found" });
  }
});

// @desc Delete project
// @route DELETE /api/projects/:id
// @access Private

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await project.deleteOne({ _id: project._id });
    res.status(200).json({ message: "Project removed" });
  } else {
    res.status(404).json({ message: "Project not found" });
  }
});

export {
  getProjects,
  getProjectsByUser,
  getProjectByID,
  createProject,
  updateProject,
  deleteProject,
};
