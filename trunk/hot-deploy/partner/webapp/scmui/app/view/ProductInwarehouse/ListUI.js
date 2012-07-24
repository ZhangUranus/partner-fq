/*
 * 定义物料Bom列表界面
 * Mark
 */
Ext.define('SCM.view.ProductInwarehouse.ListUI' ,{
    extend: 'Ext.container.Container',
    requires : ['SCM.extend.toolbar.BillBaseToolbar', 'SCM.extend.toolbar.BillSearchToolbar'],
    alias : 'widget.ProductInwarehouselist',
    title : '成品进仓单查询',
    layout: {
        type: 'border'
    },

    initComponent: function() {
        var me = this;
	    var entryStore=Ext.create('ProductInwarehouseEditEntryStore',{id:'ProductInwarehouseListEntry'});

        Ext.applyIf(me, {
            items: [
                {
                	xtype:'billbasetoolbar',//工具栏
                	submit: true,
                	custType : 'customer',
					region:'north'
                },
                {
                    xtype: 'gridpanel',
                    margin : '1 0 0 0',
                    title: '',
                    region: 'center',
					store:'ProductInwarehouse.ProductInwarehouseEditStore',
                    columns: [
						{
							 header : '序号',
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
                            xtype: 'datecolumn',
                            dataIndex: 'bizDate',
							width:120,
							format : 'Y-m-d',
							groupable: false,
                            text: '业务日期'
                        }
                        ,{
							xtype: 'gridcolumn'
					        ,renderer:SCM.store.basiccode.billStatusRenderer
							,dataIndex: 'status'
							,width:80
							,groupable: false
                            ,text: '单据状态'
                        }
												//\n
						,{
							xtype:'gridcolumn'
							,dataIndex: 'inspectorSystemUserName'
							,width:150
							,groupable: false
                            ,text: '领料人'
                        }
																		//\n
						,{
							xtype:'gridcolumn'
							,dataIndex: 'submitterSystemUserName'
							,width:150
							,groupable: false
                            ,text: '提交人'
                        }
																		//\n
						,{
																					//\n
							xtype: 'numbercolumn'
																					//\n
							//\n
							,dataIndex: 'totalsum'
							,width:150
							,groupable: false
                            ,text: '总金额'
                        }
												 //\n

                    ],
                    viewConfig: {

                    },
	                dockedItems: [{
						xtype : 'billsearchtoolbar',// 工具栏
						custType : 'workshop',
						border : '0 1 1 1'
					}, {
						dock : 'bottom',
						xtype : 'pagingtoolbar',
						store : 'ProductInwarehouse.ProductInwarehouseEditStore',
						displayInfo : true
					}]
                }//end gridpanel
				,{
                    xtype: 'gridpanel',
                    title: '',
                    region: 'south',
					height:150,
					split: true,
					store:entryStore,
					columns: [
								{
									 header : '序号',
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
									dataIndex: 'parentId',
									text: 'parentId',
									hidden:true

								}
																//\n
								,{
									xtype: 'gridcolumn',
									dataIndex: 'workshopWorkshopName',
									text: '车间'
								}
																								//\n
								,{
									xtype: 'gridcolumn',
									dataIndex: 'warehouseWarehouseName',
									text: '仓库'
								}
																								//\n
								,{
									xtype: 'gridcolumn',
									dataIndex: 'materialMaterialName',
									text: '物料'
								}
																								//\n
								,{
								  								  								  //\n
								  xtype: 'numbercolumn'
								  								  								  //\n
								  //\n
								  ,dataIndex:'volume'
								  ,text: '数量'
								  
								}
																								//\n
								,{
									xtype: 'gridcolumn',
									dataIndex: 'unitUnitName',
									text: '单位'
								}
																								//\n
								,{
								  								  								  //\n
								  xtype: 'numbercolumn'
								  								  								  //\n
								  //\n
								  ,dataIndex:'price'
								  ,text: '单价'
								  
								}
																								//\n
								,{
								  								  								  //\n
								  xtype: 'numbercolumn'
								  								  								  //\n
								  //\n
								  ,dataIndex:'entrysum'
								  ,text: '金额'
								  
								}
																								//\n
								,{
								  //\n
								  xtype: 'gridcolumn'
								  								  								  								  								  //\n
								  //\n
								  ,dataIndex:'barcode1'
								  ,text: '条码1'
								  
								}
																								//\n
								,{
								  //\n
								  xtype: 'gridcolumn'
								  								  								  								  								  //\n
								  //\n
								  ,dataIndex:'barcode2'
								  ,text: '条码2'
								  
								}
																								//\n
								,{
								  								  								  								  								  //\n
								  //\n
								  xtype: 'gridcolumn'
							      ,renderer:SCM.store.basiccode.productInStatusRenderer
									//\n
								  ,dataIndex:'inwarehouseType'
								  ,text: '进仓类型'
								  
								}
																 //\n
							]
				}
            ]
        });
        me.callParent(arguments);

		//me.down('gridpanel').store.load();
    }
});
