# syntax=docker/dockerfile:1
ARG NODE_VERSION=18
ARG PNPM_VERSION=10.12.1

########################################
# 1) Base image
########################################
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
RUN corepack enable pnpm

########################################
# 2) Install production deps
########################################
FROM base AS deps
COPY    package.json pnpm-lock.yaml ./
RUN     pnpm install --frozen-lockfile --prod

########################################
# 3) Build stage
########################################
FROM deps AS build
WORKDIR /app
# install devDependencies too
RUN     pnpm install --frozen-lockfile

# ── COPY your src folder into /app ───────────────────────
# This will place, for example, src/app → /app/app
COPY   . .
# ─────────────────────────────────────────────────────────

RUN     pnpm run build

########################################
# 4) Production image
########################################
FROM base AS final
WORKDIR /app
ENV NODE_ENV=production
USER node

# bring in only what’s needed at runtime
COPY --from=deps  /app/node_modules ./node_modules
COPY --from=build /app/.next        ./.next
COPY --from=build /app/public       ./public
COPY package.json ./

EXPOSE 3000
CMD ["pnpm", "start"]
