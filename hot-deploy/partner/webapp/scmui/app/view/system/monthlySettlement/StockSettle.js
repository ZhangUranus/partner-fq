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
    	console.log('runSettlement');
    },
    /**
     * 反结算
     */
    rollbackSettlement:function(){
    	console.log('rollbackSettlement');
    }
    
});