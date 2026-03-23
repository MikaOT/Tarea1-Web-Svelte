# ⚡ Mi Tienda v5 - Sistema de Gestión de Activos
Este proyecto es una aplicación web moderna construida con Svelte 5, diseñada con una estética Cyber-Premium inspirada en eventos de alto impacto. Permite la gestión completa de un catálogo de productos y una administración avanzada de usuarios y roles.

# 🛠️ Tecnologías Utilizadas
Frontend: Svelte 5 (Runes mode), Svelte Routing. 🏎️

Backend: Node.js, Express. 🟢

Base de Datos: MongoDB. 🍃

Caché/Sesiones: Redis. 🔴

Contenedores: Docker & Docker Compose. 🐳

# 🚀 Implementación de Svelte 5 (Runes)
El corazón de la reactividad de esta aplicación se basa en las nuevas Runas de Svelte 5, optimizando el rendimiento y la legibilidad del código:

$state: Utilizado para manejar el estado reactivo global (como el token de autenticación y los datos del usuario) y local (listas de productos, estados de carga y formularios). 💾

- __auth.svelte.js:__ Gestiona el estado global de autenticación (user, token). 🔑

- __Productos.svelte:__ Controla la lista de productos, estados de carga y datos de los formularios. 📦

- __Login.svelte:__ Maneja los campos de entrada de usuario y contraseña. ⌨️

$derived: Implementado para cálculos automáticos, como el filtrado de productos en tiempo real según la búsqueda del usuario y el conteo de administradores en el panel de control. 🔍

- __Productos.svelte:__ Filtra la lista de productos en tiempo real basándose en la búsqueda del usuario. 🔍

- __AdminUsuarios.svelte:__ Calcula el total de administradores activos en la plataforma. 🛡️

- __ProductCard.svelte:__ Genera etiquetas dinámicas según el estado del producto. 🏷️

$props: Usado para la comunicación eficiente entre componentes (ej. enviando datos y funciones desde Productos.svelte hacia ProductCard.svelte). 🔌

- __ProductCard.svelte:__ Recibe los datos del producto y las funciones de acción (onEdit, onDelete) desde el componente padre. 🔌

$effect: Gestiona efectos secundarios como la carga inicial de datos desde la API y la sincronización de la sesión con el localStorage. 🔄

- __App.svelte:__ Sincroniza el estado de autenticación con el almacenamiento local y gestiona redirecciones. ⚓

- __Productos.svelte__ y AdminUsuarios.svelte: Disparan la carga de datos desde la API al montar el componente. 📥

# EndPoints

## 🌐 Endpoints de Acceso Público

- __POST__	/api/login	Autenticación de usuario y generación de token JWT 🔑

## 👤 Endpoints para Usuarios Autenticados (User/Admin)

- __GET__	/api/productos	Obtener la lista completa de productos del catálogo 📦

## 🛡️ Endpoints Exclusivos para Administradores

- __POST__	/api/productos	Crear un nuevo producto en el sistema ➕
- __PUT__	/api/productos/:id	Modificar los datos de un producto existente 📝
- __DELETE__	/api/productos/:id	Eliminar un producto de la base de datos 🗑️
- __GET__	/api/users	Listar todos los usuarios del sistema 👥
- __PUT__	/api/users/:id	Gestionar permisos (ascender o degradar rangos) ⚡

# ✨ Funcionalidades Avanzadas
Gestión de Roles (RBAC): Interfaz adaptativa que oculta/muestra botones de edición y borrado según si el usuario es admin o user. 🔐

Filtros en Tiempo Real: Buscador optimizado que filtra el catálogo instantáneamente sin peticiones extra al servidor. 🕵️

Sistema de Notificaciones (Toasts): Feedback visual para cada acción (éxito al guardar, errores de red, etc.). 🔔

Seguridad UI: Bloqueo de botones durante el envío de formularios para evitar duplicados. ⏳

Persistencia de Sesión: El estado de acceso se mantiene tras recargar la página gracias a la integración de Runas con el almacenamiento del navegador. ⚓

# ⚙️ Instrucciones de Ejecución
1. Levantar la Infraestructura (Docker)
Asegúrate de tener Docker instalado y ejecuta el siguiente comando en la raíz del proyecto para levantar MongoDB, Redis y el Backend:

```bash
docker-compose up -d
```
2. Ejecutar el Frontend
Entra en la carpeta del frontend, instala las dependencias y arranca el servidor de desarrollo:

```Bash
cd frontend
npm install
npm run dev
```
La aplicación estará disponible en http://localhost:5173.

🧪 Credenciales de Prueba
Admin: admin / admin

Usuario: user / user