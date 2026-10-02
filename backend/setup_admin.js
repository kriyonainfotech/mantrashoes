const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const uri = "mongodb://mantrashoessurat_db_user:mantrashoessurat_db_user@ac-mvovewv-shard-00-00.ptnrudr.mongodb.net:27017,ac-mvovewv-shard-00-01.ptnrudr.mongodb.net:27017,ac-mvovewv-shard-00-02.ptnrudr.mongodb.net:27017/mantrashoes?ssl=true&replicaSet=atlas-628f5o-shard-0&authSource=admin";

mongoose.connect(uri)
  .then(async () => {
    console.log("Connected");
    let admin = await User.findOne({ email: 'admin@mantrashoes.com' });
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    if (admin) {
      admin.password = hashedPassword;
      await admin.save();
      console.log("Password reset for admin@mantrashoes.com to admin123");
    } else {
      admin = await User.create({
        name: 'Admin',
        email: 'admin@mantrashoes.com',
        password: hashedPassword
      });
      console.log("Created new admin user: admin@mantrashoes.com / admin123");
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
