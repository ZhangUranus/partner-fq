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
			//�б�˫���¼�
	        'departmentinfomaintaince gridpanel': {
	    		itemdblclick: this.modifyRecord
	        },
	        //�б�������ť
	        'departmentinfomaintaince button[action=addNew]':{
	        	click: this.addNewRecord
	        },
	        //�б��޸İ�ť
	        'departmentinfomaintaince button[action=modify]':{
	        	click: this.editRecord
	        },
	        //�б�ɾ����ť
	        'departmentinfomaintaince button[action=delete]':{
	        	click: this.deleteRecord
	        },
			//�б�ˢ�°�ť
	        'departmentinfomaintaince button[action=refresh]':{
	        	click: this.refreshAll
	        },
			//�༭�����ϼ������ֶ�ѡ�����ȷ��
			'#selectorwin button[name=btnSure]':{
				click: this.selectParent
			},
			//�༭�����ϼ������ֶ�ѡ�����ȡ��
			'#selectorwin button[name=btnCancel]':{
				click: this.cancelParent
			},
			 //�༭���汣��
	        'departmentedit button[action=save]':{
	        	click: this.saveRecord
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
		
		gridStore.load({params:{'whereStr':'DepartmentV.id =\''+record.data.id+'\'  or DepartmentV.parent_Id=\''+record.data.id+'\''}});//ʹ��where�����ַ���
	},
	//˫���༭
    modifyRecord: function(grid, record){
        var editui=Ext.widget('departmentedit');
        editui.uiStatus='Modify';
		this.ajustId2Display(record);
    	editui.down('form').loadRecord(record);
		this.refreshAll();
    },
    //�޸�
    editRecord: function(button){
    	listPanel=this.getMaingrid();
    	
    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//�ж��Ƿ�ѡ���м�¼
    		record=sm.getLastSelected();
			this.ajustId2Display(record);
    		var editui=Ext.widget('departmentedit');
    		editui.uiStatus='Modify';
        	editui.down('form').loadRecord(record);
    	}
		this.refreshAll();
    },
    //����
    addNewRecord: function(button){
    	newRecord=Ext.create('DepartmentModel');//������¼
    	var editui=Ext.widget('departmentedit');
    	editui.uiStatus='AddNew';
    	editui.down('form').loadRecord(newRecord);
		this.refreshAll();
    },
	//ѡ���б���ֵ
	selectParent: function(button){

		var win=button.up('window');
		var grid=win.down('gridpanel');
		var records=grid.getSelectionModel().getSelection() ;
									
		//setValue(records[0].get('name'));//��һ��ѡ�м�¼
		//console.log(records[0].get('name'));
		var edit=this.getDepartmentedit();
		var parentField=edit.down('form').down('selectorfield[name=parentId]');//���ұ༭������ϼ����ſؼ�
		parentField.record=records[0];//����ѡ�����
		parentField.setValue(records[0].get(parentField.displayField));//������ʾ����
		win.close();
	},
	cancelParent: function(button){
		var win=button.up('window');
		win.close();
	},
  //ɾ����¼
    deleteRecord: function(button){
    	listPanel=this.getMaingrid();
    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//�ж��Ƿ�ѡ���м�¼
    		//ɾ��ѡ��ļ�¼
    		records=sm.getSelection();
    		listPanel.store.remove(records);
    	}
		this.refreshAll();
    },
	//�����¼
	saveRecord: function(button){
		//ȡ�༭����
    	var win=this.getDepartmentedit();
    	//ȡ��
    	form=win.down('form');
    	values=form.getValues();

		//����id�ֶ�,�����ʱ����Ҫ����id
		var parentField=form.down('selectorfield[name=parentId]');
		if(parentField.record!=null){
			values.parentId=parentField.record.get('id');
		}

    	var record;
    	if(win.uiStatus=='Modify'){//�޸ļ�¼
    		record=form.getRecord();
    		record.set(values);
    	}else if(win.uiStatus=='AddNew'){//������¼
    		record=Ext.create('DepartmentModel');
    		record.set(values);
    		this.getMaingrid().store.add(record);
    	}
    	
    	win.close();
		this.refreshAll();
	},
	//������ʾ�ֶΣ���id�ֶ�ֵ����Ϊdisplay�ֶ�ֵ
	ajustId2Display : function(record){
		record.set('parentId',record.get('parentDeptName'));//�ϼ�����
	},
	refreshAll : function(button){
		var treegrid=this.getDepttreegrid();
		treegrid.store.load();//��������������������ᴥ��ɾ��������������
		//���grid����
		var gridStore=this.getMaingrid().store;
		gridStore.clearFilter();
		gridStore.load({params:{'whereStr':'DepartmentV.id =\'empty\''}});
	},
	refreshTree : function(button){
		var treegrid=this.getDepttreegrid();
		treegrid.store.load();//��������������������ᴥ��ɾ��������������
		
	}

});