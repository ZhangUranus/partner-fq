package org.ofbiz.partner.scm.pricemgr;

import java.math.BigDecimal;


/**
 * 计价法接口
 * 
 * @author Mark
 * 
 */
public interface IPriceCal {
	// 根据一次业务计算单价
	public BigDecimal calPrice(PriceCalItem item) throws Exception;
	
	//获取当前单价
	public BigDecimal getCurPrice(String warehouseId,String materialId) throws Exception;
}
