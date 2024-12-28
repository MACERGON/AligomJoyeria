import React from 'react';

const Catalog = () => {
    const products = [
        { id: 1, name: 'Collar de chapa de oro', price: '$200.00', image: 'https://via.placeholder.com/150' },
        { id: 2, name: 'Pulsera de acero inoxidable', price: '$150.00', image: 'https://via.placeholder.com/150' },
        { id: 3, name: 'Anillo ajustable', price: '$100.00', image: 'https://via.placeholder.com/150' },
    ];

    return (
        <div>
            <h1>Catálogo de Productos</h1>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {products.map((product) => (
                    <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', width: '200px' }}>
                        <img src={product.image} alt={product.name} style={{ width: '100%' }} />
                        <h2>{product.name}</h2>
                        <p>{product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catalog;
