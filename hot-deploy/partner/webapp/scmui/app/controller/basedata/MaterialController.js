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
			//�б�˫���¼�
	        'materialinfomaintaince gridpanel': {
	    		itemdblclick: this.modifyRecord
	        },
	        //�б�������ť
	        'materialinfomaintaince button[action=addNew]':{
	        	click: this.addNewRecord
	        },
	        //�б��޸İ�ť
	        'materialinfomaintaince button[action=modify]':{
	        	click: this.editRecord
	        },
	        //�б�ɾ����ť
	        'materialinfomaintaince button[action=delete]':{
	        	click: this.deleteRecord
	        },
			//�б�ˢ�°�ť
	        'materialinfomaintaince button[action=refresh]':{
	        	click: this.refresh
	        },
			//�༭������������ֶ�ѡ�����ȷ��
			'#materialform-materialTypeId-selWin button[name=btnSure]':{
				click: this.selectMaterialType
			},
			//�༭������������ֶ�ѡ�����ȡ��
			'#materialform-materialTypeId-selWin button[name=btnCancel]':{
				click: this.cancelSelWin
			},
			//�༭����Ĭ�ϼ�����λ�ֶ�ѡ�����ȷ��
			'#materialform-defaultUnitId-selWin button[name=btnSure]':{
				click: this.selectDefaultUnit
			},
			//�༭����Ĭ�ϼ�����λ�ֶ�ѡ�����ȡ��
			'#materialform-defaultUnitId-selWin button[name=btnCancel]':{
				click: this.cancelSelWin
			},
			 //�༭���汣��
	        'materialedit button[action=save]':{
	        	click: this.saveRecord
	        }
			
		}
		);
    },
	//ѡ�����νڵ�ʱ�������б�����
	selectNode: function(me, record, index, eOpts){
		
		var gridStore=this.getMaterialgrid().getStore();
		gridStore.clearFilter();
		//gridStore.filter([{property: "parentId", value: record.data.id}]);//�ù��˷�ʽֻ�ܽ���ȫ����ϲ����ˣ�
		
		gridStore.load({params:{'whereStr':'TMaterialV.material_Type_Id =\''+record.data.id+'\''}});//ʹ��where�����ַ���
	},
	
	//˫���༭
    modifyRecord: function(grid, record){
        var editui=Ext.widget('materialedit');
        editui.uiStatus='Modify';
		var form=editui.down('form');
		this.ajustId2Display(form,record);
    	form.loadRecord(record);
    },
    //�޸�
    editRecord: function(button){
    	listPanel=this.getMaterialgrid();
    	
    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//�ж��Ƿ�ѡ���м�¼
    		record=sm.getLastSelected();
			//��ȡ���ڵļ�¼id��ͨ��id���ر༭ҳ������
    		var editui=Ext.widget('materialedit');
    		editui.uiStatus='Modify';
			var form=editui.down('form');
			this.ajustId2Display(form,record);
			form.loadRecord(record);
    	}
    },
    //����
    addNewRecord: function(button){
    	newRecord=Ext.create('MaterialModel');//������¼
    	var editui=Ext.widget('materialedit');
    	editui.uiStatus='AddNew';
    	editui.down('form').loadRecord(newRecord);
    },
	 //ɾ����¼
    deleteRecord: function(button){
    	listPanel=this.getMaterialgrid();
    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//�ж��Ƿ�ѡ���м�¼
    		//ɾ��ѡ��ļ�¼
    		records=sm.getSelection();
    		listPanel.store.remove(records);
    	}
		this.refresh();
    },
	//�����¼
	saveRecord: function(button){
		//ȡ�༭����
    	var win=this.getMaterialedit();
    	//ȡ��
    	form=win.down('form');
    	values=form.getValues();

    	var record;
    	if(win.uiStatus=='Modify'){//�޸ļ�¼
    		record=form.getRecord();
    		record.set(values);
    	}else if(win.uiStatus=='AddNew'){//������¼
    		record=Ext.create('MaterialModel');
    		record.set(values);
    		this.getMaterialgrid().store.add(record);
    	}
    	
    	win.close();
		this.refresh();
	},
	//������ʾ�ֶΣ���id�ֶ�ֵ����ΪdisplayValue�ֶ�ֵ
	ajustId2Display : function(form,record){
		var defaultUnit=form.down('selectorfield[name=defaultUnitId]');
		defaultUnit.displayValue=record.get('defaultUnitName');//Ĭ�ϼ�����λ
	},
	//ˢ��
    refresh : function(button){
		listPanel=this.getMaterialgrid();
		listPanel.store.load();
	},
	//�������ѡ��򱣴�
	selectMaterialType:function(button){
		var edit=this.getMaterialedit();
		var form=edit.down('form')
		this.selectValwin(button,'materialTypeId',form);
	},
	//Ĭ�ϼ�����λѡ��򱣴�
	selectDefaultUnit:function(button){
		var edit=this.getMaterialedit();
		var form=edit.down('form')
		this.selectValwin(button,'defaultUnitId',form);
	},
	//ѡ��򱣴湫������
	selectValwin:function(button,fieldName,targetForm){
		if(Ext.isEmpty(button)||Ext.isEmpty(fieldName)||Ext.isEmpty(targetForm)){
			return;
		}

		var win=button.up('window');
		var grid=win.down('gridpanel');
		var records=grid.getSelectionModel().getSelection() ;

		var parentField=targetForm.down('selectorfield[name='+fieldName+']');//���ұ༭������ϼ����ſؼ�
		parentField.displayValue=records[0].get('name');//������ʾ����
		parentField.setValue(records[0].get('id'));//����valueֵ
		win.close();
	},
	//ѡ���ȡ����������
	cancelSelWin:function(button){
		var win=button.up('window');
		win.close();
	}
	

});