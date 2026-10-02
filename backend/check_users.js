const mongoose = require('mongoose');

const uri = "mongodb://mantrashoessurat_db_user:mantrashoessurat_db_user@ac-mvovewv-shard-00-00.ptnrudr.mongodb.net:27017,ac-mvovewv-shard-00-01.ptnrudr.mongodb.net:27017,ac-mvovewv-shard-00-02.ptnrudr.mongodb.net:27017/mantrashoes?ssl=true&replicaSet=atlas-628f5o-shard-0&authSource=admin";

mongoose.connect(uri)
  .then(() => {
    console.log("Connected");
    const UserSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.model('User', UserSchema, 'users');
    return User.find({});
  })
  .then(users => {
    console.log(users);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
