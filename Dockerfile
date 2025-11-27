# Imagen base optimizada y ligera
FROM oven/bun:1.1.21-alpine AS base

# Directorio de trabajo
WORKDIR /app

# Crear directorio público para fotos
RUN mkdir -p public

# Copiar solo archivos de dependencias primero
COPY package*.json ./

# Instalar dependencias de producción
RUN bun install --production

# Copiar el resto del proyecto
COPY . .

# Azure asigna el puerto automáticamente
ENV PORT=443
ENV NODE_ENV=production
ENV MEDIA_PORT=8443

# Exponer puerto (Azure ignora esto pero es buena práctica)
EXPOSE 443

# Ejecutar la aplicación
CMD ["bun", "start"]