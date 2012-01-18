/**
 * 单元页面通用方法
 * 必须包括以下对象
 * 
 * this.listPanel	表头grid对象
 * this.detailPanel 明细grid对象
 * this.newButton	新增按钮
 * this.deleteButton	删除按钮
 * this.editButton	编辑按钮
 * 
 * 
 * this.win	弹出window窗口
 * this.editForm	form对象
 * this.fields	所有可见field对象
 * this.editEntry 编辑界面分录grid对象
 * this.saveButton	form保存按钮
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
				this.listPanel = view.down('gridpanel[region=center]');//表头列表
				this.detailPanel=view.down('gridpanel[region=south]');//明细列表
				this.newButton = view.down('button[action=addNew]');//新增按钮
				this.deleteButton = view.down('button[action=delete]');//删除按钮
				this.editButton = view.down('button[action=modify]');//编辑按钮
				
				this.getEdit();
				this.initButtonByPermission();
				this.changeComponentsState();
				this.initEnterEvent();
				this.afterInitComponent();
			},

			afterInitComponent : Ext.emptyFn,

			/**
			 * 初始化确定按钮事件
			 */
			initEnterEvent : function() {
//				var pageMap = new Ext.util.KeyMap(Ext.getDoc(), [// 当前页面注册确定按钮事件
//						{
//									scope : this,
//									key : Ext.EventObject.ENTER,
//									fn : this.clickEnter
//								}]);
//				var searchMap = new Ext.util.KeyMap(this.searchText.getEl(), [// 搜索框需要单独注册确定按钮事件
//						{
//									scope : this,
//									key : Ext.EventObject.ENTER,
//									fn : this.clickEnter
//								}]);
			},
			/**
			 * 初始化编辑框 只初始化一次，关闭时候隐藏
			 */
			getEdit : function() {
				if (!this.win || this.win.isDestroyed) {
					this.win = Ext.widget(this.editName);
					this.editForm = this.win.down('form');
					this.editEntry= this.win.down('gridpanel');
					this.fields = this.editForm.query("textfield{isVisible()}"); // 取所以显示的field
					this.saveButton = this.win.down('button[action=save]');
				}
				return this.win;
			},

			/**
			 * 捕捉提交后台的回调函数
			 * 
			 * @param {}
			 *            request.action : read,create,update,destroy
			 * @param {}
			 *            success : true,false
			 */
			afterRequest : function(request, success) {
				if (success && request.operation.success) {
					if (request.action == 'read') {
						this.changeComponentsState();
					} else if (request.action == 'create') {
						this.refreshRecord();
					} else if (request.action == 'update') {
						this.refreshRecord();
					} else if (request.action == 'destroy') {
						this.refreshRecord();
					}
					if (this.win.isVisible()) {
						this.win.close();
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
//				if (this.listPanel.permission.add) {
//					this.newButton.setVisible(true);
//				} else {
//					this.newButton.setVisible(false);
//				}
//				if (this.listPanel.permission.edit) {
//					this.editButton.setVisible(true);
//				} else {
//					this.editButton.setVisible(false);
//				}
//				if (this.listPanel.permission.remove) {
//					this.deleteButton.setVisible(true);
//				} else {
//					this.deleteButton.setVisible(false);
//				}

			},

			/**
			 * 用户操作触发改变界面控件状态 如：选中记录
			 */
			changeComponentsState : function() {
//				if (this.listPanel.getSelectionModel().hasSelection()) {
//					this.deleteButton.setDisabled(false);
//					this.editButton.setDisabled(false);
//				} else {
//					this.deleteButton.setDisabled(true);
//					this.editButton.setDisabled(true);
//				}
//				if (this.win.uiStatus == 'AddNew') {
//					this.saveButton.setVisible(true);
//				} else {
//					if (this.listPanel.permission.edit) {
//						this.saveButton.setVisible(true);
//						Ext.each(this.fields, function(item, index, length) {
//									item.setReadOnly(false);
//								})
//					} else {
//						this.saveButton.setVisible(false);
//						Ext.each(this.fields, function(item, index, length) {
//									item.setReadOnly(true);
//								})
//					}
//				}
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
				this.win.show();
				this.changeComponentsState();
				this.win.inited = true;
				this.fields[0].focus(true, true);
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
				this.getEdit().uiStatus = 'Modify';
				this.editForm.getForm().loadRecord(record);
				//根据选择的id加载编辑界面数据
				var editStore=Ext.create(this.editStoreName);
				editStore.filter([{property: "id", value: record.data.id}]);
				editStore.load({
					scope   : this,
					callback: function(records, operation, success) {
						this.editForm.loadRecord(records[0]);
						var entryStore=this.editEntry.store;
						entryStore.removeAll();//清除记录
						entryStore.clearFilter();
						entryStore.filter([{property: "parentId", value: records[0].id}]);//过滤记录
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
				sm=this.listPanel.getSelectionModel();
				
		    	if(sm.hasSelection()){//判断是否选择行记录
		    		record=sm.getLastSelected();
		    		//如果单据状态是审核或者已经结算则不能修改
		    		if(record.data.status=='1'||record.data.status=='3'){
		    			showError('单据不能修改');
		    		}else{
		    			record = sm.getLastSelected();
						this.modifyRecord(this.listPanel, record);	
		    		}
				}else{
		    		showError('请选择记录!');
		    	}
				
			},
			/**
			 * 点击新增按钮
			 * 
			 * @param {}
			 *            button 按钮控件
			 */
			addNewRecord : function(button) {
				var newRecord=Ext.create(this.modelName);//新增记录
		    	this.getEdit().uiStatus='AddNew';
		    	
		    	this.editForm.getForm().loadRecord(newRecord);
				//清空分录
				grid=this.editForm.down('gridpanel');
				grid.store.removeAll();
				this.showEdit();
			},

			/**
			 * 点击删除按钮
			 * 
			 * @param {}
			 *            button 按钮控件
			 */
			deleteRecord : function(button) {
				sm=this.listPanel.getSelectionModel();
		    	if(sm.hasSelection()){//判断是否选择行记录
		    		//删除选择的记录
		    		records=sm.getSelection();
		    		for(i in records){
		    			if(records[i].data.status=='1'||records[i].data.status=='3'){
		    				showError('单据不能删除');
		    				return ;
		    			}
		    		}
		    		
		    		Ext.Msg.confirm('提示', '确定删除该' + this.gridTitle + '？', confirmChange, this);
						function confirmChange(id) {
							if (id == 'yes') {
								this.listPanel.store.remove(records);
								this.listPanel.store.sync();
							}
						}
		    		
		    	}else{
		    		showError('请选择记录!');
		    	}
			},
			/**
			 * 刷新页面数据
			 *
			 */
			refreshRecord : function() {
		    	this.listPanel.store.load();
		    	this.detailPanel.store.removeAll();
				this.changeComponentsState();
			},
			
			//审核单据
			auditBill: function(button){
		    	sm=this.listPanel.getSelectionModel();
				
		    	if(sm.hasSelection()){//判断是否选择行记录
		    		record=sm.getLastSelected();
					Ext.Ajax.request({
					scope:this,
				    url: '../../scm/control/auditBill?billId='+record.data.id+'&entity='+this.entityName,
				    success: function(response){
				         this.refreshRecord();
				    }
				});
				}else{
		    		showError('请选择记录!');
		    	}
				
				
			},
			//反审核单据
			unauditBill: function(button){
				sm=this.listPanel.getSelectionModel();
				
		    	if(sm.hasSelection()){//判断是否选择行记录
		    		record=sm.getLastSelected();
					Ext.Ajax.request({
					scope:this,
				    url: '../../scm/control/unauditBill?billId='+record.data.id+'&entity='+this.entityName,
				    success: function(response){
				        this.refreshRecord();
				    }
				});
				}else{
		    		showError('请选择记录!');
		    	}
			},
			/**
			 * 保存事件
			 * 
			 * @param {}
			 *            button 保存按钮
			 */
			saveRecord : function(button) {
		    	//取表单
		    	values=this.editForm.getValues();
		
		    	var head;
		    	if(this.win.uiStatus=='Modify'){//修改记录
		    		head=this.editForm.getRecord();
					head.set(values);
					var entryStore=this.editEntry.store;
					
					//新建一个复合model
					var oneEntryModel=Ext.create(this.actionModelName);
					
					var removed = entryStore.getRemovedRecords();   
					var updated = entryStore.getUpdatedRecords();   
					var newed = entryStore.getNewRecords(); 
					if(head.dirty||removed.length>0||updated.length>0||newed.length>0){
						oneEntryModel=processOneEntryModel(oneEntryModel,head,entryStore);
						oneEntryModel.save({scope:this,callback:function(){this.refreshRecord();}});
					}
					
		    	}else if(this.win.uiStatus=='AddNew'){//新增记录
				    
		    		head=Ext.create(this.editStoreName);
		    		head.set(values);
					
					//新建一个复合model
					var oneEntryModel=Ext.create(this.actionModelName);
					
					oneEntryModel=processOneEntryModel(oneEntryModel,head,this.editEntry().store);
		
					oneEntryModel.save({scope:this,callback:function(){this.refreshRecord();}});
		
		    	}
				this.win.close();
			},

			/**
			 * 清理文本框内容
			 */
			clear : function() {
				Ext.each(this.fields, function(item, index, length) {
							if(!item.readOnly)
								item.setValue('');
							}
						);
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

			getParams : function() {
				var tempheader = this.listPanel.headerCt.query('{isVisible()}');
				var header = "";
				var dataIndex = "";
				var count = 0;
				Ext.each(tempheader, function(column, index, length) {
							if(column.xtype != 'rownumberer'){
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
						entity : this.entityName, // 导出实体名称，一般为视图名称。
						title : this.gridTitle, // sheet页名称
						header : header, // 表头
						dataIndex : dataIndex, // 数据引用
						type : 'EXCEL',
						whereStr : getProxy().extraParams.whereStr
					}
					return params;
				}
			},
			
			//新增分录
			addLine:function(button){
				var entryRecord=Ext.create(this.entryModelName);
		
				//设置父id
				entryRecord.set('parentId',this.editForm.getValues().id);
				this.editEntry.store.add(entryRecord);
			},
			//删除分录
			deleteLine:function(button){
				this.editEntry.store.remove(this.getSelectedEntry());
			},
			//获取选择的分录行
			getSelectedEntry: function(){
				var selMod= this.editEntry.getSelectionModel();
				if(selMod!=null){
					 return selMod.getLastSelected();
				}
			},
				
			//显示分录信息
			showDetail: function(me, record,index,eOpts){
				if(record!=null&&record.get("id")!=null){
					var entryStore=this.detailPanel.store;
					if(entryStore!=null){
						entryStore.clearFilter(true);
						entryStore.filter([{property: "parentId", value: record.data.id}]);
						entryStore.load();
					}
				}
			},
			
			//打印单据
			print : function(button){
				var printWin=window.open('','printwin');
				printWin.document.write(this.getPrintContent());
			    printWin.document.close();
			    printWin.print();
			    printWin.close();
			},
			getPrintContent: function(){
				return 'test';
			}
		})