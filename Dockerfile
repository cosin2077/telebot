FROM node:16-alpine AS builder
WORKDIR /app
LABEL conanskyforce.telebot.image.authors="conan@denode.fun"

COPY package.json .
RUN npm config set sass-binary-site "https://npmmirror.com/mirrors/node-sass"
RUN npm i
ARG ENV
ENV ENV=${ENV}
COPY . .

FROM node:16-alpine AS runner
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 9525
CMD ["npm", "start"]
