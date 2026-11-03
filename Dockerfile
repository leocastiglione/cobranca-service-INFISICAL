FROM node:22-alpine AS build
WORKDIR /cobranca-service-INFISICAL

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY src ./src

RUN npx prisma generate
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /cobranca-service-INFISICAL
ENV NODE_ENV=production

EXPOSE 8888

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copia os arquivos compilados do estágio anterior
COPY --from=build /cobranca-service-INFISICAL/dist ./dist

# Executa diretamente o JavaScript compilado (main.js)
CMD ["node", "dist/main.js"]
