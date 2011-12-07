Ext.define('SCM.view.basedata.department.EditUI', {
    extend: 'Ext.window.Window',
    alias : 'widget.departmentedit',

    width:350,
    title : '部门',
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
	                  bodyPadding:5,
	                  items: [
	                      {
	                          xtype: 'textfield',
	                          name : 'id',
	                          fieldLabel: 'id',
	                          hidden:true
	                      },
						  {
	                          xtype: 'selectorfield',
							  storeName:'SCM.store.basedata.DepartmentStore',//定义数据集名称
							  selectorColumns: [//定义选择对话框的列
												{
													xtype: 'gridcolumn',
													dataIndex: 'id',
													text: 'id',
													hidden:true
												},
												{
													xtype: 'gridcolumn',
														dataIndex: 'number',
														text: '部门编号'
													},
													{
														xtype: 'gridcolumn',
														dataIndex: 'name',
														text: '名称'
													}
												],
	                          name : 'parentId',
	                          fieldLabel: '上级部门'
	                          
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