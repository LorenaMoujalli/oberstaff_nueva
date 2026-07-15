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

RUN npm ci

COPY . .
RUN npm run build

# Etapa de producción
FROM node:20-slim AS runtime
WORKDIR /app

# Instalar wget para el healthcheck
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

# Copiar dependencias construidas y distribución de Astro
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist

# Variables de entorno para ejecutar Astro en Node
ENV HOST=0.0.0.0
ENV PORT=80
ENV NODE_ENV=production

EXPOSE 80
CMD ["node", "./dist/server/entry.mjs"]
