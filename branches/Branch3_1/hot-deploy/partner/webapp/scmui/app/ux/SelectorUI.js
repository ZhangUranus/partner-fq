Ext.define('SCM.ux.SelectorUI', {
    extend: 'Ext.window.Window',
	alias: 'widget.selectorui',
    height: 383,
    width: 523,
    layout: {
        type: 'border'
    },
    title: '选择框',
	modal:true, //
	cancel:true,//是否取消
	selectedValue:{},//选择值
	selectorField:{},//选择框

    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
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
                            width: 50,
                            text: '确定',
							handler: function() {
								var win=this.up('window');
								var grid=win.down('gridpanel');
								var records=grid.getSelectionModel().getSelection() ;
								this.selectorField.value=records[0];//第一条选中记录
								win.close();
							}
                        },
                        {
                            xtype: 'button',
                            width: 50,
                            text: '取消',
							handler: function() {
								var win=this.up('window');
								this.cancel=true;
								win.close();
							}
                        },
                        {
                            xtype: 'tbspacer'
                        }
                    ]
                }
            ],
			items: [
                {
                    xtype: 'gridpanel',
                    region: 'center',
					columns: [
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'string',
                            text: 'String'
                        },
                        {
                            xtype: 'numbercolumn',
                            dataIndex: 'number',
                            text: 'Number'
                        },
                        {
                            xtype: 'datecolumn',
                            dataIndex: 'date',
                            text: 'Date'
                        },
                        {
                            xtype: 'booleancolumn',
                            dataIndex: 'bool',
                            text: 'Boolean'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});