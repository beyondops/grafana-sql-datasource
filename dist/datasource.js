System.register(['lodash', 'moment'], function(exports_1) {
    var lodash_1, moment_1;
    var BeyondOpsSqlDatasource;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            }],
        execute: function() {
            BeyondOpsSqlDatasource = (function () {
                /** @ngInject */
                function BeyondOpsSqlDatasource(instanceSettings, backendSrv, templateSrv, $q) {
                    var _this = this;
                    this.instanceSettings = instanceSettings;
                    this.backendSrv = backendSrv;
                    this.templateSrv = templateSrv;
                    this.$q = $q;
                    this.interpolateVariable = function (value, variable) {
                        if (typeof value === 'string') {
                            return _this.quoteLiteral(value);
                        }
                        if (typeof value === 'number') {
                            return value;
                        }
                        var quotedValues = lodash_1.default.map(value, function (v) {
                            return _this.quoteLiteral(v);
                        });
                        return quotedValues.join(',');
                    };
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
                BeyondOpsSqlDatasource.prototype.query = function (options) {
                    var _this = this;
                    var vars = this.getRangeVariables(options);
                    var queries = lodash_1.default.filter(options.targets, function (target) {
                        return !target.hide && undefined !== target.rawSql;
                    }).map(function (target) {
                        var rawSql = _this.templateSrv.replace(target.rawSql, options.scopedVars, _this.interpolateVariable);
                        rawSql = _this.templateSrv.replace(target.rawSql, vars, _this.interpolateVariable);
                        target.generateSql = rawSql;
                        return {
                            refId: target.refId,
                            intervalMs: options.intervalMs,
                            maxDataPoints: options.maxDataPoints,
                            datasource: _this.name,
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
                };
                BeyondOpsSqlDatasource.prototype.annotationQuery = function (options) {
                    var query = this.templateSrv.replace(options.annotation.rawSql, {}, 'glob');
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
                    }).then(function (result) {
                        return result.data;
                    });
                };
                BeyondOpsSqlDatasource.prototype.metricFindQuery = function (query) {
                    var interpolated = {
                        rawSql: this.templateSrv.replace(query, {}, this.interpolateVariable),
                        datasource: this.name
                    };
                    return this.doRequest({
                        url: this.url + '/search',
                        data: interpolated,
                        method: 'POST',
                    }).then(function (result) {
                        return result.data;
                    });
                };
                BeyondOpsSqlDatasource.prototype.testDatasource = function () {
                    return this.doRequest({
                        url: this.url + '/',
                        method: 'GET',
                    }).then(function (response) {
                        if (response.status === 200) {
                            return { status: "success", message: "Data source is working", title: "Success" };
                        }
                    });
                };
                BeyondOpsSqlDatasource.prototype.getRangeVariables = function (options) {
                    var defaultVariables = {
                        from_unix_timestamp_ms: {
                            text: options.range.from.valueOf(),
                            value: options.range.from.valueOf()
                        },
                        from: {
                            text: moment_1.default(options.range.from).format('YYYY-MM-DD HH:mm:ss'),
                            value: moment_1.default(options.range.from).format('YYYY-MM-DD HH:mm:ss')
                        },
                        from_day: {
                            text: moment_1.default(options.range.from).format('YYYY-MM-DD'),
                            value: moment_1.default(options.range.from).format('YYYY-MM-DD')
                        },
                        to_unix_timestamp_ms: {
                            text: options.range.to.valueOf(),
                            value: options.range.to.valueOf()
                        },
                        to: {
                            text: moment_1.default(options.range.to).format('YYYY-MM-DD HH:mm:ss'),
                            value: moment_1.default(options.range.to).format('YYYY-MM-DD HH:mm:ss')
                        },
                        to_day: {
                            text: moment_1.default(options.range.to).format('YYYY-MM-DD'),
                            value: moment_1.default(options.range.to).format('YYYY-MM-DD')
                        },
                    };
                    console.log(defaultVariables);
                    return defaultVariables;
                };
                BeyondOpsSqlDatasource.prototype.quoteLiteral = function (value) {
                    return "'" + value.replace(/'/g, "''") + "'";
                };
                BeyondOpsSqlDatasource.prototype.doRequest = function (options) {
                    options.withCredentials = this.withCredentials;
                    options.headers = this.headers;
                    return this.backendSrv.datasourceRequest(options);
                };
                return BeyondOpsSqlDatasource;
            })();
            exports_1("default", BeyondOpsSqlDatasource);
        }
    }
});
//# sourceMappingURL=datasource.js.map