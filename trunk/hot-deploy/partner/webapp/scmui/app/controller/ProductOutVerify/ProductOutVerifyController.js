Ext.define('SCM.controller.ProductOutVerify.ProductOutVerifyController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter'],
			views : ['ProductOutVerify.ListUI'],
			stores : ['ProductOutVerify.ProductOutVerifyHeadStore','ProductOutVerify.ProductOutVerifyEntryStore','ProductOutVerify.DeliverNumberStore'],
			requires : ['SCM.model.ProductOutVerify.ProductOutVerifyActionModel'],
			init : function() {
				this.control({
							'ProductOutVerifyList' : {
								afterrender : this.initComponent
							},
							// 列表查询
							'ProductOutVerifyList button[action=search]' : {
								click : this.searchHead
							},
							'ProductOutVerifyList gridpanel[region=center]' : {
								beforedeselect : this.beforeDeselectHead,
								select : this.showDetail,
							},
							// 编辑界面分录删除
							'ProductOutVerifyList button[action=save]' : {
								click : this.saveBill
							},
							// 编辑界面分录新增
							'ProductOutVerifyList gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'ProductOutVerifyList gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},
							// 列表提交按钮
							'ProductOutVerifyList button[action=submit]' : {
								click : this.submitBill
							},
							// 列表撤销按钮
							'ProductOutVerifyList button[action=rollback]' : {
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
				this.detailPanel = view.down('gridpanel[region=south]');// 明细列表
				this.searchDate = this.listContainer.down('datefield[name=searchDate]');
				this.searchDeliverNum = this.listContainer.down('combogrid[name=deliverNumber]');
//				// this.searchMaterialId =
//				// this.listContainer.down('combogrid[name=searchMaterialId]');
//				this.searchKeyWord = this.listPanel.down('textfield[name=searchKeyWord]');
//				
//				this.deleteButton = view.down('button[action=delete]');// 删除按钮
//				this.submitButton = view.down('button[action=submit]');// 提交按钮
//				this.searchStatus = this.listContainer.down('combobox[name=status]');
//				this.searchStatus.setVisible(false);
//				this.syncDownSel = this.listContainer.down('toolbar button[action=syncDownSel]');
//				this.listPanel.addListener('edit', this.listPanelEditActin, this);
//				this.refreshRecord();
//				
//				this.initButtonByPermission();
			},
			
			/**
			 * 根据用户权限初始化按钮状态
			 * 
			 */
			initButtonByPermission : function() {
//				if (this.listContainer.permission.remove) {
//					this.deleteButton.setVisible(true);
//				} else {
//					this.deleteButton.setVisible(false);
//				}
//				if (this.submitButton) {
//					if (this.listContainer.permission.submit) {
//						this.submitButton.setVisible(true);
//					} else {
//						this.submitButton.setVisible(false);
//					}
//				}
			},

			//查询
			searchHead : function(){
				this.listPanel.store.getProxy().extraParams.bizDate=null;
				this.listPanel.store.getProxy().extraParams.deliverNum=null;
				
				if(this.searchDate.getRawValue()){
					this.listPanel.store.getProxy().extraParams.bizDate = this.searchDate.getRawValue();
				}
				if(this.searchDeliverNum.getValue()){
					this.listPanel.store.getProxy().extraParams.deliverNum = this.searchDeliverNum.getValue();
				}
				this.listPanel.store.load();
				
			},	
			
			//选择另外表头记录前，判断是否需要保存修改
			beforeDeselectHead : function(me, record, index, eOpts){
//				if(record.isModified('sumBoardVolume')){
//					showWarning('单据已经修改，是否保存');
//				}
			},
			//显示分录
			showDetail : function(me, record, index, eOpts) {
				if (record != null && record.get("deliverNumber") != null&&record.get("materialId") != null) {
					var entryStore = this.detailPanel.store;
					if (entryStore != null) {
						entryStore.clearFilter(true);
						entryStore.filter([{
									property : "deliverNumber",
									value : record.get("deliverNumber")
								},{
									property : "parentMaterialId",
									value : record.get("materialId")
								}]);
						entryStore.load();
					}
				}
				//this.changeComponentsState();
			},
			//保存单据
			saveBill : function(button){
				var entryStore = this.detailPanel.store;
				var record=this.getSelectedHead();
				if(record.get('status')==4){
					showWarning('单据已提交');
					return;
				}
				
				var oneEntryModel = Ext.create('ProductOutVerifyActionModel');
				oneEntryModel = processOneEntryModel(oneEntryModel, record, entryStore);
				oneEntryModel.save({
						scope:this,
					    success : function(model,reponse) {
				 				this.searchHead();
								var record=this.getSelectedHead();
						        this.showDetail(this,record);
						        showInfo('保存成功');
						}
				});
			},
			// 新增分录
			addLine : function(button) {
				var headRecord=this.getSelectedHead();
				if(!(headRecord&&headRecord.get("deliverNumber")&&headRecord.get("materialId"))){
					showError('请选择表头或者表头没有单号和产品信息！');
				}
				
				var entryRecord = Ext.create('ProductOutVerifyEntryModel');
				entryRecord.phantom = true;
				
				// 设置单号和父物料
				entryRecord.set('deliverNumber', headRecord.get("deliverNumber"));
				entryRecord.set('parentMaterialId', headRecord.get("materialId"));
				
				entryRecord.set('sort', this.detailPanel.store.getCount()+1);
				this.detailPanel.store.add(entryRecord);
			},
			// 删除分录
			deleteLine : function(button) {
				this.detailPanel.store.remove(this.getSelectedEntry());
			},
			// 获取选择的单头行
			getSelectedHead : function() {
				var selMod = this.listPanel.getSelectionModel();
				if (selMod != null) {
					return selMod.getLastSelected();
				}
			},
			// 获取选择的分录行
			getSelectedEntry : function() {
				var selMod = this.detailPanel.getSelectionModel();
				if (selMod != null) {
					return selMod.getLastSelected();
				}
			},
			//提交
			submitBill : function(button){
				var headRecord=this.getSelectedHead();
				if(!(headRecord&&headRecord.get("deliverNumber")&&headRecord.get("materialId"))){
					showError('请选择表头或者表头没有单号和产品信息！');
					return ;
				}
				
				Ext.Ajax.request({
					scope : this,
					url : "../../scm/control/submitVerifyBill",
					timeout : SCM.limitTimes,
					params : {deliverNumber:headRecord.get("deliverNumber")
							 ,materialId:headRecord.get("materialId")},
					success : function(response, option) {
						if(response.responseText.length<1){
							showError("系统错误");
						}
			 			var responseArray = Ext.JSON.decode(response.responseText);
			 			if(responseArray.success){
			 				showInfo('提交成功');
			 				this.searchHead();
			 			}else{
			 				showError(responseArray.message);
			 			}
					}
				});
			},
			//撤销
			rollbackBill:function(button){
				var headRecord=this.getSelectedHead();
				if(!(headRecord&&headRecord.get("deliverNumber")&&headRecord.get("materialId"))){
					showError('请选择表头或者表头没有单号和产品信息！');
					return ;
				}
				
				Ext.Ajax.request({
					scope : this,
					url : "../../scm/control/rollbackVerifyBill",
					timeout : SCM.limitTimes,
					params : {deliverNumber:headRecord.get("deliverNumber")
							 ,materialId:headRecord.get("materialId")},
					success : function(response, option) {
						if(response.responseText.length<1){
							showError("系统错误");
						}
			 			var responseArray = Ext.JSON.decode(response.responseText);
			 			if(responseArray.success){
			 				showInfo('撤销成功');
			 				this.searchHead();
			 			}else{
			 				showError(responseArray.message);
			 			}
					}
				});
			}
		});