const db = require('./db');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('¡Servidor de Aligom funcionando!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

app.post('/add-product', (req, res) => {
    const { name, price, category } = req.body; // Datos enviados desde el frontend
    
    const sql = 'INSERT INTO products (name, price, category) VALUES (?, ?, ?)';
    db.query(sql, [name, price, category], (err, result) => {
        if (err) {
            console.error('Error al insertar el producto:', err);
            return res.status(500).send('Error al insertar el producto');
        }
        res.status(200).send('Producto agregado con éxito');
    });
});
