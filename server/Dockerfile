FROM node:22-alpine

# Install compilers for the Judge System
RUN apk add --no-cache \
    python3 \
    g++ \
    gcc \
    musl-dev

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
