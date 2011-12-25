/*
 * 定义物料Bom列表界面
 * Mark
 */
Ext.define('SCM.view.${TemplateName}.ListUI' ,{
    extend: 'Ext.container.Container',
    alias : 'widget.${TemplateName}list',

    title : '${TemplateName}',
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
					store:'${TemplateName}.${TemplateName}Store',
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
						#foreach($headfield in $HeadFields)
						#if($headfield.isListVisible==true&&$headfield.type!='entity')//\n
						,{
							#if($headfield.type=='string')//\n
							xtype: 'gridcolumn'
							#end
							#if($headfield.type=='int')//\n
							xtype: 'numbercolumn'
							,format:'0'
							#end
							#if($headfield.type=='float')//\n
							xtype: 'numbercolumn'
							#end
							#if($headfield.type=='boolean')//\n
							xtype: 'booleancolumn'
							,trueText:'是'
							,falseText:'否'
							#end
							#if($headfield.type=='date')//\n
							xtype: 'datecolumn'
							,format : 'Y-m-d'
							#end//\n
							,dataIndex: '$headfield.name'
							,width:150
							,groupable: false
                            ,text: '$headfield.alias'
                        }
						#elseif($headfield.isListVisible==true&&$headfield.type=='entity')//\n
						,{
							xtype:'gridcolumn'
							,dataIndex: '${headfield.name}${headfield.entity}Name'
							,width:150
							,groupable: false
                            ,text: '$headfield.alias'
                        }
						#end 
						#end //\n
						,{
                            xtype: 'gridcolumn',
                            dataIndex: 'entryId',
							width:150,
							groupable: false,
                            text: '分录id'
                        }
						#foreach($entryfield in $EntryFields)
						#if($entryfield.isListVisible==true&&$entryfield.type!='entity')//\n
						,{
							#if($entryfield.type=='string')//\n
							xtype: 'gridcolumn'
							#end
							#if($entryfield.type=='int')//\n
							xtype: 'numbercolumn'
							#end
							#if($entryfield.type=='float')//\n
							xtype: 'numbercolumn'
							#end
							#if($entryfield.type=='boolean')//\n
							xtype: 'booleancolumn'
							,trueText:'是'
							,falseText:'否'
							#end
							#if($entryfield.type=='date')//\n
							xtype: 'datecolumn'
							,format : 'Y-m-d'
							#end//\n
							,dataIndex: '$entryfield.name'
							,width:150
							,groupable: false
                            ,text: '$entryfield.alias'
                        }
						#elseif($entryfield.isListVisible==true&&$entryfield.type=='entity')//\n
						,{
							xtype:'gridcolumn'
							,dataIndex: '${entryfield.name}${entryfield.entity}Name'
							,width:150
							,groupable: false
                            ,text: '$entryfield.alias'
                        }
						#end 
						#end //\n
							
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
