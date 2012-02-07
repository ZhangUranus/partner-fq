Ext.define('SCM.controller.ConsignReturnMaterial.ConsignReturnMaterialController', {
	extend : 'Ext.app.Controller',
	mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
	views : ['ConsignReturnMaterial.ListUI', 'ConsignReturnMaterial.EditUI'],
	stores : ['ConsignReturnMaterial.ConsignReturnMaterialStore', 'ConsignReturnMaterial.ConsignReturnMaterialEditStore', 'ConsignReturnMaterial.ConsignReturnMaterialEditEntryStore'],
	requires : ['SCM.model.ConsignReturnMaterial.ConsignReturnMaterialActionModel'],
	gridTitle : '委外退料单',
	editName : 'ConsignReturnMaterialedit',
	editStoreName : 'ConsignReturnMaterialEditStore',
	entityName : 'ConsignReturnMaterial',
	modelName : 'ConsignReturnMaterialEditModel',
	entryModelName : 'ConsignReturnMaterialEditEntryModel',
	actionModelName : 'ConsignReturnMaterialActionModel',
	init : function() {
		this.control({
					'ConsignReturnMateriallist' : {
						afterrender : this.initComponent
					},
					// 列表新增按钮
					'ConsignReturnMateriallist button[action=addNew]' : {
						click : this.addNewRecord
					},
					// 列表事件
					'ConsignReturnMateriallist gridpanel[region=center]' : {
						select : this.showDetail,
						itemdblclick : this.modifyRecord
					},
					// 列表修改按钮
					'ConsignReturnMateriallist button[action=modify]' : {
						click : this.editRecord
					},
					// 列表删除按钮
					'ConsignReturnMateriallist button[action=delete]' : {
						click : this.deleteRecord
					},
					// 列表界面刷新
					'ConsignReturnMateriallist button[action=search]' : {
						click : this.refreshRecord
					},
					// 列表提交按钮
					'ConsignReturnMateriallist button[action=submit]' : {
						click : this.submitBill
					},
					// 列表撤销按钮
					'ConsignReturnMateriallist button[action=rollback]' : {
						click : this.rollbackBill
					},
					// 列表打印按钮
					'ConsignReturnMateriallist button[action=print]' : {
						click : this.print
					},
					// 列表导出
					'ConsignReturnMateriallist button[action=export]' : {
						click : this.exportExcel
					},
					// 编辑界面分录新增
					'ConsignReturnMaterialedit  gridpanel button[action=addLine]' : {
						click : this.addLine
					},
					// 编辑界面分录删除
					'ConsignReturnMaterialedit  gridpanel button[action=deleteLine]' : {
						click : this.deleteLine
					},

					// 编辑界面直接提交
					'ConsignReturnMaterialedit button[action=submit]' : {
						click : this.saveAndSubmitRecord
					},
					// 编辑界面保存
					'ConsignReturnMaterialedit button[action=save]' : {
						click : this.saveRecord
					},
					// 编辑界面打印
					'ConsignReturnMaterialedit button[action=print]' : {
						click : this.print
					},
					// 编辑界面重填
					'ConsignReturnMaterialedit button[action=clear]' : {
						click : this.clear
					},
					// 编辑界面取消
					'ConsignReturnMaterialedit button[action=cancel]' : {
						click : this.cancel
					},
					// 监听各field值变动事件，只监听可见控件
					'ConsignReturnMaterialedit form textfield{isVisible()}' : {
						change : this.fieldChange
					},
					// 角色列表更新事件
					'ConsignReturnMaterialedit grid' : {
						selectionchange : this.fieldChange
					}
				});
	},

	/**
	 * 重新方法，增加查询条件控件的引用
	 */
	afterInitComponent : function() {
		this.searchStartDate = this.listContainer.down('datefield[name=searchStartDate]');
		this.searchEndDate = this.listContainer.down('datefield[name=searchEndDate]');
		this.searchMaterialId = this.listContainer.down('combogrid[name=searchMaterialId]');
		this.searchCustId = this.listContainer.down('combogrid[name=searchCustId]');
		this.totalFields = this.editForm.down('textfield[name=totalsum]');
		this.processorFields = this.editForm.down('combogrid[name=processorSupplierId]');
		// this.processorFields.addListener('change', this.changeProcessor,
		// this);
	},

	/**
	 * 重写刷新方法
	 * 
	 */
	refreshRecord : function() {
		var tempString = '';
		if (this.searchStartDate.getValue()) {
			tempString += 'ConsignReturnMaterialV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
		}
		if (this.searchEndDate.getValue()) {
			if (tempString != '') {
				if (this.searchStartDate.getRawValue() > this.searchEndDate.getRawValue()) {
					showWarning('开始日期不允许大于结束日期，请重新选择！');
					return;
				}
				tempString += ' and ';
			}
			tempString += 'ConsignReturnMaterialV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
		}
		if (this.searchMaterialId.getValue() && this.searchMaterialId.getValue() != '') {
			if (tempString != '') {
				tempString += ' and ';
			}
			tempString += 'ConsignReturnMaterialEntryV.material_material_id = \'' + this.searchMaterialId.getValue() + '\'';
		}
		if (this.searchCustId.getValue() && this.searchCustId.getValue() != '') {
			if (tempString != '') {
				tempString += ' and ';
			}
			tempString += 'ConsignReturnMaterialV.supplier_supplier_id = \'' + this.searchCustId.getValue() + '\'';
		}
		this.listPanel.store.getProxy().extraParams.whereStr = tempString;
		this.listPanel.store.load();
		this.detailPanel.store.removeAll();
		this.changeComponentsState();
	},

	/**
	 * 当用户编辑grid时，同步更新相关表单数据
	 * 
	 * @param {}
	 *            editor
	 * @param {}
	 *            e
	 */
	initMaterialInfo : function(editor, e) {
		if (e.field == 'materialMaterialId') {
			var record = this.searchMaterialId.store.findRecord('id', e.value);
			if (record) {
				e.record.set('materialMaterialModel', record.get('model'));
				// e.record.set('price', this.getAveragePrice());
				e.record.set('unitUnitId', record.get('defaultUnitId'));
				e.record.set('unitUnitName', record.get('defaultUnitName'));

			}
		}
		// e.record.set('entrysum', e.record.get('price') *
		// e.record.get('volume'));
		// this.changeMaterialPrice(e.grid.store);
	}

		// /**
		// * 计算总金额
		// * @param {} store
		// */
		// changeMaterialPrice : function (store){
		// var count = store.getCount();
		// var sum = 0;
		// for (var i = 0; i < count; i++) {
		// sum += store.getAt(i).get('entrysum');
		// }
		// this.totalFields.setValue(sum);
		// },

		// changeProcessor: function(field, newValue, oldValue){
		// var me = this;
		// var count = me.editEntry.store.getCount();
		// for(var i = 0;i<count;i++ ){
		// var tempRecord = me.editEntry.store.getAt(i);
		// tempRecord.set('price', this.getAveragePrice());
		// tempRecord.set('entrysum', tempRecord.get('price') *
		// tempRecord.get('volume'));
		// }
		// me.changeMaterialPrice(me.editEntry.store);
		// }

		// getAveragePrice : function(){
		// return 10;
		// }
	});