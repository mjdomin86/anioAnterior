#!/bin/bash

# docker y git 
sudo apt-get update -y

# several tools
sudo apt-get -y install \
     apt-transport-https \
     ca-certificates \
     curl \
     gnupg2 \
     software-properties-common  \
     git  \
     xclip

# Docker
curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | sudo apt-key add -
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
   $(lsb_release -cs) \
   stable"
sudo apt-get -y update
sudo apt-get -y install docker-ce

# docker-machine install
curl -L https://github.com/docker/machine/releases/download/v0.12.2/docker-machine-`uname -s`-`uname -m` >/tmp/docker-machine &&
chmod +x /tmp/docker-machine &&
sudo cp /tmp/docker-machine /usr/local/bin/docker-machine

# docker-compose
sudo curl -L https://github.com/docker/compose/releases/download/1.16.1/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# evitar usar docker con sudo
sudo groupadd docker
sudo gpasswd -a $USER docker

# nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash
cd 
source ~/.bashrc

# node y npm
#sudo apt-get install nodejs
nvm install node 
nvm use node

# angular cli
npm install -g @angular/cli

# typescript
npm install -g typescript

# forever
npm install -g forever

# mongodb
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
sudo apt-get -y update
sudo apt-get -y install mongodb-org

# mongod as service
touch mongodb.service

# copy / paste en mongodb.service
echo "[Unit]" >> mongodb.service
echo "Description=High-performance, schema-free document-oriented database" >> mongodb.service
echo "After=network.target" >> mongodb.service
echo "" >> mongodb.service
echo "[Service]" >> mongodb.service
echo "User=mongodb" >> mongodb.service
echo "ExecStart=/usr/bin/mongod --quiet --config /etc/mongod.conf" >> mongodb.service
echo "" >> mongodb.service
echo "[Install]" >> mongodb.service
echo "WantedBy=multi-user.target" >> mongodb.service

# restart mongo service
sudo mv mongodb.service /etc/systemd/system/mongodb.service

# start service
sudo systemctl start mongodb

#mongo firewall
#sudo ufw allow from la_IP_del_otro_servidor/32 to any port 27017
#sudo ufw allow from 0.0.0.0/0 to any port 27017
#sudo ufw status

# nginx
sudo apt-get -y update
sudo apt-get -y install nginx
sudo ufw enable

# check rules nginx in firewall
sudo ufw app list
# Available applications:
#  Nginx Full
#  Nginx HTTP
#  Nginx HTTPS
#  OpenSSH
sudo ufw allow 'Nginx Full'

# check nginx status
systemctl status nginx

# ngingx test config y reload
sudo nginx -t
sudo /etc/init.d/nginx reload

# instalar app
cd ~
mkdir workspace
cd  workspace
git clone https://www.github.com/ristrettoninjateam/ristrettoapp.git

# Git + avoid / Seteo credenciales
cd ristrettoapp
$ git config credential.helper store
# do some push: $ git push http://example.com/repo.git
#Username: <type your username>
#Password: <type your password>


# variables entorno producción
cd
echo "export MONGO_URI=mongodb://127.0.0.1:27017/test" >> ~/.bashrc
echo "export HOST=ec2-18-231-81-16.sa-east-1.compute.amazonaws.com" >> ~/.bashrc
echo "export BACK_PORT=5000" >> ~/.bashrc
echo "export FRONT_PORT=80" >> ~/.bashrc
echo "export NODE_ENV=Production" >> ~/.bashrc
echo "export GOOGLE_SECRET=eBlvWSxHF0FpmpcTwLkvKorp" >> ~/.bashrc
echo "export FACEBOOK_SECRET=ff3b8afa1e3f05be9ec9e935e7d4503a" >> ~/.bashrc
echo "export TOKEN_SECRET=s3cr3t" >> ~/.bashrc
echo "export AZURE_SUBSCRIPTION_KEY=66dd523dbefb47d78d85e434b13262a9" >> ~/.bashrc
echo "export AZURE_DETECT_URI=https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect" >> ~/.bashrc
echo "export AZURE_VERIFY_URI=https://westcentralus.api.cognitive.microsoft.com/face/v1.0/verify" >> ~/.bashrc
echo "export RECAPTCHA=6LcjhzUUAAAAAP3eeFePBpOSSCeQoQ1lDwH8QHcN" >> ~/.bashrc
echo "export AZURE_PERSON_URI=https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/%s/persons" >> ~/.bashrc
echo "export AZURE_PERSIST_FACE_URI=https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/%s/persons/%s/persistedFaces" >> ~/.bashrc
echo "export AZURE_IDENTIFY_URI=https://westcentralus.api.cognitive.microsoft.com/face/v1.0/identify" >> ~/.bashrc
echo "export AZURE_TRAIN_URI=https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/%s/train" >> ~/.bashrc
echo "export GOOGLE_API_KEY=AIzaSyDUj0NuPPUfMrBNDBglkeeZy4oo9x6cR_8" >> ~/.bashrc
echo "export GOOGLE_MAPS_HOST=https://maps.googleapis.com/maps/api/geocode/json" >> ~/.bashrc
echo "export MP_SHORT_NAME=hackathon" >> ~/.bashrc
echo "export MP_CLIENT_ID=5532061874310277" >> ~/.bashrc
echo "export MP_CLIENT_SECRET=8ZzHIkwN3mdw6GqQ9llPubdoqunihLsn" >> ~/.bashrc
echo "export MP_ACCESS_TOKEN=TEST-5532061874310277-101110-0404445e2106ca2c79591b2a64163922__LB_LD__-8223153" >> ~/.bashrc


