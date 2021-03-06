///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import _ from 'lodash';
import { QueryCtrl } from 'app/plugins/sdk';
import './css/query_editor.css!';

const defaultQuery = `SELECT
  value_column AS value,
  UNIX_TIMESTAMP(time_column) AS time_sec,
  metric_column AS metric
FROM yourtable
ORDER BY time_sec ASC
`;

export class BeyondOpsSqlQueryCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.editor.html';
  private lastQueryError = null;
  private generateSql = null;
  private showHelp = false;
  private showLastQuerySQL = false;
  private queryRangeVariables = {};

  defaults = {
  };

  /** @ngInject **/
  constructor($scope, $injector, private templateSrv) {
    super($scope, $injector);
    _.defaultsDeep(this.target, this.defaults);

    this.target.rawSql = this.target.rawSql || null;
    this.target.type = this.target.type || 'timeserie';

    if (!this.target.rawSql) {
      // special handling when in table panel
      if (this.panelCtrl.panel.type === 'table') {
        this.target.type = 'table';
        this.target.rawSql = 'SELECT 1';
        this.target.rawQuery = true;
      } else {
        this.target.rawSql = defaultQuery;
      }
    }
    this.panelCtrl.events.on('data-received', this.onQueryReceived.bind(this), $scope);
    this.panelCtrl.events.on('data-error', this.onQueryError.bind(this), $scope);
  }

  onQueryReceived() {
    this.lastQueryError = null;
    this.generateSql = null;
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

  showHelpPanel() {
    this.showHelp = !this.showHelp;
    this.queryRangeVariables = this.datasource.getRangeVariables(this.panelCtrl);
  }

  debugRefresh() {
    console.log(this.target);
    this.panelCtrl.refresh();
  }

}
