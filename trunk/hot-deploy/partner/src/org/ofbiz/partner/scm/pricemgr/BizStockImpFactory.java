package org.ofbiz.partner.scm.pricemgr;

import org.ofbiz.partner.scm.pricemgr.bizStockImp.ConsignDrawMaterialBizImp;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.ConsignReturnMaterialBizImp;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.ConsignReturnProductBizImp;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.ConsignWarehousingBizImp;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.InspectiveBizImp;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.PurchaseReturnBizImp;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.WorkshopDrawMaterialBizImp;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.WorkshopReturnMaterialBizImp;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.WorkshopReturnProductBizImp;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.WorkshopWarehousingBizImp;

public class BizStockImpFactory {
	public static IBizStock getBizStockImp(BillType billType) throws Exception{
		switch (billType) {
		case PurchaseWarehouse:
			return new InspectiveBizImp();
		case PurchaseReturn:
			return new PurchaseReturnBizImp();
		case ConsignDrawMaterial:
			return new ConsignDrawMaterialBizImp();
		case ConsignReturnProduct:
			return new ConsignReturnProductBizImp();
		case ConsignReturnMaterial:
			return new ConsignReturnMaterialBizImp();
		case ConsignWarehousing:
			return new ConsignWarehousingBizImp();
		case WorkshopDrawMaterial:
			return new WorkshopDrawMaterialBizImp();
		case WorkshopReturnMaterial:
			return new WorkshopReturnMaterialBizImp();
		case WorkshopReturnProduct:
			return new WorkshopReturnProductBizImp();
		case WorkshopWarehousing:
			return new WorkshopWarehousingBizImp();
		default:
			throw new Exception("不支持该类型接口实现");
		}
	}
}
