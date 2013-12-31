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
		String startDate,startDateFrom,startDateTo,thisWeek;
		String selectStr ="" ;
		String todaySelectStr ="" ;
		
		if(request.getParameter("startDate") != null){
			startDate = request.getParameter("startDate");
			startDateFrom = startDate+ " 00:00:00";
			startDateTo = startDate+ " 23:59:59";
		}else{
			throw new Exception("日期不能为空！");
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date date = sdf.parse(startDate);
		thisWeek = Utils.getYearWeekStr(date);
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		int dayOfWeek =cal.get(Calendar.DAY_OF_WEEK);

		/*
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
		*/
		switch(dayOfWeek){
			case Calendar.SUNDAY:
				todaySelectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0))";
				selectStr = "0";
				break;
			case Calendar.MONDAY:
				todaySelectStr = "SUM(IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0))";
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0))";
				break;
			case Calendar.TUESDAY:
				todaySelectStr = "SUM(IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0))";
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0))";
				break;
			case Calendar.WEDNESDAY:
				todaySelectStr = "SUM(IFNULL(WEN_NOR_IN_QTY,0)+IFNULL(WEN_CHG_BRD_QTY,0))";
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)+IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0))";
				break;
			case Calendar.THURSDAY:
				todaySelectStr = "SUM(IFNULL(THU_NOR_IN_QTY,0)+IFNULL(THU_CHG_BRD_QTY,0))";
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)+IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0)+IFNULL(WEN_NOR_IN_QTY,0)+IFNULL(WEN_CHG_BRD_QTY,0))";
				break;
			case Calendar.FRIDAY:
				todaySelectStr = "SUM(IFNULL(FRI_NOR_IN_QTY,0)+IFNULL(FRI_CHG_BRD_QTY,0))";
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)+IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0)+IFNULL(WEN_NOR_IN_QTY,0)+IFNULL(WEN_CHG_BRD_QTY,0)+IFNULL(THU_NOR_IN_QTY,0)+IFNULL(THU_CHG_BRD_QTY,0))";
				break;
			case Calendar.SATURDAY:
				todaySelectStr = "SUM(IFNULL(STA_NOR_IN_QTY,0)+IFNULL(STA_CHG_BRD_QTY,0))";
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)+IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0)+IFNULL(WEN_NOR_IN_QTY,0)+IFNULL(WEN_CHG_BRD_QTY,0)+IFNULL(THU_NOR_IN_QTY,0)+IFNULL(THU_CHG_BRD_QTY,0)+IFNULL(FRI_NOR_IN_QTY,0)+IFNULL(FRI_CHG_BRD_QTY,0))";
				break;
		}

		if(request.getParameter("keyWord")!=null&&request.getParameter("keyWord").trim().length()>0){
			filterMaterial.append(" where  (material.name like '%").append(request.getParameter("keyWord")).append("%' or material.number like '%").append(request.getParameter("keyWord")).append("%')");
		}
		
		String sql =" SELECT \r\n"+
				" 	BIZDATE, \r\n"+
				" 	T.MATERIAL_ID, \r\n"+
				" 	MATERIAL_NAME, \r\n"+
				" 	SUM(IFNULL(T.THIS_DAY_PLN_QTY,0)) AS ORDER_QTY,  \r\n"+
				"  	SUM(IFNULL(T.LAST_WEEK_OWE_QTY,0)+IFNULL(T.LAST_DAY_OWE_QTY,0)-IFNULL(T.LAST_DAY_PLN_QTY,0)-IFNULL(T.LAST_DAY_PLN_OTH_QTY,0)) AS TODAY_BAL,  \r\n"+
				"  	SUM((IFNULL(T.THIS_DAY_PLN_QTY,0)+IFNULL(T.THIS_DAY_PLN_OTH_QTY,0))*T.BOARD_COUNT) AS VOLUME,  \r\n"+
				"  	SUM((IFNULL(T.LAST_WEEK_OWE_QTY,0)+IFNULL(T.LAST_DAY_OWE_QTY,0)+IFNULL(T.THIS_DAY_OWE_QTY,0)-IFNULL(T.LAST_DAY_PLN_QTY,0)-IFNULL(T.LAST_DAY_PLN_OTH_QTY,0)-IFNULL(T.THIS_DAY_PLN_QTY,0)-IFNULL(T.THIS_DAY_PLN_OTH_QTY,0))*T.BOARD_COUNT) AS TODAY_TOTAL  \r\n"+
				" FROM (     \r\n"+
				" 		SELECT '"+startDate+"' as BIZDATE, \r\n"+
				" 			WEEKINOUT.MATERIAL_ID AS MATERIAL_ID, \r\n"+
				" 			TM.NAME AS MATERIAL_NAME, \r\n"+
				" 			PM.BOARD_COUNT, \r\n"+
				" 			SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)+IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0)+IFNULL(WEN_NOR_IN_QTY,0)+IFNULL(WEN_CHG_BRD_QTY,0)+IFNULL(THU_NOR_IN_QTY,0)+IFNULL(THU_CHG_BRD_QTY,0)+IFNULL(FRI_NOR_IN_QTY,0)+IFNULL(FRI_CHG_BRD_QTY,0)+IFNULL(STA_NOR_IN_QTY,0)+IFNULL(STA_CHG_BRD_QTY,0)) AS LAST_WEEK_OWE_QTY, \r\n"+
				" 			0 AS LAST_DAY_OWE_QTY, \r\n"+
				" 			0 AS THIS_DAY_OWE_QTY, \r\n"+
				" 			0 AS THIS_DAY_PLN_QTY, \r\n"+
				" 			0 AS LAST_DAY_PLN_QTY, \r\n"+
				" 			0 AS THIS_DAY_PLN_OTH_QTY, \r\n"+
				" 			0 AS LAST_DAY_PLN_OTH_QTY \r\n"+
				" 		FROM PRD_IN_OUT_WEEK_DETAIL WEEKINOUT	 \r\n"+
				" 		INNER JOIN PRODUCT_MAP PM ON WEEKINOUT.MATERIAL_ID=PM.MATERIAL_ID  \r\n"+
				" 		INNER JOIN T_MATERIAL TM ON (WEEKINOUT.MATERIAL_ID=TM.ID )  \r\n"+
				" 		WHERE WEEKINOUT.WEEK<'"+thisWeek+"'  \r\n"+
				" 		AND LENGTH(PM.IKEA_ID) = 8  \r\n"+
				" 		GROUP BY WEEKINOUT.MATERIAL_ID,TM.NAME,PM.BOARD_COUNT \r\n"+
				" 		UNION ALL	 \r\n"+
				" 		SELECT '"+startDate+"' AS BIZDATE, \r\n"+
				" 			WEEKINOUT.MATERIAL_ID AS MATERIAL_ID, \r\n"+
				" 			TM.NAME AS MATERIAL_NAME, \r\n"+
				" 			PM.BOARD_COUNT, \r\n"+
				" 			0 AS LAST_WEEK_OWE_QTY, \r\n"+
				" 			"+selectStr+" AS LAST_DAY_OWE_QTY, \r\n"+
				" 			"+todaySelectStr+" AS THIS_DAY_OWE_QTY, \r\n"+
				" 			0 AS THIS_DAY_PLN_QTY, \r\n"+
				" 			0 AS LAST_DAY_PLN_QTY, \r\n"+
				" 			0 AS THIS_DAY_PLN_OTH_QTY, \r\n"+
				" 			0 AS LAST_DAY_PLN_OTH_QTY \r\n"+
				" 		FROM PRD_IN_OUT_WEEK_DETAIL WEEKINOUT	 \r\n"+
				" 		INNER JOIN PRODUCT_MAP PM ON WEEKINOUT.MATERIAL_ID=PM.MATERIAL_ID  \r\n"+
				" 		INNER JOIN T_MATERIAL TM ON (WEEKINOUT.MATERIAL_ID=TM.ID )  \r\n"+
				" 		INNER JOIN T_MATERIAL TME ON PM.ENTRY_MATERIAL_ID=TME.ID  \r\n"+
				" 		WHERE WEEKINOUT.WEEK='"+thisWeek+"'  \r\n"+
				" 		AND LENGTH(PM.IKEA_ID) = 8  \r\n"+
				" 		GROUP BY WEEKINOUT.MATERIAL_ID,TM.NAME,PM.BOARD_COUNT \r\n"+
				" 		UNION ALL	 \r\n"+
				" 		SELECT \r\n"+
				" 			'"+startDate+"' AS BIZDATE, \r\n"+
				" 			T1.MATERIAL_ID AS MATERIAL_ID, \r\n"+
				" 			T1.MATERIAL_NAME AS MATERIAL_NAME, \r\n"+
				" 			T1.BOARD_COUNT, \r\n"+
				" 			0 AS LAST_WEEK_OWE_QTY, \r\n"+
				" 			0 AS LAST_DAY_OWE_QTY, \r\n"+
				" 			0 AS THIS_DAY_OWE_QTY, \r\n"+
				" 			SUM(IFNULL(T1.ORDER_QTY,0)) AS THIS_DAY_PLN_QTY, \r\n"+
				" 			0 AS LAST_DAY_PLN_QTY, \r\n"+
				" 			0 AS THIS_DAY_PLN_OTH_QTY, \r\n"+
				" 			0 AS LAST_DAY_PLN_OTH_QTY \r\n"+
				" 		FROM (  \r\n"+
				" 			SELECT  \r\n"+
				" 				DISTINCT  \r\n"+
				" 				VERIFYENTRY.ID,  \r\n"+
				" 				VERIFYENTRY.MATERIAL_ID,  \r\n"+
				" 				TM.NAME AS MATERIAL_NAME, \r\n"+
				" 				VERIFYENTRY.ORDER_QTY, \r\n"+
				" 				PM.BOARD_COUNT  \r\n"+
				" 			FROM PRODUCT_OUT_NOTIFICATION NOTIFICATION  \r\n"+
				" 			INNER JOIN PRODUCT_OUT_NOTIFICATION_ENTRY NOTIFICATIONENTRY ON NOTIFICATIONENTRY.PARENT_ID=NOTIFICATION.ID  \r\n"+
				" 			INNER JOIN PRODUCT_OUT_VERIFY_ENTRY VERIFYENTRY ON (NOTIFICATION.DELIVER_NUMBER=VERIFYENTRY.DELIVER_NUMBER AND NOTIFICATIONENTRY.MATERIAL_ID=VERIFYENTRY.PARENT_MATERIAL_ID)  \r\n"+
				" 			INNER JOIN PRODUCT_MAP PM ON VERIFYENTRY.MATERIAL_ID=PM.MATERIAL_ID  \r\n"+
				" 			INNER JOIN T_MATERIAL TM ON (VERIFYENTRY.MATERIAL_ID=TM.ID ) \r\n"+
				" 			WHERE NOTIFICATION.PLAN_DELIVERY_DATE BETWEEN '"+startDateFrom+"' AND '"+startDateTo+"' \r\n"+
				" 				AND NOTIFICATION.STATUS=4 \r\n"+
				" 				AND LENGTH(PM.IKEA_ID) = 8  \r\n"+
				" 			) T1 \r\n"+
				" 		GROUP BY T1.MATERIAL_ID,T1.MATERIAL_NAME \r\n"+
				" 		UNION ALL	 \r\n"+
				" 		SELECT \r\n"+
				" 			'"+startDate+"' AS BIZDATE, \r\n"+
				" 			T1.MATERIAL_ID AS MATERIAL_ID, \r\n"+
				" 			T1.MATERIAL_NAME AS MATERIAL_NAME, \r\n"+
				" 			T1.BOARD_COUNT, \r\n"+
				" 			0 AS LAST_WEEK_OWE_QTY, \r\n"+
				" 			0 AS LAST_DAY_OWE_QTY, \r\n"+
				" 			0 AS THIS_DAY_OWE_QTY, \r\n"+
				" 			0 AS THIS_DAY_PLN_QTY, \r\n"+
				" 			SUM(IFNULL(T1.ORDER_QTY,0)) AS LAST_DAY_PLN_QTY, \r\n"+
				" 			0 AS THIS_DAY_PLN_OTH_QTY, \r\n"+
				" 			0 AS LAST_DAY_PLN_OTH_QTY \r\n"+
				" 		FROM (  \r\n"+
				" 			SELECT  \r\n"+
				" 				DISTINCT  \r\n"+
				" 				VERIFYENTRY.ID,  \r\n"+
				" 				VERIFYENTRY.MATERIAL_ID,  \r\n"+
				" 				TM.NAME AS MATERIAL_NAME, \r\n"+
				" 				VERIFYENTRY.ORDER_QTY, \r\n"+
				" 				PM.BOARD_COUNT  \r\n"+
				" 			FROM PRODUCT_OUT_NOTIFICATION NOTIFICATION  \r\n"+
				" 			INNER JOIN PRODUCT_OUT_NOTIFICATION_ENTRY NOTIFICATIONENTRY ON NOTIFICATIONENTRY.PARENT_ID=NOTIFICATION.ID  \r\n"+
				" 			INNER JOIN PRODUCT_OUT_VERIFY_ENTRY VERIFYENTRY ON (NOTIFICATION.DELIVER_NUMBER=VERIFYENTRY.DELIVER_NUMBER AND NOTIFICATIONENTRY.MATERIAL_ID=VERIFYENTRY.PARENT_MATERIAL_ID)  \r\n"+
				" 			INNER JOIN PRODUCT_MAP PM ON VERIFYENTRY.MATERIAL_ID=PM.MATERIAL_ID  \r\n"+
				" 			INNER JOIN T_MATERIAL TM ON (VERIFYENTRY.MATERIAL_ID=TM.ID ) \r\n"+
				" 			WHERE NOTIFICATION.PLAN_DELIVERY_DATE < '"+startDateFrom+"' \r\n"+
				" 				AND NOTIFICATION.STATUS=4 \r\n"+
				" 				AND LENGTH(PM.IKEA_ID) = 8  \r\n"+
				" 			) T1 \r\n"+
				" 		GROUP BY T1.MATERIAL_ID,T1.MATERIAL_NAME \r\n"+
				" 		UNION ALL	 \r\n"+
				" 		SELECT \r\n"+
				" 			'"+startDate+"' AS BIZDATE, \r\n"+
				" 			'' AS MATERIAL_ID, \r\n"+
				" 			TME.NAME AS MATERIAL_NAME, \r\n"+
				" 			1 AS BOARD_COUNT, \r\n"+
				" 			0 AS LAST_WEEK_OWE_QTY, \r\n"+
				" 			0 AS LAST_DAY_OWE_QTY, \r\n"+
				" 			0 AS THIS_DAY_OWE_QTY, \r\n"+
				" 			0 AS THIS_DAY_PLN_QTY, \r\n"+
				" 			0 AS LAST_DAY_PLN_QTY, \r\n"+
				" 			SUM(IFNULL(NOTIFICATIONENTRY.VOLUME,0)) AS THIS_DAY_PLN_OTH_QTY, \r\n"+
				" 			0 AS LAST_DAY_PLN_OTH_QTY \r\n"+
				" 		FROM PRODUCT_OUT_NOTIFICATION NOTIFICATION  \r\n"+
				" 		INNER JOIN PRODUCT_OUT_NOTIFICATION_ENTRY NOTIFICATIONENTRY ON NOTIFICATIONENTRY.PARENT_ID=NOTIFICATION.ID  \r\n"+
				" 		INNER JOIN T_MATERIAL TME ON (NOTIFICATIONENTRY.MATERIAL_ID=TME.ID ) \r\n"+
				" 		WHERE NOTIFICATION.PLAN_DELIVERY_DATE BETWEEN '"+startDateFrom+"' AND '"+startDateTo+"' \r\n"+
				" 			AND NOTIFICATION.STATUS=5 \r\n"+
				" 		GROUP BY TME.NAME \r\n"+
				" 		UNION ALL	 \r\n"+
				" 		SELECT \r\n"+
				" 			'"+startDate+"' AS BIZDATE, \r\n"+
				" 			'' AS MATERIAL_ID, \r\n"+
				" 			TME.NAME AS MATERIAL_NAME, \r\n"+
				" 			1 AS BOARD_COUNT, \r\n"+
				" 			0 AS LAST_WEEK_OWE_QTY, \r\n"+
				" 			0 AS LAST_DAY_OWE_QTY, \r\n"+
				" 			0 AS THIS_DAY_OWE_QTY, \r\n"+
				" 			0 AS THIS_DAY_PLN_QTY, \r\n"+
				" 			0 AS LAST_DAY_PLN_QTY, \r\n"+
				" 			0 AS THIS_DAY_PLN_OTH_QTY, \r\n"+
				" 			SUM(IFNULL(NOTIFICATIONENTRY.VOLUME,0)) AS LAST_DAY_PLN_OTH_QTY \r\n"+
				" 		FROM PRODUCT_OUT_NOTIFICATION NOTIFICATION  \r\n"+
				" 		INNER JOIN PRODUCT_OUT_NOTIFICATION_ENTRY NOTIFICATIONENTRY ON NOTIFICATIONENTRY.PARENT_ID=NOTIFICATION.ID  \r\n"+
				" 		INNER JOIN T_MATERIAL TME ON (NOTIFICATIONENTRY.MATERIAL_ID=TME.ID ) \r\n"+
				" 		WHERE NOTIFICATION.PLAN_DELIVERY_DATE < '"+startDateFrom+"' \r\n"+
				" 			AND NOTIFICATION.STATUS=5 \r\n"+
				" 		GROUP BY TME.NAME \r\n"+
				" 	) T LEFT JOIN MATERIAL_BOM MB ON T.MATERIAL_ID = MB.MATERIAL_ID  \r\n"+
				" 	WHERE MB.VALID = 'Y' OR MB.VALID IS NULL  \r\n"+
				" 	GROUP BY BIZDATE ,T.MATERIAL_ID,MATERIAL_NAME "; 
		
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
				" AND PON.STATUS IN (4,5) \r\n"+
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
		String startDate,startDateFrom,startDateTo,thisWeek;
		String selectStr ="" ;
		String todaySelectStr ="" ;
		
		if(request.getParameter("startDate") != null){
			startDate = request.getParameter("startDate");
			startDateFrom = startDate+ " 00:00:00";
			startDateTo = startDate+ " 23:59:59";
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
				todaySelectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0))";
				selectStr = "0";
				break;
			case Calendar.MONDAY:
				todaySelectStr = "SUM(IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0))";
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0))";
				break;
			case Calendar.TUESDAY:
				todaySelectStr = "SUM(IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0))";
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0))";
				break;
			case Calendar.WEDNESDAY:
				todaySelectStr = "SUM(IFNULL(WEN_NOR_IN_QTY,0)+IFNULL(WEN_CHG_BRD_QTY,0))";
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)+IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0))";
				break;
			case Calendar.THURSDAY:
				todaySelectStr = "SUM(IFNULL(THU_NOR_IN_QTY,0)+IFNULL(THU_CHG_BRD_QTY,0))";
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)+IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0)+IFNULL(WEN_NOR_IN_QTY,0)+IFNULL(WEN_CHG_BRD_QTY,0))";
				break;
			case Calendar.FRIDAY:
				todaySelectStr = "SUM(IFNULL(FRI_NOR_IN_QTY,0)+IFNULL(FRI_CHG_BRD_QTY,0))";
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)+IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0)+IFNULL(WEN_NOR_IN_QTY,0)+IFNULL(WEN_CHG_BRD_QTY,0)+IFNULL(THU_NOR_IN_QTY,0)+IFNULL(THU_CHG_BRD_QTY,0))";
				break;
			case Calendar.SATURDAY:
				todaySelectStr = "SUM(IFNULL(STA_NOR_IN_QTY,0)+IFNULL(STA_CHG_BRD_QTY,0))";
				selectStr = "SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)+IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0)+IFNULL(WEN_NOR_IN_QTY,0)+IFNULL(WEN_CHG_BRD_QTY,0)+IFNULL(THU_NOR_IN_QTY,0)+IFNULL(THU_CHG_BRD_QTY,0)+IFNULL(FRI_NOR_IN_QTY,0)+IFNULL(FRI_CHG_BRD_QTY,0))";
				break;
		}

		if(request.getParameter("number")!=null&&request.getParameter("number").trim().length()>0){
			filterNumer.append(" AND T1.NUMBER = '").append(request.getParameter("number")).append("'");
		}
		
		String sql ="	SELECT \r\n"+
					"		NOTIFICATION.ORDER_NUMBER AS ORDER_NUMBER,   \r\n"+
					"		NOTIFICATION.REQUIRE_RECEIVE_DATE AS REQUIRE_RECEIVE_DATE,   \r\n"+
					"		NOTIFICATION.ORDER_GET_DATE AS ORDER_GET_DATE,   \r\n"+
					"		IFNULL(VERIFY_ENTRY.MATERIAL_ID,NOTIFICATION.MATERIALID) AS MATERIAL_ID,   \r\n"+
					"		IFNULL(MATERIAL_ENTRY.NAME,MATERIAL.NAME) MATERIAL_NAME,   \r\n"+
					"		HIS.ORDER_QTY, \r\n"+
					"		HIS.TODAY_BAL, \r\n"+
					"		IFNULL(HIS.VOLUME,NOTIFICATION.VOLUME) AS VOLUME, \r\n"+
					"		IFNULL(HIS.TODAY_TOTAL,-NOTIFICATION.VOLUME) AS TODAY_TOTAL \r\n"+
					"	FROM (   \r\n"+
					"		SELECT    \r\n"+
					"			T2.ORDER_NUMBER,   \r\n"+
					"			T2.REQUIRE_RECEIVE_DATE,   \r\n"+
					"			T2.ORDER_GET_DATE,   \r\n"+
					"			T1.DELIVER_NUMBER DELIVERNUMBER,   \r\n"+
					"			T2.MATERIAL_ID MATERIALID,   \r\n"+
					"			MIN(T1.PLAN_DELIVERY_DATE) AS BIZDATE, \r\n"+
					"			SUM(T2.VOLUME) AS VOLUME \r\n"+
					"		FROM PRODUCT_OUT_NOTIFICATION T1   \r\n"+
					"		INNER JOIN PRODUCT_OUT_NOTIFICATION_ENTRY T2 ON T1.ID=T2.PARENT_ID    \r\n"+
					"		WHERE STATUS IN (4,5)   \r\n"+
					"			AND DATE(T1.PLAN_DELIVERY_DATE)='"+startDate+"'   \r\n"+
								filterNumer.toString() +
					"		GROUP BY T1.DELIVER_NUMBER,T2.MATERIAL_ID HAVING DELIVERNUMBER IS NOT NULL \r\n"+
					"	 ) NOTIFICATION    \r\n"+
					"	 LEFT JOIN PRODUCT_OUT_VERIFY_ENTRY VERIFY_ENTRY ON (NOTIFICATION.DELIVERNUMBER=VERIFY_ENTRY.DELIVER_NUMBER AND NOTIFICATION.MATERIALID=VERIFY_ENTRY.PARENT_MATERIAL_ID) \r\n"+
					"	 LEFT JOIN ( \r\n"+
					"		SELECT  \r\n"+
					"			T.MATERIAL_ID, \r\n"+
					"			SUM(IFNULL(T.THIS_DAY_PLN_QTY,0)) AS ORDER_QTY,   \r\n"+
					"			SUM(IFNULL(T.LAST_WEEK_OWE_QTY,0)+IFNULL(T.LAST_DAY_OWE_QTY,0)-IFNULL(T.LAST_DAY_PLN_QTY,0)-IFNULL(T.LAST_DAY_PLN_OTH_QTY,0)) AS TODAY_BAL,   \r\n"+
					"			SUM((IFNULL(T.THIS_DAY_PLN_QTY,0)+IFNULL(T.THIS_DAY_PLN_OTH_QTY,0))*T.BOARD_COUNT) AS VOLUME,   \r\n"+
					"			SUM((IFNULL(T.LAST_WEEK_OWE_QTY,0)+IFNULL(T.LAST_DAY_OWE_QTY,0)+IFNULL(T.THIS_DAY_OWE_QTY,0)-IFNULL(T.LAST_DAY_PLN_QTY,0)-IFNULL(T.LAST_DAY_PLN_OTH_QTY,0)-IFNULL(T.THIS_DAY_PLN_QTY,0)-IFNULL(T.THIS_DAY_PLN_OTH_QTY,0))*T.BOARD_COUNT) AS TODAY_TOTAL   \r\n"+
					"		FROM (      \r\n"+
					"			SELECT  \r\n"+
					"				WEEKINOUT.MATERIAL_ID AS MATERIAL_ID, \r\n"+
					"				PM.BOARD_COUNT,  \r\n"+
					"				SUM(IFNULL(SUN_NOR_IN_QTY,0)+IFNULL(SUN_CHG_BRD_QTY,0)+IFNULL(MON_NOR_IN_QTY,0)+IFNULL(MON_CHG_BRD_QTY,0)+IFNULL(TUE_NOR_IN_QTY,0)+IFNULL(TUE_CHG_BRD_QTY,0)+IFNULL(WEN_NOR_IN_QTY,0)+IFNULL(WEN_CHG_BRD_QTY,0)+IFNULL(THU_NOR_IN_QTY,0)+IFNULL(THU_CHG_BRD_QTY,0)+IFNULL(FRI_NOR_IN_QTY,0)+IFNULL(FRI_CHG_BRD_QTY,0)+IFNULL(STA_NOR_IN_QTY,0)+IFNULL(STA_CHG_BRD_QTY,0)) AS LAST_WEEK_OWE_QTY,  \r\n"+
					"				0 AS LAST_DAY_OWE_QTY,  \r\n"+
					"				0 AS THIS_DAY_OWE_QTY,  \r\n"+
					"				0 AS THIS_DAY_PLN_QTY,  \r\n"+
					"				0 AS LAST_DAY_PLN_QTY,  \r\n"+
					"				0 AS THIS_DAY_PLN_OTH_QTY,  \r\n"+
					"				0 AS LAST_DAY_PLN_OTH_QTY  \r\n"+
					"		 	FROM PRD_IN_OUT_WEEK_DETAIL WEEKINOUT	  \r\n"+
					"		 	INNER JOIN PRODUCT_MAP PM ON WEEKINOUT.MATERIAL_ID=PM.MATERIAL_ID   \r\n"+
					"		 	WHERE WEEKINOUT.WEEK<'"+thisWeek+"'   \r\n"+
					"		 	AND LENGTH(PM.IKEA_ID) = 8   \r\n"+
					"		 	GROUP BY WEEKINOUT.MATERIAL_ID,PM.BOARD_COUNT  \r\n"+
					"		 	UNION ALL	  \r\n"+
					"		 	SELECT  \r\n"+
					"		 		WEEKINOUT.MATERIAL_ID AS MATERIAL_ID, \r\n"+
					"		 		PM.BOARD_COUNT,  \r\n"+
					"		 		0 AS LAST_WEEK_OWE_QTY,  \r\n"+
					" 				"+selectStr+" AS LAST_DAY_OWE_QTY, \r\n"+
					" 				"+todaySelectStr+" AS THIS_DAY_OWE_QTY, \r\n"+
					"		 		0 AS THIS_DAY_PLN_QTY,  \r\n"+
					"		 		0 AS LAST_DAY_PLN_QTY,  \r\n"+
					"		 		0 AS THIS_DAY_PLN_OTH_QTY,  \r\n"+
					"		 		0 AS LAST_DAY_PLN_OTH_QTY  \r\n"+
					"		 	FROM PRD_IN_OUT_WEEK_DETAIL WEEKINOUT	  \r\n"+
					"		 	INNER JOIN PRODUCT_MAP PM ON WEEKINOUT.MATERIAL_ID=PM.MATERIAL_ID   \r\n"+
					"		 	WHERE WEEKINOUT.WEEK='"+thisWeek+"'   \r\n"+
					"		 	AND LENGTH(PM.IKEA_ID) = 8   \r\n"+
					"		 	GROUP BY WEEKINOUT.MATERIAL_ID,PM.BOARD_COUNT  \r\n"+
					"		 	UNION ALL	  \r\n"+
					"		 	SELECT  \r\n"+
					"		 		T1.MATERIAL_ID AS MATERIAL_ID,  \r\n"+
					"		 		T1.BOARD_COUNT,  \r\n"+
					"		 		0 AS LAST_WEEK_OWE_QTY,  \r\n"+
					"		 		0 AS LAST_DAY_OWE_QTY,  \r\n"+
					"		 		0 AS THIS_DAY_OWE_QTY,  \r\n"+
					"		 		SUM(IFNULL(T1.ORDER_QTY,0)) AS THIS_DAY_PLN_QTY,  \r\n"+
					"		 		0 AS LAST_DAY_PLN_QTY,  \r\n"+
					"		 		0 AS THIS_DAY_PLN_OTH_QTY,  \r\n"+
					"		 		0 AS LAST_DAY_PLN_OTH_QTY  \r\n"+
					"		 	FROM (   \r\n"+
					"		 		SELECT   \r\n"+
					"		 			DISTINCT   \r\n"+
					"		 			VERIFYENTRY.ID,   \r\n"+
					"		 			VERIFYENTRY.MATERIAL_ID,   \r\n"+
					"		 			VERIFYENTRY.ORDER_QTY,  \r\n"+
					"		 			PM.BOARD_COUNT   \r\n"+
					"		 		FROM PRODUCT_OUT_NOTIFICATION NOTIFICATION   \r\n"+
					"		 		INNER JOIN PRODUCT_OUT_NOTIFICATION_ENTRY NOTIFICATIONENTRY ON NOTIFICATIONENTRY.PARENT_ID=NOTIFICATION.ID   \r\n"+
					"		 		INNER JOIN PRODUCT_OUT_VERIFY_ENTRY VERIFYENTRY ON (NOTIFICATION.DELIVER_NUMBER=VERIFYENTRY.DELIVER_NUMBER AND NOTIFICATIONENTRY.MATERIAL_ID=VERIFYENTRY.PARENT_MATERIAL_ID)   \r\n"+
					"		 		INNER JOIN PRODUCT_MAP PM ON VERIFYENTRY.MATERIAL_ID=PM.MATERIAL_ID   \r\n"+
					" 				WHERE NOTIFICATION.PLAN_DELIVERY_DATE BETWEEN '"+startDateFrom+"' AND '"+startDateTo+"' \r\n"+
					"		 			AND NOTIFICATION.STATUS=4  \r\n"+
					"		 			AND LENGTH(PM.IKEA_ID) = 8   \r\n"+
					"		 		) T1  \r\n"+
					"		 	GROUP BY T1.MATERIAL_ID \r\n"+
					"		 	UNION ALL	  \r\n"+
					"		 	SELECT  \r\n"+
					"		 		T1.MATERIAL_ID AS MATERIAL_ID,  \r\n"+
					"		 		T1.BOARD_COUNT,  \r\n"+
					"		 		0 AS LAST_WEEK_OWE_QTY,  \r\n"+
					"		 		0 AS LAST_DAY_OWE_QTY,  \r\n"+
					"		 		0 AS THIS_DAY_OWE_QTY,  \r\n"+
					"		 		0 AS THIS_DAY_PLN_QTY,  \r\n"+
					"		 		SUM(IFNULL(T1.ORDER_QTY,0)) AS LAST_DAY_PLN_QTY,  \r\n"+
					"		 		0 AS THIS_DAY_PLN_OTH_QTY,  \r\n"+
					"		 		0 AS LAST_DAY_PLN_OTH_QTY  \r\n"+
					"		 	FROM (   \r\n"+
					"		 		SELECT   \r\n"+
					"		 			DISTINCT   \r\n"+
					"		 			VERIFYENTRY.ID,   \r\n"+
					"		 			VERIFYENTRY.MATERIAL_ID,   \r\n"+
					"		 			VERIFYENTRY.ORDER_QTY,  \r\n"+
					"		 			PM.BOARD_COUNT   \r\n"+
					"		 		FROM PRODUCT_OUT_NOTIFICATION NOTIFICATION   \r\n"+
					"		 		INNER JOIN PRODUCT_OUT_NOTIFICATION_ENTRY NOTIFICATIONENTRY ON NOTIFICATIONENTRY.PARENT_ID=NOTIFICATION.ID   \r\n"+
					"		 		INNER JOIN PRODUCT_OUT_VERIFY_ENTRY VERIFYENTRY ON (NOTIFICATION.DELIVER_NUMBER=VERIFYENTRY.DELIVER_NUMBER AND NOTIFICATIONENTRY.MATERIAL_ID=VERIFYENTRY.PARENT_MATERIAL_ID)   \r\n"+
					"		 		INNER JOIN PRODUCT_MAP PM ON VERIFYENTRY.MATERIAL_ID=PM.MATERIAL_ID   \r\n"+
					" 				WHERE NOTIFICATION.PLAN_DELIVERY_DATE < '"+startDateFrom+"' \r\n"+
					"		 			AND NOTIFICATION.STATUS=4  \r\n"+
					"		 			AND LENGTH(PM.IKEA_ID) = 8   \r\n"+
					"		 		) T1  \r\n"+
					"		 	GROUP BY T1.MATERIAL_ID \r\n"+
					"		 	UNION ALL	  \r\n"+
					"		 	SELECT  \r\n"+
					"		 		NOTIFICATIONENTRY.MATERIAL_ID AS MATERIAL_ID,  \r\n"+
					"		 		1 AS BOARD_COUNT,  \r\n"+
					"		 		0 AS LAST_WEEK_OWE_QTY,  \r\n"+
					"		 		0 AS LAST_DAY_OWE_QTY,  \r\n"+
					"		 		0 AS THIS_DAY_OWE_QTY,  \r\n"+
					"		 		0 AS THIS_DAY_PLN_QTY,  \r\n"+
					"		 		0 AS LAST_DAY_PLN_QTY,  \r\n"+
					"		 		SUM(IFNULL(NOTIFICATIONENTRY.VOLUME,0)) AS THIS_DAY_PLN_OTH_QTY,  \r\n"+
					"		 		0 AS LAST_DAY_PLN_OTH_QTY  \r\n"+
					"		 	FROM PRODUCT_OUT_NOTIFICATION NOTIFICATION   \r\n"+
					"		 	INNER JOIN PRODUCT_OUT_NOTIFICATION_ENTRY NOTIFICATIONENTRY ON NOTIFICATIONENTRY.PARENT_ID=NOTIFICATION.ID   \r\n"+
					" 			WHERE NOTIFICATION.PLAN_DELIVERY_DATE BETWEEN '"+startDateFrom+"' AND '"+startDateTo+"' \r\n"+
					"		 		AND NOTIFICATION.STATUS=5  \r\n"+
					"		 	GROUP BY NOTIFICATIONENTRY.MATERIAL_ID  \r\n"+
					"		 	UNION ALL	  \r\n"+
					"		 	SELECT  \r\n"+
					"		 		NOTIFICATIONENTRY.MATERIAL_ID AS MATERIAL_ID,  \r\n"+
					"		 		1 AS BOARD_COUNT,  \r\n"+
					"		 		0 AS LAST_WEEK_OWE_QTY,  \r\n"+
					"		 		0 AS LAST_DAY_OWE_QTY,  \r\n"+
					"		 		0 AS THIS_DAY_OWE_QTY,  \r\n"+
					"		 		0 AS THIS_DAY_PLN_QTY, \r\n"+
					"		 		0 AS LAST_DAY_PLN_QTY,  \r\n"+
					"		 		0 AS THIS_DAY_PLN_OTH_QTY,  \r\n"+
					"		 		SUM(IFNULL(NOTIFICATIONENTRY.VOLUME,0)) AS LAST_DAY_PLN_OTH_QTY  \r\n"+
					"		 	FROM PRODUCT_OUT_NOTIFICATION NOTIFICATION \r\n"+
					"		 	INNER JOIN PRODUCT_OUT_NOTIFICATION_ENTRY NOTIFICATIONENTRY ON NOTIFICATIONENTRY.PARENT_ID=NOTIFICATION.ID   \r\n"+
					" 			WHERE NOTIFICATION.PLAN_DELIVERY_DATE < '"+startDateFrom+"' \r\n"+
					"		 		AND NOTIFICATION.STATUS=5  \r\n"+
					"		 	GROUP BY NOTIFICATIONENTRY.MATERIAL_ID \r\n"+
					"		) T  \r\n"+
					"		LEFT JOIN MATERIAL_BOM MB ON T.MATERIAL_ID = MB.MATERIAL_ID   \r\n"+
					"		WHERE MB.VALID = 'Y' OR MB.VALID IS NULL   \r\n"+
					"		GROUP BY T.MATERIAL_ID  \r\n"+
					"		) HIS ON VERIFY_ENTRY.MATERIAL_ID = HIS.MATERIAL_ID \r\n"+
					"	LEFT JOIN T_MATERIAL MATERIAL ON NOTIFICATION.MATERIALID=MATERIAL.ID   \r\n"+
					"	LEFT JOIN T_MATERIAL MATERIAL_ENTRY ON VERIFY_ENTRY.MATERIAL_ID=MATERIAL_ENTRY.ID ";
		return sql;
	}
}
