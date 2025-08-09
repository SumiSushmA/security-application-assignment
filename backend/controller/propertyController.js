const Property = require("../models/Property");
const User = require("../models/User");
const { createNotification } = require("./notificationController");
const { getReceiverSocketId, io } = require("../socket/socket");

// Get all unsold properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({ sold: false }).populate(
      "seller",
      "name email address avatar createdAt"
    );
    res.status(200).send(properties);
  } catch (error) {
    res.status(404).json({ message: "Properties not found", error });
  }
};

// Get all approved properties
const getApprovedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "Approved", sold: false }).populate(
      "seller",
      "name email address"
    );
    res.status(200).send(properties);
  } catch (error) {
    res.status(404).json({ message: "Properties not found", error });
  }
};

// Post a new property
const postProperty = async (req, res) => {
  console.log("REQ.USER", req.user);
  console.log("REQ.BODY", req.body);
  console.log("REQ.FILES", req.files);

  try {
    const userId = req.user.id;
    const {
      title,
      genre,           // frontend field for type
      description,
      price,
      location,
      condition,       // frontend field for furnishing
      delivery,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required!" });
    }

    const images = req.files.map((file) => file.filename);

    const property = new Property({
      seller: userId,
      title,
      type: genre,
      furnishing: condition,
      description,
      price,
      location,
      delivery: delivery || false,
      images: images,
    });

    const data = await property.save();

    await User.findByIdAndUpdate(userId, {
      $push: { property_listings: data._id },
    });

    res.status(200).json({ message: "Property posted successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Approve or decline a property
const updatePropertyApprovalStatus = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { status } = req.body;

    if (!status || typeof status !== "string") {
      return res.status(400).json({ message: "Status is required and must be a string." });
    }

    const property = await Property.findById(propertyId).populate("seller");

    if (!property) {
      return res.status(404).json({ message: "Property not found!" });
    }

    property.status = status;
    property.approvalDate = new Date();
    await property.save();

    const message = `Your property "${property.title}" has been ${status} by the admin.`;
    const notification = await createNotification(
      property.seller._id.toString(),
      "PROPERTY_APPROVAL",
      message
    );

    const receiverSocketId = getReceiverSocketId(property.seller._id.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newNotification", {
        ...notification.toObject(),
        createdAt: new Date(),
      });
    }

    res.status(200).json({
      message: `Property ${status} successfully!`,
      data: property,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Get property by ID
const getPropertyById = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const property = await Property.findById(propertyId).populate(
      "seller",
      "name email address avatar createdAt"
    );
    res.status(200).send(property);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get properties posted by a specific user
const getPropertyByUser = async (req, res) => {
  try {
    const { id } = req.headers;
    const properties = await Property.find({ seller: id, sold: false });
    res.status(200).send(properties);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get approved properties posted by a specific user
const getApprovedPropertyByUser = async (req, res) => {
  try {
    const { id } = req.headers;
    const properties = await Property.find({ seller: id, status: "Approved" });
    res.status(200).send(properties);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete property
const deletePropertyById = async (req, res) => {
  try {
    const { propertyid } = req.headers;
    const userId = req.user.id;

    const property = await Property.findByIdAndDelete(propertyid);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { property_listings: propertyid },
    });

    res.status(200).json({ message: "Property deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update property
const updateProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { title, type, description, price, location, delivery } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found!" });
    }

    const updateFields = {
      title,
      type,
      description,
      price,
      location,
      delivery,
      status: "Pending",
    };

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.filename);
      updateFields.images = [...property.images, ...newImages];
    }

    const updatedProperty = await Property.findByIdAndUpdate(propertyId, updateFields, {
      new: true,
    });

    res.status(200).json({ message: "Property updated successfully!", data: updatedProperty });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Mark property as sold
const markAsSold = async (req, res) => {
  const { propertyId } = req.params;
  const sellerId = req.user.id;

  try {
    const property = await Property.findOne({ _id: propertyId, seller: sellerId });

    if (!property) {
      return res.status(404).json({ message: "Property not found or not owned by you." });
    }

    if (property.sold) {
      return res.status(400).json({ message: "Property is already marked as sold." });
    }

    property.sold = true;
    await property.save();

    res.status(200).json({ message: "Property marked as sold successfully!", property });
  } catch (error) {
    res.status(500).json({ message: "Error marking property as sold.", error });
  }
};

// Get sold properties
const getSoldProperty = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const soldProperties = await Property.find({ seller: sellerId, sold: true });
    res.status(200).json(soldProperties);
  } catch (error) {
    res.status(500).json({ message: "Server error. Could not fetch sold properties." });
  }
};

module.exports = {
  getAllProperties,
  getApprovedProperties,
  postProperty,
  updatePropertyApprovalStatus,
  getPropertyById,
  getPropertyByUser,
  getApprovedPropertyByUser,
  deletePropertyById,
  updateProperty,
  markAsSold,
  getSoldProperty,
};

