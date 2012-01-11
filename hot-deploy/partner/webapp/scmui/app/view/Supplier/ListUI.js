/*
 * 定义物料Bom列表界面
 * Mark
 */
Ext.define('SCM.view.Supplier.ListUI' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.Supplierlist',

    title : '供应商查询',
    store:'Supplier.SupplierEditStore',
	initComponent : function() {
				this.initColumns();
				this.initToolBar();
				this.callParent(arguments);
				this.store.loadPage(1);
	},

	// 初始化列
			initColumns : function() {
				this.columns = [
						{
                             xtype: 'rownumberer',
							 width: 40
                        }
						,{
                            xtype: 'gridcolumn',
                            dataIndex: 'id',
                            text: 'id',
							hidden:true
                        }
						,{
                            xtype: 'gridcolumn',
                            dataIndex: 'number',
							width:150,
                            text: '编码'
                        }
                        ,{
                            xtype: 'gridcolumn',
                            dataIndex: 'name',
							width:150,
                            text: '名称'
                        }
												//\n
						,{
							//\n
							xtype: 'gridcolumn'
																																			//\n
							//\n
							,dataIndex: 'phoneNum'
							,width:150
							,groupable: false
                            ,text: '供应商电话'
                        }
																		//\n
						,{
							//\n
							xtype: 'gridcolumn'
																																			//\n
							//\n
							,dataIndex: 'address'
							,width:150
							,groupable: false
                            ,text: '供应商地址'
                        }
												 //\n
                    ];
			},
	// 初始化工具栏
			initToolBar : function() {
				this.dockedItems = [{
							xtype : 'toolbar',
							height: 28,
							items : [{
										xtype : 'textfield',
										name : 'keyWord',
										emptyText : '请输入单位名称',
										id : 'keyWord'
									}, {
										text : '查询',
										iconCls : 'system-search',
										action : 'search'
									}, {
										text : '新增',
										iconCls : 'system-add',
										action : 'addNew'
									}, {
										text : '修改',
										iconCls : 'system-edit',
										action : 'modify'
									}, {
										text : '删除',
										iconCls : 'system-delete',
										action : 'delete'
									}, {
										text : '导出',
										iconCls : 'system-export',
										action : 'export'
									}]
						}, {
							dock : 'bottom',
							xtype : 'pagingtoolbar',
							store : 'Supplier.SupplierEditStore',
							displayInfo : true,
							displayMsg : '显示 {0} - {1} 条，共计 {2} 条',
							emptyMsg : '没有数据'
						}];
			}
    
});
