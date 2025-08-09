const express = require("express");
const router = express.Router();

const {
  adminSummary,
  getAllUsers,
  bookListingsStats,
  userActivityStats,
} = require("../controller/adminController");
const { verifyAdmin } = require("../middleware/authMiddleware");

router.get("/summary", verifyAdmin, adminSummary);
router.get("/dashboard-summary", verifyAdmin, adminSummary);
router.get("/users", verifyAdmin, getAllUsers);

// New graph endpoints
router.get("/book-listings-stats", verifyAdmin, bookListingsStats);
router.get("/user-activity-stats", verifyAdmin, userActivityStats);

module.exports = router;
