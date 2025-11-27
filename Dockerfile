FROM node:carbon-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn config set strict-ssl false && yarn
COPY ./src ./src
RUN yarn build
RUN yarn --production
COPY . .

FROM pandoc/core
WORKDIR /app
RUN sed -i 's/https/http/g' /etc/apk/repositories && \
    apk add --update --no-cache nodejs
COPY --from=builder /app /app
RUN chmod +x /app/docker-entrypoint.sh && \
    ln -s /app/docker-entrypoint.sh /usr/local/bin/

ENV HOSTNAME=0.0.0.0
ENV PORT=4000
EXPOSE 4000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pandoc-api"]
