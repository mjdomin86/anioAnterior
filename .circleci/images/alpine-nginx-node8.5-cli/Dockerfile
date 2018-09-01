FROM ristrettoninjateam/alpine-nginx-node8.5:latest

# config npm
RUN npm set progress=false \
 && npm config set depth 0 \
 && npm config set logleve warn \
 && npm cache clean --force \
 && npm -g config set user root

## install @angular/cli and clean node cache
RUN npm install --quiet --no-progress -g @angular/cli@latest

## add mongo db
RUN apk update \
 && apk add mongodb \
 && apk add mongodb-tools \
 && rm /usr/bin/mongoperf \
 && mkdir /data \
 && mkdir /data/db

VOLUME /data/db
EXPOSE 27017 28017
COPY run.sh /root
RUN /root/run.sh 
CMD ["mongod"]