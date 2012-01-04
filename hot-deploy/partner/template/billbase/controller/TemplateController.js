Ext.define('SCM.controller.${TemplateName}.${TemplateName}Controller', {
    extend: 'Ext.app.Controller',
    
	views: [
        '${TemplateName}.ListUI',
		'${TemplateName}.EditUI'
    ],
	
	stores:[
		'${TemplateName}.${TemplateName}Store',
		'${TemplateName}.${TemplateName}EditStore',
		'${TemplateName}.${TemplateName}EditEntryStore'
	],
	refs:[
		{ref: '${TemplateName}list',selector: '${TemplateName}list gridpanel[region=center]'},
		{ref: '${TemplateName}listentry',selector: '${TemplateName}list gridpanel[region=south]'},
		{ref: '${TemplateName}edit',selector: '${TemplateName}edit'},
		{ref: '${TemplateName}editentry',selector: '${TemplateName}edit gridpanel'}
	],
	requires:['SCM.model.${TemplateName}.${TemplateName}ActionModel'],
	
    init: function() {
		this.control({
			//列表新增按钮
	        '${TemplateName}list button[action=addNew]':{
	        	click: this.addNewRecord
	        },
			//列表选择事件，显示明细
	        '${TemplateName}list gridpanel[region=center]': {
	    		select: this.showDetail
	        },
	        //列表修改按钮
	        '${TemplateName}list  button[action=modify]':{
	        	click: this.editRecord
	        },
	        //列表删除按钮
	        '${TemplateName}list  button[action=delete]':{
	        	click: this.deleteRecord
	        },
			//列表界面刷新
			'${TemplateName}list button[action=refresh]':{
	        	click: this.refresh
	        },
			//编辑界面分录新增
	        '${TemplateName}edit  gridpanel button[action=addLine]':{
	        	click: this.addLine
	        },
			//编辑界面分录删除
	        '${TemplateName}edit  gridpanel button[action=deleteLine]':{
	        	click: this.deleteLine
	        },
			
			//编辑界面保存
			'${TemplateName}edit button[action=save]':{
				click: this.saveRecord
			}
			#foreach($headfield in $HeadFields)
			#if($headfield.isHidden==false&&$headfield.type=='entity')//\n
			//编辑界面${headfield.alias}字段选择界面确定
			,'#${TemplateName}form-${headfield.name}${headfield.entity}Id-selWin button[name=btnSure]':{
				click: this.select${headfield.name}${headfield.entity}
			}
			//编辑界面${headfield.alias}字段选择界面取消
			,'#${TemplateName}form-${headfield.name}${headfield.entity}Id-selWin button[name=btnCancel]':{
				click: cancelSelWin
			}
			#end
			#end
			#foreach($entryfield in $EntryFields)
			#if($entryfield.isHidden==false&&$entryfield.type=='entity')//\n
			//编辑界面分录${entryfield.alias}字段选择界面确定
			,'#${TemplateName}form-${entryfield.name}${entryfield.entity}Name-selWin button[name=btnSure]':{
				click: this.select${entryfield.name}${entryfield.entity}
			}
			//编辑界面分录${entryfield.alias}字段选择界面取消
			,'#${TemplateName}form-${entryfield.name}${entryfield.entity}Name-selWin button[name=btnCancel]':{
				click: cancelSelWin
			}
			#end
			#end//\n

		}
		);
    },

	//新增
    addNewRecord: function(button){
    	newRecord=Ext.create('${TemplateName}EditModel');//新增记录
    	var editui=Ext.widget('${TemplateName}edit');
    	editui.uiStatus='AddNew';
		var form=editui.down('form');
    	form.loadRecord(newRecord);
		//清空分录
		grid=form.down('gridpanel');
		grid.store.removeAll(true);

    },
	//修改记录
	editRecord: function(){
		listPanel=this.get${TemplateName}list();
    	sm=listPanel.getSelectionModel();
		
    	if(sm.hasSelection()){//判断是否选择行记录
    		record=sm.getLastSelected();
			//根据选择的id加载编辑界面数据
			var editStore=Ext.create('${TemplateName}EditStore');
			editStore.filter([{property: "id", value: record.data.id}]);
			editStore.load({
				scope   : this,
				callback: function(records, operation, success) {
					
					var editUI=Ext.widget('${TemplateName}edit');
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
		}else{
    		showError('请选择记录!');
    	}
		
	},
	//显示分录信息
	showDetail: function(me, record,index,eOpts){
		if(record!=null&&record.get("id")!=null){
			var entryStore=this.get${TemplateName}listentry().store;
			if(entryStore!=null){
				entryStore.clearFilter(true);
				entryStore.filter([{property: "parentId", value: record.data.id}]);
				entryStore.load();
			}
		}
	},
	//删除记录
	deleteRecord: function(){
		listPanel=this.get${TemplateName}list();
		//清除新增标记
		newRecords=listPanel.store.getNewRecords();
		for(i in newRecords){
				newRecords[i].phantom=false;
		}

    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		//删除选择的记录
    		records=sm.getSelection();
			
    		listPanel.store.remove(records);
			listPanel.store.proxy.afterRequest=function(request,success){
				if(request.action=='destroy'){
					var store = Ext.data.StoreManager.lookup('${TemplateName}.${TemplateName}Store');
					if(store!=null){
						store.load();//刷新界面
					}
				}
			};
			listPanel.store.sync();
    	}else{
    		showError('请选择记录!');
    	}
	},
	//刷新
	refresh: function(button){
		var listPanel=this.get${TemplateName}list();
    	listPanel.store.load();
    	
    	var entryPanel=this.get${TemplateName}listentry();
    	entryPanel.store.removeAll();
	},
    //保存记录
	saveRecord: function(button){
		//取编辑界面
    	var win=this.get${TemplateName}edit();
    	//取表单
    	form=win.down('form');
    	values=form.getValues();

    	var head;
    	if(win.uiStatus=='Modify'){//修改记录
    		head=form.getRecord();
			head.set(values);
			var entryStore=this.get${TemplateName}editentry().store;
			
			//新建一个复合model
			var oneEntryModel=Ext.create('${TemplateName}ActionModel');
			
			var removed = entryStore.getRemovedRecords();   
			var updated = entryStore.getUpdatedRecords();   
			var newed = entryStore.getNewRecords(); 
			if(head.dirty||removed.length>0||updated.length>0||newed.length>0){
				oneEntryModel=processOneEntryModel(oneEntryModel,head,entryStore);
				oneEntryModel.save();
			}
			
    	}else if(win.uiStatus=='AddNew'){//新增记录
		    
    		head=Ext.create('${TemplateName}EditModel');
    		head.set(values);
			var entryGrid=this.get${TemplateName}editentry();
			
			//新建一个复合model
			var oneEntryModel=Ext.create('${TemplateName}ActionModel');
			
			oneEntryModel=processOneEntryModel(oneEntryModel,head,entryGrid.store);

			oneEntryModel.save();

    	}
    	
    	win.close();
		this.refresh();
		
		
	},
	//新增分录
	addLine:function(button){
		var entryRecord=Ext.create('${TemplateName}EditEntryModel');
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
		var grid=this.get${TemplateName}editentry();
		var selMod= grid.getSelectionModel();
		if(selMod!=null){
			 return selMod.getLastSelected();
		}
	}
	#foreach($headfield in $HeadFields)
	#if($headfield.isHidden==false&&$headfield.type=='entity')//\n
	//表头选择框保存
	,select${headfield.name}${headfield.entity}:function(button){
		var edit=this.get${TemplateName}edit();
		var form=edit.down('form');
		selectValwin(button,'${headfield.name}${headfield.entity}Id',form);
	}
	#end
	#end
	#foreach($entryfield in $EntryFields)
	#if($entryfield.isHidden==false&&$entryfield.type=='entity')//\n
	//表头选择框保存
	,select${entryfield.name}${entryfield.entity}:function(button){
		var sr=this.getSelectedEntry();
		selectValIdAName(button,'${entryfield.name}${entryfield.entity}Id','${entryfield.name}${entryfield.entity}Name',sr);
	}
	#end
	#end//\n
	//调整显示字段，将id字段值设置为displayValue字段值
	,ajustId2Display : function(form,record){
		//示例代码
		//var material=form.down('selectorfield[name=materialId]');
		//material.displayValue=record.get('materialName');//默认物料
		#foreach($headfield in $HeadFields)
		#if($headfield.isHidden==false&&$headfield.type=='entity')//\n
		var ${headfield.name}${headfield.entity}=form.down('selectorfield[name=${headfield.name}${headfield.entity}Id]');
		${headfield.name}${headfield.entity}.displayValue=record.get('${headfield.name}${headfield.entity}Name');
		#end
		#end

	}
	

});