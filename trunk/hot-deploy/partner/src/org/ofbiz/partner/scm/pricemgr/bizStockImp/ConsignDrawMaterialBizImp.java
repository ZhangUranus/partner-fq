package org.ofbiz.partner.scm.pricemgr.bizStockImp;

import org.ofbiz.partner.scm.pricemgr.ConsignPriceMgr;
import org.ofbiz.partner.scm.pricemgr.IBizStock;
import org.ofbiz.partner.scm.pricemgr.PriceCalItem;
import org.ofbiz.partner.scm.pricemgr.PriceMgr;

public class ConsignDrawMaterialBizImp implements IBizStock {
	public void updateStock(PriceCalItem calItem) throws Exception {
		if(calItem.isOut()){
			//如果是出库业务，数量、金额转换为负数
			calItem.setAmount(calItem.getAmount().negate());
			calItem.setSum(calItem.getSum().negate());
		}
		PriceMgr.getInstance().calPrice(calItem);
		
		//更新加工商库存表
		ConsignPriceMgr.getInstance().update(calItem.getExtendParam(), calItem.getMaterialId(), calItem.getAmount().negate(), calItem.getSum().negate());
	}
}
