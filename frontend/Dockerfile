FROM nginx:stable-alpine
# On copie le build de l'application vers le dossier public de Nginx
COPY . /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
