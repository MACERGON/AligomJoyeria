const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// Configuración de middlewares
app.use(cors());
app.use(bodyParser.json());

// Configuración de almacenamiento de imágenes con multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Carpeta donde guardarás las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Configuración de la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'aligom_joyeria',
});

// Verificar conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

// Ruta para insertar un producto
app.post('/add-product', upload.single('image'), (req, res) => {
  const { id_categoria, nombre, precio } = req.body;
  const descripcion = req.body.descripcion || 'Sin descripción';
  const sku = req.body.sku || `SKU-${Date.now()}`;
  const image_path = req.file ? req.file.filename : null;

  if (!id_categoria || !nombre || !precio || !image_path) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  const sql = `
    INSERT INTO productos (id_categoria, nombre, descripcion, precio, sku, image_path)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [id_categoria, nombre, descripcion, precio, sku, image_path];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al insertar el producto:', err);
      return res.status(500).json({ message: 'Error al insertar el producto' });
    }
    res.status(200).json({ message: 'Producto agregado correctamente', id: result.insertId });
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
