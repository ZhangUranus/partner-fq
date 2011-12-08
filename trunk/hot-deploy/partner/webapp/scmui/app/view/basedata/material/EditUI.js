Ext.define('SCM.view.basedata.material.EditUI', {
    extend: 'Ext.window.Window',
    alias : 'widget.materialedit',

    width:350,
    title : '物料',
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
		
    	this.items = [
	              {
	                  xtype: 'form',
					  name:'materialform',
	                  bodyPadding:5,
	                  items: [
						  {
	                          xtype: 'selectorfield',
							  storeName:'SCM.store.basedata.MaterialTypeStore',//定义数据集名称
							  parentFormName:'materialform',
	                          name : 'materialTypeId',
	                          fieldLabel: '物料类别'
	                          
	                      },
	                      {
	                          xtype: 'textfield',
	                          name : 'id',
	                          fieldLabel: 'id',
	                          hidden:true
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
	                      },
						  {
	                          xtype: 'textfield',
	                          name : 'model',
	                          fieldLabel: '规格型号'
	                      },
						  {
	                          xtype: 'numberfield',
	                          name : 'defaultPrice',
							  hideTrigger: true,
	                          fieldLabel: '默认单价'
	                      },
						  {
	                          xtype: 'textfield',
	                          name : 'defaultSupplier',
	                          fieldLabel: '默认供应商'
	                      },
						  {
	                          xtype: 'numberfield',
	                          name : 'safeStock',
							  hideTrigger: true,
	                          fieldLabel: '安全库存'
	                      },
						  {
	                          xtype: 'selectorfield',
							  storeName:'SCM.store.basedata.UnitStore',//定义数据集名称
							  parentFormName:'materialform',
	                          name : 'defaultUnitId',
	                          fieldLabel: '默认计量单位'
	                          
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