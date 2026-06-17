# Etapa 1: Build
FROM node:18-alpine AS build
WORKDIR /app

# Copia dependências e instala
COPY package*.json ./

# Instala dependências com lockfile
RUN npm ci

# Copia o restante dos arquivos
COPY . .

# ⚙️ Corrige permissões e executa build
RUN chmod +x ./node_modules/.bin/vite
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build

# Etapa 2: Servidor Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf


# Configuração opcional (para rotas SPA)
# RUN sed -i 's/listen 80;/listen ${PORT:-80};/' /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
