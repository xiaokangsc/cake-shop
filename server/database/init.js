// 数据库初始化 — 使用 sql.js (纯 JS / WASM, 无需编译)
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'cake_shop.db');

let db;

// 将 exec 结果转换为对象数组
function rows(sql, params = []) {
  if (!db) throw new Error('DB not initialized');
  const results = db.exec(sql, params);
  if (!results.length) return [];
  const [{ columns, values }] = results;
  return values.map(row => {
    const obj = {};
    columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
  });
}

// 执行单条查询返回第一个结果
function get(sql, params = []) {
  const result = rows(sql, params);
  return result[0] || null;
}

// 执行写入操作
function run(sql, params = []) {
  if (!db) throw new Error('DB not initialized');
  db.run(sql, params);
}

// 获取最后插入的 ID
function lastID() {
  return get('SELECT last_insert_rowid() as id')?.id;
}

// 保存数据库到文件
function save() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

async function initDB() {
  if (db) return db;

  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const filebuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(filebuffer);
  } else {
    db = new SQL.Database();
  }

  // 启用 WAL 模式
  db.run('PRAGMA journal_mode=WAL');
  db.run('PRAGMA foreign_keys=ON');

  initTables();
  seedData();
  save();

  return db;
}

function initTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT DEFAULT '',
      sort INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category_id INTEGER,
      price REAL NOT NULL DEFAULT 0,
      original_price REAL DEFAULT 0,
      images TEXT DEFAULT '[]',
      description TEXT DEFAULT '',
      specs TEXT DEFAULT '[]',
      stock INTEGER DEFAULT 999,
      sales INTEGER DEFAULT 0,
      status INTEGER DEFAULT 1,
      is_recommend INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      openid TEXT UNIQUE,
      nickname TEXT DEFAULT '',
      avatar TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      province TEXT DEFAULT '',
      city TEXT DEFAULT '',
      district TEXT DEFAULT '',
      detail TEXT NOT NULL,
      is_default INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      spec_info TEXT DEFAULT '',
      quantity INTEGER DEFAULT 1,
      checked INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_no TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL,
      items TEXT NOT NULL DEFAULT '[]',
      total_amount REAL NOT NULL DEFAULT 0,
      discount_amount REAL DEFAULT 0,
      pay_amount REAL NOT NULL DEFAULT 0,
      status TEXT DEFAULT 'pending',
      address_snapshot TEXT DEFAULT '{}',
      remark TEXT DEFAULT '',
      pay_time DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS banners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image TEXT NOT NULL,
      link TEXT DEFAULT '',
      sort INTEGER DEFAULT 0,
      status INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS shop_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT '甜蜜蛋糕坊',
      logo TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      address TEXT DEFAULT '',
      business_hours TEXT DEFAULT '09:00-21:00',
      latitude REAL DEFAULT 0,
      longitude REAL DEFAULT 0,
      notice TEXT DEFAULT '',
      delivery_fee REAL DEFAULT 0,
      min_order REAL DEFAULT 0
    )
  `);
}

function seedData() {
  const catCount = get('SELECT COUNT(*) as count FROM categories');
  if (catCount && catCount.count === 0) {
    // 插入分类
    const categories = [
      ['生日蛋糕', 'birthday', 1], ['慕斯蛋糕', 'mousse', 2], ['芝士蛋糕', 'cheese', 3],
      ['千层蛋糕', 'layer', 4], ['杯子蛋糕', 'cupcake', 5], ['定制蛋糕', 'custom', 6]
    ];
    for (const c of categories) {
      run('INSERT INTO categories (name, icon, sort) VALUES (?, ?, ?)', c);
    }

    // 产品通过管理后台添加，此处不再预设演示产品

    // 店铺信息
    run('INSERT INTO shop_info (name, phone, address, business_hours, latitude, longitude, notice, delivery_fee, min_order) VALUES (?,?,?,?,?,?,?,?,?)',
      ['甜蜜蛋糕坊', '138-0000-8888', '北京市朝阳区美食街88号', '09:00-21:00', 39.915, 116.404, '下单后2小时内送达；定制蛋糕请提前3天预约', 5, 30]);

    // Banner
    run('INSERT INTO banners (image, link, sort) VALUES (?,?,?)', ['/static/images/banner1.jpg', '/pages/product/product?id=1', 1]);
    run('INSERT INTO banners (image, link, sort) VALUES (?,?,?)', ['/static/images/banner2.jpg', '/pages/product/product?id=7', 2]);
    run('INSERT INTO banners (image, link, sort) VALUES (?,?,?)', ['/static/images/banner3.jpg', '/pages/product/product?id=2', 3]);

    // 测试管理员
    run("INSERT INTO users (openid, nickname, role) VALUES (?,?,?)", ['admin_test', '店主', 'admin']);

    save();
  }
}

module.exports = { initDB, get, rows, run, lastID, save };
