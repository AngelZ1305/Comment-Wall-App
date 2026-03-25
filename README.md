Comment Wall App

Aplicación web sencilla para la gestión de comentarios. Permite iniciar sesión, publicar, visualizar y eliminar comentarios mediante una Web API desarrollada con Node.js y Express, consumida por un frontend en JavaScript vanilla.

El proyecto está desplegado en Render y conectado a GitHub, por lo que cualquier cambio enviado al repositorio se despliega automáticamente.

Demo
Frontend

- https://comment-wall-app-1.onrender.com/

Backend API

- https://comment-wall-app-back.onrender.com

Tecnologías utilizadas
Backend

- Node.js

- Express

- CORS

- JWT (autenticación con cookie)

- Frontend

- HTML

- CSS

- JavaScript (Vanilla)

Infraestructura

- Render (hosting)

- GitHub (control de versiones y despliegue automático)

Arquitectura del proyecto

El proyecto está dividido en dos aplicaciones independientes:

Frontend (Static Web Page)
        ↓ consume
Backend API (Node.js / Express)

El frontend realiza peticiones HTTP a la API para autenticar usuarios y manipular comentarios.

El backend mantiene los comentarios en memoria, por lo que los datos se reinician cuando el servidor se reinicia.

API Endpoints
- Base URL
https://comment-wall-app-1.onrender.com/
- Iniciar sesión
POST /login
Body
{
  "email": "angel@email.com",
  "password": "123456"
}
Respuesta exitosa
{
  "message": "Login correcto",
  "user": {
    "id": 1,
    "email": "angel@email.com",
    "name": "Angel"
  }
}
- Cerrar sesión
POST /logout
- Obtener todos los comentarios (requiere autenticación)
GET /comments
Ejemplo de respuesta
[
  {
    "id": 1,
    "username": "angel@email.com",
    "name": "Angel",
    "message": "Primer comentario",
    "date": "2026-03-22T18:00:00.000Z"
  }
]
- Crear un comentario (requiere autenticación)
POST /comments
Body
{
  "message": "Nuevo comentario",
  "date": "2026-03-22T18:00:00.000Z"
}
- Eliminar un comentario (requiere autenticación y ser dueño del comentario)
DELETE /comments/:id

Características

- Login y logout con JWT en cookie httpOnly

- Publicar comentarios

- Listar comentarios ordenados por fecha

- Eliminar comentarios propios

- Botón de eliminar visible solo para comentarios del usuario autenticado

- Modal de confirmación para eliminación

- Feedback visual para el usuario

- Mensaje cuando no hay comentarios

- Conteo de comentarios publicados

- UI responsive para desktop y mobile

Despliegue

El proyecto está desplegado en Render utilizando integración directa con GitHub.

Cada vez que se realiza:

git push

Render detecta el cambio y actualiza automáticamente la aplicación en producción.

Imágenes del proyecto
Windows
<img width="1919" height="911" alt="image" src="/images/desktop.png" /> <br>
Móvil
<br><img width="346" height="623" alt="image" src="/images/mobile.png" />

Checklist de configuración en Render
Backend (Web Service)

Directorio raíz: backend

Comando de construcción:

- npm install

Comando de inicio:

- npm start
Variables de entorno

Agregar en Render:

- JWT_SECRET=<tu secreto>

- CORS_ORIGIN=https://comment-wall-app-1.onrender.com/

- NODE_ENV=production

Nota:
PORT lo proporciona Render automáticamente, no necesitas configurarlo.


Notas importantes

En producción, la cookie de autenticación se configura con:

- secure=true

- sameSite=none

- CORS_ORIGIN puede aceptar múltiples orígenes, separados por comas.

Ejemplo:

- CORS_ORIGIN=https://comment-wall-app-1.onrender.com,http://localhost:5500

El origen de la API en el frontend cambia automáticamente:

- Usa la URL de Render en producción

- Usa localhost en desarrollo local

Estructura actual del frontend:

- pages/ (vista principal)

- modal/ (plantilla del modal de eliminación)

- styles/ (estilos separados por vista/modal)

- js/modules/ (módulos de lógica de la app)
