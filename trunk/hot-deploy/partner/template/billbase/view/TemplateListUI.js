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
	    var entryStore=Ext.create('${TemplateName}EditEntryStore',{id:'${TemplateName}ListEntry'});

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
					store:'${TemplateName}.${TemplateName}EditStore',
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
									xtype: 'gridcolumn'
									,dataIndex: '${entryfield.name}${entryfield.entity}Id'
									,text: '${entryfield.name}${entryfield.entity}Id'
									,hidden:true
									
								}
								,{
									xtype: 'gridcolumn',
									dataIndex: '${entryfield.name}${entryfield.entity}Name',
									text: '$entryfield.alias',
									editor:{
											  xtype: 'selectorfield',
											  storeName:'${entryfield.entity}Store',//定义数据集名称
											  parentFormName:'${TemplateName}form',
											  name : '${entryfield.name}${entryfield.entity}Name'
										   }
									
								}
								#end 
								#end //\n
							]
				}
            ]
        });
        me.callParent(arguments);

		me.down('gridpanel').store.load();
    }
});
