System.register(['./datasource', './query_ctrl', './config_ctrl'], function(exports_1) {
    var datasource_1, query_ctrl_1, config_ctrl_1;
    var defaultQuery, BeyondOpsSqlAnnotationsQueryCtrl;
    return {
        setters:[
            function (datasource_1_1) {
                datasource_1 = datasource_1_1;
            },
            function (query_ctrl_1_1) {
                query_ctrl_1 = query_ctrl_1_1;
            },
            function (config_ctrl_1_1) {
                config_ctrl_1 = config_ctrl_1_1;
            }],
        execute: function() {
            defaultQuery = "SELECT\n  round(UNIX_TIMESTAMP(time_column) * 1000) AS time,\n  text_column AS text,\n  tag_column AS tags,\n  title_column AS title\nFROM yourtable\nORDER BY time ASC\n\n";
            BeyondOpsSqlAnnotationsQueryCtrl = (function () {
                /** @ngInject */
                function BeyondOpsSqlAnnotationsQueryCtrl() {
                    this.annotation.rawSql = this.annotation.rawSql || defaultQuery;
                }
                BeyondOpsSqlAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
                return BeyondOpsSqlAnnotationsQueryCtrl;
            })();
            exports_1("BeyondOpsSqlDatasource", datasource_1.default);
            exports_1("Datasource", datasource_1.default);
            exports_1("QueryCtrl", query_ctrl_1.BeyondOpsSqlQueryCtrl);
            exports_1("ConfigCtrl", config_ctrl_1.BeyondOpsSqlConfigCtrl);
            exports_1("AnnotationsQueryCtrl", BeyondOpsSqlAnnotationsQueryCtrl);
        }
    }
});
//# sourceMappingURL=module.js.map