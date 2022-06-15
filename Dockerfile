FROM node:18 

# Create app directory, this is in our container/in our image
WORKDIR /kevin/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm run build

# the port 8080 is default one, and could be occupied.
EXPOSE 8585 

#CMD [ "npm", "run", "start:prod" ]
CMD [ "npm", "run", "start:dev" ]