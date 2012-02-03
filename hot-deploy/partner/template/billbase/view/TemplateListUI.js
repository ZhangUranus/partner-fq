/*
 * 定义物料Bom列表界面
 * Mark
 */
Ext.define('SCM.view.${TemplateName}.ListUI' ,{
    extend: 'Ext.container.Container',
    requires: ['SCM.extend.toolbar.BillBaseToolbar'],
    alias : 'widget.${TemplateName}list',
    title : '${TemplateAlias}查询',
	height: 497,
    width: 718,
    layout: {
        type: 'border'
    },

    initComponent: function() {
        var me = this;
	    var entryStore=Ext.create('${TemplateName}EditEntryStore',{id:'${TemplateName}ListEntry'});

        Ext.applyIf(me, {
            items: [
                {
                	xtype:'billbasetoolbar',//工具栏
                	audit: true,
                	custType : 'customer',
					region:'north'
                },
                {
                    xtype: 'gridpanel',
                    title: '',
                    margin : '1 0 0 0',
                    region: 'center',
					store:'${TemplateName}.${TemplateName}EditStore',
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
								#foreach($entryfield in $EntryFields)
								#if($entryfield.isHidden==false&&$entryfield.type!='entity')//\n
								,{
								  #if($entryfield.type=='string')//\n
								  xtype: 'gridcolumn'
								  #end
								  #if($entryfield.type=='int')//\n
								  xtype: 'numbercolumn'
								  ,format:'0'
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
								  ,format:'Y-m-d'
								  #end//\n
								  #if($entryfield.type=='enum')//\n
								  xtype: 'gridcolumn'
							      ,renderer:$entryfield.enumRender
									#end//\n
								  ,dataIndex:'$entryfield.name'
								  ,text: '$entryfield.alias'
								  
								}
								#elseif($entryfield.isHidden==false&&$entryfield.type=='entity')//\n
								,{
									xtype: 'gridcolumn',
									dataIndex: '${entryfield.name}${entryfield.entity}Name',
									text: '$entryfield.alias'
								}
								#end 
								#end //\n
							]
				}
            ]
        });
        me.callParent(arguments);

		//me.down('gridpanel').store.load();
    }
});
