FROM node:18-alpine AS builder
WORKDIR /usr/src/nirvana

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine AS runtime
WORKDIR /usr/src/nirvana

COPY --from=builder /usr/src/nirvana/package*.json ./
COPY --from=builder /usr/src/nirvana/dist ./dist
COPY --from=builder /usr/src/nirvana/node_modules ./node_modules

CMD ["node", "dist/index.js"]