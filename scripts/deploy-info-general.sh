# jenkins get password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword


# jenkins jobs
#http://ec2-18-231-81-16.sa-east-1.compute.amazonaws.com:8080/

# open aws
ssh -i ~/Descargas/app5.pem http://ec2-18-231-81-16.sa-east-1.compute.amazonaws.com


# http://blog.manula.org/2013/03/running-jenkins-under-different-user-in.html
# ***************** no ejecutar este cambio
#export JENKINS_USER="ubuntu"
#sudo chown -R jenkins:jenkins /var/lib/jenkins 
#sudo chown -R jenkins:jenkins /var/cache/jenkins
#sudo chown -R jenkins:jenkins /var/log/jenkins
#sudo /etc/init.d/jenkins restart
#ps -ef | grep jenkins


# cambiar de user sin password
sudo useradd -m -s /bin/bash app5 && echo "app5:app5" | chpasswd
sudo -u app5 bash
sudo usermod -d /home/app5/ app5

#remove pswd
sudo passwd -d app5
#add user app to sudo visudo
app ALL=(ALL) NOPASSWD:ALL

#1. Create a custom password for jenkins user
#sudo passwd jenkins
#2. Add jenkins to sudoers list
#sudo nano /etc/sudoer and add one line
#jenkins ALL=(ALL) ALL
#3. Create a file with the jenkins password inside and limit read access only to jenkins user
#sudo su - jenkins
#echo 'the_jenkins_password' > pwd
#chmod 600 pwd
#exit
#4. Execute your script
#In your custom build create a free form build and select “Execute Shell” in build steps and in the box do:
#sudo -S su - ubuntu -c "sh /path/to/your/script.sh"



#Sigh. To remove password prompts for commands/apps using sudo:
sudo adduser (your user name) sudo
sudo visudo
#Change:
%sudo   ALL=(ALL:ALL) ALL
to
%sudo  ALL=(ALL) NOPASSWD:ALL
#Exit visudo- Ctrl+x, y, Enter
#Run:
sudo service sudo restart


# jdk
# https://www.digitalocean.com/community/tutorials/instalar-java-en-ubuntu-con-apt-get-es
echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" | sudo tee /etc/apt/sources.list.d/webupd8team-java.list
echo "deb-src http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" | sudo tee -a /etc/apt/sources.list.d/webupd8team-java.list
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys EEA14886
sudo apt-get update
sudo apt-get-y  install oracle-java8-installer

sudo update-alternatives --config java
sudo update-alternatives --config javac
sudo update-alternatives --config java
sudo nano /etc/environment
JAVA_HOME=/usr/lib/jvm/java-8-oracle
source /etc/environment
echo $JAVA_HOME

# maven
 sudo apt-get -y install maven
 mvn -version

