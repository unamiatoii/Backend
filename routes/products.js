// backend/routes/products.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

// Configurer multer pour sauvegarder les fichiers
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Ajouter un timestamp pour éviter les collisions de noms
  }
});

const upload = multer({ storage: storage });

// Récupérer tous les produits
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un produit
router.post('/', upload.single('image'), async (req, res) => {
  const product = new Product({
    nom: req.body.nom,
    description: req.body.description,
    prix: req.body.prix,
    categorie: req.body.categorie,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : ''
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un produit
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Aucun produit trouvé' });
    }

    product.nom = req.body.nom || product.nom;
    product.description = req.body.description || product.description;
    product.prix = req.body.prix || product.prix;
    product.categorie = req.body.categorie || product.categorie;
    if (req.file) {
      product.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un produit
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.remove();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
