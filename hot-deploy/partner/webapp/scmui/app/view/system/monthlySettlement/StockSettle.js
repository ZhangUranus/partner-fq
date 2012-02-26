Ext.define('SCM.view.system.monthlySettlement.StockSettle', {
    extend: 'Ext.container.Container',
    alias: 'widget.stockSettle',
    height: 250,
    width: 400,
    layout: {
        type: 'absolute'
    },
    
        
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
        	items: [
                    {
                        xtype: 'button',
                        componentCls: '',
                        height: 70,
                        width: 110,
                        text: '结算',
                        x: 20,
                        y: 40,
                        handler:this.runSettlement
                    },
                    {
                        xtype: 'button',
                        height: 70,
                        width: 110,
                        text: '反结算',
                        x: 160,
                        y: 40,
                        handler:this.rollbackSettlement
                    }
                ]
        });

        me.callParent(arguments);
    },
    
    /**
     * 结算操作
     */
    runSettlement:function(){
    	Ext.Msg.confirm('提示', '确定结算本月单据？', confirmChange, this);
		function confirmChange(id) {
//			
//			 var taskMask = new Ext.LoadMask(Ext.getBody(), {
//                 msg: '正在进行结算操作....'
//             });
//			 taskMask.show();
			
			Ext.getBody().mask('正在进行结算操作....');
			if (id == 'yes') {
				Ext.Ajax.request({
							scope : this,
							url : "../../scm/control/monthlySettle",
							success : function(response, option) {
								if(response.responseText.length<1){
									taskMask.hide();
									showError("系统错误");
								}
					 			var responseArray = Ext.JSON.decode(response.responseText);
					 			if(responseArray.success){
					 				showInfo('结算操作结束');
					 			}else{
					 				showError(responseArray.message);
					 			}
					 			Ext.getBody().unmask();
								
							}
						});
				
			}else{
				Ext.getBody().unmask();
			}
		}
    },
    /**
     * 反结算
     */
    rollbackSettlement:function(){
    	Ext.Msg.confirm('提示', '确定反结算系统？', confirmChange, this);
		function confirmChange(id) {
			 var taskMask = new Ext.LoadMask(Ext.getBody(), {
                 msg: '正在进行反结算操作....',
                 removeMask: true //完成后移除
             });
			 taskMask.show();
			
			if (id == 'yes') {
				Ext.Ajax.request({ 
							scope : this,
							url : "../../scm/control/rollbackSettle",
							success : function(response, option) {
								if(response.responseText.length<1){
									taskMask.hide();
									showError("系统错误");
								}
					 			var responseArray = Ext.JSON.decode(response.responseText);
					 			if(responseArray.success){
					 				showInfo('结算操作结束');
					 			}else{
					 				showError(responseArray.message);
					 			}
								taskMask.hide();
								
							}
						});
				
			}else{
				taskMask.hide();
			}
		}
    }
    
});