#! /bin/bash
docker-machine create --driver digitalocean --digitalocean-access-token $DIGITALOCEAN_ACCESS_TOKEN   --digitalocean-tags ristretto ristretto-app-machine
docker-machine ls
docker-machine env ristretto-app-machine
eval $(docker-machine env ristretto-app-machine)
docker-compose -f docker-compose-prod.yml up -d
eval $(env)

