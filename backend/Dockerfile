# 1. Usamos una imagen base ligera (Alpine) para optimizar tamaño
FROM node:20-alpine

# 2. Directorio de trabajo
WORKDIR /app

# 3. Aprovechamos la caché de Docker:
# Copiamos SOLO los archivos de dependencias primero.
# Si el package.json no cambia, Docker no volverá a ejecutar 'npm install'
COPY package*.json ./

# 4. Instalamos dependencias
RUN npm install

# 5. Copiamos el resto del código
# (Gracias al .dockerignore, no copiamos node_modules basura del host)
COPY . .

# 6. Documentamos el puerto correcto
EXPOSE 3000

# 7. Comando por defecto
# Nota: En desarrollo lo sobrescribiremos con docker-compose para usar nodemon
CMD ["npm", "start"]