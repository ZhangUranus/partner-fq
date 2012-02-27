// 定义仓库类型数据模型
Ext.define('SCM.model.basedata.WarehouseTypeModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'WarehouseTypeModel',
			fields : [// 字段
			{
						name : 'id',
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
					read : '../../scm/control/requestJsonData?entity=WarehouseType',
					create : '../../scm/control/addnewJsonData?entity=WarehouseType',
					update : '../../scm/control/updateJsonData?entity=WarehouseType',
					destroy : '../../scm/control/deleteJsonData?entity=WarehouseType'
				},
				extraParams : {
					queryField : 'number,name'
				}
			}
		});