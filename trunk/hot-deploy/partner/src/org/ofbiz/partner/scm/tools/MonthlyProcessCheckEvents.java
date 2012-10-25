package org.ofbiz.partner.scm.tools;


import java.util.Calendar;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.pricemgr.MonthlySettlement;
import org.ofbiz.partner.scm.pricemgr.Utils;

/**
 * 实体数据工具类
 * 
 * @author Mark
 * 
 */
public class MonthlyProcessCheckEvents {

	/**
	 * 检查月结过程
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String monthlySettleCheck(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Date curDate=Utils.getCurDate();
		Calendar   cal   =   Calendar.getInstance();
		cal.setTime(curDate);
		int year=cal.get(Calendar.YEAR);
		int month=cal.get(Calendar.MONTH)+1;
		request.setAttribute("year", year);
		request.setAttribute("month", month);
		MonthlySettlement.getInstance().monthlySettleCheck(request, response);
		CommonEvents.writeJsonDataToExt(response, "{success:true}");
		return "success";
	}
}