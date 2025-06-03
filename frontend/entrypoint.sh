#!/bin/sh

if [ -n "$BACKEND_URL" ]; then
  sed -i "s|__BACKEND_URL__|$BACKEND_URL|g" /usr/share/nginx/html/index.html
fi

nginx -g "daemon off;"