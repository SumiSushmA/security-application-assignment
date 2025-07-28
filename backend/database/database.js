import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ Database connected successfully`);
  } catch (error) {
    console.log("❌ Mongodb connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
