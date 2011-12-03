Ext.define('SCM.view.system.user.EditUI', {
    extend: 'Ext.window.Window',
    alias : 'widget.usermanagementedit',

    title : '用户管理',
    layout: 'fit',
    width : 300,
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
	                          name : 'userId',
	                          fieldLabel: '登录名'
	                      },
                          {
                              xtype: 'textfield',
                              name : 'password',
                              fieldLabel: '密码',
                              inputType: 'password'
                          },
                          
	                      {
	                          xtype: 'textfield',
	                          name : 'userName',
	                          fieldLabel: '用户名'
	                      },
	                      {
	                          xtype: 'combobox',
	                          name : 'sex',//定义管理的model字段
	                          fieldLabel: '性别',
	                          store:Ext.partner.basiccode.sexStore,
	                          displayField:'name',//显示字段
	                          valueField: 'id'//值字段，后台通过该字段传递
	                      },
	                      {
	                          xtype: 'textfield',
	                          name : 'departmentId',
	                          fieldLabel: '部门编码'
	                      },
	                      {
	                          xtype: 'textfield',
	                          name : 'position',
	                          fieldLabel: '职位'
	                      },
	                      {
	                          xtype: 'textfield',
	                          name : 'phoneNumber',
	                          fieldLabel: '手机号码'
	                      },
	                      {
	                          xtype: 'textfield',
	                          name : 'email',
	                          fieldLabel: '邮箱'
	                      },{
	                          xtype: 'combobox',
	                          name : 'valid',//定义管理的model字段
	                          fieldLabel: '是否有效',
	                          store:Ext.partner.basiccode.validStore,
	                          displayField:'name',//显示字段
	                          valueField: 'id'//值字段，后台通过该字段传递
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