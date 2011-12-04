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
	//ѡ�����νڵ�ʱ�������б����ݣ���ʾ�ڵ㼰�¼�����
	selectNode: function(me, record, index, eOpts){
		//console.log(this.getMaingrid());
		var gridStore=this.getMaingrid().getStore();
		gridStore.clearFilter();
		//gridStore.filter([{property: "parentId", value: record.data.id}]);//�ù��˷�ʽֻ�ܽ���ȫ����ϲ����ˣ�
		
		gridStore.load({params:{'whereStr':'id =\''+record.data.id+'\'  or parent_Id=\''+record.data.id+'\''}});//ʹ��where�����ַ���
	}

});