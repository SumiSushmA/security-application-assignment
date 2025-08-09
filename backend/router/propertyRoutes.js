const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  getAllProperties,
  postProperty,
  getPropertyById,
  updateProperty,
  getPropertyByUser,
  deletePropertyById,
  updatePropertyApprovalStatus,
  getApprovedProperties,
  getApprovedPropertyByUser,
  markAsSold,
  getSoldProperty,
} = require("../controller/propertyController");

const { authenticateToken } = require("../middleware/userAuth");
const { verifyAdmin } = require("../middleware/authMiddleware");
const { uploadBookImages } = require("../config/multerConfig");
const {
  sanitizeInput,
  validateObjectId,
  uploadLimiter,
} = require("../middleware/validation");

// Fallback multer config (not used, only here if needed later)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "product_images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.get("/get-all-properties", verifyAdmin, getAllProperties);
router.get("/get-approved-properties", getApprovedProperties);
router.get("/get-property-by-id/:propertyId", validateObjectId("propertyId"), getPropertyById);
router.get("/get-property-by-user", getPropertyByUser);
router.get("/get-approved-by-user", getApprovedPropertyByUser);
router.delete("/delete-property", authenticateToken, deletePropertyById);

router.patch(
  "/approve-property/:propertyId",
  validateObjectId("propertyId"),
  verifyAdmin,
  updatePropertyApprovalStatus
);
router.patch(
  "/mark-as-sold/:propertyId",
  validateObjectId("propertyId"),
  authenticateToken,
  markAsSold
);
router.get("/sold", authenticateToken, getSoldProperty);

// Post property -- Broken Access Control
router.post(
  "/post-property",
  sanitizeInput,
  uploadLimiter,
  uploadBookImages,
  authenticateToken,
  postProperty
);

// Update property
router.patch(
  "/update-property/:propertyId",
  sanitizeInput,
  validateObjectId("propertyId"),
  uploadLimiter,
  uploadBookImages,
  authenticateToken,
  updateProperty
);

module.exports = router;
