/*
 * 定义物料Bom列表界面
 * Mark
 */
Ext.define('SCM.view.PurchaseBill.ListUI' ,{
    extend: 'Ext.container.Container',
    alias : 'widget.PurchaseBilllist',

    title : '采购单查询',
	height: 497,
    width: 718,
    layout: {
        type: 'border'
    },

    initComponent: function() {
        var me = this;
	    var entryStore=Ext.create('PurchaseBillEditEntryStore',{id:'PurchaseBillListEntry'});

        Ext.applyIf(me, {
            items: [
                {
                   xtype:'toolbar',//工具栏
    				items:[
				   {text:'新增',cls:'x-btn-text-icon',icon:'/scmui/images/icons/add.png',action:'addNew'}
    		       ,{text:'修改',cls:'x-btn-text-icon',icon:'/scmui/images/icons/edit.png',action:'modify'}
    		       ,{text:'删除',cls:'x-btn-text-icon',icon:'/scmui/images/icons/delete.png',action:'delete'}
    		       ,{text:'刷新',cls:'x-btn-text-icon',icon:'/scmui/images/icons/refresh.png',action:'refresh'}
    		       ,{text:'审核',cls:'x-btn-text-icon',icon:'/scmui/images/icons/audit.gif',action:'audit'}
    		       ,{text:'反审核',cls:'x-btn-text-icon',icon:'/scmui/images/icons/unaudit.gif',action:'unaudit'}
    		       ,{text:'打印',cls:'x-btn-text-icon',icon:'/scmui/images/icons/printer.gif',action:'print'}],
					region:'north'
                },
                {
                    xtype: 'gridpanel',
                    title: '',
                    region: 'center',
					store:'PurchaseBill.PurchaseBillEditStore',
                    columns: [
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
                            xtype: 'datecolumn',
                            dataIndex: 'bizDate',
							width:150,
							format : 'Y-m-d',
							groupable: false,
                            text: '业务日期'
                        }
                        ,{
							xtype: 'gridcolumn'
					        ,renderer:SCM.store.basiccode.billStatusRenderer
							,dataIndex: 'status'
							,width:150
							,groupable: false
                            ,text: '单据状态'
                        }
												//\n
						,{
							xtype:'gridcolumn'
							,dataIndex: 'supplierSupplierName'
							,width:150
							,groupable: false
                            ,text: '供应商'
                        }
																		//\n
						,{
							xtype:'gridcolumn'
							,dataIndex: 'buyerSystemUserName'
							,width:150
							,groupable: false
                            ,text: '采购员'
                        }
																		//\n
						,{
							xtype:'gridcolumn'
							,dataIndex: 'approverSystemUserName'
							,width:150
							,groupable: false
                            ,text: '审核员'
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

                    }
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
									xtype: 'gridcolumn'
									,dataIndex: 'materialMaterialId'
									,text: 'materialMaterialId'
									,hidden:true
									
								}
								,{
									xtype: 'gridcolumn',
									dataIndex: 'materialMaterialName',
									text: '物料',
									editor:{
											  xtype: 'selectorfield',
											  storeName:'MaterialStore',//定义数据集名称
											  parentFormName:'PurchaseBillform',
											  name : 'materialMaterialName'
										   }
									
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
									xtype: 'gridcolumn'
									,dataIndex: 'unitUnitId'
									,text: 'unitUnitId'
									,hidden:true
									
								}
								,{
									xtype: 'gridcolumn',
									dataIndex: 'unitUnitName',
									text: '单位',
									editor:{
											  xtype: 'selectorfield',
											  storeName:'UnitStore',//定义数据集名称
											  parentFormName:'PurchaseBillform',
											  name : 'unitUnitName'
										   }
									
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
								  ,dataIndex:'refPrice'
								  ,text: '参考单价'
								  
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
							]
				}
            ]
        });
        me.callParent(arguments);

		me.down('gridpanel').store.load();
    }
});
