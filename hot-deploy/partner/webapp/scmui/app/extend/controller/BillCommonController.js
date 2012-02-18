/**
 * 单元页面通用方法 必须包括以下对象
 * 
 * this.listPanel 表头grid对象 this.detailPanel 明细grid对象 this.newButton 新增按钮
 * this.deleteButton 删除按钮 this.editButton 编辑按钮
 * 
 * 
 * this.win 弹出window窗口 this.editForm form对象 this.fields 所有可见field对象
 * this.editEntry 编辑界面分录grid对象 this.saveButton form保存按钮
 * 
 * 如果只是方法不同，可以通过重写方式实现
 */
Ext.define('SCM.extend.controller.BillCommonController', {
			/**
			 * 页面初始化方法
			 * 
			 * @param {}
			 *            grid 事件触发控件
			 */
			initComponent : function(view) {
				this.listContainer = view;
				this.checkSession();
				this.listPanel = view.down('gridpanel[region=center]');// 表头列表
				this.detailPanel = view.down('gridpanel[region=south]');// 明细列表
				this.newButton = view.down('button[action=addNew]');// 新增按钮
				this.deleteButton = view.down('button[action=delete]');// 删除按钮
				this.editButton = view.down('button[action=modify]');// 编辑按钮
				this.submitButton = view.down('button[action=submit]');// 提交按钮
				this.rollbackButton = view.down('button[action=rollback]');// 撤销按钮

				this.listPanel.store.proxy.addListener('afterRequest', this.afterRequest, this); // 监听所有请求回调

				this.getEdit();
				this.initButtonByPermission();
				this.changeComponentsState();
				this.initEnterEvent();
				this.afterInitComponent();
				this.refreshRecord();
				this.searchMaterialId.store.load(); // 初始化物料列表
			},

			afterInitComponent : Ext.emptyFn,

			/**
			 * 初始化确定按钮事件
			 */
			initEnterEvent : function() {
				var pageMap = new Ext.util.KeyMap(Ext.getDoc(), [// 当前页面注册确定按钮事件
						{
									scope : this,
									key : Ext.EventObject.ENTER,
									fn : this.clickEnter
								}]);
				// var searchMap = new Ext.util.KeyMap(this.searchText.getEl(),
				// [// 搜索框需要单独注册确定按钮事件
				// {
				// scope : this,
				// key : Ext.EventObject.ENTER,
				// fn : this.clickEnter
				// }]);
			},
			/**
			 * 初始化编辑框 只初始化一次，关闭时候隐藏
			 */
			getEdit : function() {
				if (!this.win || this.win.isDestroyed) {
					this.win = Ext.widget(this.editName);
					this.editForm = this.win.down('form');
					this.editEntry = this.win.down('gridpanel');
					this.fields = this.editForm.query("textfield{isVisible()}[readOnly=false]"); // 取所以显示的field
					this.submitEditButton = this.win.down('button[action=submit]');
					this.saveButton = this.win.down('button[action=save]');
					this.clearButton = this.win.down('button[action=clear]');
					this.editEntry.addListener('edit', this.initMaterialInfo, this); // 监控列表编辑事件
				}
				return this.win;
			},

			/**
			 * 当用户编辑grid时，同步更新相关表单数据
			 * 
			 * @param {}
			 *            editor
			 * @param {}
			 *            e
			 */
			initMaterialInfo : Ext.emptyFn,

			/**
			 * 捕捉提交后台的回调函数
			 * 
			 * @param {}
			 *            request.action : read,create,update,destroy
			 * @param {}
			 *            success : true,false
			 */
			afterRequest : function(request, success) {
				var me = this;
				if (success && request.operation.success) {
					if (request.action == 'read') {
						me.changeComponentsState();
					} else if (request.action == 'create') {
						if(!me.isSubmitWhenSave){
							Ext.Msg.alert("提示", "新增成功！");
							me.refreshRecord();
						}
						me.doSubmitBill();
					} else if (request.action == 'update') {
						if(!me.isSubmitWhenSave){
							Ext.Msg.alert("提示", "更新成功！");
							me.refreshRecord();
						}
						me.doSubmitBill();
					} else if (request.action == 'destroy') {
						Ext.Msg.alert("提示", "删除成功！", this.refreshRecord);
					}
					if (request.action != 'read' && me.win.isVisible()) {
						me.win.close();
					}
				} else {
					// 不需要处理，由服务器抛出异常即可
				}
			},
			/**
			 * 根据用户权限初始化按钮状态
			 * 
			 */
			initButtonByPermission : function() {
				if (this.listContainer.permission.add) {
					this.newButton.setVisible(true);
				} else {
					this.newButton.setVisible(false);
				}
				if (this.listContainer.permission.edit) {
					this.editButton.setVisible(true);
				} else {
					this.editButton.setVisible(false);
				}
				if (this.listContainer.permission.remove) {
					this.deleteButton.setVisible(true);
				} else {
					this.deleteButton.setVisible(false);
				}
				if (this.auditButton) {
					if (this.listContainer.permission.audit) {
						this.auditButton.setVisible(true);
						this.unauditButton.setVisible(true);
					} else {
						this.auditButton.setVisible(false);
						this.unauditButton.setVisible(false);
					}
				}
				if (this.submitButton) {
					if (this.listContainer.permission.submit) {
						this.submitButton.setVisible(true);
						this.rollbackButton.setVisible(true);
					} else {
						this.submitButton.setVisible(false);
						this.rollbackButton.setVisible(false);
					}
				}
			},

			/**
			 * 检查Session是否过期，如果过期弹出登录页面
			 */
			checkSession : function() {
				if (!this.listContainer.permission.view) {
					Ext.Msg.alert("提示", "Session过期，请重新登录！", new Function("window.location = window.location;"));
				}
			},

			/**
			 * 用户操作触发改变界面控件状态 如：选中记录
			 */
			changeComponentsState : function() {
				if (this.listPanel.getSelectionModel().hasSelection()) {
					this.deleteButton.setDisabled(false);
					this.editButton.setDisabled(false);
					if (this.auditButton) {
						this.auditButton.setDisabled(false);
						this.unauditButton.setDisabled(false);
					}
					if (this.submitButton) {
						this.submitButton.setDisabled(false);
						this.rollbackButton.setDisabled(false);
					}
				} else {
					this.deleteButton.setDisabled(true);
					this.editButton.setDisabled(true);
					if (this.auditButton) {
						this.auditButton.setDisabled(true);
						this.unauditButton.setDisabled(true);
					}
					if (this.submitButton) {
						this.submitButton.setDisabled(true);
						this.rollbackButton.setDisabled(true);
					}
				}
				if (this.win.uiStatus == 'AddNew') {
					this.saveButton.setVisible(true);
				} else {
					if (this.listContainer.permission.edit) {
						this.saveButton.setVisible(true);
						// Ext.each(this.fields, function(item, index, length)
						// {由初始化状态决定
						// item.setReadOnly(false);
						// })
					} else {
						this.saveButton.setVisible(false);
						this.setFieldsReadOnly(true);
					}
				}
			},

			/**
			 * 设置界面可编辑性
			 * 
			 * @param {}
			 *            isReadOnly
			 */
			setFieldsReadOnly : function(isReadOnly) {
				Ext.each(this.fields, function(item, index, length) {
							item.setReadOnly(isReadOnly);
						})
			},

			/**
			 * 页面Enter键事件捕捉
			 */
			clickEnter : function() {
				if (this.win.isVisible()) {
					this.saveRecord();
				} else {
					this.refreshRecord();
				}
			},

			/**
			 * 捕捉field控件的change事件，设置form的修改状态
			 * 
			 * @param {}
			 *            textField 当前控件
			 * @param {}
			 *            newValue 新值
			 * @param {}
			 *            oldValue 旧值
			 */
			fieldChange : function(textField, newValue, oldValue) {
				if (this.win.inited && !this.win.modifyed) {
					this.win.modifyed = true;
				}
			},

			/**
			 * 弹出编辑框事件
			 */
			showEdit : function() {
				this.checkSession();
				this.win.show();
				this.changeComponentsState();
				this.win.inited = true;
				Ext.each(this.fields, function(item, index, length) {
							item.focus(true, true);
							return false; // 跳出循环
						});
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
					this.editEntry.setDisabled(false);
					this.saveButton.setDisabled(false);
					this.clearButton.setDisabled(false);
					this.submitEditButton.setDisabled(false);
				} else {
					this.setFieldsReadOnly(true);
					this.editEntry.setDisabled(true);
					this.saveButton.setDisabled(true);
					this.clearButton.setDisabled(true);
					this.submitEditButton.setDisabled(true);
				}
			},

			/**
			 * 编辑事件
			 * 
			 * @param {}
			 *            grid 当前表格
			 * @param {}
			 *            record 选中记录
			 */
			modifyRecord : function(grid, record) {
				this.currentRecord = record;
				this.changeEditStatus(record);
				this.getEdit().uiStatus = 'Modify';
				this.editForm.getForm().loadRecord(record);
				// 根据选择的id加载编辑界面数据
				var editStore = Ext.create(this.editStoreName);
				editStore.filter([{
							property : "id",
							value : record.data.id
						}]);
				editStore.load({
							scope : this,
							callback : function(records, operation, success) {
								this.editForm.loadRecord(records[0]);
								var entryStore = this.editEntry.store;
								entryStore.removeAll();// 清除记录
								entryStore.clearFilter();
								entryStore.filter([{
											property : "parentId",
											value : records[0].id
										}]);// 过滤记录
								entryStore.load();
								this.showEdit();
							}
						});
			},

			/**
			 * 点击修改按钮
			 * 
			 * @param {}
			 *            button 按钮控件
			 */
			editRecord : function(button) {
				record = this.getSelectRecord();
				// 如果单据状态是已提交、已审核或者已经结算则不能修改
				this.modifyRecord(this.listPanel, record);
			},
			/**
			 * 点击新增按钮
			 * 
			 * @param {}
			 *            button 按钮控件
			 */
			addNewRecord : function(button) {
				this.listPanel.getSelectionModel().deselectAll();
				var newRecord = Ext.create(this.modelName);// 新增记录
				this.currentRecord = newRecord;
				this.changeEditStatus(newRecord);
				this.getEdit().uiStatus = 'AddNew';

				this.editForm.getForm().loadRecord(newRecord);
				// 清空分录
				this.editEntry.store.removeAll();
				this.editEntry.getView().refresh();
				this.showEdit();
			},

			/**
			 * 点击删除按钮
			 * 
			 * @param {}
			 *            button 按钮控件
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

				Ext.Msg.confirm('提示', '确定删除该' + this.gridTitle + '？', confirmChange, this);
				function confirmChange(id) {
					if (id == 'yes') {
						this.listPanel.store.remove(record);
						this.listPanel.store.sync();
					}
				}
			},
			/**
			 * 刷新页面数据(必须重写该方法)
			 * 
			 */
			refreshRecord : Ext.emptyFn,

			/**
			 * 是否可以提交
			 * 
			 * @return {Boolean}
			 */
			isSubmitAble : function(record) {
				if (record.get('status') != '0') {
					showWarning('单据已提交！');
					return false;
				} else {
					return true;
				}
			},

			/**
			 * 提交单据
			 * 
			 * @param {}
			 *            button
			 */
			submitBill : function(button) {
				var me = this;
				record = me.getSelectRecord();
				if (!me.isSubmitAble(record)) {
					return;
				}
				if(!me.isSubmitWhenSave){//如果是直接提交触发，不需要确认
					Ext.Msg.confirm('提示', '确定提交该' + me.gridTitle + '？', confirmChange, me);
				}else{
					confirmChange('yes');
				}
				function confirmChange(id) {
					if (id == 'yes') {
						Ext.Ajax.request({
									params : {
										billId : record.get('id'),
										entity : me.entityName
									},
									url : me.getSubmitBillUrl(),
									success : function(response, option) {
										var result = Ext.decode(response.responseText)
                						if(result.success){
											me.submitBillSuccess(response, option);
											Ext.Msg.alert("提示", "处理成功！");
                						} else {
                							showError(result.message);
                						}
                						me.refreshRecord();
									}
								});
					}
				}
			},

			/**
			 * 提交成功后处理方法
			 * 
			 * @type
			 */
			submitBillSuccess : Ext.emptyFn,

			/**
			 * 获取单据提交URL
			 */
			getSubmitBillUrl : function() {
				return '../../scm/control/submitBill';
			},

			/**
			 * 是否可以撤销提交
			 * 
			 * @param {}
			 *            record
			 */
			isRollbackBillAble : function(record) {
				if (record.get('status') != '4') {
					showWarning('单据未提交！');
					return false;
				} else {
					return true;
				}
			},

			/**
			 * 撤销单据
			 * 
			 * @param {}
			 *            button
			 */
			rollbackBill : function(button) {
				record = this.getSelectRecord();
				if (!this.isRollbackBillAble(record)) {
					return;
				}
				Ext.Msg.confirm('提示', '确定撤销该' + this.gridTitle + '？', confirmChange, this);
				function confirmChange(id) {
					if (id == 'yes') {
						Ext.Ajax.request({
									scope : this,
									params : {
										billId : record.get('id'),
										entity : this.entityName
									},
									url : this.getRollbackBillUrl(),
									success : function(response, option) {
										this.rollbackBillSuccess(response, option);
										Ext.Msg.alert("提示", "撤销成功！");
										this.refreshRecord();
									}
								});
					}
				}
			},

			/**
			 * 撤销提交成功后处理方法
			 * 
			 * @type
			 */
			rollbackBillSuccess : Ext.emptyFn,

			/**
			 * 获取单据撤销URL
			 */
			getRollbackBillUrl : function() {
				return '../../scm/control/rollbackBill';
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
				} else {
					return this.currentRecord;
				}
			},

			/**
			 * 保存时提交单据
			 */
			doSubmitBill : function() {
				if (this.isSubmitWhenSave) {
					this.submitBill();
					this.isSubmitWhenSave = false;
				}
			},

			/**
			 * 直接保存并提交单据
			 */
			saveAndSubmitRecord : function() {
				this.isSubmitWhenSave = true;
				this.saveRecord();
			},

			/**
			 * 保存事件
			 * 
			 * @param {}
			 *            button 保存按钮
			 */
			saveRecord : function(button) {
				var me = this;
				var values = me.editForm.getValues();
				if (!me.win.modifyed) {// 用户未做任何修改，直接关闭编辑框
					this.doSubmitBill();
					if (me.win.isVisible()) {
						me.win.close();
					}
					return;
				}
				if (!this.isValidate()) {
					return;
				}

				var record;
				if (me.win.uiStatus == 'Modify') {// 修改记录
					record = me.editForm.getRecord();
					record.set(values);
					var entryStore = me.editEntry.store;

					var removed = entryStore.getRemovedRecords();
					var updated = entryStore.getUpdatedRecords();
					var newed = entryStore.getNewRecords();
					if (record.dirty || removed.length > 0 || updated.length > 0 || newed.length > 0) {
						me.commitSave(record, entryStore);
					} else {
						this.doSubmitBill();
					}
				} else if (me.win.uiStatus == 'AddNew') {// 新增记录
					record = Ext.create(me.modelName);
					record.set(values);

					me.commitSave(record, me.editEntry.store);
				}
				if (me.win.isVisible()) {
					me.win.close();
				}
				me.changeComponentsState();
			},

			/**
			 * 提交保存
			 * 
			 * @param {}
			 *            record
			 * @param {}
			 *            store
			 */
			commitSave : function(record, store) {
				var oneEntryModel = Ext.create(this.actionModelName);
				oneEntryModel.proxy.addListener('afterRequest', this.afterRequest, this); // 监听请求回调
				oneEntryModel = processOneEntryModel(oneEntryModel, record, store);
				oneEntryModel.save();
			},

			/**
			 * 清理文本框内容
			 */
			clear : function() {
				Ext.each(this.fields, function(item, index, length) {
							item.setValue('');
						});
			},

			/**
			 * 取消编辑
			 */
			cancel : function() {
				this.win.close();
			},

			/**
			 * 校验form所有field的输入值是否有效
			 * 
			 * @return true 有效,false 无效
			 */
			isValidate : function() {
				var valid = true;
				Ext.each(this.fields, function(item, index, length) {
							if (!item.isValid()) {
								valid = false;
							}
						});
				return valid;
			},

			/**
			 * 获取报表参数
			 * 
			 * @return {}
			 */
			getParams : function() {
				var tempheader = this.listPanel.headerCt.query('{isVisible()}');
				var header = "";
				var dataIndex = "";
				var count = 0;
				Ext.each(tempheader, function(column, index, length) {
							if (column.xtype != 'rownumberer') {
								if (count != 0) {
									header += ",";
									dataIndex += ",";
								}
								header += column.text;
								dataIndex += column.dataIndex;
								count++;
							}
						})
				with (this.listPanel.store) {
					var params = {
						// Store参数
						sort : Ext.encode(getSorters()),
						filter : Ext.encode(filters.items),

						// 页面参数
						entity : this.entityName + 'View', // 导出实体名称，一般为视图名称。
						title : this.gridTitle, // sheet页名称
						header : header, // 表头
						dataIndex : dataIndex, // 数据引用
						type : 'EXCEL',
						whereStr : getProxy().extraParams.whereStr
					}
					return params;
				}
			},

			// 新增分录
			addLine : function(button) {
				var entryRecord = Ext.create(this.entryModelName);

				// 设置父id
				entryRecord.set('parentId', this.editForm.getValues().id);
				this.editEntry.store.add(entryRecord);
			},
			// 删除分录
			deleteLine : function(button) {
				this.editEntry.store.remove(this.getSelectedEntry());
			},
			// 获取选择的分录行
			getSelectedEntry : function() {
				var selMod = this.editEntry.getSelectionModel();
				if (selMod != null) {
					return selMod.getLastSelected();
				}
			},

			// 显示分录信息
			showDetail : function(me, record, index, eOpts) {
				if (record != null && record.get("id") != null) {
					var entryStore = this.detailPanel.store;
					if (entryStore != null) {
						entryStore.clearFilter(true);
						entryStore.filter([{
									property : "parentId",
									value : record.data.id
								}]);
						entryStore.load();
					}
				}
				this.changeComponentsState();
			},

			// 打印单据
			print : function(button) {
				//选择打印模板
				var templates=this.getPrintTemplateArr();
				if(!Ext.isArray(templates)){
					showError('套打模板格式出错');
					return;
				}
				//弹出选择框
//				if(templates.length>1){
				var selector=Ext.create('SCM.view.print.TemplateSelector');
				selector.registerCallback(this,this.buildPrintContent);
				var radioGroup=selector.down('radiogroup');
				radioGroup.removeAll();
				var oneCheck=false;//默认选择第一个模板
				for(var i in templates){
					radioGroup.add(Ext.create('Ext.form.field.Radio',{name: 'template',checked:!oneCheck,boxLabel:templates[i].name,inputValue:templates[i].template}));
					oneCheck=true;
				}
				
				selector.show();
//				}
				
			},
			
			buildPrintContent : function(template) {
				var printData=this.getPrintData();
				var printWin = window.open('', 'printwin');
				appendData2Win(printWin,printData,template.template);
				printWin.document.close();
				printWin.print();
				printWin.close();
				
			},
			/**
			 *返回单据打印模板，数组类型
			 *格式：定义打印内容的打印样式 [{name:'单据打印模板1',
			 *                   		  template:[{dataIndex:'data.billNumber',style:'left:0px;top:150px'}, 
			 *							  			{dataIndex:'data.supplierName',style:'left:0px;top:100px'},
			 *							  			{dataIndex:'data.entries[0].materialName',style:'left:0px;top:150px'}
			 *									   ]
			 *							  },
			 *							  {.....}
			 *							 ]
			 *@dataIndex 数据选择 ，json具体字段值表示
			 *@style css样式
			 *抽象方法，具体单据需要进行定义
			 */
			//getPrintTemplateArr:Ext.emptyFn,
			getPrintTemplateArr: function(){
				return [{name:'单据打印模板1',
					     template:[{dataIndex:'data.billNumber',style:'left:50px;top:200px'}, 
					        	{dataIndex:'data.supplierName',style:'left:0px;top:100px'},
					               {dataIndex:'data.entries[0].materialName',style:'left:40;top:150px'}
					                ]
					     },
					     {name:'单据打印模板2',
						     template:[{dataIndex:'data.billNumber',style:'left:50px;top:200px'}, 
						        	{dataIndex:'data.supplierName',style:'left:0px;top:100px'},
						               {dataIndex:'data.entries[0].materialName',style:'left:40;top:150px'}
						                ]
						  },
						  {name:'单据打印模板3',
							     template:[{dataIndex:'data.billNumber',style:'left:50px;top:200px'}, 
							        	{dataIndex:'data.supplierName',style:'left:0px;top:100px'},
							               {dataIndex:'data.entries[0].materialName',style:'left:40;top:150px'}
							                ]
							     },
					     ];
			},
			/**
			 * 返回单据打印数据
			 * 打印的内容，json对象 {billNumber:'001',bizDate:'2012-08-09',supplierName:'江门开发' ,entries:[{materialName:'钢条',volume:10},{materialName:'钢条',volume:10}]}
			 */
//			getPrintData:Ext.emptyFn
			getPrintData: function(){
				return {billNumber:'001',bizDate:'2012-08-09',supplierName:'江门开发' ,entries:[{materialName:'钢条',volume:10},{materialName:'钢条',volume:10}]};
			}
		})