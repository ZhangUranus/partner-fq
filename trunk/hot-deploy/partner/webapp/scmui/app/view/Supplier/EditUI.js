Ext.define('SCM.view.Supplier.EditUI', {
    extend: 'Ext.window.Window',
    alias : 'widget.Supplieredit',

    width: 290,
    title : '供应商编辑',
    layout: 'fit',
    autoShow: false,
    modal:true,//背景变灰，不能编辑
    inited : false, //初始化标识
	modifyed : false, //修改标识
    uiStatus:'AddNew',
    
	requires: ['SCM.ux.SelectorField'],

    initComponent: function() {
		this.initForm();
		this.initToolbar();
        this.callParent(arguments);
    },
    close : function() {
				this.hide();
				this.inited = false;
				this.modifyed = false;
	},
	//初始化表单
	initForm: function(){
		this.items = [{
							xtype : 'form',
							bodyPadding : 5,
							items : [{
										xtype : 'textfield',
										name : 'id',
										fieldLabel : 'id',
										hidden : true
									}, {
										xtype : 'textfield',
										name : 'number',
										fieldLabel : '编码',
										margin: 5,
										hidden : true
									}, {
										xtype : 'textfield',
										name : 'name',
										fieldLabel : '名称',
										margin: 5,
										allowBlank : false,
										maxLength : 50
									}
																	//\n
								,{
								  //\n
								  xtype: 'textfield'
								  ,fieldLabel: '供应商电话'
								  								  								  								  								  //\n
								   //\n
								  ,name : 'phoneNum'
								  ,margin: 5
								  
								}
																								//\n
								,{
								  //\n
								  xtype: 'textfield'
								  ,fieldLabel: '供应商地址'
								  								  								  								  								  //\n
								   //\n
								  ,name : 'address'
								  ,margin: 5
								  
								}
																 //\n
								]
						}];
    },
    
    //初始化工具栏
    initToolbar:function(){
    	this.dockedItems=[
	    	{xtype:'toolbar',
	    	items:[{xtye:'button',text:'保存',cls:'x-btn-text-icon',icon:'/scmui/images/icons/save.png',action:'save'}
	    			,{xtye:'button',text:'打印',cls:'x-btn-text-icon',icon:'/scmui/images/icons/printer.gif',action:'print'}]
	    	}
    	];
    }

});