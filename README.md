
# BeyondOps SQL Datasource For Grafana

This datasource plugin support SQL database, it depends on [grafana-sql-datasource-server](https://github.com/beyondops/grafana-sql-datasource-server), we have tested on these databases:

- MySQL
- PostgreSQL
- Impala

# Quick start

```shell
npm install or yarn install
grunt
# for development
grunt watch

# Start a grafana container with BeyondOps SQL Datasource plugin
# Please install Docker first
./start.sh
```