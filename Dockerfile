# Imagen base optimizada y ligera
FROM oven/bun:1.1.21-alpine AS base

# Directorio de trabajo
WORKDIR /app

# Copiar solo archivos de dependencias primero
COPY package*.json ./

# Instalar dependencias de producción
RUN bun install --production

# Copiar el resto del proyecto
COPY . .

# Azure asigna el puerto automáticamente
ENV PORT=3000
ENV NODE_ENV=production

# Exponer puerto (Azure ignora esto pero es buena práctica)
EXPOSE 3000

# Ejecutar la aplicación
CMD ["bun", "start"]
