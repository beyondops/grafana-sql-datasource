#!/bin/bash

docker run \
  --rm \
  -p 3000:3000 \
  --name=grafana \
  -v $PWD:/var/lib/grafana/plugins/grafana-sql-datasource \
  -v "/Users/sadman/github/grafana/simple-json-datasource:/var/lib/grafana/plugins/grafana-simple-json-datasource" \
  grafana/grafana
  
#-e "GF_INSTALL_PLUGINS=grafana-clock-panel,grafana-simple-json-datasource" \
#-e "GF_INSTALL_PLUGINS=grafana-simple-json-datasource" \
