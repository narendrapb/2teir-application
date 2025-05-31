#!/bin/sh
if [ -n "$BACKEND_URL" ]; then
  sed -i "s|window.BACKEND_URL = .*;|window.BACKEND_URL = '$BACKEND_URL';|" /usr/share/nginx/html/index.html
fi
nginx -g "daemon off;"
