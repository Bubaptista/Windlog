# Build stage
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Replace the default port 80 with the $PORT env variable provided by Railway
CMD sed -i 's/listen \(.*\)80;/listen '"${PORT:-80}"';/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
