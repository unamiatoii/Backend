// backend/models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nom: String,
  description: String,
  prix: Number,
  categorie: String,
  imageUrl: String,
});

module.exports = mongoose.model('Product', productSchema);
