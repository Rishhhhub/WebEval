const mongoose = require('mongoose');
const noteSchema = new mongoose.Schema({
  category: String,
  title: String,
  meta: String,
  image: String
});
module.exports = mongoose.model('Note', noteSchema);