/**
 * @Purpose 角色model
 * @author jeff-liu
 * @Date 2011-11-26
 */
Ext.define('SCM.model.system.LogModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'LogModel',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'hitTime',
						type : 'date',
						dateFormat : 'time'
					}, {
						name : 'hitType',
						type : 'string'
					}, {
						name : 'runningTime',
						type : 'string'
					}, {
						name : 'userId',
						type : 'string'
					}, {
						name : 'url',
						type : 'string'
					}, {
						name : 'ipAddress',
						type : 'string'
					}, {
						name : 'hostName',
						type : 'string'
					}, {
						name : 'name',
						type : 'string'
					}, {
						name : 'operateType',
						type : 'string'
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/querySystemLogReport'
				}
			}
		});