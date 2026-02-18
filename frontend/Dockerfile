# Imagen base de Nginx
FROM nginx:latest

# Elimina la configuración por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copia los archivos estáticos del frontend
COPY . /usr/share/nginx/html

# Expone el puerto HTTP
EXPOSE 80

# Arranca Nginx
CMD ["nginx", "-g", "daemon off;"]
