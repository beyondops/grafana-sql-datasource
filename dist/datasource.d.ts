/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
export default class BeyondOpsSqlDatasource {
    private instanceSettings;
    private backendSrv;
    private templateSrv;
    private $q;
    id: number;
    name: string;
    type: string;
    url: string;
    withCredentials: boolean;
    headers: any;
    /** @ngInject */
    constructor(instanceSettings: any, backendSrv: any, templateSrv: any, $q: any);
    query(options: any): any;
    annotationQuery(options: any): any;
    metricFindQuery(query: string): any;
    testDatasource(): any;
    interpolateVariable: (value: any, variable: any) => any;
    getRangeVariables(options: any): {
        from_unix_timestamp_ms: {
            text: any;
            value: any;
        };
        from: {
            text: any;
            value: any;
        };
        from_day: {
            text: any;
            value: any;
        };
        to_unix_timestamp_ms: {
            text: any;
            value: any;
        };
        to: {
            text: any;
            value: any;
        };
        to_day: {
            text: any;
            value: any;
        };
    };
    quoteLiteral(value: any): string;
    doRequest(options: any): any;
}
