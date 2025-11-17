const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  coverUrl: String,
  author: String,
  subject: String,
  downloadUrl: String,
});
module.exports = mongoose.model('Book', bookSchema);