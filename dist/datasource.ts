///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import _ from 'lodash';
import moment from 'moment';

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
    let vars = this.getRangeVariables(options);
    const queries = _.filter(options.targets, target => {
      return !target.hide && undefined !== target.rawSql;
    }).map(target => {
      let rawSql = this.templateSrv.replace(target.rawSql, options.scopedVars, this.interpolateVariable);
      rawSql = this.templateSrv.replace(target.rawSql, vars, this.interpolateVariable);
      target.generateSql = rawSql;
      return {
        refId: target.refId,
        intervalMs: options.intervalMs,
        maxDataPoints: options.maxDataPoints,
        datasource: this.name,
        rawSql: rawSql,
        type: target.type
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
      return this.quoteLiteral(value);
    }

    if (typeof value === 'number') {
      return value;
    }

    const quotedValues = _.map(value, v => {
      return this.quoteLiteral(v);
    });
    return quotedValues.join(',');
  };

  getRangeVariables(options) {

    let defaultVariables = {
      from_unix_timestamp_ms: {
        text: options.range.from.valueOf(),
        value: options.range.from.valueOf()
      },
      from_unix_timestamp: {
        text: Math.round(options.range.from.valueOf() / 1000),
        value: Math.round(options.range.from.valueOf() / 1000)
      },
      from: {
        text: moment(options.range.from).format('YYYY-MM-DD HH:mm:ss'),
        value: moment(options.range.from).format('YYYY-MM-DD HH:mm:ss')
      },
      from_number: {
        text: moment(options.range.from).format('YYYYMMDDHHmmss'),
        value: moment(options.range.from).format('YYYYMMDDHHmmss')
      },
      from_day: {
        text: moment(options.range.from).format('YYYY-MM-DD'),
        value: moment(options.range.from).format('YYYY-MM-DD')
      },
      from_day_number: {
        text: moment(options.range.from).format('YYYYMMDD'),
        value: moment(options.range.from).format('YYYYMMDD')
      },
      to_unix_timestamp_ms: {
        text: options.range.to.valueOf(),
        value: options.range.to.valueOf()
      },
      to_unix_timestamp: {
        text: Math.round(options.range.to.valueOf() / 1000),
        value: Math.round(options.range.to.valueOf() / 1000)
      },
      to: {
        text: moment(options.range.to).format('YYYY-MM-DD HH:mm:ss'),
        value: moment(options.range.to).format('YYYY-MM-DD HH:mm:ss')
      },
      to_number: {
        text: moment(options.range.to).format('YYYYMMDDHHmmss'),
        value: moment(options.range.to).format('YYYYMMDDHHmmss')
      },
      to_day: {
        text: moment(options.range.to).format('YYYY-MM-DD'),
        value: moment(options.range.to).format('YYYY-MM-DD')
      },
      to_day_number: {
        text: moment(options.range.to).format('YYYYMMDD'),
        value: moment(options.range.to).format('YYYYMMDD')
      },
    };
    console.log(defaultVariables);
    return defaultVariables;
  }

  quoteLiteral(value) {
    return "'" + value.replace(/'/g, "''") + "'";
  }

  doRequest(options) {
    options.withCredentials = this.withCredentials;
    options.headers = this.headers;

    return this.backendSrv.datasourceRequest(options);
  }
}
