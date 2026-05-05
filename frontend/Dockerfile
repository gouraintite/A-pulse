# ═══════════════════════════════════════════════
# STAGE 1 : BUILD
# ═══════════════════════════════════════════════
FROM node:22.19.0-alpine AS build
WORKDIR /app

# Copie package.json et install (cache)
COPY package.json package-lock.json ./
RUN npm ci

# Copie le reste et build
COPY . .

# Variable d'env injectée au build (Vite l'embarque dans le bundle)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ═══════════════════════════════════════════════
# STAGE 2 : NGINX SERVE
# ═══════════════════════════════════════════════
FROM nginx:1.27.6-alpine AS runtime

# Config nginx custom (gestion du SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie les fichiers build depuis le stage 1
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]