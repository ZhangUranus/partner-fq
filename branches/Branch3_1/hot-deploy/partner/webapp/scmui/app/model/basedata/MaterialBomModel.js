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
						name : 'number',
						type : 'string'
					}, {
						name : 'note',
						type : 'string'
					}, {
						name : 'status',
						type : 'int'
					}, {
						name : 'valid',
						type : 'string'
					}, {
						name : 'bomModel',
						type : 'string'
					}, {
						name : 'bomUnitId',
						type : 'string'
					}, {
						name : 'bomUnitName',
						type : 'string'
					}, {
						name : 'materialId',
						type : 'string'
					}, {
						name : 'materialNumber',
						type : 'string'
					}, {
						name : 'materialName',
						type : 'string'
					}, {
						name : 'bomMaterialId',
						type : 'string'
					}, {
						name : 'bomMaterialName',
						type : 'string'
					}, {
						name : 'bomMaterialModel',
						type : 'string'
					}, {
						name : 'volume',
						type : 'float'
					}, {
						name : 'unitId',
						type : 'string'
					}, {
						name : 'unitName',
						type : 'string'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=MaterialBomListView',
					destroy : '../../scm/control/deleteWithEntry?headEntity=MaterialBom&entryEntity=MaterialBomEntry'
				},
				extraParams : {
					queryField : 'number,materialNumber,materialName,bomMaterialName'
				}
			}
		});