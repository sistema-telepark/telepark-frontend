# ======================================================================
# Etapa 1: Build — Compilar la aplicación React con Node.js
# ======================================================================
FROM node:22-alpine AS build

# Directorio de trabajo
WORKDIR /app

# Copiar solo los archivos de dependencias primero (caching de capas)
COPY package*.json ./

# D-DOCKER (Sprint 5.16): el lock quedó sano tras remover react-scripts
# (conflicto typescript@7.0.2 vs 4.9.5 resuelto) → se usa npm ci.
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# ARG para pasar la URL de la API en build-time
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build de producción
RUN npm run build

# ======================================================================
# Etapa 2: Serve — Servir los archivos estáticos con Nginx
# ======================================================================
FROM nginx:alpine

# Copiar el build desde la etapa anterior (Vite emite a /app/dist)
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Puerto expuesto
EXPOSE 80

# Healthcheck: verificar que nginx responde HTTP 200
# wget viene preinstalado en nginx:alpine
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80 || exit 1

# Comando por defecto de nginx:alpine
CMD ["nginx", "-g", "daemon off;"]
