// JWT 认证中间件
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'cake_shop_secret_key_2024';

// H5/小程序通用认证（简化版：用 openid 模拟）
function auth(req, res, next) {
  const token = req.headers.authorization || req.query.token || '';

  try {
    if (token.startsWith('Bearer ')) {
      const decoded = jwt.verify(token.slice(7), JWT_SECRET);
      req.userId = decoded.userId;
      req.userRole = decoded.role;
    } else if (token) {
      // 简化模式: 直接传 openid
      req.userId = token;
      req.userRole = 'user';
    } else {
      // 游客模式: 用模拟用户ID
      req.userId = 1;
      req.userRole = 'user';
    }
  } catch (e) {
    req.userId = 1; // 兜底游客
    req.userRole = 'user';
  }
  next();
}

// 管理员认证
function adminAuth(req, res, next) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ code: 403, msg: '需要管理员权限' });
  }
  next();
}

// 生成 token
function generateToken(user) {
  return jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
}

module.exports = { auth, adminAuth, generateToken };
