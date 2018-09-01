#!/bin/bash
jenkins=/var/lib/jenkins/workspace/ristrettoapp

echo "Starting nvm..."
export NVM_DIR="$HOME/.nvm"                                                                                    
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use node
npm set progress=false
npm config set depth 0
npm config set logleve warn
npm cache clean --force

echo ""
echo "Starting backend..."
cd $jenkins/app/back
rm -rf node_modules
npm i ## x deps desarrollo
npm i --production
forever stopall
forever stopall ## just to be sure!
forever list ## just for check
forever start app.js 

echo ""
echo "Starting frontend..."
cd $jenkins/app/front
rm -rf node_modules
npm i ## sin el --production x deps desarrollo (ng y typescript)
ng build --prod --aot && npm run precache && cp -r nodeserver/* dist
sudo cp -R $jenkins/app/front/dist/. /var/www/html/app

echo ""
echo "Restarting nginx..."
sudo cp $jenkins/.circleci/root/etc/nginx/conf.d/default.conf /etc/nginx/sites-available/default
sudo nginx -t
sudo /etc/init.d/nginx reload

echo ""
echo "check..."
sudo netstat -plot
forever list 

echo ""
echo "done!"