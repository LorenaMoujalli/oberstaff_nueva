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
FROM nginx:alpine AS runtime

# Instalar wget para el healthcheck (si no está presente, aunque suele estarlo en alpine)
RUN apk add --no-cache wget

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Limpiar y copiar los archivos construidos
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
