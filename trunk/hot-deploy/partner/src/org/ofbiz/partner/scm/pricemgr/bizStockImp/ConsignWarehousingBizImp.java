package org.ofbiz.partner.scm.pricemgr.bizStockImp;

import java.math.BigDecimal;
import java.util.List;

import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.pricemgr.ConsignPriceMgr;
import org.ofbiz.partner.scm.pricemgr.IBizStock;
import org.ofbiz.partner.scm.pricemgr.PriceCalItem;
import org.ofbiz.partner.scm.pricemgr.PriceMgr;

public class ConsignWarehousingBizImp implements IBizStock {

	public void updateStock(GenericValue billValue) throws Exception {
//		if (calItem.getSum() == null) {
//			BigDecimal price = ConsignPriceMgr.getInstance().CreateConsignPriceDetailList(calItem.getExtendParam(), calItem.getMaterialId(), calItem.getBillEntryId());
//			calItem.setSum(price.multiply(calItem.getAmount()));
//		}
//
//		if (calItem.isOut()) {
//			// 如果是出库业务，数量、金额转换为负数
//			calItem.setAmount(calItem.getAmount().negate());
//			calItem.setSum(calItem.getSum().negate());
//		}
//		PriceMgr.getInstance().calPrice(calItem);
//
//		// 更新加工商库存表
//		List<List> materialList = ConsignPriceMgr.getInstance().getMaterialList(calItem.getBillEntryId());
//		for (List element : materialList) {
//			String materialId = (String) element.get(0);
//			BigDecimal amount = (BigDecimal) element.get(1);
//			BigDecimal sum = (BigDecimal) element.get(2);
//			if (!calItem.isOut()) {
//				amount.negate();
//				sum.negate();
//			}
//			ConsignPriceMgr.getInstance().update(calItem.getExtendParam(), materialId, amount, sum);
//		}
	}

}
