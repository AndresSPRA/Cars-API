# Usa la imagen oficial de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias
COPY Backend/package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código del backend
COPY Backend/ .

# Expone el puerto del backend (según config.js)
EXPOSE 8020

# Comando para ejecutar la aplicación
CMD ["node", "index.js"]

