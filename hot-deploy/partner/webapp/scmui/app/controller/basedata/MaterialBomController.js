Ext.define('SCM.controller.basedata.MaterialBomController', {
    extend: 'Ext.app.Controller',
    
	views: [
        'basedata.materialbom.ListUI',
		'basedata.materialbom.EditUI'
    ],
	
	stores:[
		'basedata.MaterialBomStore',
		'basedata.MaterialBomEditStore',
		'basedata.MaterialBomEditEntryStore',
	],
	refs:[
		{ref: 'materialbomlist',selector: 'bombillinfomaintaince gridpanel'},
		{ref: 'materialbomedit',selector: 'materialbomedit'},
		{ref: 'materialbomeditentry',selector: 'materialbomedit gridpanel'}
	],
	requires:['SCM.model.basedata.MaterialBomActionModel','SCM.model.basedata.UnitModel'],
	
    init: function() {
		this.control({
			//列表新增按钮
	        'bombillinfomaintaince button[action=addNew]':{
	        	click: this.addNewRecord
	        },
			//列表双击事件
	        'bombillinfomaintaince gridpanel': {
	    		itemdblclick: this.editRecord
	        },
	        //列表修改按钮
	        'bombillinfomaintaince  button[action=modify]':{
	        	click: this.editRecord
	        },
	        //列表删除按钮
	        'bombillinfomaintaince  button[action=delete]':{
	        	click: this.deleteRecord
	        },
			//列表界面刷新
			'bombillinfomaintaince button[action=refresh]':{
	        	click: this.refresh
	        },
			//编辑界面物料类别字段选择界面确定
			'#materialbomform-materialId-selWin button[name=btnSure]':{
				click: this.selectMaterial
			},
			//编辑界面物料类别字段选择界面取消
			'#materialbomform-materialId-selWin button[name=btnCancel]':{
				click: cancelSelWin
			},
			//编辑界面分录新增
	        'materialbomedit  gridpanel button[action=addLine]':{
	        	click: this.addLine
	        },
			//编辑界面分录删除
	        'materialbomedit  gridpanel button[action=deleteLine]':{
	        	click: this.deleteLine
	        },
			//编辑界面分录物料字段选择界面确定
			'#materialbomform-entryMaterialName-selWin button[name=btnSure]':{
				click: this.selectEntryMaterial
			},
			//编辑界面分录物料字段选择界面取消
			'#materialbomform-entryMaterialName-selWin button[name=btnCancel]':{
				click: cancelSelWin
			},
			//编辑界面分录计量单位字段选择界面确定
			'#materialbomform-entryUnitName-selWin button[name=btnSure]':{
				click: this.selectEntryUnit
			},
			//编辑界面分录计量单位字段选择界面取消
			'#materialbomform-entryUnitName-selWin button[name=btnCancel]':{
				click: cancelSelWin
			},
			//编辑界面保存
			'materialbomedit button[action=save]':{
				click: this.saveRecord
			}
		}
		);
    },

	//新增
    addNewRecord: function(button){
    	newRecord=Ext.create('MaterialBomEditModel');//新增记录
    	var editui=Ext.widget('materialbomedit');
    	editui.uiStatus='AddNew';
		var form=editui.down('form');
    	form.loadRecord(newRecord);
		//清空分录
		grid=form.down('gridpanel');
		grid.store.removeAll(true);

    },
	//修改记录
	editRecord: function(){
		listPanel=this.getMaterialbomlist();
    	sm=listPanel.getSelectionModel();
		
    	if(sm.hasSelection()){//判断是否选择行记录
    		record=sm.getLastSelected();
			//根据选择的id加载编辑界面数据
			var editStore=Ext.create('MaterialBomEditStore');
			editStore.filter([{property: "id", value: record.data.id}]);
			editStore.load({
				scope   : this,
				callback: function(records, operation, success) {
					
					var editUI=Ext.widget('materialbomedit');
					editUI.uiStatus='Modify';
					var form=editUI.down('form');
					this.ajustId2Display(form,records[0]);
    				form.loadRecord(records[0]);
					var entryStore=editUI.down('gridpanel').store;
					entryStore.removeAll();//清除记录
					entryStore.filter([{property: "parentId", value: records[0].id}]);//过滤记录
					entryStore.load();
				}
			});
		}
		
	},
	//删除记录
	deleteRecord: function(){
		listPanel=this.getMaterialbomlist();
    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		//删除选择的记录
    		records=sm.getSelection();
    		listPanel.store.remove(records);
			listPanel.store.proxy.afterRequest=function(request,success){
				//this.refresh();
			};
			listPanel.store.sync();
    	}
	},
	//刷新
	refresh: function(button){
		listPanel=this.getMaterialbomlist();
    	listPanel.store.load();
	},
    //保存记录
	saveRecord: function(button){
		//取编辑界面
    	var win=this.getMaterialbomedit();
    	//取表单
    	form=win.down('form');
    	values=form.getValues();

    	var head;
    	if(win.uiStatus=='Modify'){//修改记录
    		head=form.getRecord();
			head.set(values);
			var entryStore=this.getMaterialbomeditentry().store;
			
			//新建一个复合model
			var oneEntryModel=Ext.create('MaterialBomActionModel');
			
			var removed = entryStore.getRemovedRecords();   
			var updated = entryStore.getUpdatedRecords();   
			var newed = entryStore.getNewRecords(); 
			if(head.dirty||removed.length>0||updated.length>0||newed.length>0){
				oneEntryModel=processOneEntryModel(oneEntryModel,head,entryStore);
				oneEntryModel.save();
			}
			
    	}else if(win.uiStatus=='AddNew'){//新增记录
		    
    		head=Ext.create('MaterialBomModel');
    		head.set(values);
			var entryGrid=this.getMaterialbomeditentry();
			
			//新建一个复合model
			var oneEntryModel=Ext.create('MaterialBomActionModel');
			
			oneEntryModel=processOneEntryModel(oneEntryModel,head,entryGrid.store);

			oneEntryModel.save();

    	}
    	
    	win.close();
		this.refresh();
		
		
	},
	//表头物料选择框保存
	selectMaterial:function(button){
		var edit=this.getMaterialbomedit();
		var form=edit.down('form');
		selectValwin(button,'materialId',form);
	},
	//分录物料选择框保存
	selectEntryMaterial:function(button){
		var sr=this.getSelectedEntry();
		selectValIdAName(button,'entryMaterialId','entryMaterialName',sr);
	},
	//分录计量单位选择框保存
	selectEntryUnit:function(button){
		var sr=this.getSelectedEntry();
		selectValIdAName(button,'entryUnitId','entryUnitName',sr);
	},
	//新增分录
	addLine:function(button){
		var entryRecord=Ext.create('MaterialBomEditEntryModel');
		var grid=button.up('gridpanel');
		var form=grid.up('form');

		//设置父id
		entryRecord.set('parentId',form.getValues().id);
		grid.store.add(entryRecord);
	},
	//删除分录
	deleteLine:function(button){
		var grid=button.up('gridpanel');
		grid.store.remove(this.getSelectedEntry());
	},
	//获取选择的分录行
	getSelectedEntry: function(){
		var grid=this.getMaterialbomeditentry();
		var selMod= grid.getSelectionModel();
		if(selMod!=null){
			 return selMod.getLastSelected();
		}
	},
	//调整显示字段，将id字段值设置为displayValue字段值
	ajustId2Display : function(form,record){
		var material=form.down('selectorfield[name=materialId]');
		material.displayValue=record.get('materialName');//默认物料
	}


});