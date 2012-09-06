Ext.define('SCM.controller.basedata.MaterialController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.CommonGridController'],
			views : ['basedata.material.ListUI', 'basedata.material.EditUI','basedata.material.TypeEditUI'],
			stores : ['basedata.MaterialTypeTreeStore', 'basedata.MaterialTypeStore', 'basedata.MaterialStore', 'basedata.MaterialComboStore', 'basedata.MaterialWarehouseComboStore'],
			models : ['basedata.MaterialTypeTreeModel'],
			gridTitle : '料品资料',
			gridName : 'materialinfomaintaince',
			editName : 'materialedit',
			modelName : 'MaterialModel',
			entityName : 'TMaterialListView',
			
			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							// 列表事件
							'materialinfomaintaince' : {
								afterrender : this.initComponent
							},
							// 选择树形节点
							'materialinfomaintaince treepanel' : {
								select : this.selectNode
							},
							//物料分类新增
							'materialinfomaintaince treepanel button[action=addType]' : {
								click : this.addType
							},
							//物料分类修改
							'materialinfomaintaince treepanel button[action=modifyType]' : {
								click : this.modifyType
							},
							//物料分类删除
							'materialinfomaintaince treepanel button[action=delType]' : {
								click : this.delType
							},
							//物料分类编辑界面保存
							'materialtypeedit button[action=saveType]' : {
								click : this.saveType
							},
							// 列表事件
							'materialinfomaintaince gridpanel' : {
								itemdblclick : this.modifyRecord, // 双击列表，弹出编辑界面
								itemclick : this.changeComponentsState
								// 点击列表，改变修改、删除按钮状态
							},
							// 列表新增按钮
							'materialinfomaintaince button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表修改按钮
							'materialinfomaintaince button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'materialinfomaintaince button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表查询按钮
							'materialinfomaintaince button[action=search]' : {
								click : this.refreshRecord
							},
							'materialinfomaintaince button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面保存
							'materialedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面重填
							'materialedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'materialedit button[action=cancel]' : {
								click : this.cancel
							},
							//列表打印按钮
							'materialedit button[action=print]' : {
								click : this.print
							},
							// 监听各field值变动事件，只监听可见控件
							'materialedit form textfield{isVisible()}' : {
								change : this.fieldChange
							}
						});
						
						
				if (!this.typeWin || this.typeWin.isDestroyed) {
					this.typeWin = Ext.widget('materialtypeedit');
				}
			},

			/**
			 * 重写空方法
			 */
			afterInitComponent : function() {
				this.editForm.down('[name=materialTypeId]').store.load(); // 初始物料下拉框数据
				this.editForm.down('[name=defaultUnitId]').store.load();// 初始计量单位下拉框数据
				this.numberField = this.editForm.down('[name=number]');
				
				this.treePanel=this.listContainer.down('treepanel');
				
				

				/**
				 * add by marklam 2012-7-15 注册键盘事件，取消选择物料分类
				 */
				var nav = new Ext.util.KeyNav({
				    target : this.treePanel.id,
				    esc: {
				        fn: function(){this.treePanel.getSelectionModel().deselectAll(true);},
				        defaultEventAction: false
				    },
				    scope : this
				});
				
				
			},

			/**
			 * 选择树形节点时，更新列表数据
			 * @param {} me
			 * @param {} record
			 * @param {} index
			 * @param {} eOpts
			 */
			selectNode : function(me, record, index, eOpts) {
				this.currentRecord=record;
				
				this.listPanel.store.filters.clear();
				this.listPanel.store.filter([{property:'materialTypeId',value:record.get('id')}]);
				
//				this.listPanel.store.loadPage(1,{
//							params : {
//								'whereStr' : 'TMaterialV.material_Type_Id =\'' + record.get("id") + '\''
//							}
//						});
			},
			
			/**
			 * 编辑时，将不可编辑的属性设置为只读
			 * @param {} record
			 */
			changeEditStatus : function(record){
				if(this.getEdit().uiStatus == 'Modify'){
					this.numberField.setReadOnly(true);
				}else{
					this.numberField.setReadOnly(false);
				}
			},
			
			/**
			 * 刷新页面数据
			 * 
			 * @param {}
			 *            button 刷新按钮
			 */
			refreshRecord : function(button) {
				var lstore=this.listPanel.store;
				if (this.searchText.getValue()) {
					lstore.getProxy().extraParams.query = this.searchText.getValue();
				} else {
					lstore.getProxy().extraParams.query = '';
				}
				
//				
//				//如果选择了物料分类，添加物料分类过滤  lrf 2012-4-19 
				var selItem=this.getSelType();
				var selTypeId;
				lstore.filters.clear();
				if(selItem!=null){
					lstore.filter([{property:'materialTypeId',value:selItem.get('id')}]);
				}else{
					this.listPanel.store.loadPage(1);
				}
				
				
				//this.refreshTypeTree();
				this.changeComponentsState();
			},

			/**
			 * 点击新增按钮
			 * 
			 * @param {}
			 *            button 按钮控件
			 */
			addNewRecord : function(button) {
				newRecord = Ext.create(this.modelName);// 新增记录
				newRecord.phantom = true;
				if (this.currentRecord) {
					newRecord.set('materialTypeId', this.currentRecord.get('id'));
				}
				this.getEdit().uiStatus = 'AddNew';
				this.changeEditStatus(newRecord);
				this.editForm.getForm().loadRecord(newRecord);
				this.showEdit();
			},
			
			/**
			 * 新增分类
			 */
			addType :  function(button){
				var selectedType=this.getSelType();
				var newTypeRecord=Ext.create('MaterialTypeModel');
				newTypeRecord.phantom=true;//标识为新增
				if(selectedType){
					newTypeRecord.set('parentId',selectedType.get('id'));
				}
				
				this.typeWin.down('[name=parentId]').setDisabled(false);//设置可编辑
				this.typeWin.down('[name=number]').setDisabled(false);//设置可编辑
				this.typeWin.down('form').loadRecord(newTypeRecord);
				this.typeWin.uiStatus = 'AddNew';
				this.typeWin.show();
			},
			
			/**
			 * 修改分类，上级分类，编码不能修改
			 */
			modifyType :  function(button){
				var selectedType=this.getSelType();
				var newTypeRecord=
				SCM.model.basedata.MaterialTypeModel.load(selectedType.get('id'),{
					scope: this,
				    callback: function(record, operation) {
				        //do something whether the load succeeded or failed
				    	this.typeWin.down('[name=parentId]').setDisabled(true);//设置不可编辑
				    	this.typeWin.down('[name=number]').setDisabled(true);//设置不可编辑
						this.typeWin.down('form').loadRecord(record);
						this.typeWin.uiStatus = 'Modify';
						this.typeWin.show();				    	
				    }
				});

			},
			/**
			 * 删除分类
			 */
			delType :  function(button){
				var selectedType=this.getSelType();
				Ext.Ajax.request({
					scope : this,
					url : "../../scm/control/delMaterialType",
					params : {
                       id : selectedType.get('id')
                    },
					success : function(response, option) {
						var result = Ext.decode(response.responseText);
						if (result.success) {
							showInfo('操作成功！');
							this.refreshTypeTree();
						} else {
							showError(result.message);
						}
					}
				});
			},
			//保存分类
			saveType : function(button){
				var form=this.typeWin.down('form');
				var record=form.getRecord();
				var values=form.getValues();
				if(values.parentId==undefined||values.parentId==null){
					showError('类型不能为空');
					return ;
				}
				if(record){
					record.set(values);
					record.save({scope:this,callback:function(record, operation){
						this.typeWin.hide();
						this.refreshTypeTree();
					}});
				}
			},
			//更新分类树，重新展开上一次选择节点
			refreshTypeTree : function(isRefParent){
				var selItem=this.getSelType();
				var selTypeId;
				if(selItem!=null){
					selTypeId=selItem.get('id');
				}else{
					selTypeId='';
				}
				
				this.treePanel.store.load({scope:this,callback:function(){
					var record = this.treePanel.getRootNode().findChild("id",selTypeId, true);
					if(record!=null){
						this.treePanel.selectPath(record.getPath());	
					}
					
				}});
			},
			//返回选择的分类
			getSelType : function(){
				if(this.treePanel!=undefined&&this.treePanel!=null ){
					return this.treePanel.getSelectionModel().getSelection()[0];
				}
			}
			
		});