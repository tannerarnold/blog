FROM node:23-alpine AS build

WORKDIR /app
COPY . /app/
ENV DATABASE_URL=file:db/db.db
RUN npm ci

RUN mkdir db
RUN npm run db:migrate
RUN npm run build

FROM node:23-alpine AS runner
RUN adduser -D noderunner

USER noderunner

COPY --from=build --chown=noderunner /app/dist /app
COPY --from=build --chown=noderunner /app/db /app/db
COPY --chown=noderunner package.json package-lock.json /app/
VOLUME /app/db
WORKDIR /app

RUN npm i --omit=dev

ENV DATABASE_URL=file:/app/db/db.db NODE_ENV="production" ASSET_PATH="client" SERVER_ENTRY_PATH="server/entry.mjs"
HEALTHCHECK --interval=60s --timeout=15s --start-period=5s --retries=3 CMD wget --no-verbose --tries=1 --spider http://0.0.0.0:5173/api/health || exit 1

EXPOSE 5173

CMD ["node", "server.js"]