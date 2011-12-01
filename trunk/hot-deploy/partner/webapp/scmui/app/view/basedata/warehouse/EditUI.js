Ext.define('SCM.view.basedata.warehouse.EditUI', {
    extend: 'Ext.window.Window',
    alias : 'widget.warehouseedit',

    title : '仓库',
    layout: 'fit',
    autoShow: true,
    modal:true,//背景变灰，不能编辑
    uiStatus:'AddNew',
    
    initComponent: function() {
		this.initForm();
		this.initToolbar();
        this.callParent(arguments);
    },
   
	//初始化表单
	initForm: function(){

        // 创建一个仓库类型store绑定仓库类型选择框
        var warehouseType = Ext.create('WarehouseTypeStore');
    	this.items = [
	              {
	                  xtype: 'form',
	                  bodyPadding:5,
	                  items: [
	                      {
	                          xtype: 'textfield',
	                          name : 'id',
	                          fieldLabel: 'id',
	                          hidden:true
	                      },
	                      {
	                          xtype: 'combobox',
	                          name : 'warehouseTypeName',//定义管理的model字段
	                          fieldLabel: '仓库类型',
	                          store:warehouseType,
	                          displayField:'name',//显示字段
	                          valueField: 'id'//值字段，后台通过该字段传递
	                      },
	                      {
	                          xtype: 'textfield',
	                          name : 'number',
	                          fieldLabel: '编码'
	                          
	                      },
	                      {
	                          xtype: 'textfield',
	                          name : 'name',
	                          fieldLabel: '名称'
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