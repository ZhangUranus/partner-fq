Ext.define('SCM.view.basedata.customer.EditUI', {
    extend: 'Ext.window.Window',
    alias : 'widget.customeredit',

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
	                      },
	                      {
	                          xtype: 'textfield',
	                          name : 'address',
	                          fieldLabel: '地址'
	                      },
	                      {
	                          xtype: 'textfield',
	                          name : 'contact',
	                          fieldLabel: '联系人'
	                      },
	                      {
	                          xtype: 'textfield',
	                          name : 'phone',
	                          fieldLabel: '电话'
	                      },
	                      {
	                          xtype: 'textfield',
	                          name : 'fax',
	                          fieldLabel: '传真'
	                      },
	                      {
	                          xtype: 'textfield',
	                          name : 'postCode',
	                          fieldLabel: '邮政编码'
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