FROM ubuntu:16.04

# switch to Bash
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Grab some pre-requisites and install the 6.x version of Node
RUN apt-get update \
    && apt-get -y install sudo  \
    && apt-get -y install git \
    && apt-get -y install build-essential \
    && apt-get -y install curl 

# add new USER app
ENV HOME /home/app
RUN useradd --create-home --home-dir $HOME -m app \
 && chown -R app:app $HOME \
 && echo "app:app" | chpasswd \ 
 && adduser app sudo

USER app
CMD /bin/bash

#&& chown -R app:app /media \
#&& usermod -a -G audio,video app

# Install nvm, node, npm, @angular/cli, typescript, forever
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash  \
 && cd \
 && source ~/.bashrc  \
 && export NVM_DIR="$HOME/.nvm" \ 
 && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" \ 
 && nvm install node \
 && nvm use node \
 && npm set progress=false \
 && npm config set depth 0 \
 && npm config set logleve warn \
 && npm cache clean --force \
 && npm -g config set user root \ 
 && npm i -g typescript \
 && npm i -g forever \
 && npm i -g --quiet --no-progress @angular/cli \
 && npm cache clean --force 

# nginx
RUN apt-get update \
 && apt-get install nginx \
 && sudo ufw enable \
 && sudo ufw app list \ 
 && sudo ufw allow 'Nginx Full'  \ 
 && systemctl status nginx \
 && nginx -t \
 && sudo /etc/init.d/nginx reload
