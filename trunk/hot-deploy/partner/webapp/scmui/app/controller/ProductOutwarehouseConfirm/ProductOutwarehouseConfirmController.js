Ext.define('SCM.controller.ProductInwarehouseConfirm.ProductInwarehouseConfirmController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter'],
			views : ['ProductInwarehouseConfirm.ListUI', 'ProductInwarehouseConfirm.DetailEditUI'],
			stores : ['ProductInwarehouseConfirm.ProductInwarehouseConfirmStore','ProductInwarehouseConfirm.ProductInwarehouseConfirmDetailStore'],
			
			init : function() {
				this.control({
							'ProductInwarehouseConfirmlist' : {
								afterrender : this.initComponent
							},
							// 列表删除按钮
							'ProductInwarehouseConfirmlist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'ProductInwarehouseConfirmlist button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表审核按钮
							'ProductInwarehouseConfirmlist button[action=submit]' : {
								click : this.submitBill
							},
							// 列表反审核按钮
							'ProductInwarehouseConfirmlist button[action=rollback]' : {
								click : this.rollbackBill
							}
						});
			},
			
			/**
			 * 初始化方法
			 */
			initComponent : function(view) {
				this.listContainer = view;
				this.listPanel = view.down('gridpanel[region=center]');
				this.searchStartDate = this.listContainer.down('datefield[name=searchStartDate]');
				this.searchEndDate = this.listContainer.down('datefield[name=searchEndDate]');
				this.searchMaterialId = this.listContainer.down('combogrid[name=searchMaterialId]');
				this.searchStatus = this.listContainer.down('combobox[name=status]');
				//重新更新仓库数据
				Ext.data.StoreManager.lookup('WHComboInitStore').load();
				
				//更新物料
				Ext.data.StoreManager.lookup('MWHComboInitStore').load();
				
				//耗料编辑
				this.detailEditWin = Ext.widget('ProductInwarehouseConfirmDetailEdit');
				this.detailEditEntry = this.detailEditWin.down('gridpanel');
				
				this.detailEditEntry.addListener('edit', this.detailEntryEditAction, this); 
			},
			
			/**
			 * 根据状态设置编辑界面状态
			 * 
			 * @param {}
			 *            isReadOnly
			 */
			changeEditStatus : function(record) {
				if (record.get('status') == '0') {
					this.setFieldsReadOnly(false);
					this.setGridEditAble(true);
					this.saveButton.setDisabled(false);
					this.clearButton.setDisabled(false);
					this.submitEditButton.setDisabled(false);
					this.viewDetailButton.setVisible(false);
					this.editDetailButton.setVisible(true);
				} else {
					this.setFieldsReadOnly(true);
					this.setGridEditAble(false);
					this.saveButton.setDisabled(true);
					this.clearButton.setDisabled(true);
					this.submitEditButton.setDisabled(true);
					this.viewDetailButton.setVisible(true);
					this.editDetailButton.setVisible(false);
				}
			},

			/**
			 * 设置分录列表是否可编辑
			 * 
			 * @param {}
			 *            editAble
			 */
			setGridEditAble : function(editAble) {
				this.addLineButton.setDisabled(!editAble);
				this.deleteLineButton.setDisabled(!editAble);
				Ext.each(this.allColumn, function(item, index, length) {
							if (item.getEditor()) {
								item.getEditor().setDisabled(!editAble);
							}
						})
			},
			
			/**
			 * 查看加工件耗料情况
			 */
			viewDetailList : function() {
				var sm = this.listPanel.getSelectionModel();
				if (sm.hasSelection()) {// 判断是否选择行记录
					record = sm.getLastSelected();
					
					/*如果单据为已提交，或者审核，则不能编辑*/
					if(record.get('status')=='4'){
						this.detailEntry.store.getProxy().extraParams.whereStr = "parent_id = '" + record.get('id') + "'";
						this.detailEntry.store.load();
						this.detailWin.show();
					}else{//编辑耗料
						this.currentRecord = record;
						this.detailEditWin.uiStatus = 'Modify';
						
						this.detailEditEntry.store.removeAll(false);
						// 获取耗料列表
						this.detailEditEntry.store.getProxy().extraParams.whereStr = 'parent_id = \'' + record.get('id') + '\'';
						this.detailEditEntry.store.load();
						this.detailEditEntry.store.getProxy().extraParams.whereStr = "";
						this.detailEditWin.show();
					}
				} else {
					showWarning('未选中物料！');
				}

			},
			/*
			 * 删除记录
			 * */
			deleteRecord : function(button) {
				record = this.getSelectRecord();
				if (record.get('status') == '1' || record.get('status') == '2') {
					showWarning('单据为已审核状态，不允许删除！');
					return;
				} else if (record.get('status') == '3') {
					showWarning('单据为已结算状态，不允许删除！');
					return;
				} else if (record.get('status') == '4') {
					showWarning('单据为已提交状态，不允许删除！');
					return;
				}

				Ext.Msg.confirm('提示', '确定删除该记录？', confirmChange, this);
				function confirmChange(id) {
					if (id == 'yes') {
						this.listPanel.store.remove(record);
						this.listPanel.store.sync();
					}
				}

			},
			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if(this.searchStartDate.getValue()){
					tempString += 'ProductInwarehouseConfirmV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if(this.searchEndDate.getValue()){
					if(tempString != ''){
						if(this.searchStartDate.getRawValue()>this.searchEndDate.getRawValue()){
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return ;
						}
						tempString += ' and ';
					}
					tempString += 'ProductInwarehouseConfirmV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
				if(this.searchMaterialId.getValue() && this.searchMaterialId.getValue() != ''){
					if(tempString != ''){
						tempString += ' and ';
					}
					tempString += 'ProductInwarehouseConfirmV.material_material_id = \'' + this.searchMaterialId.getValue() + '\'';
				}
				if ((this.searchStatus.getValue() && this.searchStatus.getValue() != '') || this.searchStatus.getValue() == 0) {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'ProductInwarehouseConfirmV.status = \'' + this.searchStatus.getValue() + '\'';
				}
				
				this.listPanel.store.getProxy().extraParams.whereStr = tempString;
				this.listPanel.store.load();
				
//				this.changeComponentsState();
			},
			/**
			 * 添加耗料记录
			 */
			detailAddLine:function(){
				var detailRecord = Ext.create('ProductInwarehouseConfirmDetailModel');
				detailRecord.phantom = true;
				// 设置父id
				detailRecord.set('parentId', this.currentRecord.get('id'));
				//默认单价，金额为零
				detailRecord.set('price', 0);
				detailRecord.set('amount', 0);
				this.detailEditEntry.store.add(detailRecord);
			},
			/**
			 * 删除耗料记录
			 */
			detailRemoveLine:function(){
				var selMod = this.detailEditEntry.getSelectionModel();
				if (selMod != null&&selMod.getLastSelected()!=null) {
					this.detailEditEntry.store.remove(selMod.getLastSelected());
				}else{
					showWarning('请选择分录');
				}
				
			},
			/**
			 * 保存额外耗料列表
			 * 
			 * @param {}
			 *            button 保存按钮
			 */
			saveDetailRecord : function(button) {
				var me = this;
				me.detailEditEntry.store.sync({
							callback : function(batch, options) {
								if (!batch.hasException) {
									if (me.detailEditWin.isVisible()) {
										me.detailEditWin.close();
									}
									Ext.Msg.alert("提示", "保存成功！");
								}
							}
						});
			},

			/**
			 * 取消编辑
			 */
			cancelDetail : function() {
				this.detailEditWin.close();
			},
			
			/**
			 * 耗料明细编辑事情
			 */
			detailEntryEditAction : function(editor, e){
				//自动填写规格型号和计量单位
				if (e.field == 'materialId') {
					var record = Ext.data.StoreManager.lookup('MWHComboInitStore').findRecord('id', e.value);
					if (record) {
						e.record.set('model', record.get('model'));
						e.record.set('unitUnitId', record.get('defaultUnitId'));

					}
				}
			},
			/**
			 * 获取当前操作的Record
			 * 
			 * @return {}
			 */
			getSelectRecord : function() {
				var sm = this.listPanel.getSelectionModel();
				if (sm.hasSelection()) {// 判断是否选择行记录
					return sm.getLastSelected();
				}
			},
			
			
			/**
			 * 返回选择所有记录
			 */
			getAllSelectRecords : function(){
				var sm = this.listPanel.getSelectionModel();
				if (sm.hasSelection()) {// 判断是否选择行记录
					return sm.getSelection();
				}
			},
			
			/**
			 * 提交单据
			 */
			submitBill : function(){
				var records=this.getAllSelectRecords()
				if(records){
					var recordsData=[];
					for(var r in records){
						recordsData.push(records[r].data);
					}
					var json=Ext.encode(recordsData);
					
					Ext.Ajax.request({ 
						scope : this,
						url : "../../scm/control/submitProductInwarehouseConfirm",
						params:{records:json},
						success : function(response, option) {
							if(response.responseText.length<1){
								showError('系统没有返回结果');
							}
				 			var responseArray = Ext.JSON.decode(response.responseText);
				 			if(responseArray.success){
				 				showInfo('成功');
				 			}else{
				 				showError(responseArray.message);
				 			}
						}
					});
					
				}else {
					showWarning('未选中物料！');
				}
				
			}
		});