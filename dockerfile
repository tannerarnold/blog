FROM node:23-alpine AS build

WORKDIR /app
COPY . /app/
ENV DATABASE_URL=file:db/db.db
RUN npm ci

RUN mkdir db
RUN npm run db:migrate
RUN npm run build

FROM node:23-alpine AS runner
COPY --from=build /app/dist /app
COPY --from=build /app/db /app/db
COPY package.json package-lock.json /app/
VOLUME /app/db
WORKDIR /app

RUN npm i --omit=dev
RUN ls

ENV DATABASE_URL=file:/app/db/db.db
ENV NODE_ENV="production"
ENV ASSET_PATH="client"
ENV SERVER_ENTRY_PATH="server/entry.mjs"

EXPOSE 5173

CMD ["node", "server.js"]