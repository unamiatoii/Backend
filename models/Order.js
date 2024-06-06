// backend/models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  produits: [{
    produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantite: Number,
  }],
  montantTotal: Number,
  nomClient: String,
  emailClient: String,
  adresseClient: String,
  dateCommande: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Commande', orderSchema);
