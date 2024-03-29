/**
 * @Purpose 角色model
 * @author jeff-liu
 * @Date 2011-11-26
 */
Ext.define('SCM.model.system.UserOfRoleModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'UserOfRoleModel',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'userId',
						type : 'string'
					}, {
						name : 'roleId',
						type : 'string'
					}],
			idgen : 'uuid', //使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=TSystemUserOfRole'
				}
			}
		});