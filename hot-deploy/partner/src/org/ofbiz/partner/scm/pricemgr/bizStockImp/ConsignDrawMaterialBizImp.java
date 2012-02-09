package org.ofbiz.partner.scm.pricemgr.bizStockImp;

import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.pricemgr.ConsignPriceMgr;
import org.ofbiz.partner.scm.pricemgr.IBizStock;
import org.ofbiz.partner.scm.pricemgr.PriceCalItem;
import org.ofbiz.partner.scm.pricemgr.PriceMgr;

public class ConsignDrawMaterialBizImp implements IBizStock {
	private Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();;
	
	public void updateStock(GenericValue billValue) throws Exception {
//		//返填单价、金额、总金额
//		String billId = this.setPriceToBillEntry(calItem);
//		this.setTotalSumToBillByEntryId(calItem, billId);
//		
//		if(calItem.isOut()){
//			//如果是出库业务，数量、金额转换为负数
//			calItem.setAmount(calItem.getAmount().negate());
//			calItem.setSum(calItem.getSum().negate());
//		}
//		PriceMgr.getInstance().calPrice(calItem);
//		
//		//更新加工商库存表
//		ConsignPriceMgr.getInstance().update(calItem.getExtendParam(), calItem.getMaterialId(), calItem.getAmount().negate(), calItem.getSum().negate());
	}
	
//	private String setPriceToBillEntry(PriceCalItem calItem) throws Exception {
//		GenericValue value=delegator.findOne("ConsignDrawMaterialEntry", UtilMisc.toMap("id", calItem.getBillEntryId()), false);
//		String result = value.getString("parentId");
//		value.set("price", calItem.getSum().divide(calItem.getAmount()));
//		value.set("entrysum", calItem.getSum());
//		value.store();
//		return result;
//	}
//	
//	private void setTotalSumToBillByEntryId(PriceCalItem calItem, String billId) throws Exception {
//		GenericValue value=delegator.findOne("ConsignDrawMaterial", UtilMisc.toMap("id", billId), false);
//		value.set("totalsum", value.getBigDecimal("totalsum").add(calItem.getSum()));
//		value.store();
//	}
}
