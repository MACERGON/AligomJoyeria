import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar datos mínimos
    if (!imageFile) {
      alert('Por favor, selecciona una imagen');
      return;
    }

    try {
      // Crear un FormData con los campos y el archivo
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('name', name);
      formData.append('price', price);
      formData.append('category', category);

      // Enviar al backend
      const response = await axios.post(
        'http://localhost:5001/add-product', // Ajusta la URL según tu servidor
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      alert(response.data.message || 'Producto agregado correctamente');

      // Resetear formulario si quieres
      setName('');
      setPrice('');
      setCategory('');
      setImageFile(null);

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

      <div>
        <label>Imagen:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <button type="submit">Agregar Producto</button>
    </form>
  );
};

export default AddProduct;
