#!/bin/sh
# Iniciar el daemon de base de datos Node en segundo plano
node server.js &

# Iniciar Nginx en primer plano para servir la web
nginx -g "daemon off;"
