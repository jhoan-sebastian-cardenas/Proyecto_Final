FROM node:20-alpine AS base
WORKDIR /app

# Instalar Bun
RUN npm install -g bun

# Copiamos los manifiestos de dependencias primero para aprovechar la caché de Docker
COPY package*.json ./

# Instalamos solo dependencias de producción cuando sea posible
RUN if [ -f package-lock.json ]; then \
            npm ci --only=production --no-audit --no-fund; \
        else \
            npm install --only=production --no-audit --no-fund; \
        fi

# Copiamos el resto del proyecto
COPY . .

# Variable de entorno para producción
ENV NODE_ENV=production
ENV PORT=443

# Puerto que expone la app
EXPOSE $PORT

# Comando por defecto
CMD ["bun", "src/index.ts"]