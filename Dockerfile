### STAGE 1: Build ###
FROM node:8.12.0
RUN mkdir /usr/app
COPY package.json ./usr/app
WORKDIR /usr/app
RUN npm install --quiet
RUN npm run build

# production environment
EXPOSE 5001
CMD ["npm", "run" ,"start"]

