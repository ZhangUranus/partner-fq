Ext.define('SCM.view.ProductOutNotificationModify.EditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar', 'SCM.ux.combobox.ComboGrid'],
			alias : 'widget.ProductOutNotificationModifyedit',
			title : '出货通知单变更',
			layout : 'fit',
			width : SCM.MaxSize.WINDOW_WIDTH,
			modal : true,// 背景变灰，不能编辑
			collapsible : true,
			resizable : false,
			closeAction : 'hide',
			uiStatus : 'AddNew',
			inited : false, // 初始化标识
			modifyed : false, // 修改标识

			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							items : [{
										xtype : 'form',
										bodyPadding : '10 10 10 10',
										border : 0,
										defaults : {
											xtype : 'textfield',
											labelWidth : 120,
											width : 300
										},
										items : [{
													name : 'id',
													fieldLabel : 'id',
													hidden : true
												}, {
													name : 'number',
													fieldLabel : '编码',
													emptyText : '保存时系统自动生成',
													readOnly : true
												}, {
													xtype : 'combogrid',
													fieldLabel : '单号',
													name : 'deliverNumber',
													valueField : 'number',
													displayField : 'number',
													allowBlank : false,
													initStore : Ext.data.StoreManager.lookup('CDNSComboInitStore'),
													store : Ext.data.StoreManager.lookup('CDNSComboStore'),
													listConfig : {
														width : 300,
														height : SCM.MaxSize.COMBOGRID_HEIGHT,
														columns : [{
																	header : '单号',
																	dataIndex : 'number',
																	width : 250,
																	hideable : false
																}]
													}
												}, {
													xtype : 'combobox',
													name : 'operateType',
													fieldLabel : '操作类型',
													allowBlank : false,
													store : SCM.store.basiccode.operateTypeStore,
													displayField : 'name',
													valueField : 'id'
												}, {
													xtype : 'combogrid',
													fieldLabel : '货号',
													name : 'goodNumber',
													valueField : 'number',
													displayField : 'number',
													allowBlank : false,
													initStore : Ext.data.StoreManager.lookup('CGNSComboInitStore'),
													store : Ext.data.StoreManager.lookup('CGNSComboStore'),
													listeners : {
														scope : this,
														beforequery : function(qe){
															return this.setDeliverNumberFilter(qe);
														}
													},
													listConfig : {
														width : 300,
														height : SCM.MaxSize.COMBOGRID_HEIGHT,
														columns : [{
																	header : '货号',
																	dataIndex : 'number',
																	width : 250,
																	hideable : false
																}]
													}
												}, {
													xtype : 'combogrid',
													fieldLabel : '产品名称',
													name : 'materialId',
													valueField : 'materialId',
													displayField : 'materialName',
													matchFieldWidth : false,
													initStore : Ext.data.StoreManager.lookup('MBComboInitStore'),
													store : Ext.data.StoreManager.lookup('MBComboStore'),
													listConfig : {
														width : 400,
														height : SCM.MaxSize.COMBOGRID_HEIGHT,
														columns : [{
																	header : '编码',
																	dataIndex : 'materialNumber',
																	width : 100,
																	hideable : false
																}, {
																	header : '名称',
																	dataIndex : 'materialName',
																	width : 280,
																	hideable : false
																}, {
																	header : '备注',
																	dataIndex : 'note',
																	width : 100,
																	hideable : false
																}]
													}
												}, {
													xtype : 'combogrid',
													fieldLabel : '通知单产品名称',
													name : 'notificationEntryId',
													valueField : 'notificationEntryId',
													displayField : 'materialName',
													hidden : true,
													matchFieldWidth : false,
													initStore : Ext.data.StoreManager.lookup('MBGNSComboInitStore'),
													store : Ext.data.StoreManager.lookup('MBGNSComboStore'),
													listeners : {
														scope : this,
														beforequery : function(qe){
															return this.setMaterialByGoodNumberFilter(qe);
														}
													},
													listConfig : {
														width : 450,
														height : SCM.MaxSize.COMBOGRID_HEIGHT,
														columns : [{
																	header : '订单号',
																	dataIndex : 'orderNumber',
																	width : 100,
																	hideable : false
																}, {
																	header : '产品名称',
																	dataIndex : 'materialName',
																	width : 200,
																	hideable : false
																}, {
																	header : '订单数量',
																	dataIndex : 'volume',
																	width : 100,
																	hideable : false
																}]
													}
												}, {
													xtype : 'numberfield',
													name : 'volume',
													fieldLabel : '修改后订单数量',
													allowBlank : false,
													hideTrigger : true
												}, {
													xtype : 'combogrid',
													fieldLabel : '对数表打板产品名称',
													name : 'verifyEntryId',
													valueField : 'verifyEntryId',
													displayField : 'materialName',
													hidden : true,
													matchFieldWidth : false,
													initStore : Ext.data.StoreManager.lookup('MBDNSComboInitStore'),
													store : Ext.data.StoreManager.lookup('MBDNSComboStore'),
													listeners : {
														scope : this,
														beforequery : function(qe){
															return this.setMaterialByDeliverNumberFilter(qe);
														}
													},
													listConfig : {
														width : 450,
														height : SCM.MaxSize.COMBOGRID_HEIGHT,
														columns : [{
																	header : '打板产品名称',
																	dataIndex : 'materialName',
																	width : 280,
																	hideable : false
																}, {
																	header : '计划打板数量',
																	dataIndex : 'verifyEntryVolume',
																	width : 100,
																	hideable : false
																}]
													}
												}, {
													xtype : 'numberfield',
													name : 'verifyEntryVolume',
													fieldLabel : '修改后计划打板数量',
													allowBlank : false,
													hideTrigger : true
												}, {
													xtype : 'textarea',
													name : 'note',
													fieldLabel : '备注',
													maxLength : 50,
													colspan : 3,
												}]
									}],
							dockedItems : [{
										xtype : 'savetoolbar',
										dock : 'bottom'
									}]
						});
				this.callParent();
			},
			close : function() {
				this.hide();
				this.inited = false;
				this.modifyed = false;
			},
			
			setDeliverNumberFilter : function(qe){
				var deliverCombo = this.down('combogrid[name=deliverNumber]');
				
				//根据所选仓库过滤物料
				var goodNumberStore = qe.combo.store;
				if(goodNumberStore){
					goodNumberStore.getProxy().extraParams.deliverNumber = deliverCombo.getValue() ;
				}
				return true;
			},
			
			setMaterialByGoodNumberFilter : function(qe){
				var goodCombo = this.down('combogrid[name=goodNumber]');
				
				//根据所选仓库过滤物料
				var materialStore = qe.combo.store;
				if(materialStore){
					materialStore.getProxy().extraParams.goodNumber = goodCombo.getValue() ;
				}
				return true;
			},
			setMaterialByDeliverNumberFilter : function(qe){
				var deliverCombo = this.down('combogrid[name=deliverNumber]');
				var entryCombo = this.down('combogrid[name=notificationEntryId]');
				
				//根据所选仓库过滤物料
				var materialStore = qe.combo.store;
				if(materialStore){
					materialStore.getProxy().extraParams.deliverNumber = deliverCombo.getValue() ;
					materialStore.getProxy().extraParams.notificationEntryId = entryCombo.getValue() ;
				}
				return true;
			}
		});