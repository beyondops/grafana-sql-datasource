///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import _ from 'lodash';
import { QueryCtrl } from 'app/plugins/sdk';
import './css/query_editor.css!';

export class BeyondOpsSqlQueryCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.editor.html';
  private lastQueryError = null;
  private showHelp = false;
  private defaultQuery = `SELECT
  value_column AS value,
  ROUND(UNIX_TIMESTAMP(time_column) * 1000) AS time_sec
FROM yourtable
ORDER BY time_sec ASC
`;

  defaults = {
  };

  /** @ngInject **/
  constructor($scope, $injector, private templateSrv) {
    super($scope, $injector);
    _.defaultsDeep(this.target, this.defaults);

    this.target.target = this.target.target || { rawSql: null, datasource: null, target: 'unknown' };
    this.target.type = this.target.type || 'timeserie';

    if (!this.target.target.rawSql) {
      // special handling when in table panel
      if (this.panelCtrl.panel.type === 'table') {
        this.target.type = 'table';
        this.target.target.rawSql = 'SELECT 1';
        this.target.rawQuery = true;
      } else {
        this.target.target.rawSql = this.defaultQuery;
      }
    }
    this.panelCtrl.events.on('data-received', this.onQueryReceived.bind(this), $scope);
    this.panelCtrl.events.on('data-error', this.onQueryError.bind(this), $scope);
  }

  onQueryReceived() {
    this.lastQueryError = null;
  }

  onQueryError(err) {
    console.log(err);
    if (err.data && err.data.error) {
      this.lastQueryError = err.data.error;
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
