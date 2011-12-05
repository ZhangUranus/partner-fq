
Ext.define('SCM.ux.SelectorField', {
    extend: 'Ext.form.field.Trigger',
	alias: 'widget.selectorfield',
	storeName: undefined,
	initComponent: function() {
		this.valueField='id';
		this.displayField='name';
		this.initGridPanel();
		this.callParent(arguments);
	},

	//初始化选择框列表
	initGridPanel:function(){
		
	},
	//触发选择动作
	onTriggerClick: function() {
		var gridStore=Ext.create('SCM.store.basedata.DepartmentStore');
		var win=Ext.create('Ext.window.Window',
		{title:'选择框',
		 height: 383,
		 width: 523,
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
								width: 50,
								text: '确定',
								handler: function() {
									var win=this.up('window');
									var grid=win.down('gridpanel');
									var records=grid.getSelectionModel().getSelection() ;
									
									this.setValue(records[0].get('name'));//第一条选中记录
									console.log(this.value);
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
							store: gridStore,
							columns: [
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
						}
					]
		});
		gridStore.load();
		//console.log(win);
		console.log('before show');
		win.show();

	}

});