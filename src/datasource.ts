///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import _ from 'lodash';


export default class BeyondOpsSqlDatasource {
  id: number;
  name: string;
  type: string;
  url: string;
  withCredentials: boolean;
  headers: any;


  /** @ngInject */
  constructor(private instanceSettings, private backendSrv, private templateSrv, private $q) {
    this.id = instanceSettings.id;
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.withCredentials = instanceSettings.withCredentials;
    this.headers = { 'Content-Type': 'application/json' };
    if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
      this.headers['Authorization'] = instanceSettings.basicAuth;
    }
  }

  query(options) {

    const queries = _.filter(options.targets, target => {
      return !target.hide && undefined !== target.rawSql;
    }).map(target => {
      return {
        refId: target.refId,
        intervalMs: options.intervalMs,
        maxDataPoints: options.maxDataPoints,
        datasource: this.name,
        rawSql: this.templateSrv.replace(target.rawSql, options.scopedVars, this.interpolateVariable),
        type: target.type,
        name: target.name
      };
    });


    if (queries.length <= 0) {
      return this.$q.when({ data: [] });
    }

    return this.doRequest({
      url: this.url + '/query',
      data: queries,
      method: 'POST'
    });
  }

  annotationQuery(options) {
    let query = this.templateSrv.replace(options.annotation.rawSql, {}, 'glob');
    var annotationQuery = {
      range: options.range,
      annotation: {
        name: options.annotation.name,
        datasource: options.annotation.datasource,
        enable: options.annotation.enable,
        iconColor: options.annotation.iconColor,
        query: query
      },
      rangeRaw: options.rangeRaw
    };

    return this.doRequest({
      url: this.url + '/annotations',
      method: 'POST',
      data: annotationQuery
    }).then(result => {
      return result.data;
    });
  }

  metricFindQuery(query: string) {
    var interpolated = {
      rawSql: this.templateSrv.replace(query, {}, this.interpolateVariable),
      datasource: this.name
    };

    return this.doRequest({
      url: this.url + '/search',
      data: interpolated,
      method: 'POST',
    }).then(result => {
      return result.data;
    });
  }

  testDatasource() {
    return this.doRequest({
      url: this.url + '/',
      method: 'GET',
    }).then(response => {
      if (response.status === 200) {
        return { status: "success", message: "Data source is working", title: "Success" };
      }
    });
  }

  interpolateVariable = (value, variable) => {
    if (typeof value === 'string') {
      if (variable.multi || variable.includeAll) {
        return this.quoteLiteral(value);
      } else {
        return value;
      }
    }

    if (typeof value === 'number') {
      return value;
    }

    const quotedValues = _.map(value, v => {
      return this.quoteLiteral(v);
    });
    return quotedValues.join(',');
  };

  quoteLiteral(value) {
    return "'" + value.replace(/'/g, "''") + "'";
  }

  doRequest(options) {
    options.withCredentials = this.withCredentials;
    options.headers = this.headers;

    return this.backendSrv.datasourceRequest(options);
  }
}
