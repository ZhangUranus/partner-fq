package org.ofbiz.partner.scm.stock;

import java.util.Calendar;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.pricemgr.MonthlySettlement;
import org.ofbiz.partner.scm.pricemgr.Utils;

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
		Date curDate=Utils.getCurDate();
		Calendar   cal   =   Calendar.getInstance();
		cal.setTime(curDate);
		int year=cal.get(Calendar.YEAR);
		int month=cal.get(Calendar.MONTH)+1;
		request.setAttribute("year", year);
		request.setAttribute("month", month);
		MonthlySettlement.getInstance().monthlySettle(request,response);
		CommonEvents.writeJsonDataToExt(response, "{success:true}");
		return "success";
	}
	
	/*
	 * 反结算
	 */
	public static String rollbackSettle(HttpServletRequest request,HttpServletResponse response) throws Exception{
		Date curDate=Utils.getCurDate();
		Calendar   cal   =   Calendar.getInstance();
		cal.setTime(curDate);
		int year=cal.get(Calendar.YEAR);
		int month=cal.get(Calendar.MONTH)+1;
		request.setAttribute("year", year);
		request.setAttribute("month", month);
		MonthlySettlement.getInstance().rollbackSettle(request,response);
		CommonEvents.writeJsonDataToExt(response, "{success:true}");
		return "success";
	}
	
}
