const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require("./models/User");

dotenv.config();

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/productosdb";

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 
async function seed() {
  await User.deleteMany({});
  
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  await User.create([
    { username: "admin", password: adminPassword, role: "admin" },
    { username: "user", password: userPassword, role: "user" },
  ]);
  console.log("Usuarios iniciales creados");
  mongoose.disconnect();
}

seed();