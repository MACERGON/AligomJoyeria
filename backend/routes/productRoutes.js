// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../db'); // importamos la conexión a MySQL

// (Opcional) Para TinyPNG
const tinify = require('tinify');
tinify.key = 'Z1VvMm8NY1W12zs1g3y4bBlNWLrXbwZ6';

const fs = require('fs');
const path = require('path');

// 1. Configurar multer para almacenar en disco:
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // carpeta 'uploads' en la raíz de backend
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Generar un nombre único (por ejemplo timestamp-nombreOriginal)
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// 2. Ruta POST /add-product
router.post('/add-product', upload.single('image'), async (req, res) => {
  try {
    // Campos de texto
    const { name, price, category } = req.body;
    // Información del archivo subido
    const file = req.file; // { fieldname, originalname, filename, path, ... }

    if (!file) {
      return res.status(400).json({ error: 'No se recibió la imagen' });
    }

    // (Opcional) Si deseas comprimir con TinyPNG, deberías:
    // 1) Leer el archivo en buffer
    // 2) Comprimir con tinify
    // 3) Sobrescribir el archivo o guardarlo con otro nombre
  
    const source = tinify.fromFile(file.path);
    await source.toFile(file.path);
    

    // 3. Insertar en la base de datos
    //    Supongamos que en tu tabla 'productos' tienes campos:
    //    id_producto, nombre, precio, categoria, image_path
    const sql = `
      INSERT INTO productos (nombre, precio, sku, descripcion)
      VALUES (?, ?, ?, ?)
    `;
    // Ajusta los campos que necesites. Ejemplo (nótese que no uso 'category' en tu DB, 
    // podrías usar 'descripcion' o 'categoria' en la tabla).
    
    const sku = `SKU-${Date.now()}`; // Generar un SKU único, por ejemplo
    const descripcion = `Categoría: ${category}, Imagen: ${file.filename}`;
    
    db.query(sql, [name, price, sku, descripcion], (err, result) => {
      if (err) {
        console.error('Error al insertar en DB:', err);
        return res.status(500).json({ error: 'Error al insertar producto' });
      }
      
      console.log('Producto insertado con ID:', result.insertId);
      // Podrías insertar la ruta de imagen en otra tabla, 
      // o en el mismo INSERT si tu tabla 'productos' la maneja

      return res.json({ message: 'Producto agregado correctamente' });
    });
  } catch (error) {
    console.error('Error al agregar el producto:', error);
    return res.status(500).json({ error: 'Error al agregar producto' });
  }
});

module.exports = router;
