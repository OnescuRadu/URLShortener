const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const UrlSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fullURL: { type: String, required: true },
  shortURL: { type: String, unique: true },
  clicked: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

UrlSchema.plugin(uniqueValidator, {
  message: 'Error, expected {PATH} to be unique!'
});

module.exports = mongoose.model('Url', UrlSchema);
