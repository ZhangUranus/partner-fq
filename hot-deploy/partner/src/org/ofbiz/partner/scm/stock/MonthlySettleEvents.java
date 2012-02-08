package org.ofbiz.partner.scm.stock;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.partner.scm.pricemgr.MonthlySettlement;

/**
 * 
 * 月度结算事件
 * @author Mark
 *
 */
public class MonthlySettleEvents {
	private static final String module=org.ofbiz.partner.scm.stock.MonthlySettleEvents.class.getName();
	/*
	 *月度结算 
	 */
	public static String monthlySettle(HttpServletRequest request,HttpServletResponse response) throws Exception{
		MonthlySettlement.getInstance().monthlySettle(request,response);
		return "success";
	}
	
	/*
	 * 反结算
	 */
	public static String rollbackSettle(HttpServletRequest request,HttpServletResponse response) throws Exception{
		MonthlySettlement.getInstance().rollbackSettle(request,response);
		return "success";
	}
	
}
