const express = require('express');
const router = express.Router();
const { rows } = require('../database/init');

router.get('/list', (req, res) => {
  const categories = rows('SELECT * FROM categories ORDER BY sort ASC');
  res.json({ code: 0, data: categories });
});

module.exports = router;
