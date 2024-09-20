#!/bin/sh

# Substitute environment variables in nginx.conf
envsubst '$JS_PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Start Nginx
exec nginx -g 'daemon off;'
