package org.ofbiz.partner.scm.pricemgr;

/**
 * 物料计价方法 ，现在系统只支持移动加权平均法
 * @author Mark
 *
 */
public enum PriceCalType {
	//SpecificIdentification,//个别计价法
	//FirstInFirstOut,//先进先出
	WeightedMovingAverage //移动加权平均
}
