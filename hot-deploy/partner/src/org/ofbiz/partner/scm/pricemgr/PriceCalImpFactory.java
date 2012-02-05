package org.ofbiz.partner.scm.pricemgr;

import org.ofbiz.partner.scm.pricemgr.priceCalImp.PriceCalImp4WMA;

/**
 * 计价法工厂类
 * @author Mark
 *
 */
public class PriceCalImpFactory {
	public static IPriceCal getPriceCalImp(PriceCalType type, int year, int month){
		switch (type) {
		case WeightedMovingAverage:
			return new PriceCalImp4WMA(year, month);
		default:
			return null;
		}
	}
}
