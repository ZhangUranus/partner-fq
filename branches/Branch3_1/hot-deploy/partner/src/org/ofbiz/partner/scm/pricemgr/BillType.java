package org.ofbiz.partner.scm.pricemgr;

/**
 * 系统单据类型
 * @author Mark
 *
 */
public enum BillType {
	 PurchaseBill//采购单
	,PurchaseWarehouse//采购入库单
	,PurchaseReturn//采购退货
	,ConsignDrawMaterial//委外领料
	,ConsignReturnMaterial//委外退料
	,ConsignWarehousing//委外入库
	,ConsignReturnProduct//委外退库
	,WorkshopDrawMaterial//车间领料
	,WorkshopReturnMaterial//车间退料
	,WorkshopWarehousing//车间入库
	,WorkshopReturnProduct//车间退货
	,WorkshopOtherDrawBill//车间其他领料
	,ProductionPlan//采购计划
	,ReturnProductWarehousing//已退货的进库单
	,ProductWarehouse//成品进仓单
	,StockAdjust//仓库调整单
	,WorkshopStockAdjust//车间调整单
	,SupplierStockAdjust//供应商调整单
	,ProductOutwarehouse//成品出仓单
	,ProductManualOutwarehouse//成品手工出仓单
}
