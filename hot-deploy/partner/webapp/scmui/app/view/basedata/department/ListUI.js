/*
 * 定义树形基础资料列表界面
 * Mark
 */
Ext.define('SCM.view.basedata.department.ListUI' ,{
    extend: 'Ext.container.Container',
    alias : 'widget.departmentinfomaintaince',

    title : '部门',
	height: 371,
    width: 540,
    layout: {
        type: 'border'
    },
    
    
    initComponent: function() {
        var me = this;
		//var treeStore=Ext.create('DepartmentTreeStore');
		//var gridStore=Ext.create('DepartmentStore');
		
        Ext.applyIf(me, {
            items: [
                {
	                  xtype: 'form',
					  region: 'center',
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
	              },
                {//树结构
                    xtype: 'treepanel',
                    width: 200,
                    region: 'west',
					border:0,
					rootVisible: false,
					store:'basedata.DepartmentTreeStore'// 树形store
                },
                {
					xtype:'toolbar',//工具栏
    				items:[
				   {text:'新增',cls:'x-btn-text-icon',icon:'/scmui/images/icons/add.png',action:'addNew'},
    		       {text:'修改',cls:'x-btn-text-icon',icon:'/scmui/images/icons/edit.png',action:'modify'},
    		       {text:'删除',cls:'x-btn-text-icon',icon:'/scmui/images/icons/delete.png',action:'delete'},
    		       {text:'刷新',cls:'x-btn-text-icon',icon:'/scmui/images/icons/refresh.png',action:'refresh'}],
					region:'north'
				}
            ]
        });

        me.callParent(arguments);
    },

	//初始化列
	initColumns: function(){
    	 this.columns = [
    	                 {header: 'id',  dataIndex: 'id', width:200,hidden:true},
    	                 {header: '编码',  dataIndex: 'number', width:200},
    	                 {header: '名称', dataIndex: 'name', width:200}
    	 ];
    },
    //初始化工具栏
    initToolBar: function(){
    	
    },
    //初始化数据
    initStore: function(){
    	
    }
});
