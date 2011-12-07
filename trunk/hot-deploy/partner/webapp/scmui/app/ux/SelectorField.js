//选择字段，必须覆盖storeName
Ext.define('SCM.ux.SelectorField', {
    extend: 'Ext.form.field.Trigger',
	alias: 'widget.selectorfield',
	storeName: undefined,
	record:undefined,//字段对象，保存选择的model
	displayField:'name',//显示字段
	initComponent: function() {
		this.valueField='id';
		this.displayField='name';
		this.callParent(arguments);
	},
	selectorColumns: [//默认选择列
 					{
						xtype: 'gridcolumn',
						dataIndex: 'id',
						text: 'id'
					},
					{
						xtype: 'gridcolumn',
							dataIndex: 'number',
							text: '编号'
						},
						{
							xtype: 'gridcolumn',
							dataIndex: 'name',
							text: '名称'
						}
					]
	,
	//触发选择动作
	onTriggerClick: function(event) {
		if(this.storeName== undefined||typeof(this.storeName)!='string'){
			return ;
		}
		var gridStore=Ext.create(this.storeName);
		var win=Ext.create('Ext.window.Window',
		{title:'选择框',
		 height: 383,
		 width: 523,
		 id:'selectorwin',//定义唯一id
					layout: {
						type: 'border'
					},
			        modal:true,
					store:gridStore,
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
								name:'btnSure',
								width: 50,
								text: '确定'
							},
							{
								xtype: 'button',
								width: 50,
								name:'btnCancel',
								text: '取消'
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
							store: gridStore,
							columns: this.selectorColumns
						}
					]
		});
		gridStore.load();
		win.show();

	}

});