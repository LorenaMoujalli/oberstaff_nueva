# Etapa de construcción
FROM node:20-slim AS build
WORKDIR /app

# Establecer límite de memoria para Node.js
ENV NODE_OPTIONS="--max-old-space-size=1024"

COPY package*.json ./

# Configurar npm para ser más robusto ante fallos de red
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set maxsockets 10

# NUEVO: Instalar Python y compiladores necesarios para compilar better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

RUN npm ci

COPY . .
RUN npm run build

# Etapa de producción
FROM node:20-slim AS runtime
WORKDIR /app

# Instalar Nginx y wget para el healthcheck
RUN apt-get update && apt-get install -y nginx wget && rm -rf /var/lib/apt/lists/*

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/sites-enabled/default

# Copiar los archivos estáticos construidos a la ruta que sirve Nginx
COPY --from=build /app/dist ./dist

# Copiar dependencias de Node, script de base de datos y script de inicio
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY server.js ./
COPY start.sh ./

# Dar permisos de ejecución al script de inicio
RUN chmod +x start.sh

EXPOSE 80
CMD ["./start.sh"]