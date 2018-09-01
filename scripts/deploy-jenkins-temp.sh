#!/bin/bash
#
# project in jenkins
# gitHub project: https://github.com/ristrettoNinjaTeam/ristrettoapp.git/
# Sour code Management: git
# select git
# repository URL: https://github.com/ristrettoNinjaTeam/ristrettoapp.git
# credentials: add las de ristrettoninjateam
# branch to build: */master
# build triggers, select "GitHub hook trigger for GITScm polling"
# build environment, select "Delete workspace before build starts"
# build environment, select "Abort the build if it's stuck", put absolute and timeout 20 minutes, time out actin: Fail the build
# build: sudo -S su - ubuntu -c "sh /var/lib/jenkins/workspace/ristrettoapp/scripts/deploy-jenkins.sh"
# sh scripts/deploy-jenkins.sh
# add email notification
#
jenkins=/var/lib/jenkins/workspace/ristrettoapp
echo "init"
echo ""
echo "Changing to Bash ..."
bash 
echo ""
echo "Starting nvm..."
#curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash
export NVM_DIR="$HOME/.nvm"                                                                                    
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
echo ""
#echo "Installing node..."
#nvm install node 
nvm use node
#echo ""
#echo "Config node..."
#npm set progress=false
#npm config set depth 0
#npm config set logleve warn
#npm cache clean --force
###npm -g config set user root
echo ""
#echo "Installing angular, typescript and forever..."
#npm install -g --quiet --no-progress @angular/cli
#npm install -g --quiet --no-progress typescript
#npm install -g --quiet --no-progress forever
#echo ""
#echo "Versions..."
#node --version
#npm  --version 
#echo ""
echo "Stopping web server..."
sudo /etc/init.d/nginx stop
echo "Starting backend..."
cd $jenkins/app/back
rm -rf node_modules
npm i ## x deps desarrollo
npm i --production
forever stopall
forever start app.js 
echo ""
echo "Checking backend with forever..."
forever list
echo ""
echo "Starting frontend..."
cd $jenkins/app/front
rm -rf node_modules
npm i ## sin el --production x deps desarrollo (ng y typescript)
ng build --prod --aot && npm run precache && cp -r nodeserver/* dist
sudo cp -R $jenkins/app/front/dist/. /var/www/html/app
echo ""
echo "Config nginx..."
sudo cp $jenkins/.circleci/root/etc/nginx/conf.d/default.conf /etc/nginx/sites-available/default
echo ""
echo "Starting web server..."
sudo nginx -t
sudo /etc/init.d/nginx start
echo ""
echo "check..."
sudo netstat -plot
echo ""
echo "done!"

