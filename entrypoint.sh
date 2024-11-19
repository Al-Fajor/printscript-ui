#!/bin/sh

# Loop over all files matching the pattern index-*.js and replace placeholders with environment variable values
for file in /usr/share/nginx/html/assets/index-*.js; do
  [ -e "$file" ] || continue
  sed -i "s|__VITE_AUTH0_DOMAIN__|${VITE_AUTH0_DOMAIN}|g" "$file"
  sed -i "s|__VITE_AUTH0_CLIENT_ID__|${VITE_AUTH0_CLIENT_ID}|g" "$file"
  sed -i "s|__VITE_AUTH0_AUDIENCE__|${VITE_AUTH0_AUDIENCE}|g" "$file"
  sed -i "s|__BACKEND_URL__|${BACKEND_URL}|g" "$file"
  sed -i "s|__FRONTEND_URL__|${FRONTEND_URL}|g" "$file"
done

# Start the main process
exec "$@"