# reload profile
source ~/.bashrc

# check
cd
touch versions
echo $(docker --version) >> versions
echo $(docker-machine --version) >> versions
echo $(docker-compose --version) >> versions
echo $(git --version) >> versions
echo "nvm version" $(nvm --version) >> versions
echo "node version" $(node --version) >> versions
echo "npm version" $(npm --version) >> versions
echo $(mongo --version) >> versions
cat versions
rm versions


# jenkins
# https://www.digitalocean.com/community/tutorials/how-to-install-jenkins-on-ubuntu-16-04
wget -q -O - https://pkg.jenkins.io/debian/jenkins-ci.org.key | sudo apt-key add -
echo deb http://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list
sudo apt-get -y update
sudo apt-get -y install jenkins
sudo systemctl start jenkins
sudo systemctl status jenkins
sudo ufw allow 8080
sudo ufw status
sudo adduser jenkins sudo
sudo cat /var/lib/jenkins/secrets/initialAdminPassword

# Config for deploy jenkins
sudo mkdir -p /var/lib/jenkins/workspace/ristrettoapp
sudo chown jenkins:jenkins -R /var/lib/jenkins/workspace/ristrettoapp
sudo chmod -R 777 /var/lib/jenkins/workspace/ristrettoapp
sudo adduser jenkins sudo
sudo cp .bashrc /var/lib/jenkins/.bashrc

# remove password jenkins
sudo passwd -d app5

# change pswd user jenkins
# no ejecutar!
#echo "jenkins:jenkins" | sudo passwd jenkins

# config jenkins permissions
sudo visudo
# add this line:
jenkins ALL=(ALL:ALL) ALL
jenkins    ALL = NOPASSWD: /var/lib/jenkins/workspace/ristrettoapp/scripts/*.sh
%jenkins ALL=(ALL) NOPASSWD:ALL
%sudo  ALL=(ALL) NOPASSWD:ALL
#sudo service sudo restart

check cambios en: sudo vi /etc/sudoers

# got to http://aws-host:8080
# login en jenkins and install plugins
cat /var/lib/jenkins/secrets/initialAdminPassword
#create user mento/x password


# Hacer la integración en github con Jenkins
#https://medium.com/@marc_best/trigger-a-jenkins-build-from-a-github-push-b922468ef1ae

# en repo github, en integrations & services, add service jenkins (github)
# agregar url de amazon con el path:
    http://ec2-18-231-81-16.sa-east-1.compute.amazonaws.com:8080/github-webhook/
# hacer un test desde github


# config ssh en aws
cdssh-keygen
cd .ssh
cat id_rsa.pub
#copy / paste en credenciales ssh en github.com, en "deploy keys" del repository

# add key de ssh en github


###############################################################

# Install nvm, node, etc. para user Jenkins
sudo -u jenkins bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash
cd 
export NVM_DIR="$HOME/.nvm"                                                                                    
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install node 
nvm use node
npm install -g @angular/cli
npm install -g typescript
npm install -g forever

# Deploy app
# install node packages in app
cd ~/workspace/ristrettoapp/app/front 
npm i 
cd ~/workspace/ristrettoapp/app/back 
npm i 

# start back
cd ~/workspace/ristrettoapp/app/back 
forever start app.js

# deploy app en nginx
#ng build --prod --aot && npm run precache && cp -r nodeserver/* dist
cd ~/workspace/ristrettoapp/app/front 
npm i --production
ng build --prod --aot && npm run precache && cp -r nodeserver/* dist
sudo mkdir /var/www/html/app
sudo cp -R ~/workspace/ristrettoapp/app/front/dist/. /var/www/html/app
cd ~/workspace/ristrettoapp/app/back
forever stopall
forever start app.js
sudo cp ~/workspace/ristrettoapp/.circleci/root/etc/nginx/conf.d/default.conf /etc/nginx/sites-available/default
sudo nginx -t
sudo /etc/init.d/nginx reload

# agregar usuario admin de mongo
        {
        "picture":"/assets/images/flat-avatar.png",
        "displayName":"admin",
        "email":"admin@admin.com",
        "password":"$2a$10$doX.GZphql/iONQrKIVVvucCjeI0vRZxos5.A7GJFbn2dHgBzaJPe",
        "face":null,
        "roles":["user","admin"]
        }
        #El email es "admin@admin.com" y el password es "admin".
        #Hay que agregar ese user al mongo de prod y después loguiarse con el para poder eliminar/modificar otros.


# install python and pip
#https://www.digitalocean.com/community/tutorials/how-to-install-python-3-and-set-up-a-local-programming-environment-on-ubuntu-16-04
sudo apt-get -y update
sudo apt-get -y upgrade
python3 -V
sudo apt-get install -y python3-pip
sudo apt-get install -y build-essential libssl-dev libffi-dev python-dev

# install amazon-cli
pip3 install awscli --upgrade --user
aws --version


