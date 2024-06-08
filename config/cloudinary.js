// backend/config/cloudinary.js

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dme5av0sm',
  api_key: '573213792363922',
  api_secret: 'lOuWK2xdQ_3LT469Zh4QjbfUcEU'
});

module.exports = cloudinary;
