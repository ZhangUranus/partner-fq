/**
 * @Purpose 系统框架类
 * @author jeff-liu
 * @Date 2011-11-24
 */
/*
 * 系统默认加载path为: 'Ext', '.' application增加path为：'SCM', './app'
 */
Ext.Loader.setConfig({
			enabled : true
		});

Ext.application({
			name : 'SCM',
			appFolder : 'app',
			controllers : [// 载入系统controller
			'Main', 'homepage.HomePageController', 'basedata.UnitController', 'basedata.WarehouseTypeController', 'basedata.WarehouseController', 'basedata.CustomerController', 'basedata.DepartmentController',
					'basedata.MaterialController', 'basedata.MaterialBomController', 'basedata.WorkshopController', 'PurchaseBill.PurchaseBillController', 'Supplier.SupplierController',
					'system.SystemController', 'system.LogController', 'PurchaseWarehousing.PurchaseWarehousingController', 'PurchaseReturn.PurchaseReturnController',
					'ConsignDrawMaterial.ConsignDrawMaterialController', 'ConsignReturnMaterial.ConsignReturnMaterialController', 'WorkshopDrawMaterial.WorkshopDrawMaterialController',
					'WorkshopReturnMaterial.WorkshopReturnMaterialController', 'ConsignWarehousing.ConsignWarehousingController', 'WorkshopWarehousing.WorkshopWarehousingController',
					'ConsignReturnProduct.ConsignReturnProductController', 'WorkshopReturnProduct.WorkshopReturnProductController', 'WorkshopOtherDrawBill.WorkshopOtherDrawBillController','StockAdjust.StockAdjustController','WorkshopStockAdjust.WorkshopStockAdjustController','SupplierStockAdjust.SupplierStockAdjustController','rpt.ConsignProcessMatchingReportController',
					'ProductInwarehouse.ProductInwarehouseController', 'ProductOutwarehouse.ProductOutwarehouseController', 'basedata.RegionController',
					'rpt.StockDetailReportController', 'rpt.WorkshopStockDetailReportController', 'rpt.PackingMaterialReportController', 'ProductionPlan.ProductionPlanController', 'rpt.ProductReportController', 'rpt.SemiProductCostReportController', 'rpt.PurchaseMatchingReportController'],
			onLaunch : function() {
				
				/* 初始化物料的STORE */
				/* 普通物料 */
				Ext.create('MaterialComboStore', {
					pageSize : SCM.comboPageSize,
				    storeId: 'MComboStore'			//下拉框－－选择时使用
				});
				Ext.create('MaterialComboStore', {
				    storeId: 'MComboInitStore'		//下拉框－－展现时使用
				});
				
				/* 包括仓库字段的物料 store */
				Ext.create('MaterialWarehouseComboStore', {
					pageSize : SCM.comboPageSize,
				    storeId: 'MWHComboStore'			//下拉框－－选择时使用
				});
				Ext.create('MaterialWarehouseComboStore', {
				    storeId: 'MWHComboInitStore'		//下拉框－－展现时使用
				});
				
				
				/* 初始化物料BOM的STORE */
				/* 普通物料BOM */
				Ext.create('MaterialBomComboStore', {
					pageSize : SCM.comboPageSize,
				    storeId : 'MBComboStore'			//下拉框－－选择时使用
				});
				Ext.create('MaterialBomComboStore', {
				    storeId : 'MBComboInitStore'		//下拉框－－展现时使用
				});
				
				/* 包括仓库字段的物料BOM store */
				Ext.create('MaterialBomWarehouseComboStore', {
					pageSize : SCM.comboPageSize,
				    storeId: 'MBWHComboStore'			//下拉框－－选择时使用
				});
				Ext.create('MaterialBomWarehouseComboStore', {
				    storeId: 'MBWHComboInitStore'		//下拉框－－展现时使用
				});
				
				/* 只用于物料BOM查找，下拉框不能使用该store */
				Ext.create('MaterialBomStore', {
				    storeId: 'MBAllStore'		//物料BOM的Store
				});
				
				/* 初始化供应商的STORE */
				Ext.create('SupplierStore', {
					pageSize : SCM.comboPageSize,
				    storeId: 'SPComboStore'		//下拉框－－选择时使用
				});
				
				Ext.create('SupplierStore', {
				    storeId: 'SPComboInitStore'		//下拉框－－展现时使用
				});
				
				/* 初始化车间的STORE */
				Ext.create('WorkshopStore', {
					pageSize : SCM.comboPageSize,
				    storeId: 'WSComboStore'		//下拉框－－选择时使用
				});
				
				Ext.create('WorkshopStore', {
				    storeId: 'WSComboInitStore'		//下拉框－－展现时使用
				});
				
				/* 初始化仓库的STORE */
				Ext.create('WarehouseStore', {
					pageSize : SCM.comboPageSize,
				    storeId: 'WHComboStore'			//下拉框－－选择时使用
				});
				Ext.create('WarehouseStore', {
				    storeId: 'WHComboInitStore'		//下拉框－－展现时使用
				});
				
				/* 初始化计量单位的STORE */
				Ext.create('UnitStore', {
					pageSize : SCM.comboPageSize,
				    storeId: 'UComboStore'			//下拉框－－选择时使用
				});
				Ext.create('UnitStore', {
				    storeId: 'UComboInitStore'		//下拉框－－展现时使用
				});
				
				/* 初始化系统用户的STORE */
				Ext.create('SystemUserStore', {
					pageSize : SCM.comboPageSize,
				    storeId: 'SUComboStore'		//下拉框－－选择时使用
				});
				
				Ext.create('SystemUserStore', {
				    storeId: 'SUComboInitStore'		//下拉框－－展现时使用
				});
				
				/* 初始化地区的STORE */
				Ext.create('RegionStore', {
					pageSize : SCM.comboPageSize,
				    storeId: 'RGComboStore'			//下拉框－－选择时使用
				});
				Ext.create('RegionStore', {
				    storeId: 'RGComboInitStore'		//下拉框－－展现时使用
				});
				
				/* 初始化月份的STORE */
				Ext.create('MonthStore', {
				    storeId: 'MTHComboStore'		//下拉框－－展现时使用
				});
			},
			launch : function() {
				var viewport = Ext.create('SCM.view.Viewport');
				viewport.doLayout(); // 刷新布局

				
//				Ext.override(Ext.form.field.Number,{decimalPrecision:4});
//				//4.1B2版本已经解决改问题，屏蔽代码。
//				// 修正treestoreload的bug
//				Ext.override(Ext.data.TreeStore, {
//							load : function(options) {
//								options = options || {};
//								options.params = options.params || {};
//
//								var me = this, node = options.node || me.tree.getRootNode(), root;
//
//								// If there is not a node it means the user
//								// hasnt defined a rootnode yet. In this case
//								// lets just
//								// create one for them.
//								if (!node) {
//									node = me.setRootNode({
//												expanded : true
//											});
//								}
//
//								if (me.clearOnLoad) {
//									// this is what we changed. added false
//									node.removeAll(false);
//								}
//
//								Ext.applyIf(options, {
//											node : node
//										});
//								options.params[me.nodeParam] = node ? node.getId() : 'root';
//
//								if (node) {
//									node.set('loading', true);
//								}
//
//								return me.callParent([options]);
//							}
//						});

			}
		});