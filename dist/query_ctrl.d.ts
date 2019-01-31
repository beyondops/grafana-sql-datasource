/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import { QueryCtrl } from 'app/plugins/sdk';
export declare class BeyondOpsSqlQueryCtrl extends QueryCtrl {
    private templateSrv;
    static templateUrl: string;
    private lastQueryError;
    private generateSql;
    private showHelp;
    private showLastQuerySQL;
    private queryRangeVariables;
    defaults: {};
    /** @ngInject **/
    constructor($scope: any, $injector: any, templateSrv: any);
    onQueryReceived(): void;
    onQueryError(err: any): void;
    toggleEditorMode(): void;
    showHelpPanel(): void;
    debugRefresh(): void;
}
