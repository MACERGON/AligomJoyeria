import React from 'react';
import { Link } from 'react-router-dom';
import Menu from '../components/Menu';



const Home = () => {
    return (
        <div>
            {/* Menú de navegación reutilizable */}
            <Menu />

            {/* Contenido principal de la página de inicio */}
            <h1>Bienvenido a Aligom</h1>
            <p>Explora nuestra joyería de chapa de oro y acero inoxidable.</p>

            <Link to="/catalog">Ver Catálogo</Link>
            
            <p>insertar</p>
            <Link to="/AddProduct">Insertar Producto</Link>
        </div>
    );
};

export default Home;
