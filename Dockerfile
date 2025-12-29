# Etapa 1: Build
FROM node:18-alpine AS build
WORKDIR /app

# Copia dependências e instala
COPY package*.json ./

# Instala TODAS as dependências (incluindo dev)
RUN npm install

# Copia o restante dos arquivos
COPY . .

# ⚙️ Corrige permissões e executa build
RUN chmod +x ./node_modules/.bin/vite
RUN npx vite build

# Etapa 2: Servidor Nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html


# Configuração opcional (para rotas SPA)
# RUN sed -i 's/listen 80;/listen ${PORT:-80};/' /etc/nginx/conf.d/default.conf

EXPOSE ${PORT:-80}
CMD ["nginx", "-g", "daemon off;"]