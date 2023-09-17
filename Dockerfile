FROM node:16-alpine AS chess-knight-client-builder
RUN mkdir -p /home/node/chess-knight-client/node_modules && chown -R node:node /home/node/chess-knight-client
WORKDIR /home/node/chess-knight-client
COPY package.json ./
USER node
RUN npm install --production --silent
COPY --chown=node:node . .
RUN npm run build

FROM nginx:1.21.3
COPY conf/nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=chess-knight-client-builder /home/node/chess-knight-client/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
