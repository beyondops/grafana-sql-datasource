import BeyondOpsSqlDatasource from './datasource';
import { BeyondOpsSqlQueryCtrl } from './query_ctrl';
import { BeyondOpsSqlConfigCtrl } from './config_ctrl';

const defaultQuery = `SELECT
  round(UNIX_TIMESTAMP(time_column) * 1000) AS time,
  text_column AS text,
  tag_column AS tags,
  title_column AS title
FROM yourtable
ORDER BY time ASC

`;

class BeyondOpsSqlAnnotationsQueryCtrl {
  static templateUrl = 'partials/annotations.editor.html';
  annotation: any;

  /** @ngInject */
  constructor() {
    this.annotation.rawSql = this.annotation.rawSql || defaultQuery;
  }
}

export {
  BeyondOpsSqlDatasource,
  BeyondOpsSqlDatasource as Datasource,
  BeyondOpsSqlQueryCtrl as QueryCtrl,
  BeyondOpsSqlConfigCtrl as ConfigCtrl,
  BeyondOpsSqlAnnotationsQueryCtrl as AnnotationsQueryCtrl,
};
