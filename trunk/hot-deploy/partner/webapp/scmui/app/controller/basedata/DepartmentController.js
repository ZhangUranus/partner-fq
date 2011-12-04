Ext.define('SCM.controller.basedata.DepartmentController', {
    extend: 'Ext.app.Controller',
    
	views: [
        'basedata.department.ListUI'
    ],
	
	stores:[
		'basedata.DepartmentStore',
		'basedata.DepartmentTreeStore'
	],
	refs:[
		{ref: 'maingrid',selector: 'departmentinfomaintaince gridpanel'}
	],
	
    init: function() {
		this.control({
			'departmentinfomaintaince treepanel':{
				select:this.selectNode
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
		
		gridStore.load({params:{'whereStr':'id =\''+record.data.id+'\'  or parent_Id=\''+record.data.id+'\''}});//使用where过滤字符串
	}

});