import BeyondOpsSqlDatasource from './datasource';
import { BeyondOpsSqlQueryCtrl } from './query_ctrl';
import { BeyondOpsSqlConfigCtrl } from './config_ctrl';
declare class BeyondOpsSqlAnnotationsQueryCtrl {
    static templateUrl: string;
    annotation: any;
    /** @ngInject */
    constructor();
}
export { BeyondOpsSqlDatasource, BeyondOpsSqlDatasource as Datasource, BeyondOpsSqlQueryCtrl as QueryCtrl, BeyondOpsSqlConfigCtrl as ConfigCtrl, BeyondOpsSqlAnnotationsQueryCtrl as AnnotationsQueryCtrl };
