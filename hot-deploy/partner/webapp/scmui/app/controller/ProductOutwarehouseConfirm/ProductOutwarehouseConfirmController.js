Ext.define('SCM.controller.ProductOutwarehouseConfirm.ProductOutwarehouseConfirmController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter'],
			views : ['ProductOutwarehouseConfirm.ListUI'],
			stores : ['ProductOutwarehouseConfirm.ProductOutwarehouseConfirmStore'],
			
			init : function() {
				this.control({
							'ProductOutwarehouseConfirmlist' : {
								afterrender : this.initComponent
							},
							// 列表删除按钮
							'ProductOutwarehouseConfirmlist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'ProductOutwarehouseConfirmlist button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表审核按钮
							'ProductOutwarehouseConfirmlist button[action=submit]' : {
								click : this.submitBill
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
				this.searchStatus.setVisible(false);
				this.syncDownSel=this.listContainer.down('toolbar button[action=syncDownSel]');
				this.listPanel.addListener('edit',this.listPanelEditActin,this);
				this.refreshRecord();
			},
			
			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if(this.searchStartDate.getValue()){
					tempString += 'ProductOutwarehouseConfirmV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if(this.searchEndDate.getValue()){
					if(tempString != ''){
						if(this.searchStartDate.getRawValue()>this.searchEndDate.getRawValue()){
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return ;
						}
						tempString += ' and ';
					}
					tempString += 'ProductOutwarehouseConfirmV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
				if(this.searchMaterialId.getValue() && this.searchMaterialId.getValue() != ''){
					if(tempString != ''){
						tempString += ' and ';
					}
					tempString += 'ProductOutwarehouseConfirmV.material_material_id = \'' + this.searchMaterialId.getValue() + '\'';
				}

				tempString += ' and ProductOutwarehouseConfirmV.status != \'' + 4 + '\'';
				
				this.listPanel.store.getProxy().extraParams.whereStr = tempString;
				this.listPanel.store.load();
			},
			
			/**
			 * 删除记录
			 */
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
			 * 进仓确认单列表界面编辑事件
			 */
			listPanelEditActin : function(editor,e){
				if(this.syncDownSel.pressed==true){
					//从fromRow行复制值
					this.syncRecordByField(e.field,e.value,this.listPanel.store,e.rowIdx+1);
				}
			},
			
			/**
			 * 从fromRow行复制值
			 * @param {} field
			 * @param {} value
			 * @param {} store
			 * @param {} fromRow
			 */
			syncRecordByField : function (field,value,store,fromRow){
				if(fromRow<store.getCount()){
					var records=store.getRange(fromRow);
					Ext.Array.each(records,function(record,index,records){
							record.set(field,value);
					});
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
				var me = this;
				var records=me.getAllSelectRecords()
				if(records){
					var recordsData=[];
					for(var r in records){
						recordsData.push(records[r].data);
						records[r].save();			//保存提交的出仓单
					}
					var json=Ext.encode(recordsData);
					
					Ext.Ajax.request({ 
						scope : me,
						url : "../../scm/control/submitProductOutwarehouseConfirm",
						params:{records:json},
						success : function(response, option) {
							if(response.responseText.length<1){
								showError('系统没有返回结果');
							}
				 			var responseArray = Ext.JSON.decode(response.responseText);
				 			if(responseArray.success){
				 				showInfo('提交成功');
				 				me.refreshRecord();
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