Ext.define('SCM.extend.proxy.JsonAjax', {
			extend : 'Ext.data.proxy.Ajax',
			alias : 'proxy.jsonajax',
			actionMethods : {// 将read方法修改为POST提交，避免中文乱码
				read : 'POST'
			},
			reader : {
				type : 'json',
				root : 'records',
				successProperty : 'success',
				messageProperty : 'message'
			},
			writer : {
				type : 'json',
				root : 'records',
				encode : true
				// 请求服务器时以param参数传进json数据
			},
			constructor : function(config) {
				var me = this;
				config = config || {};
				this.addEvents('afterrequest');
				me.callParent([config]);
			},
			afterRequest : function(request, success) {
				var me = this;
				me.fireEvent('afterRequest', request, success);
			},
			listeners : {
				exception : function(proxy, response, operation) {
					Ext.MessageBox.show({
								title : '服务器端异常',
								msg : operation.getError(),
								icon : Ext.MessageBox.ERROR,
								buttons : Ext.Msg.OK
							});
				}
			}
		})
