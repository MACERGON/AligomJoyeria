// db.js
const mysql = require('mysql2');

// Ajusta los valores según tu configuración local
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'aligom_joyeria' // o la que uses
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  console.log('Conexión exitosa a MySQL');
});

module.exports = db;
