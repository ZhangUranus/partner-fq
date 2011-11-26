Ext.define('SCM.view.basedata.unit.EditUI', {
    extend: 'Ext.window.Window',
    alias : 'widget.unitedit',

    title : '计量单位',
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