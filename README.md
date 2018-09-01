# Ristretto Ninja Team - Hackathon Ninja Argentina

## Introduction

Full App used in Hachathon Ninja Argentina

The application has a frontend, a backend (API Rest), use a no-sql database (mongo) and you could login with facebook, google and email.

## About the code

The frontend is generated with [Angular CLI](https://github.com/angular/angular-cli). 
The backend is made from scratch. Whole stack in [TypeScript](https://www.typescriptlang.org).

This project uses the [MEAN stack](https://en.wikipedia.org/wiki/MEAN_(software_bundle)):
* [**M**ongoose.js](http://www.mongoosejs.com) ([MongoDB](https://www.mongodb.com)): database
* [**E**xpress.js](http://expressjs.com): backend framework
* [**A**ngular 2+](https://angular.io): frontend framework
* [**N**ode.js](https://nodejs.org): runtime environment

Other tools and technologies used: 
* [Angular CLI](https://cli.angular.io): frontend scaffolding
* [Bootstrap](http://www.getbootstrap.com): layout and styles
* [Font Awesome](http://fontawesome.io): icons
* [JSON Web Token](https://jwt.io): user authentication
* [Angular 2 JWT](https://github.com/auth0/angular2-jwt): JWT helper for Angular
* [Docker Compose](https://docs.docker.com/compose/):To prepare environment 


## Run in Development

### Prerequisites to install in development environment

1. Install [Node.js](https://nodejs.org)
2. Install [MongoDB](https://www.mongodb.com) and start mongod service
3. Install Angular CLI: `npm i -g @angular/cli`
4. Install Typescript: `npm i -g typescript`
7. Set these environment variables:
    * MONGO_URI => Example: mongodb://localhost:27017/test
    * HOST=127.0.0.1
    * BACK_PORT=5000
    * FRONT_PORT=4200
    * NODE_ENV=Production or Development
    * TOKEN_SECRET=s3cr3t
    * GOOGLE_SECRET= [your google account secret](https://support.google.com/googleapi/answer/6158862?hl=en)
    * [FACEBOOK_SECRET= your facebook account secret](https://developers.facebook.com/docs/facebook-login/access-tokens/)


### get code 
`git clone https://github.com/ristrettoninjateam/ristrettoapp.git `

### Start app 
Once you have the prerequisites installed and the project cloned, follow these commands to start app:

1. From app/front folder install all the dependencies: `npm i`
2. From app/back folder install all the dependencies: `npm i`
3. From project root folder, run `npm run serve-dev` to start backend and frontend
4. Open one explorer in the address [http://localhost:4220](http://localhost:4200)

When you see the console indicate everything has been built and is ready to use!

## Run like Production Environment (with AWS y Amazon)

### Prerequisites to run in production (with AWS y Amazon) environment

1. Install all software indicated in scripts/intall-aws.sh (tak care about machine name and keys)
2. Set machine-name in google account (for ouath)
3. Set machine-name in facebook account (for ouath)
4. Set machine name in exports an environment variables
5. Create job in jenkins

## Run like Production Environment (with Docker)

### Prerequisites to run in production environment
1. Install [Docker](https://www.docker.com/)  
2. Install [Docker-compose](https://docs.docker.com/compose/install/)  

### get code 
`git clone https://github.com/ristrettoninjateam/ristrettoapp.git `

### Quick Start 
Once you have the prerequisites installed and the project cloned, one command will do everything you need including building and standing up the services and website: 

`docker-compose up`

When you see the console indicate everything has been built and is ready, navigate to [http://localhost:4220](http://localhost:4200). 

Localhost not available on your machine? Under the `web` section in `docker-compose.yml` change the "80:80" to "80:MY_PORT" where MY_PORT is a custom port number. 

## What is happening? 

The Docker compose file defines the environment. The Mongodb instance is not accessible except from the other docker containers (it is aliased as `db` for the `back` service via the `links` directive). The service and website both expose ports because the browser must access them. When the compose file is run, it builds the images and runs them for you. 

### Db 

This container is solely based on the standard [mongo](https://hub.docker.com/_/mongo/) image. When the image is run, it executes the custom `seed.sh` script. This script waits for the database engine to start, then imports the data files into the database. 

### app/back

This is the backennd app. 

This is an interesting container because it uses a special "on build" image from Node. This will automatically leverage the Node project, run npm install for dependencies, and create a container with the bare minimum set of services required to run the Node project, which in this case is our microservice. 

### app/front

This is another throwaway image. It sets up a Node 6.x environment, installs the Angular 2 CLI, copies the source for the web app, builds it, then exposes the output as a volume for mounting by the `Web` image.

### Web 

The web image is an [Angular 2](https://angular.io) website. Node is used in the `front` image to build the project with ahead-of-time compilation for a lightweight and fast payload. When the project is built, the `Dockerfile` starts with the base [nginx](https://hub.docker.com/_/nginx/) image, maps the static files generated for the Angular 2 project using [Webpack](https://github.com/webpack/webpack) and exposes the default HTTP port. 

You can type text to filter results and/or restrict it to a group (the text filter requires a minimum of 3 characters if a group is not selected).

## Clean up 

`docker-compose down` 

Optionally: 

`docker system prune` 

## API Documentation

The API is documented with [Swagger](https://swagger.io/). You could access navigating to `http://localhost:5000/api-docs` (take care about the port that you set).


## Continuous Integration

The app enable continuous integration with circleci

![aContinuos Integration](https://github.com/ristrettoNinjaTeam/ristrettoapp/blob/develop/doc/process-ci.png?raw=true)

1. A machine is created in circle CI
2. The code is taked from master branch in github
3. The docker container is created with docker-compose
4. The container is uploaded to [docker hub](https://hub.docker.com/r/ristrettoninjateam)
5. A machine is created en [digital ocean](https://www.digitalocean.com/)
6. The container is downloaded to machine in digital ocean.
