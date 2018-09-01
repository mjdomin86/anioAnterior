#!/bin/sh
# Script to run in aws machine with repo donwloaded and nginx installed 
# environment
export HOST=ec2-18-231-81-16.sa-east-1.compute.amazonaws.com
export FRONT_PORT=80
export NODE_ENV=Production
export GOOGLE_SECRET=eBlvWSxHF0FpmpcTwLkvKorp
export FACEBOOK_SECRET=ff3b8afa1e3f05be9ec9e935e7d4503a
export TOKEN_SECRET=s3cr3t
export AZURE_SUBSCRIPTION_KEY=66dd523dbefb47d78d85e434b13262a9
export AZURE_DETECT_URI=https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect
export AZURE_VERIFY_URI=https://westcentralus.api.cognitive.microsoft.com/face/v1.0/verify
export RECAPTCHA=6LcjhzUUAAAAAP3eeFePBpOSSCeQoQ1lDwH8QHcN
export AZURE_PERSON_URI=https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/%s/persons
export AZURE_PERSIST_FACE_URI=https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/%s/persons/%s/persistedFaces
export AZURE_IDENTIFY_URI=https://westcentralus.api.cognitive.microsoft.com/face/v1.0/identify
export AZURE_TRAIN_URI=https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/%s/train
export MP_SHORT_NAME=hackathon
export MP_CLIENT_ID=5532061874310277
export MP_CLIENT_SECRET=8ZzHIkwN3mdw6GqQ9llPubdoqunihLsn
export MP_ACCESS_TOKEN=TEST-5532061874310277-101110-0404445e2106ca2c79591b2a64163922__LB_LD__-8223153
# restart mongo and set nvm
sudo /etc/init.d/nginx stop
sudo systemctl restart mongodb
nvm use node
# download code 
cd ~/workspace/ristrettoapp
git pull
# start back
cd ~/workspace/ristrettoapp/app/back
forever stopall
npm i --production
forever start app.js 
# compile front
cd ~/workspace/ristrettoapp/app/front
npm i --production
ng build --prod --aot && npm run precache && cp -r nodeserver/* dist
sudo cp -R ~/workspace/ristrettoapp/app/front/dist/. /var/www/html/app
# config nginx 
sudo cp ~/workspace/ristrettoapp/.circleci/root/etc/nginx/conf.d/default.conf /etc/nginx/sites-available/default
sudo nginx -t
sudo /etc/init.d/nginx start