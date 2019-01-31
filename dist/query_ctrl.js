///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
System.register(['lodash', 'app/plugins/sdk', './css/query_editor.css!'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var lodash_1, sdk_1;
    var defaultQuery, BeyondOpsSqlQueryCtrl;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            },
            function (_1) {}],
        execute: function() {
            defaultQuery = "SELECT\n  value_column AS value,\n  UNIX_TIMESTAMP(time_column) AS time_sec,\n  metric_column AS metric\nFROM yourtable\nORDER BY time_sec ASC\n";
            BeyondOpsSqlQueryCtrl = (function (_super) {
                __extends(BeyondOpsSqlQueryCtrl, _super);
                /** @ngInject **/
                function BeyondOpsSqlQueryCtrl($scope, $injector, templateSrv) {
                    _super.call(this, $scope, $injector);
                    this.templateSrv = templateSrv;
                    this.lastQueryError = null;
                    this.generateSql = null;
                    this.showHelp = false;
                    this.showLastQuerySQL = false;
                    this.defaults = {};
                    lodash_1.default.defaultsDeep(this.target, this.defaults);
                    this.target.rawSql = this.target.rawSql || null;
                    this.target.type = this.target.type || 'timeserie';
                    if (!this.target.rawSql) {
                        // special handling when in table panel
                        if (this.panelCtrl.panel.type === 'table') {
                            this.target.type = 'table';
                            this.target.rawSql = 'SELECT 1';
                            this.target.rawQuery = true;
                        }
                        else {
                            this.target.rawSql = defaultQuery;
                        }
                    }
                    this.panelCtrl.events.on('data-received', this.onQueryReceived.bind(this), $scope);
                    this.panelCtrl.events.on('data-error', this.onQueryError.bind(this), $scope);
                }
                BeyondOpsSqlQueryCtrl.prototype.onQueryReceived = function () {
                    this.lastQueryError = null;
                    this.generateSql = null;
                };
                BeyondOpsSqlQueryCtrl.prototype.onQueryError = function (err) {
                    console.log(err);
                    if (err.data && err.data.error) {
                        this.lastQueryError = err.data.error;
                    }
                };
                BeyondOpsSqlQueryCtrl.prototype.toggleEditorMode = function () {
                    this.target.rawQuery = !this.target.rawQuery;
                };
                BeyondOpsSqlQueryCtrl.prototype.debugRefresh = function () {
                    console.log(this.target);
                    this.panelCtrl.refresh();
                };
                BeyondOpsSqlQueryCtrl.templateUrl = 'partials/query.editor.html';
                return BeyondOpsSqlQueryCtrl;
            })(sdk_1.QueryCtrl);
            exports_1("BeyondOpsSqlQueryCtrl", BeyondOpsSqlQueryCtrl);
        }
    }
});
//# sourceMappingURL=query_ctrl.js.map