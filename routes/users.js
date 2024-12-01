// backend/routes/users.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Récupérer tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un utilisateur
router.post('/', async (req, res) => {
  const { username, password, email, firstName, lastName, address, phone, role } = req.body;

  const user = new User({
    username,
    password,
    email,
    firstName,
    lastName,
    address,
    phone,
    role,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un utilisateur
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    Object.assign(user, updates);

    if (updates.password) {
      user.password = updates.password; // Le middleware `pre('save')` prendra en charge le hachage
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un utilisateur
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await user.remove();
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
