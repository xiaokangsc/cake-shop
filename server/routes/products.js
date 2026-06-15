const express = require('express');
const router = express.Router();
const { get, rows } = require('../database/init');
const { auth } = require('../middleware/auth');

// 获取产品列表
router.get('/list', auth, (req, res) => {
  const { category_id, keyword, page = 1, page_size = 10, is_recommend } = req.query;
  const conditions = ['p.status = 1'];
  const params = [];

  if (category_id) { conditions.push('p.category_id = ?'); params.push(Number(category_id)); }
  if (keyword) { conditions.push('p.name LIKE ?'); params.push(`%${keyword}%`); }
  if (is_recommend) { conditions.push('p.is_recommend = 1'); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (Number(page) - 1) * Number(page_size);

  const total = get(`SELECT COUNT(*) as count FROM products p ${where}`, params);
  const list = rows(
    `SELECT p.*, c.name as category_name FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     ${where}
     ORDER BY p.is_recommend DESC, p.sales DESC
     LIMIT ? OFFSET ?`,
    [...params, Number(page_size), offset]
  );

  res.json({ code: 0, data: { list, total: total ? total.count : 0, page: Number(page), page_size: Number(page_size) } });
});

// 获取产品详情
router.get('/detail/:id', auth, (req, res) => {
  const product = get(
    `SELECT p.*, c.name as category_name FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = ?`,
    [Number(req.params.id)]
  );

  if (!product) return res.json({ code: 404, msg: '产品不存在' });

  product.images = JSON.parse(product.images || '[]');
  product.specs = JSON.parse(product.specs || '[]');

  res.json({ code: 0, data: product });
});

module.exports = router;
