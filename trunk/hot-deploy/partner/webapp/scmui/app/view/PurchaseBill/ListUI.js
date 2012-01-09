/*
 * 定义物料Bom列表界面
 * Mark
 */
Ext.define('SCM.view.PurchaseBill.ListUI' ,{
    extend: 'Ext.container.Container',
    alias : 'widget.PurchaseBilllist',

    title : 'PurchaseBill',
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
					        ,renderer:Ext.partner.basiccode.billStatusRenderer
							,dataIndex: 'status'
							,width:150
							,groupable: false
                            ,text: '单据状态'
                        }
												//\n
						,{
							//\n
							xtype: 'gridcolumn'
																																			//\n
							//\n
							,dataIndex: 'myfield1'
							,width:150
							,groupable: false
                            ,text: '自定义字段1'
                        }
																														//\n
						,{
																												//\n
							xtype: 'booleancolumn'
							,trueText:'是'
							,falseText:'否'
														//\n
							//\n
							,dataIndex: 'myfield3'
							,width:150
							,groupable: false
                            ,text: '自定义字段3'
                        }
																		//\n
						,{
							xtype:'gridcolumn'
							,dataIndex: 'myfield4UnitName'
							,width:150
							,groupable: false
                            ,text: '自定义字段4'
                        }
																		//\n
						,{
														//\n
							xtype: 'numbercolumn'
							,format:'0'
																												//\n
							//\n
							,dataIndex: 'myfield5'
							,width:150
							,groupable: false
                            ,text: '自定义字段5'
                        }
																		//\n
						,{
																																			//\n
							//\n
							xtype: 'gridcolumn'
					        ,renderer:Ext.partner.basiccode.billStatusRenderer
							//\n
							,dataIndex: 'myField6'
							,width:150
							,groupable: false
                            ,text: '自定义字段6'
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
								  //\n
								  xtype: 'gridcolumn'
								  								  								  								  								  //\n
								  //\n
								  ,dataIndex:'myentryfield1'
								  ,text: '自定义字段1'
								  
								}
																								//\n
								,{
								  								  								  								  								  //\n
								  xtype: 'datecolumn'
								  ,format:'Y-m-d'
								  //\n
								  //\n
								  ,dataIndex:'myentryfield2'
								  ,text: '自定义字段2'
								  
								}
																								//\n
								,{
								  								  								  								  //\n
								  xtype: 'booleancolumn'
								  ,trueText:'是'
								  ,falseText:'否'
								  								  //\n
								  //\n
								  ,dataIndex:'myentryfield3'
								  ,text: '自定义字段3'
								  
								}
																								//\n
								,{
									xtype: 'gridcolumn'
									,dataIndex: 'myentryfield4UnitId'
									,text: 'myentryfield4UnitId'
									,hidden:true
									
								}
								,{
									xtype: 'gridcolumn',
									dataIndex: 'myentryfield4UnitName',
									text: '自定义字段4',
									editor:{
											  xtype: 'selectorfield',
											  storeName:'UnitStore',//定义数据集名称
											  parentFormName:'PurchaseBillform',
											  name : 'myentryfield4UnitName'
										   }
									
								}
																								//\n
								,{
								  								  								  //\n
								  xtype: 'numbercolumn'
								  								  								  //\n
								  //\n
								  ,dataIndex:'myentryfield5'
								  ,text: '自定义字段5'
								  
								}
																								//\n
								,{
								  								  //\n
								  xtype: 'numbercolumn'
								  ,format:'0'
								  								  								  								  //\n
								  //\n
								  ,dataIndex:'myentryfield6'
								  ,text: '自定义字段6'
								  
								}
																								//\n
								,{
								  								  								  								  								  //\n
								  //\n
								  xtype: 'gridcolumn'
							      ,renderer:Ext.partner.basiccode.billStatusRenderer
									//\n
								  ,dataIndex:'myentryfield7'
								  ,text: '自定义字段7'
								  
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
