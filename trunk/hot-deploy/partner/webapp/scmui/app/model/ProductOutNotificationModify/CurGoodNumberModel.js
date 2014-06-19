// 定义数据模型
Ext.define('SCM.model.ProductOutNotificationModify.CurGoodNumberModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'CurGoodNumberModel',
			// 字段
			fields : [{
						name : 'number',
						type : 'string'
					  }
					 ],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/getCurGoodNumber'
				},
				remoteFilter : true
			}
		});