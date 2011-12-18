Ext.define('SCM.view.basedata.materialbom.EditUI', {
    extend: 'Ext.window.Window',
    alias : 'widget.materialbomedit',

	height: 450,
	width: 600,
    title : '物料BOM',
    layout: 'fit',
    autoShow: true,
    modal:true,//背景变灰，不能编辑
    uiStatus:'AddNew',
    
	requires: ['SCM.ux.SelectorField'],

    initComponent: function() {
		this.initForm();
		this.initToolbar();
        this.callParent(arguments);
    },
    
	//初始化表单
	initForm: function(){
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		});
		var entryStore=Ext.create('MaterialBomEditEntryStore');
    	this.items = [
					  {
						  xtype: 'form',
						  name:'materialform',
						  bodyPadding:5,
						  layout:'border',
						  items: [
						{
							xtype: 'container',
							height: 40,
							layout: {
								columns: 2,
								type: 'table'
							},
							region: 'north',
							items: [
								
								 {
								  xtype: 'textfield',
								  name : 'number',
								  margin: 5,
								  fieldLabel: '编码'
								 },
								{
								  xtype: 'selectorfield',
								  storeName:'SCM.store.basedata.MaterialStore',//定义数据集名称
								  parentFormName:'materialbomform',
								  name : 'materialId',
								  margin: 5,
								  fieldLabel: '物料'
								},
								{
								  xtype: 'textfield',
								  name : 'id',
								  fieldLabel: 'id',
								  hidden:true
								}
							]
						},
						{
							xtype: 'gridpanel',
							region: 'center',
							store: entryStore,
							columns: [
								{
									xtype: 'gridcolumn',
									dataIndex: 'id',
									text: 'id',
									hidden:true
								},
								{
									xtype: 'gridcolumn',
									dataIndex: 'parentId',
									text: 'parentId',
									hidden:true

								},
								{
									xtype: 'gridcolumn',
									dataIndex: 'entryMaterialId',
									text: '物料id',
									hidden:true
									
								},
								{
									xtype: 'gridcolumn',
									dataIndex: 'entryMaterialName',
									text: '物料',
									editor:{
											  xtype: 'selectorfield',
											  storeName:'SCM.store.basedata.MaterialStore',//定义数据集名称
											  parentFormName:'materialbomform',
											  name : 'entryMaterialName'
										   }
									
								},
								{
									xtype: 'numbercolumn',
									dataIndex: 'volume',
									text: '数量',
										editor: {
											xtype: 'numberfield',
											allowBlank: false,
											hideTrigger:true
											
										}
								},
								{
									xtype: 'gridcolumn',
									dataIndex: 'entryUnitId',
									text: '计量单位id',
									hidden:true
									
								},
								{
									xtype: 'gridcolumn',
									dataIndex: 'entryUnitName',
									text: '计量单位',
									editor:{
											  xtype: 'selectorfield',
											  storeName:'SCM.store.basedata.UnitStore',//定义数据集名称
											  parentFormName:'materialbomform',
											  name : 'entryUnitName'
										   }
									
								}
							],
							viewConfig: {

							},
							plugins: [cellEditing],
							dockedItems: [
								{
									xtype: 'toolbar',
									dock: 'top',
									items: [
										{
											xtype: 'button',
											text: '分录新增',
											action: 'addLine'
										},
										{
											xtype: 'button',
											text: '分录删除',
											action: 'deleteLine'
										}
									]
								}
							]
						}
	                      
	                  ]
	              }
	          ];
    },
    
    //初始化工具栏
    initToolbar:function(){
    	this.dockedItems=[
	    	{xtype:'toolbar',
	    	items:[{xtye:'button',text:'保存',cls:'x-btn-text-icon',icon:'/scmui/images/icons/save.png',action:'save'}]
	    	}
    	];
    }

});