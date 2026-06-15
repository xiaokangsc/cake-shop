const fs = require('fs');
let html = fs.readFileSync('../docs/index.html', 'utf8');
html = html.replace(/var IMG_BASE = \([^;]+\);/,
  'var IMG_BASE = (location.protocol === "file:" ? "../src/static/images" : (location.hostname === "localhost"||location.hostname==="127.0.0.1") ? "/static/images" : "images");');
fs.writeFileSync('../docs/index.html', html, 'utf8');
console.log('OK - GitHub Pages image paths fixed');
