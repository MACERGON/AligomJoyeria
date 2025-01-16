import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>Bienvenido a Aligom</h1>
            <p>Explora nuestra joyería de chapa de oro y acero inoxidable.</p>
            <Link to="/catalog">Ver Catálogo</Link>
            <p>
                insertar
            </p>
            <Link to= "/AddProduct">Insertar Producto</Link>
        </div>
    );
};

export default Home;
