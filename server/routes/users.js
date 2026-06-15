const express = require('express');
const router = express.Router();
const { get, rows, run, lastID, save } = require('../database/init');
const { auth, generateToken } = require('../middleware/auth');

// 微信登录（简化版）
router.post('/login', (req, res) => {
  const { code, nickname, avatar } = req.body;
  const openid = code || `user_${Date.now()}`;

  let user = get('SELECT * FROM users WHERE openid = ?', [openid]);
  if (!user) {
    run('INSERT INTO users (openid, nickname, avatar) VALUES (?, ?, ?)',
      [openid, nickname || '蛋糕爱好者', avatar || '']);
    save();
    user = get('SELECT * FROM users WHERE id = ?', [lastID()]);
  } else if (nickname) {
    run('UPDATE users SET nickname = ?, avatar = ? WHERE id = ?', [nickname, avatar || '', user.id]);
    save();
  }

  const token = generateToken(user);
  res.json({ code: 0, data: { token, user: { id: user.id, nickname: user.nickname, avatar: user.avatar, phone: user.phone } } });
});

// 获取用户信息
router.get('/info', auth, (req, res) => {
  const user = get('SELECT id, openid, nickname, avatar, phone, role FROM users WHERE id = ?', [req.userId]);
  if (!user) return res.json({ code: 404, msg: '用户不存在' });
  res.json({ code: 0, data: user });
});

// 更新用户信息
router.post('/update', auth, (req, res) => {
  const { nickname, avatar, phone } = req.body;
  run('UPDATE users SET nickname = COALESCE(?, nickname), avatar = COALESCE(?, avatar), phone = COALESCE(?, phone) WHERE id = ?',
    [nickname || null, avatar || null, phone || null, req.userId]);
  save();
  res.json({ code: 0, msg: '更新成功' });
});

// ---- 地址管理 ----
router.get('/addresses', auth, (req, res) => {
  const list = rows('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC', [req.userId]);
  res.json({ code: 0, data: list });
});

router.post('/address/add', auth, (req, res) => {
  const { name, phone, province, city, district, detail, is_default } = req.body;
  if (is_default) run('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [req.userId]);
  run('INSERT INTO addresses (user_id, name, phone, province, city, district, detail, is_default) VALUES (?,?,?,?,?,?,?,?)',
    [req.userId, name, phone, province || '', city || '', district || '', detail, is_default ? 1 : 0]);
  save();
  res.json({ code: 0, msg: '添加成功' });
});

router.post('/address/update', auth, (req, res) => {
  const { id, name, phone, province, city, district, detail, is_default } = req.body;
  if (is_default) run('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [req.userId]);
  run('UPDATE addresses SET name=?, phone=?, province=?, city=?, district=?, detail=?, is_default=? WHERE id=? AND user_id=?',
    [name, phone, province || '', city || '', district || '', detail, is_default ? 1 : 0, id, req.userId]);
  save();
  res.json({ code: 0, msg: '更新成功' });
});

router.post('/address/delete', auth, (req, res) => {
  run('DELETE FROM addresses WHERE id = ? AND user_id = ?', [req.body.id, req.userId]);
  save();
  res.json({ code: 0, msg: '删除成功' });
});

module.exports = router;
