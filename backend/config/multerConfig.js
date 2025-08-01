const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

// Create uploads directories if they don't exist
const createUploadsDirectories = () => {
  const dirs = ["./uploads", "./uploads/users", "./uploads/books"];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadsDirectories();

// Multer file filter
const fileFilter = (req, file, cb) => {
  // Accept only images
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

// Storage configuration for user avatars
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/users");
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(12, (err, buffer) => {
      const filename = buffer.toString("hex") + path.extname(file.originalname);
      cb(null, filename);
    });
  },
});

// Storage configuration for book images
const bookStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/books");
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(12, (err, buffer) => {
      const filename = buffer.toString("hex") + path.extname(file.originalname);
      cb(null, filename);
    });
  },
});

// Upload configurations
const uploadUserAvatar = multer({
  storage: userStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Single file only
  },
});

const uploadBookImages = multer({
  storage: bookStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 4, // Maximum 4 files
  },
});

module.exports = {
  uploadUserAvatar: uploadUserAvatar.single("avatar"),
  uploadBookImages: uploadBookImages.array("images", 4),
  //   compressImage
};
