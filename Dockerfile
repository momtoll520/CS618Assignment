FROM node:20 AS build
ARG VITE_BACKEND_URL=https://symmetrical-enigma-r767pgwp4xjr3wx4p-3000.app.github.dev/api/v1
WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

