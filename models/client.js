const { name } = require("ejs");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var clientSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  dob: { type: String, required: true },
  qualification: { type: String, required: true },
  aadhar: { type: String, default: "" },
  pan: { type: String, default: "" },
  passport: { type: String, default: "" },
  license: { type: String, default: "" },
  status: { type: Boolean, default: false },
  remarks: { type: String },
});

module.exports = mongoose.model("Client", clientSchema);
