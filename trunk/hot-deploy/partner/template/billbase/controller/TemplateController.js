Ext.define('SCM.controller.${TemplateName}.${TemplateName}Controller', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.controller.BillCommonController'],
			views : ['${TemplateName}.ListUI', '${TemplateName}.EditUI'],
			stores : ['${TemplateName}.${TemplateName}Store', '${TemplateName}.${TemplateName}EditStore', '${TemplateName}.${TemplateName}EditEntryStore'],
			requires : ['SCM.model.${TemplateName}.${TemplateName}ActionModel'],
			gridTitle : '${TemplateAlias}',
			editName : '${TemplateName}edit',
			editStoreName : '${TemplateName}EditStore',
			entityName : '${TemplateName}',
			modelName : '${TemplateName}EditModel',
			entryModelName : '${TemplateName}EditEntryModel',
			actionModelName : '${TemplateName}ActionModel',
			init : function() {
				this.control({
							'${TemplateName}list' : {
								afterrender : this.initComponent
							},
							// 列表新增按钮
							'${TemplateName}list button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表事件
							'${TemplateName}list gridpanel[region=center]' : {
								select : this.showDetail,
								itemdblclick : this.modifyRecord
							},
							// 列表修改按钮
							'${TemplateName}list button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'${TemplateName}list button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'${TemplateName}list button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表审核按钮
							'${TemplateName}list button[action=audit]' : {
								click : this.auditBill
							},
							// 列表反审核按钮
							'${TemplateName}list button[action=unaudit]' : {
								click : this.unauditBill
							},
							// 列表打印按钮
							'${TemplateName}list button[action=print]' : {
								click : this.print
							},
							// 编辑界面分录新增
							'${TemplateName}edit  gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'${TemplateName}edit  gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},

							// 编辑界面保存
							'${TemplateName}edit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面打印
							'${TemplateName}edit button[action=print]' : {
								click : this.print
							},
							// 编辑界面重填
							'${TemplateName}edit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'${TemplateName}edit button[action=cancel]' : {
								click : this.cancel
							},
							// 监听各field值变动事件，只监听可见控件
							'${TemplateName}edit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 角色列表更新事件
							'${TemplateName}edit grid' : {
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
			},
			
			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if(this.searchStartDate.getValue()){
					tempString += '${TemplateName}V.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if(this.searchEndDate.getValue()){
					if(tempString != ''){
						if(this.searchStartDate.getRawValue()>this.searchEndDate.getRawValue()){
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return ;
						}
						tempString += ' and ';
					}
					tempString += '${TemplateName}V.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
				if(this.searchMaterialId.getValue() && this.searchMaterialId.getValue() != ''){
					if(tempString != ''){
						tempString += ' and ';
					}
					tempString += '${TemplateName}EntryV.material_material_id = \'' + this.searchMaterialId.getValue() + '\'';
				}
				if(this.searchCustId.getValue() && this.searchCustId.getValue() != ''){
					if(tempString != ''){
						tempString += ' and ';
					}
					tempString += '${TemplateName}V.supplier_supplier_id = \'' + this.searchCustId.getValue() + '\'';
				}
				this.listPanel.store.getProxy().extraParams.whereStr = tempString;
				this.listPanel.store.load();
				this.detailPanel.store.removeAll();
				this.changeComponentsState();
			}

		});