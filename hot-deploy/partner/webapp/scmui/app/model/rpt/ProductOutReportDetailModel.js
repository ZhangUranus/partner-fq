// 定义数据模型
Ext.define('SCM.model.rpt.ProductOutReportDetailModel', {
	extend : 'Ext.data.Model',
	alias : 'ProductOutReportDetailModel',
	requires : [ 'SCM.extend.proxy.JsonAjax' ],
	fields : [// 字段
	{
	    name : 'MATERIAL_NAME',
	    type : 'string'
	},{
		name : 'BIZ_DATE',
		type : 'date',
		defaultValue : new Date(),
		convert : function(value, record) {
			return new Date(value);
		}
	}, {
		name : 'GOOD_NUMBER',
		type : 'string'
	}, {
		name : 'VOLUME',
		type : 'float'
	} ],
	proxy : {
		type : 'jsonajax',
		api : {
			read : '../../scm/control/queryProductOutReportDetail'
		}
	}
});