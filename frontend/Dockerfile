# Use specific alpine version for reproducibility and small size
FROM nginx:alpine

# Elimina la configuración por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copia los archivos estáticos del frontend
COPY . /usr/share/nginx/html

# Expone el puerto HTTP
EXPOSE 80

# Arranca Nginx
CMD ["nginx", "-g", "daemon off;"]
