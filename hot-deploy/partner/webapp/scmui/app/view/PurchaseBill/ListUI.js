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
	    var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
			groupHeaderTpl: '单据编码:{name}  (分录数量 {rows.length})',
			groupByText : '用本字段分组',   
			showGroupsText : '显示分组',    
			startCollapsed: false //设置初始分组是否收起  
		});
        Ext.applyIf(me, {
            items: [
                {
                   xtype:'toolbar',//工具栏
    				items:[
				   {text:'新增',cls:'x-btn-text-icon',icon:'/scmui/images/icons/add.png',action:'addNew'},
    		       {text:'修改',cls:'x-btn-text-icon',icon:'/scmui/images/icons/edit.png',action:'modify'},
    		       {text:'删除',cls:'x-btn-text-icon',icon:'/scmui/images/icons/delete.png',action:'delete'},
    		       {text:'刷新',cls:'x-btn-text-icon',icon:'/scmui/images/icons/refresh.png',action:'refresh'}],
					region:'north'
                },
                {
                    xtype: 'gridpanel',
                    title: '',
                    region: 'center',
					store:'PurchaseBill.PurchaseBillStore',
					features: [groupingFeature],
                    columns: [
						{
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
												//\n
						,{
							//\n
							xtype: 'gridcolumn'
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
							,dataIndex: 'myfield5'
							,width:150
							,groupable: false
                            ,text: '自定义字段5'
                        }
												 //\n
						,{
                            xtype: 'gridcolumn',
                            dataIndex: 'entryId',
							width:150,
							groupable: false,
                            text: '分录id'
                        }
												//\n
						,{
							//\n
							xtype: 'gridcolumn'
																																			//\n
							,dataIndex: 'myentryfield1'
							,width:150
							,groupable: false
                            ,text: '自定义字段1'
                        }
																		//\n
						,{
																																			//\n
							xtype: 'datecolumn'
							,format : 'Y-m-d'
							//\n
							,dataIndex: 'myentryfield2'
							,width:150
							,groupable: false
                            ,text: '自定义字段2'
                        }
																		//\n
						,{
																												//\n
							xtype: 'booleancolumn'
							,trueText:'是'
							,falseText:'否'
														//\n
							,dataIndex: 'myentryfield3'
							,width:150
							,groupable: false
                            ,text: '自定义字段3'
                        }
																		//\n
						,{
							xtype:'gridcolumn'
							,dataIndex: 'myentryfield4UnitName'
							,width:150
							,groupable: false
                            ,text: '自定义字段4'
                        }
																		//\n
						,{
																					//\n
							xtype: 'numbercolumn'
																					//\n
							,dataIndex: 'myentryfield5'
							,width:150
							,groupable: false
                            ,text: '自定义字段5'
                        }
																		//\n
						,{
														//\n
							xtype: 'numbercolumn'
																												//\n
							,dataIndex: 'myentryfield6'
							,width:150
							,groupable: false
                            ,text: '自定义字段6'
                        }
												 //\n
							
                    ],
                    viewConfig: {

                    }
                }
            ]
        });
        me.callParent(arguments);

		me.down('gridpanel').store.load();
    }
});
