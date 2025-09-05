# Dockerfile (ubicado en el directorio raíz del proyecto)
FROM node:22-alpine

WORKDIR /app

# Copiar dependencias e instalar
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Variables de entorno (ajustar según necesidades)
ENV NODE_ENV=production
ENV PORT=8000
ENV AUTH_TRUST_HOST=true

EXPOSE 8000

RUN npx prisma generate


# Ejecutar migraciones y crear usuario admin antes de iniciar la aplicación
CMD ["sh", "-c", "npx prisma migrate deploy && npm run user:admin && npm run db:config_certificado && npm start"]