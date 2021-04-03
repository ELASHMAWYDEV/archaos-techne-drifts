const mongoose = require("mongoose");
const autoIncreament = require("mongoose-auto-increment");

//Init auto increament
autoIncreament.initialize(mongoose.connection);

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  source: {
    type: String,
    default: "techne-drifts-2021-form ",
  },
  businessType: String,
  businessName: String,
  createDate: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.plugin(autoIncreament.plugin, { model: "User", startAt: 1 });

module.exports = mongoose.model("User", UserSchema, "users");
