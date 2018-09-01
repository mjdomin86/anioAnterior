FROM ristrettoninjateam/ubuntu-node:latest

#RUN useradd --user-group --create-home --shell /bin/false app 

# Make the directory and copy over the files
RUN mkdir -p /src
COPY . /src

WORKDIR /src

RUN npm i --quiet --no-progress 

RUN ng build --prod --aot && npm run precache && cp -r nodeserver/* dist
 
RUN ls -al /src \
 && env

WORKDIR /src/dist

VOLUME /src/dist