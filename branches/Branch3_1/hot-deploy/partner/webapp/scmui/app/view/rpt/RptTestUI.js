Ext.define('SCM.view.rpt.RptTestUI', {
			extend : 'Ext.grid.Panel',
			alias:'RptTestUI',
			store : 'SCM.store.rpt.RptTestStore',
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
					columns: [
			                    {
			                        xtype: 'gridcolumn',
			                        dataIndex: 'number',
			                        text: '编号'
			                    },
			                    {
			                        xtype: 'datecolumn',
			                        dataIndex: 'biz_date',
			                        text: '日期'
			                    },
			                    {
			                        xtype: 'gridcolumn',
			                        dataIndex: 'name',
			                        text: '名称'
			                    }
			                ],
			                dockedItems: [
			      	                    {
			      	                        xtype: 'toolbar',
			      	                        dock: 'top',
			      	                        items: [
			      	                            {
			      	                                xtype: 'button',
			      	                                text: '取数',
			      	                                handler: function() {
//			      		                            	 var taskMask = new Ext.LoadMask(Ext.getBody(), {
//			      		                                     msg: '正在进行结算操作....',
//			      		                                     removeMask: true //完成后移除
//			      		                                 });
//			      		                    			 taskMask.show();
//			      		                            	Ext.Ajax.request({
//			      		        							scope : this,
//			      		        							url : "../../scm/control/testRpt",
//			      		        							success : function(response, option) {
//			      		        								if(response.responseText.length<1)showError("系统错误");
//			      		        					 			var responseArray = Ext.JSON.decode(response.responseText);
//			      		        					 			if(responseArray.success){
//			      		        					 				showInfo('结算操作结束');
//			      		        					 			}else{
//			      		        					 				showError(responseArray.message);
//			      		        					 			}
//			      		        					 			taskMask.hide();
//			      		        							}
//			      		        						});	
			      	                                }
			      	                            }
			      	                        ]
			      	                    }
			      	                ]
						});
				this.callParent();
				
				this.store.load();
			}
});