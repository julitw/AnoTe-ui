# Etap 1: Budowanie aplikacji Angular
FROM node:18 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Etap 2: Serwowanie aplikacji za pomocą Nginx
FROM nginx:alpine

# Kopiowanie zbudowanej aplikacji do Nginx
COPY --from=build /app/dist/anote-ui /usr/share/nginx/html

# Kopiowanie niestandardowej konfiguracji Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Eksponowanie portu 80
EXPOSE 80

# Uruchomienie Nginx
CMD ["nginx", "-g", "daemon off;"]
