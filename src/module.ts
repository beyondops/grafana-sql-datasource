import BeyondOpsSqlDatasource from './datasource';
import {BeyondOpsSqlQueryCtrl} from './query_ctrl';
import {BeyondOpsSqlConfigCtrl} from './config_ctrl';

class BeyondOpsSqlAnnotationsQueryCtrl {
  static templateUrl = 'partials/annotations.editor.html';
}

export {
  BeyondOpsSqlDatasource,
  BeyondOpsSqlDatasource as Datasource,
  BeyondOpsSqlQueryCtrl as QueryCtrl,
  BeyondOpsSqlConfigCtrl as ConfigCtrl,
  BeyondOpsSqlAnnotationsQueryCtrl as AnnotationsQueryCtrl,
};
