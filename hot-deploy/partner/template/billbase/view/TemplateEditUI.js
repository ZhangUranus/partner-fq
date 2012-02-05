Ext.define('SCM.view.${TemplateName}.EditUI', {
    extend: 'Ext.window.Window',
    requires: ['SCM.extend.toolbar.SaveToolbar','SCM.extend.toolbar.GridEditToolbar', 'SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
    alias : 'widget.${TemplateName}edit',
	height: 550,
	width: 815,
    title : '${TemplateAlias}',
    layout: 'fit',
    modal:true,//背景变灰，不能编辑
    collapsible : true,
	resizable : false,
	closeAction:'hide',
	uiStatus:'AddNew',
	inited : false,
	modifyed : false,
    initComponent: function() {
    	var me = this;
    	var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		});
		var entryStore=Ext.create('${TemplateName}EditEntryStore');
		
		Ext.applyIf(me, {
					items : [
					  {
						  xtype: 'form',
						  name:'${TemplateName}form',
						  bodyPadding:5,
						  border : 0,
						  layout:'border',
						  items: [
						  //开始container
						{
							xtype: 'container',
							height: 200,
							layout: {
								columns: 3,
								type: 'table'
							},
							region: 'north',
							items: [
								
								 {
								  xtype: 'textfield',
								  name : 'number',
								  margin: 5,
								  fieldLabel: '编码',
								  emptyText : '保存时系统自动生成',
								  readOnly : true
								 }
								,{
								  xtype: 'datefield',
								  name : 'bizDate',
								  margin: 5,
								  format:'Y-m-d',
								  fieldLabel: '日期',
								  allowBlank : false
								}
								#foreach($headfield in $HeadFields)
								#if($headfield.isHidden==false&&$headfield.type!='entity')//\n
								,{
								  #if($headfield.type=='string')//\n
								  xtype: 'textfield'
								  ,fieldLabel: '$headfield.alias'
								  #end
								  #if($headfield.type=='int')//\n
								  xtype: 'numberfield'
								  ,allowDecimals:false
								  ,hideTrigger:true
								  ,fieldLabel: '$headfield.alias'
								  #end
								  #if($headfield.type=='float')//\n
								  xtype: 'numberfield'
								  ,hideTrigger:true
								  ,fieldLabel: '$headfield.alias'
								  #end
								  #if($headfield.type=='boolean')//\n
								  xtype: 'checkboxfield'
								  ,uncheckedValue:false
								  ,inputValue:true
								  ,boxLabel:'$headfield.alias'
								  #end
								  #if($headfield.type=='date')//\n
								  xtype: 'datefield'
								  ,format:'Y-m-d'
								  ,fieldLabel: '$headfield.alias'
								  #end//\n
								   #if($headfield.type=='enum')//\n
								  xtype: 'combobox'
								  ,fieldLabel: '$headfield.alias'
								  ,store:$headfield.enumStore
								  ,displayField:'name'
								  ,valueField:'id'
								  #end//\n
								  ,name : '$headfield.name'
								  ,margin: 5
								  
								}
								#elseif($headfield.isHidden==false&&$headfield.type=='entity')//\n
								,{
								    xtype : 'combogrid',
								    fieldLabel : '${headfield.alias}',
								    name : '${headfield.name}${headfield.entity}Id',
									valueField : 'id',
									displayField : 'name',
									store : Ext.create('${headfield.entity}Store'),
									margin: 5,
									matchFieldWidth:false,
									listConfig : {
										width:185,
										height : SCM.MaxSize.COMBOGRID_HEIGHT,
										columns : [{
													header : '编码',
													dataIndex : 'number',
													width : 100,
													hideable : false
													}, {
													header : '名称',
													dataIndex : 'name',
													width : 80,
													hideable : false
													}]
									}
								}
								#end 
								#end //\n
								,{
								  xtype: 'textarea',
								  name : 'note',
								  margin: 5,
								  fieldLabel: '备注',
								  maxLength : 50,
								  colspan : 3,
								  width : 785
								}
								,{
								  xtype: 'textfield',
								  name : 'id',
								  fieldLabel: 'id',
								  hidden:true
								}
							]
						},
						//开始gridpanel
						{
							xtype: 'gridpanel',
							id : '${TemplateName}-edit-grid',
							region: 'center',
							store: entryStore,
							columns: [
								{
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
								  ,editor: {
											xtype: 'textfield'
										}
								  #end
								  #if($entryfield.type=='int')//\n
								  xtype: 'numbercolumn'
								  ,format:'0'
								  ,editor: {
											xtype: 'numberfield'
											,allowDecimals:false
											,allowBlank: false
											,hideTrigger:true
										}
								  #end
								  #if($entryfield.type=='float')//\n
								  xtype: 'numbercolumn'
								   ,editor: {
											xtype: 'numberfield'
											,allowBlank: false
											,hideTrigger:true
										}
								  #end
								  #if($entryfield.type=='boolean')//\n
								  xtype: 'checkcolumn'
								  , editor: {
										xtype: 'checkbox'
										,cls: 'x-grid-checkheader-editor'
								  }
								  #end
								  #if($entryfield.type=='date')//\n
								  xtype: 'datecolumn'
								  ,format:'Y-m-d'
								  ,editor: {
										xtype: 'datefield'
										,allowBlank: false
										,format: 'Y-m-d'
								   }
								  #end//\n
								  #if($entryfield.type=='enum')//\n
								  xtype: 'gridcolumn'
								  ,renderer:$entryfield.enumRender
								  ,editor: {
										xtype: 'combobox'
										,store:$entryfield.enumStore
										,displayField:'name'
										,valueField:'id'
								   }
								  #end//\n
								  ,dataIndex:'$entryfield.name'
								  ,text: '$entryfield.alias'
								  
								}
								#elseif($entryfield.isHidden==false&&$entryfield.type=='entity')//\n
								,{
								xtype : 'combocolumn'
								,dataIndex : '${entryfield.name}${entryfield.entity}Id'
								,text : '$entryfield.alias'
								,gridId : '${TemplateName}-edit-grid'
								,editor : {
									xtype : 'combogrid',
									valueField : 'id',
									displayField : 'name',
									store : Ext.create('${entryfield.entity}Store'),
									matchFieldWidth : false,
									
									listConfig : {
										width : SCM.MaxSize.COMBOGRID_WIDTH,
										height : SCM.MaxSize.COMBOGRID_HEIGHT,
										columns : [{
													header : '编码',
													dataIndex : 'number',
													width : 100,
													hideable : false
												}, {
													header : '名称',
													dataIndex : 'name',
													width : 80,
													hideable : false
												}]
									}
								}
							 }
								#end 
								#end //\n
							],//end columns
							viewConfig: {

							},
							plugins: [cellEditing],
							//开始工具栏
							dockedItems: [
								{
									xtype : 'gridedittoolbar',
									dock : 'top'
								}
							]//end工具栏
						}//end gridpanel
	                    ,{
							xtype: 'container',
							height: 50,
							layout: {
								columns: 3,
								type: 'table'
								},
							region: 'south',
							items: [
									
							       {
								  xtype: 'datefield'
								  ,name : 'createdStamp'
								  ,format:'Y-m-d H:i:s'
								  ,readOnly:true
								  ,margin: 5
								  ,fieldLabel: '创建时间'
								}
								,{
								  xtype: 'datefield'
								  ,name : 'lastUpdatedStamp'
								  ,margin: 5
								  ,format:'Y-m-d H:i:s'
								  ,readOnly:true
								  ,fieldLabel: '最后更新时间'
								}
								,{
								  xtype: 'combobox'
								  ,store:SCM.store.basiccode.billStatusStore
								  ,name : 'status'
								  ,displayField:'name'
								  ,margin: 5
								  ,valueField:'id'
								  ,readOnly:true
								  ,fieldLabel:'单据状态'
								}
								]
						}
	                  ]
	              }
	          ],
	    dockedItems : [{
						xtype : 'savetoolbar',
						type : 'bill',
						dock : 'bottom'
					}]
		});
    	
        this.callParent(arguments);
    },
    close : function() {
				this.hide();
				this.inited = false;
				this.modifyed = false;
			}

});