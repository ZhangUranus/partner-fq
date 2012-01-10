// 定义仓库数据模型
Ext.define('SCM.model.basedata.WarehouseModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'WarehouseModel',
			fields : [{// 字段
						name : 'id',
						type : 'string'
					}, {
						name : 'wsTypeId',
						type : 'string'
					}, {
						name : 'warehouseTypeName',
						type : 'string'
					}, {
						name : 'number',
						type : 'string'
					}, {
						name : 'name',
						type : 'string'
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=WarehouseView',
					create : '../../scm/control/addnewJsonData?entity=Warehouse',
					update : '../../scm/control/updateJsonData?entity=Warehouse',
					destroy : '../../scm/control/deleteJsonData?entity=Warehouse'
				}
			}
		});