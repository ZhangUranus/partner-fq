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
	
	//获取仓库中某物料对象
	public GenericValue getCurMaterialBalanceValue(String warehouseId, String materialId) throws Exception;
	
	//获取某物料加权平均单价
	public BigDecimal getPrice(String warehouseId, String materialId) throws Exception;
}
