-- ============================================================================
-- 1. Creación de la base de datos
-- ============================================================================
CREATE DATABASE IF NOT EXISTS aligom_joyeria_db;
USE aligom_joyeria_db;

-- ============================================================================
-- 2. Tabla: roles
--   Define los diferentes roles que pueden tener los usuarios del sistema.
-- ============================================================================
CREATE TABLE IF NOT EXISTS roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(100) NOT NULL,
    descripcion_rol VARCHAR(255),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. Tabla: usuarios
--   Usuarios de tipo "administración" (administrador, vendedor, soporte, etc.).
--   Estos NO son clientes finales, sino quienes gestionan la tienda.
-- ============================================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_rol INT NOT NULL,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- Hasheado/encriptado
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES roles (id_rol)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ============================================================================
-- 4. Tabla: categorias
--   Para clasificar los productos (ej: Chapa de Oro, Acero Inoxidable, etc.).
-- ============================================================================
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================================
-- 5. Tabla: productos
-- ============================================================================
CREATE TABLE IF NOT EXISTS productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,  -- SKU: código interno único de producto
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================================
-- 6. Tabla: imagenes_productos
--   Para asociar múltiples imágenes a un producto.
-- ============================================================================
CREATE TABLE IF NOT EXISTS imagenes_productos (
    id_imagen INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    url_imagen VARCHAR(255) NOT NULL,  -- Ruta o URL de la imagen
    imagen_principal BOOLEAN DEFAULT FALSE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES productos (id_producto)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================================
-- 7. Tabla: clientes
--   Datos de los clientes finales que compran en la tienda.
-- ============================================================================
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    password VARCHAR(255) NOT NULL,  -- Hasheado/encriptado
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- ============================================================================
-- 8. Tabla: direcciones_clientes
--   Varias direcciones por cada cliente.
-- ============================================================================
CREATE TABLE IF NOT EXISTS direcciones_clientes (
    id_direccion INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    calle VARCHAR(100) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    estado VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10) NOT NULL,
    pais VARCHAR(100) NOT NULL,
    direccion_principal BOOLEAN DEFAULT FALSE, -- Indica si es la dirección principal
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================================
-- 9. Tabla: pedidos
--   Encabezado del pedido realizado por un cliente.
-- ============================================================================
CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Cuándo se realizó el pedido
    estado VARCHAR(50) DEFAULT 'pendiente',           -- Estado inicial del pedido
    total DECIMAL(10,2) DEFAULT 0.00,                 -- Monto total del pedido
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================================
-- 10. Tabla: detalles_pedido
--   Detalle de cada producto incluido en un pedido.
-- ============================================================================
CREATE TABLE IF NOT EXISTS detalles_pedido (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,   
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) VIRTUAL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos (id_producto)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================================
-- 11. Tabla: pagos
--   Información de pagos relacionados a un pedido (tarjeta, PayPal, etc.).
-- ============================================================================
CREATE TABLE IF NOT EXISTS pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,      -- tarjeta, PayPal, transferencia...
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    monto DECIMAL(10,2) NOT NULL,
    estado_pago VARCHAR(50) DEFAULT 'pendiente',  -- pendiente, aprobado, rechazado...
    FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================================
-- 12. Tabla: inventario
--   Para llevar el control de stock de cada producto.
-- ============================================================================
CREATE TABLE IF NOT EXISTS inventario (
    id_inventario INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES productos (id_producto)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================================
-- 13. Tabla: historial_cambios
--   Para llevar registro (auditoría) de modificaciones en tablas relevantes.
--   'tabla_afectada': por ejemplo 'productos', 'clientes', etc.
--   'id_registro': id del registro que fue modificado.
--   'accion': 'INSERT', 'UPDATE', 'DELETE', etc.
--   'valor_anterior' y 'valor_nuevo': pueden ser JSON o texto con los campos modificados.
-- ============================================================================
CREATE TABLE IF NOT EXISTS historial_cambios (
    id_cambio INT AUTO_INCREMENT PRIMARY KEY,
    tabla_afectada VARCHAR(50) NOT NULL,
    id_registro INT NOT NULL,
    accion VARCHAR(50) NOT NULL,         -- INSERT, UPDATE, DELETE
    valor_anterior TEXT,
    valor_nuevo TEXT,
    fecha_cambio DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT,                      -- Usuario que realizó el cambio
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- ============================================================================
-- INSERTS DE EJEMPLO (Opcionales)
-- ============================================================================
-- Roles (Ejemplo)
INSERT INTO roles (nombre_rol, descripcion_rol)
VALUES 
    ('Administrador', 'Acceso total al sistema'),
    ('Vendedor', 'Puede gestionar productos y pedidos'),
    ('Soporte', 'Brinda soporte a clientes');

-- Categorías (Ejemplo)
INSERT INTO categorias (nombre, descripcion)
VALUES
    ('Chapa de Oro', 'Joyas con baño/chapa de oro de alta calidad'),
    ('Acero Inoxidable', 'Joyas resistentes a la corrosión en acero inoxidable');
