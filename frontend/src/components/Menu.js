import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <nav style={{ background: '#f2f2f2', padding: '10px' }}>
      <h2>Aligom Joyería</h2>
      <ul style={{ listStyle: 'none', display: 'flex', gap: '10px', margin: 0, padding: 0 }}>
        <li>
          <Link to="/">Inicio</Link>
        </li>
        <li>
          <Link to="/catalog">Catálogo</Link>
        </li>
        <li>
          <Link to="/AddProduct">Insertar Producto</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
