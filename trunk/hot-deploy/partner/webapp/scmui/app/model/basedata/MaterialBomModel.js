// 定义数据模型
Ext.define('SCM.model.basedata.MaterialBomModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'MaterialBomModel',
			// 字段
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'emptyId',
						type : 'string'
					}, {
						name : 'number',
						type : 'string'
					}, {
						name : 'materialName',
						type : 'string'
					}, {
						name : 'bomMaterialNum',
						type : 'string'
					}, {
						name : 'bomMaterialModel',
						type : 'string'
					}, {
						name : 'volume',
						type : 'float'
					}, {
						name : 'unitName',
						type : 'string'
					}],
			idProperty : 'emptyId',// 设置一个没用的id，这样才能支持显示多分录
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=MaterialBomListView',
					destroy : '../../scm/control/deleteWithEntry?headEntity=MaterialBom&entryEntity=MaterialBomEntry'
				}
			}
		});