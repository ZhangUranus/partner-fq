package org.ofbiz.partner.scm.pricemgr.priceCalImp;

import java.math.BigDecimal;
import java.util.List;

import org.ofbiz.partner.scm.pricemgr.IPriceCal;
import org.ofbiz.partner.scm.pricemgr.PriceCalItem;

/**
 * 移动加权平均法实现类
 * @author Mark
 *
 */
public class PriceCalImp4WMA implements IPriceCal{
	private static final String module=org.ofbiz.partner.scm.pricemgr.priceCalImp.PriceCalImp4WMA.class.getName();
	
	/**
	 * 根据移动加权平均法计算单价
	 */
	@Override
	public BigDecimal calPrice(PriceCalItem item) throws Exception {
		// TODO 根据
		return null;
	}
	
}
