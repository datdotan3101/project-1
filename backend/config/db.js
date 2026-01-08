import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Thêm tham số { dbName: 'shop_db' } vào dòng connect
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "shop_db",
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
