package org.ofbiz.partner.scm.pricemgr;

import java.util.List;

/**
 * 单价管理类，单价类只影响当期未结算月份物料单价
 * @author Mark
 *
 */
public class PriceMgr {
	private static final String module=org.ofbiz.partner.scm.pricemgr.PriceMgr.class.getName();
	/**
	 * 根据list的顺序计算当前
	 * @param calItemList
	 */
	public void calPrice(List<PriceCalItem> calItemList)throws Exception{
		throw new Exception();
	}
}
