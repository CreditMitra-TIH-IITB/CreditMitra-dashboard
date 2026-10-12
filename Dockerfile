# ── Build ─────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

# No git repository in the build context; skip installing hooks.
ENV HUSKY=0
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Vite inlines this at build time. The browser calls the engine directly, so
# it must be an address reachable from the user's machine, not a container name.
ARG VITE_API_BASE_URL=http://localhost:8000/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# ── Serve ─────────────────────────────────────────────────
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
