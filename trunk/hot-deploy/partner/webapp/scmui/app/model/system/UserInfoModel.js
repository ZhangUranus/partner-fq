// 定义数据模型
Ext.define('SCM.model.system.UserInfoModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'UserInfoModel',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'userId',
						type : 'string'
					}, {
						name : 'userName',
						type : 'string'
					}, {
						name : 'password',
						type : 'string'
					}, {
						name : 'passwordComfirm',
						mapping : 'password',
						type : 'string',
						defaultValue : ''
					}, {
						name : 'phoneNumber',
						type : 'string',
						defaultValue : ''
					}, {
						name : 'email',
						type : 'string',
						defaultValue : ''
					}, {
						name : 'roles',
						type : 'string',
						defaultValue : 'noUpdate'
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=TSystemUser',
					update : '../../scm/control/updateUserLogin'
				}
			}
		});