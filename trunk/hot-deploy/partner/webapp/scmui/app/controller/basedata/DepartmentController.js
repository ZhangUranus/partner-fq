Ext.define('SCM.controller.basedata.DepartmentController', {
    extend: 'Ext.app.Controller',
    
	views: [
        'basedata.department.ListUI',
		'basedata.department.EditUI'
    ],
	
	stores:[
		'basedata.DepartmentStore',
		'basedata.DepartmentTreeStore'
	],
	refs:[
		{ref: 'depttreegrid',selector: 'departmentinfomaintaince treepanel'},
		{ref: 'maingrid',selector: 'departmentinfomaintaince gridpanel'},
		{ref: 'departmentedit',selector: 'departmentedit'}
	],
	
    init: function() {
		this.control({
			'departmentinfomaintaince treepanel':{
				select:this.selectNode
		     },
			//列表双击事件
	        'departmentinfomaintaince gridpanel': {
	    		itemdblclick: this.modifyRecord
	        },
	        //列表新增按钮
	        'departmentinfomaintaince button[action=addNew]':{
	        	click: this.addNewRecord
	        },
	        //列表修改按钮
	        'departmentinfomaintaince button[action=modify]':{
	        	click: this.editRecord
	        },
	        //列表删除按钮
	        'departmentinfomaintaince button[action=delete]':{
	        	click: this.deleteRecord
	        },
			//列表刷新按钮
	        'departmentinfomaintaince button[action=refresh]':{
	        	click: this.refreshTree
	        },
			//编辑界面上级部门字段选择界面确定
			'#selectorwin button[name=btnSure]':{
				click: this.selectParent
			},
			//编辑界面上级部门字段选择界面取消
			'#selectorwin button[name=btnCancel]':{
				click: this.cancelParent
			},
			 //编辑界面保存
	        'departmentedit button[action=save]':{
	        	click: this.saveRecord
	        }
		}
		);
    },
	//选择树形节点时，更新列表数据，显示节点及下级数据
	selectNode: function(me, record, index, eOpts){
		//console.log(this.getMaingrid());
		var gridStore=this.getMaingrid().getStore();
		gridStore.clearFilter();
		//gridStore.filter([{property: "parentId", value: record.data.id}]);//该过滤方式只能进行全部与合并过滤，
		
		gridStore.load({params:{'whereStr':'DepartmentV.id =\''+record.data.id+'\'  or DepartmentV.parent_Id=\''+record.data.id+'\''}});//使用where过滤字符串
	},
	//双击编辑
    modifyRecord: function(grid, record){
        var editui=Ext.widget('departmentedit');
        editui.uiStatus='Modify';
		this.ajustId2Display(record);
    	editui.down('form').loadRecord(record);
    },
    //修改
    editRecord: function(button){
    	listPanel=this.getMaingrid();
    	
    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		record=sm.getLastSelected();
			this.ajustId2Display(record);
    		var editui=Ext.widget('departmentedit');
    		editui.uiStatus='Modify';
        	editui.down('form').loadRecord(record);
    	}
    },
    //新增
    addNewRecord: function(button){
    	newRecord=Ext.create('DepartmentModel');//新增记录
    	var editui=Ext.widget('departmentedit');
    	editui.uiStatus='AddNew';
    	editui.down('form').loadRecord(newRecord);
    },
	//选择列表返回值
	selectParent: function(button){

		var win=button.up('window');
		var grid=win.down('gridpanel');
		var records=grid.getSelectionModel().getSelection() ;
									
		//setValue(records[0].get('name'));//第一条选中记录
		//console.log(records[0].get('name'));
		var edit=this.getDepartmentedit();
		var parentField=edit.down('form').down('selectorfield[name=parentId]');//查找编辑界面的上级部门控件
		parentField.record=records[0];//保存选择对象
		parentField.setValue(records[0].get(parentField.displayField));//设置显示名称
		win.close();
	},
	cancelParent: function(button){
		var win=button.up('window');
		win.close();
	},
  //删除记录
    deleteRecord: function(button){
    	listPanel=this.getMaingrid();
    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		//删除选择的记录
    		records=sm.getSelection();
    		listPanel.store.remove(records);
    	}
		this.refreshTree();
    },
	//保存记录
	saveRecord: function(button){
		//取编辑界面
    	var win=this.getDepartmentedit();
    	//取表单
    	form=win.down('form');
    	values=form.getValues();

		//调整id字段,保存的时候是要保存id
		var parentField=form.down('selectorfield[name=parentId]');
		if(parentField.record!=null){
			values.parentId=parentField.record.get('id');
		}

    	var record;
    	if(win.uiStatus=='Modify'){//修改记录
    		record=form.getRecord();
    		record.set(values);
    	}else if(win.uiStatus=='AddNew'){//新增记录
    		record=Ext.create('DepartmentModel');
    		record.set(values);
    		this.getMaingrid().store.add(record);
    	}
    	
    	win.close();
		this.refreshTree();
	},
	//调整显示字段，将id字段值设置为display字段值
	ajustId2Display : function(record){
		record.set('parentId',record.get('parentDeptName'));//上级部门
	},

	refreshAll : function(button){
		var treegrid=this.getDepttreegrid();
		treegrid.store.load();//？？？？调用这个方法会触发删除操作？？？？
		//清空grid数据
		var gridStore=this.getMaingrid().store;
		gridStore.clearFilter();
		gridStore.load({params:{'whereStr':'DepartmentV.id =\'empty\''}});
	},
	refreshTree : function(button){
		var treegrid=this.getDepttreegrid();
		var selectedRecord=treegrid.getSelectionModel().getLastSelected();
		var spath=null;
		if(selectedRecord!=null){
			spath=selectedRecord.getPath();
		}
        
		treegrid.store.load();//？？？？调用这个方法会触发删除操作？？？？
		//恢复上次选择节点
		if(spath!=null){
			treegrid.selectPath(spath);
			console.log(spath);
		}
		
		
	}

});