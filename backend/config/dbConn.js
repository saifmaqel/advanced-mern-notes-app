import mongooes from "mongoose";

const connectDB = async () => {
  try {
    await mongooes.connect(process.env.DATABASE_URI);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
