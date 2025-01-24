import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [idCategoria, setIdCategoria] = useState(''); // ID de categoría
  const [nombre, setNombre] = useState(''); // Nombre del producto
  const [descripcion, setDescripcion] = useState(''); // Descripción
  const [precio, setPrecio] = useState(''); // Precio
  const [sku, setSku] = useState(''); // SKU
  const [imageFile, setImageFile] = useState(null); // Archivo de imagen

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar datos mínimos
    if (!idCategoria || !nombre || !precio || !imageFile) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    try {
      // Crear un FormData con los campos y el archivo
      const formData = new FormData();
      formData.append('id_categoria', idCategoria);
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion || 'Sin descripción'); // Valor por defecto si no se llena
      formData.append('precio', precio);
      formData.append('sku', sku || `SKU-${Date.now()}`); // Genera un SKU único si no se proporciona
      formData.append('image', imageFile);

      // Enviar al backend
      const response = await axios.post(
        'http://localhost:5001/AddProduct', // Asegúrate de que esta ruta coincida con tu backend
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      alert(response.data.message || 'Producto agregado correctamente');

      // Resetear formulario si quieres
      setIdCategoria('');
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setSku('');
      setImageFile(null);

    } catch (error) {
      console.error('Error al agregar el producto:', error);
      alert('Error al agregar el producto');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>ID de Categoría:</label>
        <input
          type="number"
          value={idCategoria}
          onChange={(e) => setIdCategoria(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Nombre del Producto:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Descripción:</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      <div>
        <label>Precio:</label>
        <input
          type="number"
          step="0.01"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />
      </div>

      <div>
        <label>SKU:</label>
        <input
          type="text"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />
      </div>

      <div>
        <label>Imagen:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} required />
      </div>

      <button type="submit">Agregar Producto</button>
    </form>
  );
};

export default AddProduct;
