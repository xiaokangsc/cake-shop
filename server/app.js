const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/static', express.static(path.join(__dirname, '..', 'src', 'static')));
app.use('/preview', express.static(path.join(__dirname, '..', 'preview')));

// 路由
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/shop', require('./routes/shop'));
app.use('/api/upload', require('./routes/upload'));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ code: 0, data: { status: 'ok', time: new Date().toISOString() } });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ code: 500, msg: err.message || '服务器错误' });
});

// 初始化数据库后启动
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🍰 蛋糕店后端服务已启动: http://localhost:${PORT}`);
    console.log(`📋 API 地址: http://localhost:${PORT}/api`);
    console.log(`🏪 店铺信息: http://localhost:${PORT}/api/shop/info`);
  });
}).catch(err => {
  console.error('数据库初始化失败:', err);
  process.exit(1);
});
