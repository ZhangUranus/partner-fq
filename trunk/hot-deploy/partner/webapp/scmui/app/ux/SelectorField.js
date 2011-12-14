//选择字段，必须定义storeName、parentFormName、name
Ext.define('SCM.ux.SelectorField', {
    extend: 'Ext.form.field.Trigger',
	alias: 'widget.selectorfield',
	storeName: undefined,
	parentFormName:undefined,//字段所在的form的alias名
	selWinId:undefined,//选择框的
	displayValue:undefined,//显示字段
	initComponent: function() {
		this.valueField='id';
		this.displayField='name';
		this.callParent(arguments);
	},
	valueToRaw:function(value){
		if(this.displayValue!=undefined){
			return this.displayValue;
		}
		return ''+Ext.value(value,'');
	},

	rawToValue:function(rawValue){
		if(this.value!=undefined){
			return this.value;
		}
		return this.rawValue;
	},
	getSubmitValue:function(){
		if(this.value!=undefined){
			return this.value;
		}
		return this.processRawValue(this.getRawValue());
	},
	selectorColumns: [//默认选择列
 					{
						xtype: 'gridcolumn',
						dataIndex: 'id',
						text: 'id',
						hidden:true
					},
					{
						xtype: 'gridcolumn',
							dataIndex: 'number',
							text: '编号'
						},
						{
							xtype: 'gridcolumn',
							dataIndex: 'name',
							text: '名称'
						}
					]
	,
	//触发选择动作
	onTriggerClick: function(event) {
		if(this.parentFormName== undefined||typeof(this.parentFormName)!='string'
		 ||this.name== undefined||typeof(this.name)!='string'){
			Ext.MessageBox.alert('','控件的name或者parentFormName属性定义有错');
			return ;
		}else{//构造唯一选择窗口id  formName-控件name-selWin
			this.selWinId=this.parentFormName+'-'+this.name+'-selWin';
		}

		if(this.storeName== undefined||typeof(this.storeName)!='string'){
			return ;
		}
		var gridStore=Ext.create(this.storeName);
		var win=Ext.create('Ext.window.Window',
	   {title:'选择框',
		height: 383,
		width: 523,
		id:this.selWinId,//定义唯一id
		layout: {
		  type: 'border'
		},
		modal:true,
		store:gridStore,
		dockedItems: [
			{
				xtype: 'toolbar',
				dock: 'bottom',
				items: [
					{
						xtype: 'tbfill'
					},
					{
						xtype: 'button',
						name:'btnSure',
						width: 50,
						text: '确定'
					},
					{
						xtype: 'button',
						width: 50,
						name:'btnCancel',
						text: '取消'
					},
					{
						xtype: 'tbspacer'
					}
				]
			}
		],
					
		items: [
				{
				xtype: 'gridpanel',
				region: 'center',
				store: gridStore,
				columns: this.selectorColumns
				}
		        ]
		});
		gridStore.load();
		win.show();

	}
	
});
	//选择框保存公共方法，设置form字段值
	function selectValwin(button,fieldName,targetForm){
		if(Ext.isEmpty(button)||Ext.isEmpty(fieldName)||Ext.isEmpty(targetForm)){
			return;
		}

		var win=button.up('window');
		var grid=win.down('gridpanel');
		var records=grid.getSelectionModel().getSelection() ;

		var tField=targetForm.down('selectorfield[name='+fieldName+']');//查找编辑界面的控件
		tField.displayValue=records[0].get('name');//设置显示名称
		tField.setValue(records[0].get('id'));//设置value值
		win.close();
	}
    //选择框保存公共方法，根据选择的字段设置id字段和名称字段
	function selectValIdAName(button,idProperty,displayProperty,targetRecord){
		if(Ext.isEmpty(button)||Ext.isEmpty(idProperty)||Ext.isEmpty(displayProperty)||Ext.isEmpty(targetRecord)){
			return;
		}
		var win=button.up('window');
		var grid=win.down('gridpanel');
		var records=grid.getSelectionModel().getSelection() ;
		
		targetRecord.set(displayProperty,records[0].get('name'));//设置显示名称
		targetRecord.set(idProperty,records[0].get('id'));//设置value值
		win.close();
	}
	//选择框取消公共方法
	function cancelSelWin(button){
		var win=button.up('window');
		win.close();
	}