FROM oven/bun

WORKDIR /app

COPY . .

RUN bun install

ENV NODE_ENV production

ENTRYPOINT ["./entrypoint.sh"]
EXPOSE 3000
