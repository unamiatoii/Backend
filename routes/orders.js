// backend/routes/orders.js

const express = require('express');
const router = express.Router();
const Commande = require('../models/Order');
const auth = require('../middleware/auth');

// Get all orders (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const commandes = await Commande.find().populate('produits.produit');
    res.json(commandes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  const commande = new Commande({
    produits: req.body.produits,
    montantTotal: req.body.montantTotal,
    nomClient: req.body.nomClient,
    emailClient: req.body.emailClient,
    adresseClient: req.body.adresseClient,
  });

  try {
    const nouvelleCommande = await commande.save();
    res.status(201).json(nouvelleCommande);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
