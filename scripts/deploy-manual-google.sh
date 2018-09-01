#!/bin/sh
# script to run in google to copy later to amazon
cd ~/workspace/ristrettoapp
git pull
cd ~/workspace/ristrettoapp/app/front
npm i --production
ng build --prod --aot && npm run precache && cp -r nodeserver/* dist
tar -zcf dist.tar.gz dist
git add dist.tar.gz
git commit -m "google"
git push
