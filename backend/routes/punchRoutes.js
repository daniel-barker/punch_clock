import express from "express";
import { check } from "express-validator";
import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";
import {
  getPunches,
  getPunchByID,
  punchIn,
  punchOut,
  updatePunch,
  deletePunch,
} from "../controllers/punchController.js";

const router = express.Router();

const punchValidations = [
  check("user").isMongoId().withMessage("Invalid user ID"),
  check("project").isMongoId().optional().withMessage("Invalid project ID"),
  check("note")
    .isString()
    .trim()
    .isLength({ max: 500 })
    .optional()
    .withMessage("Note must be a string and less than 500 characters"),
];

const updatePunchValidations = [
  check("punchIn").optional().isISO8601().withMessage("Invalid punchIn format"),
  check("punchOut")
    .optional()
    .isISO8601()
    .withMessage("Invalid punchOut format"),
  check("note")
    .isString()
    .trim()
    .isLength({ max: 500 })
    .optional()
    .withMessage("Note must be a string and less than 500 characters"),
  check("user").isMongoId().withMessage("Invalid user ID"),
  check("project").isMongoId().optional().withMessage("Invalid project ID"),
];

router.route("/").get(protect, admin, getPunches);
router.route("/:id").get(protect, admin, checkObjectId, getPunchByID);
router.route("/punchin").post(protect, punchValidations, punchIn);
router.route("/punchout/:id").put(protect, checkObjectId, punchOut);
router
  .route("/:id")
  .put(protect, admin, checkObjectId, updatePunchValidations, updatePunch);
router.route("/:id").delete(protect, admin, checkObjectId, deletePunch);

export default router;
