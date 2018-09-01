FROM ubuntu:16.04

# switch to Bash
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Grab some pre-requisites and install the 6.x version of Node
RUN apt-get update \
    && apt-get -y install sudo  \
    && apt-get -y install build-essential \
    && apt-get -y install curl \
    && curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get -y install nodejs

# Config npm
RUN npm set progress=false \
 && npm config set depth 0 \
 && npm config set logleve warn \
 && npm cache clean --force \
 && npm -g config set user root

# Install the Angular CLI version and typescript
RUN npm i -g --quiet --no-progress @angular/cli \
 && npm i -g typescript \
 && npm i -g forever \
 && npm cache clean --force 
