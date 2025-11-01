# Build arguments para flexibilidad
ARG NODE_VERSION=22
ARG PORT=3000

# ====================================
# Stage 1: Builder
# ====================================
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production && \
    npm cache clean --force

# ====================================
# Stage 2: Production
# ====================================
FROM node:${NODE_VERSION}-alpine

# Metadata labels
LABEL maintainer="suarezgomezjosepablo03@gmail.com" \
    version="1.0.0" \
    description="Okta OIDC Authentication Service" \
    org.opencontainers.image.source="https://github.com/JimenaJG/Secure-Software-Development-Life-Cycle" \
    org.opencontainers.image.vendor="UNA" \
    org.opencontainers.image.title="Okta OIDC UNA" \
    org.opencontainers.image.description="Secure authentication service using Okta OIDC"

# Instalar Tini para manejo correcto de señales
RUN apk add --no-cache tini

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar node_modules desde el stage builder
COPY --from=builder /app/node_modules ./node_modules

# Copiar el resto del código
COPY . .

# Variables de entorno
ENV NODE_ENV=production \
    PORT=${PORT}

# Exponer el puerto
EXPOSE ${PORT}

# Usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /usr/src/app

USER nodejs

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:${PORT}/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Usar Tini como entrypoint para manejo correcto de señales
ENTRYPOINT ["/sbin/tini", "--"]

# Comando para iniciar la aplicación
CMD ["node", "server.js"]