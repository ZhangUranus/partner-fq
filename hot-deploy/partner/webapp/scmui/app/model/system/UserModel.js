/**
 * @Purpose 用户树形model类
 * @author jeff-liu
 * @Date 2011-11-26
 */
Ext.define('SCM.model.system.UserModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'widget.userModel',
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
						type : 'string',
						defaultValue : ''
					}, {
						name : 'passwordComfirm',
						mapping : 'password',
						type : 'string',
						defaultValue : ''
					}, {
						name : 'sex',
						type : 'string',
						defaultValue : '0'
					}, {
						name : 'departmentId',
						type : 'string',
						defaultValue : ''
					}, {
						name : 'position',
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
						name : 'valid',
						type : 'string',
						defaultValue : 'Y'
					}, {//存储角色列表
						name : 'roles',
						type : 'string'
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=TSystemUser',
					create : '../../scm/control/createUserLogin',
					update : '../../scm/control/updateUserLogin',
					destroy : '../../scm/control/deleteUserLogin'
				}
			}
		});