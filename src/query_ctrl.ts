///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import _ from 'lodash';
import { QueryCtrl } from 'app/plugins/sdk';
import './css/query_editor.css!';

export class BeyondOpsSqlQueryCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.editor.html';
  private defaultQuery = `SELECT
  UNIX_TIMESTAMP(<time_column>) as time_sec,
  <value column> as value,
  <series name column> as metric
FROM <table name>
WHERE $__timeFilter(time_column)
ORDER BY <time_column> ASC
`;

  defaults = {
  };

  /** @ngInject **/
  constructor($scope, $injector, private templateSrv) {
    super($scope, $injector);
    _.defaultsDeep(this.target, this.defaults);

    this.target.target = this.target.target || 'select metric';
    this.target.type = this.target.type || 'timeserie';

    if (!this.target.rawSql) {
      // special handling when in table panel
      if (this.panelCtrl.panel.type === 'table') {
        this.target.type = 'table';
        this.target.rawSql = 'SELECT 1';
        this.target.rawQuery = true;
      } else {
        this.target.rawSql = this.defaultQuery;
      }
    }
  }

  toggleEditorMode() {
    this.target.rawQuery = !this.target.rawQuery;
  }

  debugRefresh() {
    console.log(this.target);
    this.panelCtrl.refresh();
  }

}
