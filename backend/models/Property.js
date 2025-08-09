const mongoose = require("mongoose");

const propertySchema = mongoose.Schema( //insecure design
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "Apartment",
        "House",
        "Commercial Space",
        "Land",
        "Villa",
        "Room",
        "Flat",
        "Other",
      ],
      required: true,
    },
    description: { type: String },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    furnishing: {
      type: String,
      enum: ["Fully Furnished", "Semi Furnished", "Unfurnished"],
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    delivery: {
      type: Boolean,
      default: false, // Optional: You can rename to "homeVisit" or "siteVisitAvailable" if more suitable
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Declined"],
      default: "Pending",
    },
    approvalDate: {
      type: Date,
      default: null,
    },
    sold: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
