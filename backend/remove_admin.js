const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(async () => {
    console.log("Connected to MongoDB");
    const result = await User.deleteOne({ email: 'admin@mantrashoes.com' });
    if (result.deletedCount > 0) {
      console.log("SUCCESS: Deleted admin@mantrashoes.com account.");
    } else {
      console.log("Account not found or already deleted.");
    }
    process.exit(0);
  })
  .catch(err => {
    console.error("ERROR:", err);
    process.exit(1);
  });
