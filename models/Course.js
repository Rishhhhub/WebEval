const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
  title: String,
  type: String,
  description: String,
  image: String
});
module.exports = mongoose.model('Course', courseSchema);