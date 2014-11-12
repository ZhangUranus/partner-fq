package org.ofbiz.partner.scm.tools;


import java.util.Calendar;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.common.BillBaseEvent;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.pricemgr.BillType;
import org.ofbiz.partner.scm.pricemgr.BizStockImpFactory;
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
	
	/**
	 * 修改耗料明细代码，数据迁移程序
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String moveDetailData(HttpServletRequest request, HttpServletResponse response) throws Exception {
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
	
	
	
	/**
	 * 批量撤销
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String cancelBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		
		String str = "15388e29-508d-44d0-8a5c-3244076fe25d,5e56995b-46e7-424c-8dc0-d82823b41935,5ae95a91-6a6c-4166-9c72-9b551df929e9,4dc73cda-881d-4c6a-9bdf-8a626eb6983a,1d7e08dc-7863-4fd4-b0d4-5764f30e8471,1b0d189f-72d2-4eb4-8818-5c991a12c809,47ac7e35-7aed-44bc-8549-23a8d28fed93,7c469ea5-f1a4-44b0-a132-f3dea84ee155,f25e445d-e66f-4a82-8f05-dd722ea6f57b,a4a2c665-d83e-4aea-ad6d-05600e6db93c,2356f42b-57ff-400b-95fc-eb3b7ca2c649";
		
		String[] arrStr = str.split(",");
		
		for(String billId : arrStr){
			
			Debug.log("成品出仓撤销id：" + billId + "。");

			GenericValue billHead = delegator.findOne("ProductOutwarehouse", UtilMisc.toMap("id", billId), false);
			
			// 出仓单撤销业务处理
			BizStockImpFactory.getBizStockImp(BillType.ProductOutwarehouse).updateStock(billHead, false, true);

//			BillBaseEvent.rollbackBill(request, response);// 撤销单据
		}
		
		CommonEvents.writeJsonDataToExt(response, "{success:true}");
		return "success";
	}
}