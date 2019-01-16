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
  constructor(instanceSettings, private backendSrv, private templateSrv, private $q) {
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
    var query = this.buildQueryParameters(options);

    if (query.targets.length <= 0) {
      return this.$q.when({ data: [] });
    }

    if (this.templateSrv.getAdhocFilters) {
      query.adhocFilters = this.templateSrv.getAdhocFilters(this.name);
    } else {
      query.adhocFilters = [];
    }

    return this.doRequest({
      url: this.url + '/query',
      data: query,
      method: 'POST'
    });
  }

  annotationQuery(options) {
    throw new Error("Annotation Support not implemented yet.");
  }

  metricFindQuery(query: string) {
    throw new Error("Template Variable Support not implemented yet.");
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

  buildQueryParameters(options) {
    //remove placeholder targets
    options.targets = _.filter(options.targets, target => {
      return !target.hide;
    });

    var targets = _.map(options.targets, target => {
      var newRawSql = this.templateSrv.replace(target.rawSql, options.scopedVars, 'regex');
      return {
        target: newRawSql,
        refId: target.refId,
        hide: target.hide,
        type: target.type || 'timeserie'
      };
    });

    options.targets = targets;

    return options;
  }

  doRequest(options) {
    options.withCredentials = this.withCredentials;
    options.headers = this.headers;

    return this.backendSrv.datasourceRequest(options);
  }
}
