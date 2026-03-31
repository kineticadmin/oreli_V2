FROM node:20-slim

WORKDIR /app

# pnpm via corepack (inclus dans Node 20, PATH garanti)
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copier les manifestes workspace en premier (cache Docker)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/seller-console/package.json ./apps/seller-console/
COPY apps/admin/package.json ./apps/admin/
COPY apps/mobile/package.json ./apps/mobile/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/design-tokens/package.json ./packages/design-tokens/
COPY packages/prisma/package.json ./packages/prisma/

# Installer toutes les dependances workspace
RUN pnpm install --frozen-lockfile

# Copier le code source
COPY . .

# Generer le client Prisma et builder l'API
RUN cd apps/api && npx prisma generate && pnpm build

EXPOSE 8080

CMD ["node", "apps/api/dist/main.js"]
