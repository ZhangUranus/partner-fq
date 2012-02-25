/*
 * 定义物料Bom列表界面
 * Mark
 */
Ext.define('SCM.view.${TemplateName}.ListUI' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.${TemplateName}list',

    title : '${TemplateAlias}查询',
    store:'${TemplateName}.${TemplateName}EditStore',
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
							#if($headfield.type=='enum')//\n
							xtype: 'gridcolumn'
					        ,renderer:$headfield.enumRender
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
							store : '${TemplateName}.${TemplateName}EditStore',
							displayInfo : true,
							displayMsg : '显示 {0} - {1} 条，共计 {2} 条',
							emptyMsg : '没有数据'
						}];
			}
    
});
