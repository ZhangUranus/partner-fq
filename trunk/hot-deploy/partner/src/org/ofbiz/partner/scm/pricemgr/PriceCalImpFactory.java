package org.ofbiz.partner.scm.pricemgr;

import org.ofbiz.partner.scm.pricemgr.priceCalImp.PriceCalImp4WMA;

/**
 * 计价法工程类
 * @author Mark
 *
 */
public class PriceCalImpFactory {
	public static IPriceCal getPriceCalImp(PriceCalType type){
		switch (type) {
		case WeightedMovingAverage:
			return new PriceCalImp4WMA();
		default:
			return null;
		}
	}
}
