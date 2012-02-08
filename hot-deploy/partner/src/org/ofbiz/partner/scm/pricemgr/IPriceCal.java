package org.ofbiz.partner.scm.pricemgr;

import java.math.BigDecimal;

import org.ofbiz.entity.GenericValue;


/**
 * 计价法接口
 * 
 * @author Mark
 * 
 */
public interface IPriceCal {
	// 根据一次业务计算单价
	public BigDecimal calPrice(PriceCalItem item) throws Exception;
	
	public GenericValue getCurMaterialBalanceValue(String warehouseId, String materialId) throws Exception;
}
