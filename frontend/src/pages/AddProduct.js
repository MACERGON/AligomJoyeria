import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/add-product', {
                name,
                price,
                category
            });
            alert(response.data);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            alert('Error al agregar el producto');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nombre del producto:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label>Precio:</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>
            <div>
                <label>Categoría:</label>
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
            </div>
            <button type="submit">Agregar Producto</button>
        </form>
    );
};

export default AddProduct;
