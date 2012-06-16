package org.ofbiz.partner.scm.pricemgr;

import org.ofbiz.partner.scm.pricemgr.bizStockImp.ConsignDrawMaterialBizImp;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.ConsignReturnMaterialBizImp;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.ConsignReturnProductBizImp;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.ConsignWarehousingBizImp;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.InspectiveBizImp;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.PurchaseReturnBizImp;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.ReturnProductWarehousingBizImp;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.WorkshopDrawMaterialBizImp;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.WorkshopOtherDrawBizImp;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.WorkshopReturnMaterialBizImp;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.WorkshopReturnProductBizImp;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.WorkshopWarehousingBizImp;

public class BizStockImpFactory {
	private static IBizStock inspectiveBizImp =new InspectiveBizImp();
	private static IBizStock purchaseReturnBizImp =new PurchaseReturnBizImp();
	private static IBizStock consignDrawMaterialBizImp =new ConsignDrawMaterialBizImp();
	private static IBizStock consignReturnProductBizImp =new ConsignReturnProductBizImp();
	private static IBizStock consignReturnMaterialBizImp =new ConsignReturnMaterialBizImp();
	private static IBizStock consignWarehousingBizImp =new ConsignWarehousingBizImp();
	private static IBizStock workshopDrawMaterialBizImp =new WorkshopDrawMaterialBizImp();
	private static IBizStock workshopReturnMaterialBizImp =new WorkshopReturnMaterialBizImp();
	private static IBizStock workshopReturnProductBizImp =new WorkshopReturnProductBizImp();
	private static IBizStock workshopWarehousingBizImp =new WorkshopWarehousingBizImp();
	private static IBizStock workshopOtherDrawBizImp =new WorkshopOtherDrawBizImp();
	private static IBizStock returnProductWarehousingBizImp =new ReturnProductWarehousingBizImp();
	public static IBizStock getBizStockImp(BillType billType) throws Exception{
		switch (billType) {
		case PurchaseWarehouse:
			return inspectiveBizImp;
		case PurchaseReturn:
			return purchaseReturnBizImp;
		case ConsignDrawMaterial:
			return  consignDrawMaterialBizImp;
		case ConsignReturnProduct:
			return  consignReturnProductBizImp;
		case ConsignReturnMaterial:
			return  consignReturnMaterialBizImp;
		case ConsignWarehousing:
			return  consignWarehousingBizImp;
		case WorkshopDrawMaterial:
			return  workshopDrawMaterialBizImp;
		case WorkshopReturnMaterial:
			return  workshopReturnMaterialBizImp;
		case WorkshopReturnProduct:
			return  workshopReturnProductBizImp;
		case WorkshopWarehousing:
			return  workshopWarehousingBizImp;
		case WorkshopOtherDrawBill:
			return workshopOtherDrawBizImp;
		case ReturnProductWarehousing:
			return returnProductWarehousingBizImp;
		default:
			throw new Exception("不支持该类型接口实现");
		}
	}
}
