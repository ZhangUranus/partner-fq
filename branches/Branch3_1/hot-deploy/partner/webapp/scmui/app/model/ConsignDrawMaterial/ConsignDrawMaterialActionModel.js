// 表头，单分录模型
Ext.define('SCM.model.ConsignDrawMaterial.ConsignDrawMaterialActionModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'ConsignDrawMaterialActionModel',
			// 字段
			fields : ['head', 'updateEntrys', 'createEntrys', 'deleteEntrys'],
			proxy : {
				type : 'jsonajax',
				api : {
					create : '../../scm/control/createWithEntry?headEntity=ConsignDrawMaterial&entryEntity=ConsignDrawMaterialEntry',
					update : '../../scm/control/updateWithEntry?headEntity=ConsignDrawMaterial&entryEntity=ConsignDrawMaterialEntry'
				},
				reader : {
					type : 'json',
					root : ''
				},
				writer : {
					root : 'record',
					encode : true
					// 请求服务器时以param参数传进json数据
				}
			}
		});
