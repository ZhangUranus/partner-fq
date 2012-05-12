Ext.define('SCM.view.print.TemplateSelector', {
    extend: 'Ext.window.Window',
    height: 266,
    width: 231,
    modal : true,// 背景变灰，不能编辑
    layout: {
        type: 'border'
    },
    title: '打印模板选择',
    callbackScope:{},//回调函数上下文
    callbackFunc:{},//选择后调用的回调函数
    selectedData:[],//选择值
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'radiogroup',
                    margin : 3,
                    layout: {
                        align: 'stretch',
                        type: 'vbox'
                    },
                    region: 'center',
                    items: [
                        
                    ]
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        {
                            xtype: 'tbfill'
                        },
                        {
                            xtype: 'button',
                            text: '打印',
                            handler:function(){
                        		me.selectedData=me.down('radiogroup').getValue();
                        		me.hide();
                        		me.invokeCallback();
                        	}
                        },
                        {
                            xtype: 'button',
                            text: '取消',
                            handler:function(){
                    			me.hide();
                    		}
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    },
    /**
     * 设置回调上下文和回调函数
     */
    registerCallback:function(scope,callback){
    	this.callbackScope=scope;
    	this.callbackFunc=callback;
    },
    
    /**
     * 调用回调函数
     */
    invokeCallback :function(){
    	this.callbackFunc.call(this.callbackScope,this.selectedData);
    }
});