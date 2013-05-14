// 定义数据模型
Ext.define('SCM.model.ProductOutVerify.DeliverNumberModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'DeliverNumberModel',
			// 字段
			fields : [{
						name : 'number',
						type : 'string'
					  }
					 ],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/getDeliverNumber'
				},
				remoteFilter : true
			}
		});