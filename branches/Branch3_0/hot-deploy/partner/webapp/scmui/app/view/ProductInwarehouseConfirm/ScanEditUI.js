Ext.define('SCM.view.ProductInwarehouseConfirm.ScanEditUI', {
			extend : 'Ext.window.Window',
			//requires : ['SCM.extend.toolbar.SaveToolbar', 'SCM.extend.toolbar.GridEditToolbar', 'SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
			alias : 'widget.ProductInwarehouseConfirmScanEdit',
			height : 150,
			width : 300,
			title : '扫描入库',
			modal : true,// 背景变灰，不能编辑
			collapsible : true,
			resizable : false,
			closeAction : 'hide',
			initComponent : function() {
				var me=this;
				Ext.applyIf(me, {
					items : [{
								xtype : 'textfield',
								name : 'barcode',
								margin : '15 5 5 5',
								fieldLabel : '扫描条码',
								labelWidth :60,
								width :270
							}
							],
							dockedItems : [{
								xtype : 'toolbar',
								items : [{
											text : '入库',
											action : 'inwarehouse'
										}],
								dock : 'bottom'
							}]
							
				});
				
				this.callParent(arguments);
				
			}
		});