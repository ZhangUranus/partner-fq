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
					'ConsignReturnProduct.ConsignReturnProductController', 'WorkshopReturnProduct.WorkshopReturnProductController', 'rpt.ConsignProcessMatchingReportController',
					'rpt.StockDetailReportController', 'rpt.PackingMaterialReportController', 'ProductionPlan.ProductionPlanController', 'rpt.ProductReportController', 'rpt.SemiProductCostReportController'],
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