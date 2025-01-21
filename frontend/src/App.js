import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import AddProduct from './pages/AddProduct';
// app.js
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes'); // Ajusta según tu estructura

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/', productRoutes); // O la ruta base que quieras

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/AddProduct" element={<AddProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
