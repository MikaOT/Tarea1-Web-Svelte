# Proyecto Productos con Roles y Autenticación Básica

Este proyecto es un ejemplo completo de **backend en Node.js con Express** y un **frontend en Vanilla JS**, que incluye autenticación básica con usuarios y roles.

## Funcionalidades

- **Usuarios con roles**
  - **Administrador**: puede crear, editar, eliminar y consultar productos.
  - **Administrador**: puede crear, editar, eliminar y consultar usuarios.
  - **Usuario**: solo puede consultar productos.

- **Frontend separado** del backend, con formulario de login y consumo de la API.
- **Backend con Express**:
  - Endpoints de productos protegidos por rol.
  - Autenticación básica (`Authorization: Basic <base64>`).
- **Tests con Jest + Supertest** para verificar rutas y seguridad.

docker compose up --build
