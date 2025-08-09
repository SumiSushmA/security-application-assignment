const Property = require("../models/Property");
const User = require("../models/User");

// Normalize summary to match frontend field names:
// totalBooksCount, booksPending, newUsersCount, newBooksCount
const adminSummary = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newUsersCount = await User.countDocuments({
      createdAt: { $gte: oneWeekAgo },
    });

    const newPropertiesCount = await Property.countDocuments({
      createdAt: { $gte: oneWeekAgo },
    });

    const totalPropertiesCount = await Property.countDocuments();

    const propertiesPending = await Property.countDocuments({
      status: "Pending",
    });

    res.status(200).json({
      newUsersCount,
      newBooksCount: newPropertiesCount,
      totalBooksCount: totalPropertiesCount,
      booksPending: propertiesPending,
    });
  } catch (error) {
    console.error("Error fetching summary data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Aggregation: property listings per week
const bookListingsStats = async (req, res) => {
  try {
    const data = await Property.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%V", date: "$createdAt" }, // year-week
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);
    res.json(data);
  } catch (err) {
    console.error("Error in bookListingsStats:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch property listings stats" });
  }
};

// Aggregation: active users per week based on lastActivity
const userActivityStats = async (req, res) => {
  try {
    const data = await User.aggregate([
      {
        $match: {
          lastActivity: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%V", date: "$lastActivity" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);
    res.json(data);
  } catch (err) {
    console.error("Error in userActivityStats:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch user activity stats" });
  }
};

module.exports = {
  adminSummary,
  getAllUsers,
  bookListingsStats,
  userActivityStats,
};
