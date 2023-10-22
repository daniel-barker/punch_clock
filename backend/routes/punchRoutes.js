import express from "express";
import { check } from "express-validator";
import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";
import {
  getPunches,
  getPunchByID,
  getPunchesByUser,
  punchIn,
  punchOut,
  updatePunch,
  deletePunch,
} from "../controllers/punchController.js";
import Punch from "../models/punchModel.js";

const router = express.Router();

const verifyPunchOwnership = async (req, res, next) => {
  try {
    const punch = await Punch.findById(req.params.id);

    if (!punch) {
      return res.status(404).json({ message: "Punch not found" });
    }

    if (
      punch.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: "User not authorized to access this punch" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const punchValidations = [
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
  check("project").isMongoId().optional().withMessage("Invalid project ID"),
];

router
  .route("/")
  .get(protect, getPunchesByUser)
  .post(protect, punchValidations, punchIn);
router.route("/admin").get(protect, admin, getPunches);
router.route("/:id").get(checkObjectId, protect, getPunchByID);
router.route("/punchout").put(protect, punchOut);
router
  .route("/:id")
  .put(
    checkObjectId,
    protect,
    verifyPunchOwnership,
    updatePunchValidations,
    updatePunch
  )
  .delete(checkObjectId, protect, verifyPunchOwnership, admin, deletePunch);

export default router;
