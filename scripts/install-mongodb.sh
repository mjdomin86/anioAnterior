#!/bin/sh

# mongodb
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.4.list
apt-get -y update
apt-get -y install mongodb-org

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
mv mongodb.service /etc/systemd/system/mongodb.service

# start service
systemctl start mongodb