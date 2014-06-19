// 定义数据模型
Ext.define('SCM.model.ProductOutNotificationModify.CurDeliverNumberModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'CurDeliverNumberModel',
			// 字段
			fields : [{
						name : 'number',
						type : 'string'
					  }
					 ],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/getCurDeliverNumber'
				},
				remoteFilter : true
			}
		});