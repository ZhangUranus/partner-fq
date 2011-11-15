<script type="text/javascript">
Ext.require([
    'Ext.form.*'
]);

Ext.onReady(function() {
	var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToMoveEditor: 1,
        autoCancel: false
    });
    
    Ext.define('PurInWsEntry', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'parentId', type: 'string'},
            { name: 'materialId', type: 'string' },
            { name: 'materialType', type: 'int' },
            { name: 'unit', type: 'int' },
            { name: 'count', type: 'int' },
            { name: 'unitPrice', type: 'float' }
        ]
    });
	
	var purStore = Ext.create('Ext.data.Store', {
        autoDestroy: true,
        model: 'PurInWsEntry',
        proxy: {
            type: 'memory'
        },
        data: [{
    			parentId: 'B20111112001',
				materialId: 'S001',
				materialType: 1,
                unit: 1,
                count: 0,
                unitPrice: 0.1
			}],
        sorters: [{
            property: 'parentId',
            direction: 'ASC'
        }]
    });
    
    var grid = Ext.create('Ext.grid.Panel', {
    	store: purStore,
        width: 780,
        height: 400,
        title: '物料明细列表',
        columns: [
        	{header: '采购单编码',readOnly:true,dataIndex: 'parentId',flex: 1,editor: {allowBlank: false}},
        	{header: '物料编码',dataIndex: 'materialId',editor:{allowBlank: false}},
        	{header: '规格型号',dataIndex: 'materialType',editor: {allowBlank: false}},
        	{header: '单位',dataIndex: 'unit',editor: {allowBlank: false}},
        	{xtype: 'numbercolumn',header: '数量',dataIndex: 'count',format: '0,0',
	            editor: {
	                xtype: 'numberfield',
	                allowBlank: false,
	                minValue: 0
	            }
			}, 
			{xtype: 'numbercolumn',header: '单价',dataIndex: 'unitPrice',format: '￥0,0.00',
	            editor: {
	                xtype: 'numberfield',
	                allowBlank: false,
	                minValue: 0
	            }
			}
		],
        tbar: [{
            text: '添加物料',
            iconCls: 'add',
            handler : function() {
                rowEditing.cancelEdit();

                // Create a model instance
                var r = Ext.create('PurInWsEntry', {
                    parentId: 'B20111112001',
                    materialId: 'S002',
                    materialType: 1,
                    unit: 1,
                    count: 0,
                    unitPrice: 0.1,
                    active: true
                });
				
                purStore.insert(0, r);
                rowEditing.startEdit(0, 0);
            }
        }, {
            itemId: 'removeSource',
            text: '删除物料',
            iconCls: 'delete',
            handler: function() {
            	var sm = grid.getSelectionModel();
                rowEditing.cancelEdit();
                purStore.remove(sm.getSelection());
                if (purStore.getCount() > 0) {
                    sm.select(0);
                }
            },
            disabled: true
        }],
        plugins: [rowEditing],
        listeners: {
            'selectionchange': function(view, records) {
                grid.down('#removeSource').setDisabled(!records.length);
            }
        }
    });
    
	var MyForm = Ext.create('Ext.form.Panel', {
		frame:true,
        title: '新增订单',
        bodyStyle:'padding:5px 5px 0',
        width: 800,
        fieldDefaults: {
            labelAlign: 'top',
            msgTarget: 'side'
        },
        items: [{
            xtype: 'container',
            anchor: '100%',
            layout:'column',
            items:[{
                xtype: 'container',
                columnWidth:.5,
                layout: 'anchor',
                items: [{
                    xtype:'textfield',
                    fieldLabel: '采购单编码',
                    readOnly: true,
                    name: 'parentId',
                    anchor:'96%',
                    value: '20111112001'
                },{
                    xtype:'textfield',
                    fieldLabel: '供应商编码',
                    readOnly: true,
                    name: 'supportId',
                    anchor:'96%',
                    value: 'S001'
                },{
                    xtype:'textfield',
                    fieldLabel: '采购员',
                    name: 'buyer',
                    anchor:'96%'
                }]
            },{
                xtype: 'container',
                columnWidth:.5,
                layout: 'anchor',
                items: [{
                    xtype:'textfield',
                    fieldLabel: '创建时间',
                    readOnly: true,
                    name: 'createTime',
                    anchor:'100%',
                    value: '2011-11-12 13:58:22'
                },{
                    xtype:'textfield',
                    fieldLabel: '供应商名称',
                    name: 'supportName',
                    anchor:'100%'
                },{
                    xtype:'textfield',
                    fieldLabel: 'JSON数据',
                    name:'jsonString',
                    readOnly: true,
                    isHidden: true,
                    anchor:'100%'
                }]
            }]
        },grid],
	    tbar : [
	    	{
	    		text: '保存',
	    		iconCls: 'save',
            	iconAlign: 'left',
            	handler: submit
	    	},{
	    		text: '返回',
	    		iconCls: 'back',
            	iconAlign: 'left'
	    	},{
	    		text: '打印',
	    		iconCls: 'print',
            	iconAlign: 'left'
	    	}]
	});
	
    MyForm.render('form-ct');
	
    function submit() {
    	var jsonStr = "";
    	var parentId = MyForm.getForm().findField("parentId").getValue();
    	var supportId = MyForm.getForm().findField("supportId").getValue();
    	var buyer = MyForm.getForm().findField("buyer").getValue();
    	var createTime = MyForm.getForm().findField("createTime").getValue();
    	var supportName = MyForm.getForm().findField("supportName").getValue();
    	jsonStr+="{'parentId':'"+parentId;
    	jsonStr+="','supportId':'"+supportId;
	    jsonStr+="','buyer':'"+buyer;
	    jsonStr+="','createTime':'"+createTime;
	    jsonStr+="','supportName':'"+supportName;
	    
	    var materialData = "[";
	    for (var i = 0; i < purStore.getCount(); i++) {
　　			var record = purStore.getAt(i);
			if(i!=0){
				materialData+=","
			}
			materialData+="{'parentId':'"+record.get('parentId');
	    	materialData+="','materialId':'"+record.get('materialId');
		    materialData+="','materialType':"+record.get('materialType');
		    materialData+=",'unit':"+record.get('unit');
		    materialData+=",'count':"+record.get('count');
		    materialData+=",'unitPrice':"+record.get('unitPrice');
		    materialData+="}"
		}
		materialData += "]";
		jsonStr+="','materialData':"+materialData;
		jsonStr+="}";
		MyForm.getForm().findField("jsonString").setValue(jsonStr);
		debugger;
		
	    MyForm.getForm().submit({
		         waitMsg: '正在提交数据',
		         waitTitle: '提示',
		         url: 'AddPurchaseOrders',
		         method: 'POST',
		         success: function(form, action) {
		         	Ext.Msg.alert('Success', 'Success');
		         },
		         failure: function(form, action) {
		         	Ext.Msg.alert('failure', 'failure');
		         }
		});
	}
});
</script>

<div id="form-ct"></div>