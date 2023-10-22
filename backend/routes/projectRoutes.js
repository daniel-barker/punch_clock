import express from "express";
import { check } from "express-validator";
import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

import {
  getProjects,
  getProjectsByUser,
  getProjectByID,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

const projectValidations = [
  check("name")
    .isString()
    .trim()
    .isLength({ max: 80 })
    .withMessage("Name must be a string and less than 80 characters"),
  check("description")
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be a string and less than 500 characters"),
];

router.route("/").get(protect, admin, getProjects);
router.route("/user").get(protect, getProjectsByUser);
router.route("/:id").get(protect, checkObjectId, getProjectByID);
router.route("/").post(protect, projectValidations, createProject);
router
  .route("/:id")
  .put(protect, admin, projectValidations, checkObjectId, updateProject);
router.route("/:id").delete(protect, admin, checkObjectId, deleteProject);

export default router;
