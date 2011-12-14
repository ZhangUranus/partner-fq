Ext.define('SCM.controller.basedata.MaterialController', {
    extend: 'Ext.app.Controller',
    
	views: [
        'basedata.material.ListUI',
		'basedata.material.EditUI'
    ],
	
	stores:[
		'basedata.MaterialTypeTreeStore',
		'basedata.MaterialTypeStore',
		'basedata.MaterialStore'
	],
	refs:[
		{ref: 'materialgrid',selector: 'materialinfomaintaince gridpanel'},
		{ref: 'materialedit',selector: 'materialedit'}
	],
	
    init: function() {
		this.control({
			'materialinfomaintaince treepanel':{
				select:this.selectNode
		     },
			//列表双击事件
	        'materialinfomaintaince gridpanel': {
	    		itemdblclick: this.modifyRecord
	        },
	        //列表新增按钮
	        'materialinfomaintaince button[action=addNew]':{
	        	click: this.addNewRecord
	        },
	        //列表修改按钮
	        'materialinfomaintaince button[action=modify]':{
	        	click: this.editRecord
	        },
	        //列表删除按钮
	        'materialinfomaintaince button[action=delete]':{
	        	click: this.deleteRecord
	        },
			//列表刷新按钮
	        'materialinfomaintaince button[action=refresh]':{
	        	click: this.refresh
	        },
			//编辑界面物料类别字段选择界面确定
			'#materialform-materialTypeId-selWin button[name=btnSure]':{
				click: this.selectMaterialType
			},
			//编辑界面物料类别字段选择界面取消
			'#materialform-materialTypeId-selWin button[name=btnCancel]':{
				click: this.cancelSelWin
			},
			//编辑界面默认计量单位字段选择界面确定
			'#materialform-defaultUnitId-selWin button[name=btnSure]':{
				click: this.selectDefaultUnit
			},
			//编辑界面默认计量单位字段选择界面取消
			'#materialform-defaultUnitId-selWin button[name=btnCancel]':{
				click: this.cancelSelWin
			},
			 //编辑界面保存
	        'materialedit button[action=save]':{
	        	click: this.saveRecord
	        }
			
		}
		);
    },
	//选择树形节点时，更新列表数据
	selectNode: function(me, record, index, eOpts){
		
		var gridStore=this.getMaterialgrid().getStore();
		gridStore.clearFilter();
		//gridStore.filter([{property: "parentId", value: record.data.id}]);//该过滤方式只能进行全部与合并过滤，
		
		gridStore.load({params:{'whereStr':'TMaterialV.material_Type_Id =\''+record.data.id+'\''}});//使用where过滤字符串
	},
	
	//双击编辑
    modifyRecord: function(grid, record){
        var editui=Ext.widget('materialedit');
        editui.uiStatus='Modify';
		var form=editui.down('form');
		this.ajustId2Display(form,record);
    	form.loadRecord(record);
    },
    //修改
    editRecord: function(button){
    	listPanel=this.getMaterialgrid();
    	
    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		record=sm.getLastSelected();
			//获取现在的记录id，通过id加载编辑页面数据
    		var editui=Ext.widget('materialedit');
    		editui.uiStatus='Modify';
			var form=editui.down('form');
			this.ajustId2Display(form,record);
			form.loadRecord(record);
    	}
    },
    //新增
    addNewRecord: function(button){
    	newRecord=Ext.create('MaterialModel');//新增记录
    	var editui=Ext.widget('materialedit');
    	editui.uiStatus='AddNew';
    	editui.down('form').loadRecord(newRecord);
    },
	 //删除记录
    deleteRecord: function(button){
    	listPanel=this.getMaterialgrid();
    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		//删除选择的记录
    		records=sm.getSelection();
    		listPanel.store.remove(records);
    	}
		this.refresh();
    },
	//保存记录
	saveRecord: function(button){
		//取编辑界面
    	var win=this.getMaterialedit();
    	//取表单
    	form=win.down('form');
    	values=form.getValues();

    	var record;
    	if(win.uiStatus=='Modify'){//修改记录
    		record=form.getRecord();
    		record.set(values);
    	}else if(win.uiStatus=='AddNew'){//新增记录
    		record=Ext.create('MaterialModel');
    		record.set(values);
    		this.getMaterialgrid().store.add(record);
    	}
    	
    	win.close();
		this.refresh();
	},
	//调整显示字段，将id字段值设置为displayValue字段值
	ajustId2Display : function(form,record){
		var defaultUnit=form.down('selectorfield[name=defaultUnitId]');
		defaultUnit.displayValue=record.get('defaultUnitName');//默认计量单位
	},
	//刷新
    refresh : function(button){
		listPanel=this.getMaterialgrid();
		listPanel.store.load();
	},
	//物料类别选择框保存
	selectMaterialType:function(button){
		var edit=this.getMaterialedit();
		var form=edit.down('form')
		this.selectValwin(button,'materialTypeId',form);
	},
	//默认计量单位选择框保存
	selectDefaultUnit:function(button){
		var edit=this.getMaterialedit();
		var form=edit.down('form')
		this.selectValwin(button,'defaultUnitId',form);
	},
	//选择框保存公共方法
	selectValwin:function(button,fieldName,targetForm){
		if(Ext.isEmpty(button)||Ext.isEmpty(fieldName)||Ext.isEmpty(targetForm)){
			return;
		}

		var win=button.up('window');
		var grid=win.down('gridpanel');
		var records=grid.getSelectionModel().getSelection() ;

		var parentField=targetForm.down('selectorfield[name='+fieldName+']');//查找编辑界面的上级部门控件
		parentField.displayValue=records[0].get('name');//设置显示名称
		parentField.setValue(records[0].get('id'));//设置value值
		win.close();
	},
	//选择框取消公共方法
	cancelSelWin:function(button){
		var win=button.up('window');
		win.close();
	}
	

});