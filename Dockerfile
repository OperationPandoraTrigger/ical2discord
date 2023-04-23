## Building from sources
FROM node:lts as build
WORKDIR /usr/src/app
COPY ./ ./
RUN npm ci
RUN npm run build

## Actual production image
FROM node:lts as prod
LABEL authors="frozen_byte"

ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# building code for production
RUN npm ci --omit=dev

# Bundle app source
COPY --from=build /usr/src/app/dist ./

RUN mkdir "db"
RUN chown node:node db

# At the end, set the user to use when running this image
USER node

CMD [ "node", "deploy-commands.js" ]
CMD [ "node", "app.js" ]
