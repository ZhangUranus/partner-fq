/**
 * @Purpose 用户树形model类
 * @author jeff-liu
 * @Date 2011-11-26
 */
Ext.define('SCM.model.system.SystemUserModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'widget.systemUserModel',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'number',
						type : 'string'
					}, {
						name : 'name',
						type : 'string'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read: '../../scm/control/requestJsonData?entity=SystemUser'
				},
				extraParams : {
					queryField : 'number,name'
				}
			}
		});