FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD sh -c "echo 'Frontend: http://localhost:5173' && echo 'Backend API: http://localhost:3000' && node build/index.js"
