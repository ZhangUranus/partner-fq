package org.ofbiz.partner.scm.rpt;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.pricemgr.Utils;

public class ProductSendOweReportDayEvents {
	static final SimpleDateFormat timeFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	static final SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd");
	
	/*
	 * 查询当天欠数情况
	 * */
	public static String queryMainData(HttpServletRequest request, HttpServletResponse response) throws Exception {
		CommonEvents.writeJsonDataToExt(response, DataFetchEvents.executeSelectSQL(request,getMainDataSql(request)));
		return "sucess";
	}
	
	public static String getMainDataSql(HttpServletRequest request) throws Exception {
		StringBuffer filterMaterial=new StringBuffer();//物料过滤
		String startDate,thisWeek;
		String selectStr ="" ;
		
		if(request.getParameter("startDate") != null){
			startDate = request.getParameter("startDate");
		}else{
			throw new Exception("日期不能为空！");
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date date = sdf.parse(startDate);
		thisWeek = Utils.getYearWeekStr(date);
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		int dayOfWeek =cal.get(Calendar.DAY_OF_WEEK);

		switch(dayOfWeek){
			case Calendar.SUNDAY:
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)-IFNULL(SUN_NOR_OUT_QTY,0))";
				break;
			case Calendar.MONDAY:
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)-IFNULL(SUN_NOR_OUT_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)-IFNULL(MON_NOR_OUT_QTY,0))";
				break;
			case Calendar.TUESDAY:
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)-IFNULL(SUN_NOR_OUT_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)-IFNULL(MON_NOR_OUT_QTY,0)+IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0)-IFNULL(TUE_NOR_OUT_QTY,0))";
				break;
			case Calendar.WEDNESDAY:
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)-IFNULL(SUN_NOR_OUT_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)-IFNULL(MON_NOR_OUT_QTY,0)+IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0)-IFNULL(TUE_NOR_OUT_QTY,0)+IFNULL(WEN_NOR_IN_QTY,0)+IFNULL(WEN_CHG_BRD_QTY,0)-IFNULL(WEN_NOR_OUT_QTY,0))";
				break;
			case Calendar.THURSDAY:
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)-IFNULL(SUN_NOR_OUT_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)-IFNULL(MON_NOR_OUT_QTY,0)+IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0)-IFNULL(TUE_NOR_OUT_QTY,0)+IFNULL(WEN_NOR_IN_QTY,0)+IFNULL(WEN_CHG_BRD_QTY,0)-IFNULL(WEN_NOR_OUT_QTY,0)+IFNULL(THU_NOR_IN_QTY,0)+IFNULL(THU_CHG_BRD_QTY,0)-IFNULL(THU_NOR_OUT_QTY,0))";
				break;
			case Calendar.FRIDAY:
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)-IFNULL(SUN_NOR_OUT_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)-IFNULL(MON_NOR_OUT_QTY,0)+IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0)-IFNULL(TUE_NOR_OUT_QTY,0)+IFNULL(WEN_NOR_IN_QTY,0)+IFNULL(WEN_CHG_BRD_QTY,0)-IFNULL(WEN_NOR_OUT_QTY,0)+IFNULL(THU_NOR_IN_QTY,0)+IFNULL(THU_CHG_BRD_QTY,0)-IFNULL(THU_NOR_OUT_QTY,0)+IFNULL(FRI_NOR_IN_QTY,0)+IFNULL(FRI_CHG_BRD_QTY,0)-IFNULL(FRI_NOR_OUT_QTY,0))";
				break;
			case Calendar.SATURDAY:
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)-IFNULL(SUN_NOR_OUT_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)-IFNULL(MON_NOR_OUT_QTY,0)+IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0)-IFNULL(TUE_NOR_OUT_QTY,0)+IFNULL(WEN_NOR_IN_QTY,0)+IFNULL(WEN_CHG_BRD_QTY,0)-IFNULL(WEN_NOR_OUT_QTY,0)+IFNULL(THU_NOR_IN_QTY,0)+IFNULL(THU_CHG_BRD_QTY,0)-IFNULL(THU_NOR_OUT_QTY,0)+IFNULL(FRI_NOR_IN_QTY,0)+IFNULL(FRI_CHG_BRD_QTY,0)-IFNULL(FRI_NOR_OUT_QTY,0)+IFNULL(STA_NOR_IN_QTY,0)+IFNULL(STA_CHG_BRD_QTY,0)-IFNULL(STA_NOR_OUT_QTY,0))";
				break;
		}

		if(request.getParameter("keyWord")!=null&&request.getParameter("keyWord").trim().length()>0){
			filterMaterial.append(" where  (material.name like '%").append(request.getParameter("keyWord")).append("%' or material.number like '%").append(request.getParameter("keyWord")).append("%')");
		}
		
		String sql = " SELECT \r\n"+
				" 	NOTIFICATION.BIZDATE AS BIZDATE, \r\n"+
				" 	IFNULL(VERIFY_ENTRY.MATERIAL_ID,NOTIFICATION.MATERIALID) AS MATERIAL_ID, \r\n"+
				" 	IFNULL(MATERIAL_ENTRY.NAME,MATERIAL.NAME) MATERIAL_NAME, \r\n"+
				" 	SUM(IFNULL(VERIFY_ENTRY.ORDER_QTY,0)) AS ORDER_QTY, \r\n"+
				" 	SUM(IFNULL(LAST_WEEK_BAL,0)+IFNULL(THIS_WEEK_BAL,0)) AS TODAY_BAL, \r\n"+
				" 	SUM(IFNULL(NOTIFICATION.VOLUME,0)) AS VOLUME, \r\n"+
				" 	SUM(IFNULL(LAST_WEEK_BAL,0)+IFNULL(THIS_WEEK_BAL,0))*IFNULL(PM.BOARD_COUNT,0) AS TODAY_TOTAL \r\n"+
				" FROM ( \r\n"+
				" 	SELECT  \r\n"+
				" 		T1.DELIVER_NUMBER DELIVERNUMBER, \r\n"+
				" 		T2.MATERIAL_ID MATERIALID, \r\n"+
				" 		MIN(T1.PLAN_DELIVERY_DATE) BIZDATE, \r\n"+
				" 		SUM(T2.VOLUME) VOLUME  \r\n"+
				" 	FROM PRODUCT_OUT_NOTIFICATION T1 \r\n"+
				" 	INNER JOIN PRODUCT_OUT_NOTIFICATION_ENTRY T2 ON T1.ID=T2.PARENT_ID  \r\n"+
				" 	WHERE STATUS IN (4,5) \r\n"+
				" 		AND DATE(T1.PLAN_DELIVERY_DATE)='"+startDate+"' \r\n"+
				" 	GROUP BY T1.DELIVER_NUMBER,T2.MATERIAL_ID HAVING DELIVERNUMBER IS NOT NULL  \r\n"+
				" ) NOTIFICATION \r\n"+
				" LEFT JOIN PRODUCT_OUT_VERIFY_HEAD VERIFY ON (NOTIFICATION.DELIVERNUMBER=VERIFY.DELIVER_NUMBER AND NOTIFICATION.MATERIALID=VERIFY.MATERIAL_ID) \r\n"+
				" LEFT JOIN PRODUCT_OUT_VERIFY_ENTRY VERIFY_ENTRY ON (VERIFY.DELIVER_NUMBER=VERIFY_ENTRY.DELIVER_NUMBER AND VERIFY.MATERIAL_ID=VERIFY_ENTRY.PARENT_MATERIAL_ID) \r\n"+
				" LEFT JOIN ( \r\n"+
				"   SELECT \r\n"+
				"     MATERIAL_ID, \r\n"+
				"     SUM(WEEK_BAL_QTY) AS LAST_WEEK_BAL \r\n"+
				"   FROM PRD_IN_OUT_WEEK_DETAIL WHERE WEEK<'"+thisWeek+"' \r\n"+
				"   GROUP BY MATERIAL_ID \r\n"+
				" ) LAST_WEEK ON IFNULL(VERIFY_ENTRY.MATERIAL_ID,NOTIFICATION.MATERIALID) = LAST_WEEK.MATERIAL_ID \r\n"+
				" LEFT JOIN ( \r\n"+
				"   SELECT \r\n"+
				"     MATERIAL_ID, \r\n"+
				"     "+selectStr+" AS THIS_WEEK_BAL \r\n"+
				"   FROM PRD_IN_OUT_WEEK_DETAIL WHERE WEEK = '"+thisWeek+"' \r\n"+
				"   GROUP BY MATERIAL_ID \r\n"+
				" ) THIS_WEEK ON IFNULL(VERIFY_ENTRY.MATERIAL_ID,NOTIFICATION.MATERIALID) = THIS_WEEK.MATERIAL_ID \r\n"+
				" LEFT JOIN T_MATERIAL MATERIAL ON NOTIFICATION.MATERIALID=MATERIAL.ID \r\n"+
				" LEFT JOIN T_MATERIAL MATERIAL_ENTRY ON VERIFY_ENTRY.MATERIAL_ID=MATERIAL_ENTRY.ID \r\n"+
				" LEFT JOIN PRODUCT_MAP PM  ON VERIFY_ENTRY.MATERIAL_ID=PM.MATERIAL_ID \r\n"+
				filterMaterial.toString() +
				" GROUP BY NOTIFICATION.BIZDATE,IFNULL(VERIFY_ENTRY.MATERIAL_ID,NOTIFICATION.MATERIALID),IFNULL(MATERIAL_ENTRY.NAME,MATERIAL.NAME) ";
		return sql;
	}
	
	/*
	 * 查询当天欠数情况明细主表
	 * */
	public static String queryDetailList(HttpServletRequest request, HttpServletResponse response) throws Exception {
		CommonEvents.writeJsonDataToExt(response, DataFetchEvents.executeSelectSQL(request,getDetailListSql(request)));
		return "sucess";
	}
	
	public static String getDetailListSql(HttpServletRequest request) throws Exception {
		String startDate;
		String selectStr = "";
		
		
		if(request.getParameter("startDate") != null){
			startDate = request.getParameter("startDate");
		}else{
			throw new Exception("日期不能为空！");
		}

		if(request.getParameter("materialId")!=null&&request.getParameter("materialId").trim().length()>0){
			selectStr =" AND PM.MATERIAL_ID = '" +  request.getParameter("materialId") +"' \r\n";
		}
		
		String sql = " SELECT DISTINCT PON.PLAN_DELIVERY_DATE AS BIZDATE, \r\n"+
				" 	PON.NUMBER, \r\n"+
				" 	PON.GOOD_NUMBER, \r\n"+
				" 	PON.PLAN_CONTAINER_TYPE  \r\n"+
				" FROM PRODUCT_OUT_NOTIFICATION PON \r\n"+
				" LEFT JOIN PRODUCT_OUT_NOTIFICATION_ENTRY PONE ON PON.ID = PONE.PARENT_ID \r\n"+
				" LEFT JOIN PRODUCT_MAP PM ON PONE.MATERIAL_ID = PM.ENTRY_MATERIAL_ID \r\n"+
				" WHERE DATE(PON.PLAN_DELIVERY_DATE)='"+startDate+"' \r\n"+
				selectStr;
		return sql;
	}
	
	/*
	 * 查询当天欠数情况明细分录
	 * */
	public static String queryDetailEntryList(HttpServletRequest request, HttpServletResponse response) throws Exception {
		CommonEvents.writeJsonDataToExt(response, DataFetchEvents.executeSelectSQL(request,getDetailEntryListSql(request)));
		return "sucess";
	}
	
	public static String getDetailEntryListSql(HttpServletRequest request) throws Exception {
		StringBuffer filterNumer=new StringBuffer();//物料过滤
		String startDate,thisWeek;
		String selectStr ="" ;
		
		if(request.getParameter("startDate") != null){
			startDate = request.getParameter("startDate");
		}else{
			throw new Exception("日期不能为空！");
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date date = sdf.parse(startDate);
		thisWeek = Utils.getYearWeekStr(date);
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		int dayOfWeek =cal.get(Calendar.DAY_OF_WEEK);

		switch(dayOfWeek){
			case Calendar.SUNDAY:
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)-IFNULL(SUN_NOR_OUT_QTY,0))";
				break;
			case Calendar.MONDAY:
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)-IFNULL(SUN_NOR_OUT_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)-IFNULL(MON_NOR_OUT_QTY,0))";
				break;
			case Calendar.TUESDAY:
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)-IFNULL(SUN_NOR_OUT_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)-IFNULL(MON_NOR_OUT_QTY,0)+IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0)-IFNULL(TUE_NOR_OUT_QTY,0))";
				break;
			case Calendar.WEDNESDAY:
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)-IFNULL(SUN_NOR_OUT_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)-IFNULL(MON_NOR_OUT_QTY,0)+IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0)-IFNULL(TUE_NOR_OUT_QTY,0)+IFNULL(WEN_NOR_IN_QTY,0)+IFNULL(WEN_CHG_BRD_QTY,0)-IFNULL(WEN_NOR_OUT_QTY,0))";
				break;
			case Calendar.THURSDAY:
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)-IFNULL(SUN_NOR_OUT_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)-IFNULL(MON_NOR_OUT_QTY,0)+IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0)-IFNULL(TUE_NOR_OUT_QTY,0)+IFNULL(WEN_NOR_IN_QTY,0)+IFNULL(WEN_CHG_BRD_QTY,0)-IFNULL(WEN_NOR_OUT_QTY,0)+IFNULL(THU_NOR_IN_QTY,0)+IFNULL(THU_CHG_BRD_QTY,0)-IFNULL(THU_NOR_OUT_QTY,0))";
				break;
			case Calendar.FRIDAY:
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)-IFNULL(SUN_NOR_OUT_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)-IFNULL(MON_NOR_OUT_QTY,0)+IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0)-IFNULL(TUE_NOR_OUT_QTY,0)+IFNULL(WEN_NOR_IN_QTY,0)+IFNULL(WEN_CHG_BRD_QTY,0)-IFNULL(WEN_NOR_OUT_QTY,0)+IFNULL(THU_NOR_IN_QTY,0)+IFNULL(THU_CHG_BRD_QTY,0)-IFNULL(THU_NOR_OUT_QTY,0)+IFNULL(FRI_NOR_IN_QTY,0)+IFNULL(FRI_CHG_BRD_QTY,0)-IFNULL(FRI_NOR_OUT_QTY,0))";
				break;
			case Calendar.SATURDAY:
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)-IFNULL(SUN_NOR_OUT_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)-IFNULL(MON_NOR_OUT_QTY,0)+IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0)-IFNULL(TUE_NOR_OUT_QTY,0)+IFNULL(WEN_NOR_IN_QTY,0)+IFNULL(WEN_CHG_BRD_QTY,0)-IFNULL(WEN_NOR_OUT_QTY,0)+IFNULL(THU_NOR_IN_QTY,0)+IFNULL(THU_CHG_BRD_QTY,0)-IFNULL(THU_NOR_OUT_QTY,0)+IFNULL(FRI_NOR_IN_QTY,0)+IFNULL(FRI_CHG_BRD_QTY,0)-IFNULL(FRI_NOR_OUT_QTY,0)+IFNULL(STA_NOR_IN_QTY,0)+IFNULL(STA_CHG_BRD_QTY,0)-IFNULL(STA_NOR_OUT_QTY,0))";
				break;
		}

		if(request.getParameter("number")!=null&&request.getParameter("number").trim().length()>0){
			filterNumer.append(" AND T1.NUMBER = '").append(request.getParameter("number")).append("'");
		}
		
		String sql = " SELECT \r\n"+
				" 	NOTIFICATION.ORDER_NUMBER AS ORDER_NUMBER, \r\n"+
				" 	NOTIFICATION.REQUIRE_RECEIVE_DATE AS REQUIRE_RECEIVE_DATE, \r\n"+
				" 	NOTIFICATION.ORDER_GET_DATE AS ORDER_GET_DATE, \r\n"+
				" 	IFNULL(VERIFY_ENTRY.MATERIAL_ID,NOTIFICATION.MATERIALID) AS MATERIAL_ID, \r\n"+
				" 	IFNULL(MATERIAL_ENTRY.NAME,MATERIAL.NAME) MATERIAL_NAME, \r\n"+
				" 	SUM(IFNULL(VERIFY_ENTRY.ORDER_QTY,0)) AS ORDER_QTY, \r\n"+
				" 	SUM(IFNULL(LAST_WEEK_BAL,0)+IFNULL(THIS_WEEK_BAL,0)) AS TODAY_BAL, \r\n"+
				" 	SUM(IFNULL(NOTIFICATION.VOLUME,0)) AS VOLUME, \r\n"+
				" 	SUM(IFNULL(LAST_WEEK_BAL,0)+IFNULL(THIS_WEEK_BAL,0))*IFNULL(PM.BOARD_COUNT,0) AS TODAY_TOTAL \r\n"+
				" FROM ( \r\n"+
				" 	SELECT  \r\n"+
				" 		T2.ORDER_NUMBER, \r\n"+
				" 		T2.REQUIRE_RECEIVE_DATE, \r\n"+
				" 		T2.ORDER_GET_DATE, \r\n"+
				" 		T1.DELIVER_NUMBER DELIVERNUMBER, \r\n"+
				" 		T2.MATERIAL_ID MATERIALID, \r\n"+
				" 		MIN(T1.PLAN_DELIVERY_DATE) BIZDATE, \r\n"+
				" 		SUM(T2.VOLUME) VOLUME  \r\n"+
				" 	FROM PRODUCT_OUT_NOTIFICATION T1 \r\n"+
				" 	INNER JOIN PRODUCT_OUT_NOTIFICATION_ENTRY T2 ON T1.ID=T2.PARENT_ID  \r\n"+
				" 	WHERE STATUS IN (4,5) \r\n"+
				" 		AND DATE(T1.PLAN_DELIVERY_DATE)='"+startDate+"' \r\n"+
						filterNumer.toString() +
				" 	GROUP BY T1.DELIVER_NUMBER,T2.MATERIAL_ID HAVING DELIVERNUMBER IS NOT NULL  \r\n"+
				" ) NOTIFICATION \r\n"+
				" LEFT JOIN PRODUCT_OUT_VERIFY_HEAD VERIFY ON (NOTIFICATION.DELIVERNUMBER=VERIFY.DELIVER_NUMBER AND NOTIFICATION.MATERIALID=VERIFY.MATERIAL_ID) \r\n"+
				" LEFT JOIN PRODUCT_OUT_VERIFY_ENTRY VERIFY_ENTRY ON (VERIFY.DELIVER_NUMBER=VERIFY_ENTRY.DELIVER_NUMBER AND VERIFY.MATERIAL_ID=VERIFY_ENTRY.PARENT_MATERIAL_ID) \r\n"+
				" LEFT JOIN ( \r\n"+
				"   SELECT \r\n"+
				"     MATERIAL_ID, \r\n"+
				"     SUM(WEEK_BAL_QTY) AS LAST_WEEK_BAL \r\n"+
				"   FROM PRD_IN_OUT_WEEK_DETAIL WHERE WEEK<'"+thisWeek+"' \r\n"+
				"   GROUP BY MATERIAL_ID \r\n"+
				" ) LAST_WEEK ON IFNULL(VERIFY_ENTRY.MATERIAL_ID,NOTIFICATION.MATERIALID) = LAST_WEEK.MATERIAL_ID \r\n"+
				" LEFT JOIN ( \r\n"+
				"   SELECT \r\n"+
				"     MATERIAL_ID, \r\n"+
				"     "+selectStr+" AS THIS_WEEK_BAL \r\n"+
				"   FROM PRD_IN_OUT_WEEK_DETAIL WHERE WEEK = '"+thisWeek+"' \r\n"+
				"   GROUP BY MATERIAL_ID \r\n"+
				" ) THIS_WEEK ON IFNULL(VERIFY_ENTRY.MATERIAL_ID,NOTIFICATION.MATERIALID) = THIS_WEEK.MATERIAL_ID \r\n"+
				" LEFT JOIN T_MATERIAL MATERIAL ON NOTIFICATION.MATERIALID=MATERIAL.ID \r\n"+
				" LEFT JOIN T_MATERIAL MATERIAL_ENTRY ON VERIFY_ENTRY.MATERIAL_ID=MATERIAL_ENTRY.ID \r\n"+
				" LEFT JOIN PRODUCT_MAP PM  ON VERIFY_ENTRY.MATERIAL_ID=PM.MATERIAL_ID \r\n"+
				" GROUP BY NOTIFICATION.ORDER_NUMBER,NOTIFICATION.REQUIRE_RECEIVE_DATE,NOTIFICATION.ORDER_GET_DATE,IFNULL(VERIFY_ENTRY.MATERIAL_ID,NOTIFICATION.MATERIALID),IFNULL(MATERIAL_ENTRY.NAME,MATERIAL.NAME) ";
		return sql;
	}
}
