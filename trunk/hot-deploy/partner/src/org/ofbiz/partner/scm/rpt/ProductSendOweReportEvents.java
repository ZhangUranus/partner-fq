package org.ofbiz.partner.scm.rpt;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.ofbiz.entity.jdbc.ConnectionFactory;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.common.DatePeriod;
import org.ofbiz.partner.scm.pricemgr.Utils;


public class ProductSendOweReportEvents {
	static final SimpleDateFormat timeFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	static final SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd");
	
	public static String queryMainData(HttpServletRequest request, HttpServletResponse response) throws Exception {
		CommonEvents.writeJsonDataToExt(response, DataFetchEvents.executeSelectSQL(request,getMainDataSql(request)));
		
		return "sucess";
	}
	
	public static String getMainDataSql(HttpServletRequest request) throws Exception {
		String weekStr;//查询周
		String lastWeekStr="";//上一周
		DatePeriod weekDatePeriod;//周日期范围
		DatePeriod lastWeekDatePeriod;//上一周日期范围
		StringBuffer filterMaterial=new StringBuffer();//物料过滤
		StringBuffer filterMaterialEntry=new StringBuffer();//物料过滤
		
		if(request.getParameter("week")==null)throw new Exception("周不能为空！");
		weekStr=request.getParameter("week");
		weekDatePeriod=Utils.getDatePeriodFromWeekStr(weekStr);
		
		// 初始化上周的参数
		Calendar cal = Calendar.getInstance();
		cal.setTime(weekDatePeriod.fromDate);
		cal.add(Calendar.WEEK_OF_YEAR, -1);
		lastWeekStr = Utils.getYearWeekStr(cal.getTime());
		lastWeekDatePeriod = Utils.getDatePeriodFromWeekStr(lastWeekStr);
		
		if(request.getParameter("keyWord")!=null&&request.getParameter("keyWord").trim().length()>0){
			filterMaterial.append(" and  (tm.name like '%").append(request.getParameter("keyWord")).append("%' or tm.number like '%").append(request.getParameter("keyWord")).append("%')");
			filterMaterialEntry.append(" and  (tme.name like '%").append(request.getParameter("keyWord")).append("%' or tme.number like '%").append(request.getParameter("keyWord")).append("%')");
		}
		
		String sql = "SELECT\r\n"+
				"	WEEK,\r\n"+
				"	SORT,\r\n"+
				"	ENTRY_MATERIAL_NAME,\r\n"+
				"	T.MATERIAL_ID,\r\n"+
				"	MATERIAL_NAME,\r\n"+
				"	BOARD_COUNT,\r\n"+
				"	SUM(LAST_WEEK_IN_QTY)+SUM(LAST_WEEK_CHG_QTY)-SUM(LAST_WEEK_PLN_QTY) AS LAST_WEEK_OWE_QTY,\r\n"+
				"	SUM(THIS_WEEK_OUT_QTY) AS THIS_WEEK_OUT_QTY,\r\n"+
				"	SUM(THIS_WEEK_IN_QTY) AS THIS_WEEK_IN_QTY,\r\n"+
				"	SUM(THIS_WEEK_CHG_QTY) AS THIS_WEEK_CHG_QTY,\r\n"+
				"	SUM(LAST_WEEK_BAL_QTY)-SUM(THIS_WEEK_OUT_QTY)+SUM(THIS_WEEK_IN_QTY)+SUM(THIS_WEEK_CHG_QTY) AS THIS_WEEK_BAL_QTY,\r\n"+
				"	SUM(THIS_WEEK_PLN_QTY*BOARD_COUNT) AS THIS_WEEK_PLN_QTY,\r\n"+
				"	SUM(LAST_WEEK_IN_QTY)+SUM(LAST_WEEK_CHG_QTY)-SUM(LAST_WEEK_PLN_QTY)+SUM(THIS_WEEK_IN_QTY)+SUM(THIS_WEEK_CHG_QTY)-SUM(THIS_WEEK_PLN_QTY) AS THIS_WEEK_OWE_QTY,\r\n"+
				"	SUM(LAST_WEEK_IN_QTY*BOARD_COUNT)+SUM(LAST_WEEK_CHG_QTY*BOARD_COUNT)-SUM(LAST_WEEK_PLN_QTY*BOARD_COUNT)+SUM(THIS_WEEK_IN_QTY*BOARD_COUNT)+SUM(THIS_WEEK_CHG_QTY*BOARD_COUNT)-SUM(THIS_WEEK_PLN_QTY*BOARD_COUNT) AS AGGREGATE_BALANCE,\r\n"+
				"	AVG(STOCKING) AS STOCKING,\r\n"+
				"	SUM(LAST_WEEK_IN_QTY*BOARD_COUNT)+SUM(LAST_WEEK_CHG_QTY*BOARD_COUNT)-SUM(LAST_WEEK_PLN_QTY*BOARD_COUNT)+SUM(THIS_WEEK_IN_QTY*BOARD_COUNT)+SUM(THIS_WEEK_CHG_QTY*BOARD_COUNT)-SUM(THIS_WEEK_PLN_QTY*BOARD_COUNT)-SUM(STOCKING) AS STOCKINGBAL \r\n"+
				"FROM (    \r\n"+
				"		SELECT '"+	weekStr+"' as WEEK,\r\n"+
				"			1 AS sort,\r\n"+
				"			TME.NAME AS ENTRY_MATERIAL_NAME,\r\n"+
				"			WEEKINOUT.MATERIAL_ID AS MATERIAL_ID,\r\n"+
				"			TM.NAME AS MATERIAL_NAME,\r\n"+
				"			SUM(IFNULL(WEEKINOUT.WEEK_BAL_QTY,0)) AS LAST_WEEK_BAL_QTY,\r\n"+
				"			0 AS THIS_WEEK_OUT_QTY,\r\n"+
				"			0 AS THIS_WEEK_IN_QTY,\r\n"+
				"			0 AS THIS_WEEK_CHG_QTY,\r\n"+
				"			0 AS THIS_WEEK_BAL_QTY,\r\n"+
				"			0 AS THIS_WEEK_PLN_QTY,\r\n"+
				"			0 AS THIS_WEEK_OWE_QTY,\r\n"+
				"			AVG(IFNULL(TM.SAFE_STOCK,0)) AS STOCKING,\r\n"+
				"			AVG(IFNULL(PM.BOARD_COUNT,0)) AS BOARD_COUNT,\r\n"+
				"			SUM(IFNULL(WEEKINOUT.SUN_NOR_IN_QTY,0))+SUM(IFNULL(WEEKINOUT.MON_NOR_IN_QTY,0))+SUM(IFNULL(WEEKINOUT.TUE_NOR_IN_QTY,0))+SUM(IFNULL(WEEKINOUT.WEN_NOR_IN_QTY,0))+SUM(IFNULL(WEEKINOUT.THU_NOR_IN_QTY,0))+SUM(IFNULL(WEEKINOUT.FRI_NOR_IN_QTY,0))+SUM(IFNULL(WEEKINOUT.STA_NOR_IN_QTY,0)) AS LAST_WEEK_IN_QTY,\r\n"+
				"			SUM(IFNULL(WEEKINOUT.SUN_CHG_BRD_QTY,0))+SUM(IFNULL(WEEKINOUT.MON_CHG_BRD_QTY,0))+SUM(IFNULL(WEEKINOUT.TUE_CHG_BRD_QTY,0))+SUM(IFNULL(WEEKINOUT.WEN_CHG_BRD_QTY,0))+SUM(IFNULL(WEEKINOUT.THU_CHG_BRD_QTY,0))+SUM(IFNULL(WEEKINOUT.FRI_CHG_BRD_QTY,0))+SUM(IFNULL(WEEKINOUT.STA_CHG_BRD_QTY,0)) AS LAST_WEEK_CHG_QTY,\r\n"+
				"			0 AS LAST_WEEK_PLN_QTY\r\n"+
				"		FROM PRD_IN_OUT_WEEK_DETAIL WEEKINOUT	\r\n"+
				"		INNER JOIN PRODUCT_MAP PM ON WEEKINOUT.MATERIAL_ID=PM.MATERIAL_ID \r\n"+
				"		INNER JOIN T_MATERIAL TM ON (WEEKINOUT.MATERIAL_ID=TM.ID "+filterMaterial.toString()+") \r\n"+
				"		INNER JOIN T_MATERIAL TME ON PM.ENTRY_MATERIAL_ID=TME.ID \r\n"+
				"		WHERE WEEKINOUT.WEEK<'"+weekStr+"' \r\n"+
				"		AND LENGTH(PM.IKEA_ID) = 8 \r\n"+
				"		GROUP BY TME.NAME,WEEKINOUT.MATERIAL_ID,TM.NAME 	\r\n"+
				"		UNION ALL	\r\n"+
				"		SELECT'"+weekStr+"' AS WEEK,\r\n"+
				"			1 AS sort,\r\n"+
				"			TME.NAME AS ENTRY_MATERIAL_NAME,\r\n"+
				"			WEEKINOUT.MATERIAL_ID AS MATERIAL_ID,\r\n"+
				"			TM.NAME AS MATERIAL_NAME,\r\n"+
				"			0 AS LAST_WEEK_BAL_QTY,\r\n"+
				"			SUM(IFNULL(WEEKINOUT.SUN_NOR_OUT_QTY,0))+SUM(IFNULL(WEEKINOUT.MON_NOR_OUT_QTY,0))+SUM(IFNULL(WEEKINOUT.TUE_NOR_OUT_QTY,0))		+SUM(IFNULL(WEEKINOUT.WEN_NOR_OUT_QTY,0))+SUM(IFNULL(WEEKINOUT.THU_NOR_OUT_QTY,0))+SUM(IFNULL(WEEKINOUT.FRI_NOR_OUT_QTY,0))		+SUM(IFNULL(WEEKINOUT.STA_NOR_OUT_QTY,0)) AS THIS_WEEK_OUT_QTY,\r\n"+
				"			SUM(IFNULL(WEEKINOUT.SUN_NOR_IN_QTY,0))+SUM(IFNULL(WEEKINOUT.MON_NOR_IN_QTY,0))+SUM(IFNULL(WEEKINOUT.TUE_NOR_IN_QTY,0))		+SUM(IFNULL(WEEKINOUT.WEN_NOR_IN_QTY,0))+SUM(IFNULL(WEEKINOUT.THU_NOR_IN_QTY,0))+SUM(IFNULL(WEEKINOUT.FRI_NOR_IN_QTY,0))		+SUM(IFNULL(WEEKINOUT.STA_NOR_IN_QTY,0))  AS THIS_WEEK_IN_QTY,\r\n"+
				"			SUM(IFNULL(WEEKINOUT.SUN_CHG_BRD_QTY,0))+SUM(IFNULL(WEEKINOUT.MON_CHG_BRD_QTY,0))+SUM(IFNULL(WEEKINOUT.TUE_CHG_BRD_QTY,0))		+SUM(IFNULL(WEEKINOUT.WEN_CHG_BRD_QTY,0))+SUM(IFNULL(WEEKINOUT.THU_CHG_BRD_QTY,0))+SUM(IFNULL(WEEKINOUT.FRI_CHG_BRD_QTY,0))		+SUM(IFNULL(WEEKINOUT.STA_CHG_BRD_QTY,0))  AS THIS_WEEK_CHG_QTY,\r\n"+
				"			0 AS THIS_WEEK_BAL_QTY,\r\n"+
				"			0 AS THIS_WEEK_PLN_QTY,\r\n"+
				"			0 AS THIS_WEEK_OWE_QTY,\r\n"+
				"			AVG(IFNULL(TM.SAFE_STOCK,0)) AS STOCKING,\r\n"+
				"			AVG(IFNULL(PM.BOARD_COUNT,0)) AS BOARD_COUNT,\r\n"+
				"			0 AS LAST_WEEK_IN_QTY,\r\n"+
				"			0 AS LAST_WEEK_CHG_QTY,\r\n"+
				"			0 AS LAST_WEEK_PLN_QTY\r\n"+
				"		FROM PRD_IN_OUT_WEEK_DETAIL WEEKINOUT	\r\n"+
				"		INNER JOIN PRODUCT_MAP PM ON WEEKINOUT.MATERIAL_ID=PM.MATERIAL_ID \r\n"+
				"		INNER JOIN T_MATERIAL TM ON (WEEKINOUT.MATERIAL_ID=TM.ID "+filterMaterial.toString()+") \r\n"+
				"		INNER JOIN T_MATERIAL TME ON PM.ENTRY_MATERIAL_ID=TME.ID \r\n"+
				"		WHERE WEEKINOUT.WEEK='"+weekStr+"' \r\n"+
				"		AND LENGTH(PM.IKEA_ID) = 8 \r\n"+
				"		GROUP BY TME.NAME,WEEKINOUT.MATERIAL_ID,TM.NAME  \r\n"+
				"		UNION ALL	\r\n"+
				"		SELECT\r\n"+
				"			'"+weekStr+"' AS WEEK,\r\n"+
				"			1 AS sort,\r\n"+
				"			T1.ENTRY_MATERIAL_NAME AS ENTRY_MATERIAL_NAME,\r\n"+
				"			T1.MATERIAL_ID AS MATERIAL_ID,\r\n"+
				"			T1.MATERIAL_NAME AS MATERIAL_NAME,\r\n"+
				"			0 AS LAST_WEEK_BAL_QTY,\r\n"+
				"			0 AS THIS_WEEK_OUT_QTY,\r\n"+
				"			0 AS THIS_WEEK_IN_QTY,\r\n"+
				"			0 AS THIS_WEEK_CHG_QTY,\r\n"+
				"			0 AS THIS_WEEK_BAL_QTY,\r\n"+
				"			SUM(IFNULL(T1.ORDER_QTY,0)) AS THIS_WEEK_PLN_QTY,\r\n"+
				"			0 AS THIS_WEEK_OWE_QTY,\r\n"+
				"			AVG(IFNULL(T1.SAFE_STOCK,0)) AS STOCKING,\r\n"+
				"			AVG(IFNULL(T1.BOARD_COUNT,0)) AS BOARD_COUNT,\r\n"+
				"			0 AS LAST_WEEK_IN_QTY,\r\n"+
				"			0 AS LAST_WEEK_CHG_QTY,\r\n"+
				"			0 AS LAST_WEEK_PLN_QTY\r\n"+
				"		FROM ( \r\n"+
				"			SELECT \r\n"+
				"				DISTINCT \r\n"+
				"				VERIFYENTRY.ID, \r\n"+
				"				VERIFYENTRY.MATERIAL_ID, \r\n"+
				"				VERIFYENTRY.ORDER_QTY, \r\n"+
				"				VERIFYENTRY.SENT_QTY, \r\n"+
				"				TM.NAME AS MATERIAL_NAME, \r\n"+
				"				TME.NAME AS ENTRY_MATERIAL_NAME, \r\n"+
				"				TM.SAFE_STOCK, \r\n"+
				"				PM.BOARD_COUNT \r\n"+
				"			FROM PRODUCT_OUT_NOTIFICATION NOTIFICATION \r\n"+
				"			INNER JOIN PRODUCT_OUT_NOTIFICATION_ENTRY NOTIFICATIONENTRY ON NOTIFICATIONENTRY.PARENT_ID=NOTIFICATION.ID \r\n"+
				"			INNER JOIN PRODUCT_OUT_VERIFY_ENTRY VERIFYENTRY ON (NOTIFICATION.DELIVER_NUMBER=VERIFYENTRY.DELIVER_NUMBER AND NOTIFICATIONENTRY.MATERIAL_ID=VERIFYENTRY.PARENT_MATERIAL_ID) \r\n"+
				"			INNER JOIN PRODUCT_MAP PM ON VERIFYENTRY.MATERIAL_ID=PM.MATERIAL_ID \r\n"+
				"			INNER JOIN T_MATERIAL TM ON (VERIFYENTRY.MATERIAL_ID=TM.ID "+filterMaterial.toString()+")\r\n"+
				"			INNER JOIN T_MATERIAL TME ON PM.ENTRY_MATERIAL_ID=TME.ID \r\n"+
				"			WHERE NOTIFICATION.PLAN_DELIVERY_DATE>='"+dateFormat.format(weekDatePeriod.fromDate)+"'\r\n"+
				"				AND NOTIFICATION.PLAN_DELIVERY_DATE<='"+timeFormat.format(weekDatePeriod.endDate)+"' \r\n"+
				"				AND NOTIFICATION.STATUS=4\r\n"+
				"				AND LENGTH(PM.IKEA_ID) = 8 \r\n"+
				"			) T1\r\n"+
				"		GROUP BY T1.ENTRY_MATERIAL_NAME,T1.MATERIAL_ID,T1.MATERIAL_NAME\r\n"+
				"		UNION ALL \r\n"+
				"		SELECT\r\n"+
				"			'"+weekStr+"' AS WEEK,\r\n"+
				"			1 AS sort,\r\n"+
				"			T2.ENTRY_MATERIAL_NAME AS ENTRY_MATERIAL_NAME,\r\n"+
				"			T2.MATERIAL_ID AS MATERIAL_ID,\r\n"+
				"			T2.MATERIAL_NAME AS MATERIAL_NAME,\r\n"+
				"			0 AS LAST_WEEK_BAL_QTY,\r\n"+
				"			0 AS THIS_WEEK_OUT_QTY,\r\n"+
				"			0 AS THIS_WEEK_IN_QTY,\r\n"+
				"			0 AS THIS_WEEK_CHG_QTY,\r\n"+
				"			0 AS THIS_WEEK_BAL_QTY,\r\n"+
				"			0 AS THIS_WEEK_PLN_QTY,\r\n"+
				"			0 AS THIS_WEEK_OWE_QTY,\r\n"+
				"			AVG(IFNULL(T2.SAFE_STOCK,0)) AS STOCKING,\r\n"+
				"			AVG(IFNULL(T2.BOARD_COUNT,0)) AS BOARD_COUNT,\r\n"+
				"			0 AS LAST_WEEK_IN_QTY,\r\n"+
				"			0 AS LAST_WEEK_CHG_QTY,\r\n"+
				"			SUM(IFNULL(T2.ORDER_QTY,0)) AS LAST_WEEK_PLN_QTY\r\n"+
				"		FROM ( \r\n"+
				"			SELECT \r\n"+
				"				DISTINCT \r\n"+
				"				VERIFYENTRY.ID, \r\n"+
				"				VERIFYENTRY.MATERIAL_ID,\r\n"+
				"				VERIFYENTRY.ORDER_QTY, \r\n"+
				"				VERIFYENTRY.SENT_QTY, \r\n"+
				"				TM.NAME MATERIAL_NAME,\r\n"+
				"				TME.NAME AS ENTRY_MATERIAL_NAME, \r\n"+
				"				TM.SAFE_STOCK, \r\n"+
				"				PM.BOARD_COUNT \r\n"+
				"			FROM PRODUCT_OUT_NOTIFICATION NOTIFICATION\r\n"+
				"			INNER JOIN PRODUCT_OUT_NOTIFICATION_ENTRY NOTIFICATIONENTRY ON NOTIFICATIONENTRY.PARENT_ID=NOTIFICATION.ID \r\n"+
				"			INNER JOIN PRODUCT_OUT_VERIFY_ENTRY VERIFYENTRY ON (NOTIFICATION.DELIVER_NUMBER=VERIFYENTRY.DELIVER_NUMBER AND NOTIFICATIONENTRY.MATERIAL_ID=VERIFYENTRY.PARENT_MATERIAL_ID)\r\n"+
				"			INNER JOIN PRODUCT_MAP PM ON VERIFYENTRY.MATERIAL_ID=PM.MATERIAL_ID \r\n"+
				"			INNER JOIN T_MATERIAL TM ON (VERIFYENTRY.MATERIAL_ID=TM.ID "+filterMaterial.toString()+")\r\n"+
				"			INNER JOIN T_MATERIAL TME ON PM.ENTRY_MATERIAL_ID=TME.ID \r\n"+
				"			WHERE NOTIFICATION.PLAN_DELIVERY_DATE<='"+timeFormat.format(lastWeekDatePeriod.endDate)+"'\r\n"+
				"				AND NOTIFICATION.STATUS=4\r\n"+
				"				AND LENGTH(PM.IKEA_ID) = 8 \r\n"+
				"			) T2\r\n"+
				"		GROUP BY T2.ENTRY_MATERIAL_NAME,T2.MATERIAL_ID,T2.MATERIAL_NAME\r\n"+
				"		UNION ALL	\r\n"+
				"		SELECT\r\n"+
				"			'"+weekStr+"' AS WEEK,\r\n"+
				"			0 AS sort,\r\n"+
				"			TME.NAME AS ENTRY_MATERIAL_NAME,\r\n"+
				"			'' AS MATERIAL_ID,\r\n"+
				"			TME.NAME AS MATERIAL_NAME,\r\n"+
				"			0 AS LAST_WEEK_BAL_QTY,\r\n"+
				"			0 AS THIS_WEEK_OUT_QTY,\r\n"+
				"			0 AS THIS_WEEK_IN_QTY,\r\n"+
				"			0 AS THIS_WEEK_CHG_QTY,\r\n"+
				"			0 AS THIS_WEEK_BAL_QTY,\r\n"+
				"			SUM(IFNULL(NOTIFICATIONENTRY.VOLUME,0)) AS THIS_WEEK_PLN_QTY,\r\n"+
				"			0 AS THIS_WEEK_OWE_QTY,\r\n"+
				"			AVG(IFNULL(TME.SAFE_STOCK,0)) AS STOCKING,\r\n"+
				"			1 AS BOARD_COUNT,\r\n"+
				"			0 AS LAST_WEEK_IN_QTY,\r\n"+
				"			0 AS LAST_WEEK_CHG_QTY,\r\n"+
				"			0 AS LAST_WEEK_PLN_QTY\r\n"+
				"		FROM PRODUCT_OUT_NOTIFICATION NOTIFICATION \r\n"+
				"		INNER JOIN PRODUCT_OUT_NOTIFICATION_ENTRY NOTIFICATIONENTRY ON NOTIFICATIONENTRY.PARENT_ID=NOTIFICATION.ID \r\n"+
				"		INNER JOIN T_MATERIAL TME ON (NOTIFICATIONENTRY.MATERIAL_ID=TME.ID "+filterMaterialEntry.toString()+")\r\n"+
				"		WHERE NOTIFICATION.PLAN_DELIVERY_DATE>='"+dateFormat.format(weekDatePeriod.fromDate)+"'\r\n"+
				"			AND NOTIFICATION.PLAN_DELIVERY_DATE<='"+timeFormat.format(weekDatePeriod.endDate)+"' \r\n"+
				"			AND NOTIFICATION.STATUS=5\r\n"+
				"		GROUP BY TME.NAME\r\n"+
				"		UNION ALL	\r\n"+
				"		SELECT\r\n"+
				"			'"+weekStr+"' AS WEEK,\r\n"+
				"			0 AS sort,\r\n"+
				"			TME.NAME AS ENTRY_MATERIAL_NAME,\r\n"+
				"			'' AS MATERIAL_ID,\r\n"+
				"			TME.NAME AS MATERIAL_NAME,\r\n"+
				"			0 AS LAST_WEEK_BAL_QTY,\r\n"+
				"			0 AS THIS_WEEK_OUT_QTY,\r\n"+
				"			0 AS THIS_WEEK_IN_QTY,\r\n"+
				"			0 AS THIS_WEEK_CHG_QTY,\r\n"+
				"			0 AS THIS_WEEK_BAL_QTY,\r\n"+
				"			0 AS THIS_WEEK_PLN_QTY,\r\n"+
				"			0 AS THIS_WEEK_OWE_QTY,\r\n"+
				"			AVG(IFNULL(TME.SAFE_STOCK,0)) AS STOCKING,\r\n"+
				"			1 AS BOARD_COUNT,\r\n"+
				"			0 AS LAST_WEEK_IN_QTY,\r\n"+
				"			0 AS LAST_WEEK_CHG_QTY,\r\n"+
				"			SUM(IFNULL(NOTIFICATIONENTRY.VOLUME,0)) AS LAST_WEEK_PLN_QTY\r\n"+
				"		FROM PRODUCT_OUT_NOTIFICATION NOTIFICATION \r\n"+
				"		INNER JOIN PRODUCT_OUT_NOTIFICATION_ENTRY NOTIFICATIONENTRY ON NOTIFICATIONENTRY.PARENT_ID=NOTIFICATION.ID \r\n"+
				"		INNER JOIN T_MATERIAL TME ON (NOTIFICATIONENTRY.MATERIAL_ID=TME.ID "+filterMaterialEntry.toString()+")\r\n"+
				"		WHERE NOTIFICATION.PLAN_DELIVERY_DATE<='"+timeFormat.format(lastWeekDatePeriod.endDate)+"'\r\n"+
				"			AND NOTIFICATION.STATUS=5\r\n"+
				"		GROUP BY TME.NAME\r\n"+
				"	) T LEFT JOIN MATERIAL_BOM MB ON T.MATERIAL_ID = MB.MATERIAL_ID " +
				"  WHERE MB.VALID = 'Y'" +
				"  GROUP BY WEEK ,SORT ,ENTRY_MATERIAL_NAME,T.MATERIAL_ID,MATERIAL_NAME,BOARD_COUNT";
		return sql;
	}
	
	/**
	 * 查询周明细出入库信息
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryDetailData(HttpServletRequest request, HttpServletResponse response) throws Exception {
		/*
		 * 1.欠货情况(THIS_DAY_OWE_QTY)= 库存板数(THIS_DAY_BAL_QTY)-计划出仓板数(THIS_DAY_PLN_QTY)
		 * 2.库存板数(THIS_DAY_BAL_QTY) = 昨天的欠货情况(THIS_DAY_OWE_QTY) + 进货总板数(THIS_DAY_IN_QTY) + 改版总板数(THIS_DAY_CHG_QTY)
		 * 
		 */
		String weekStr;//查询周
		String materialId;//物料id
		String materialName;//物料名称
		String preWeekBalStr;//上周库存余额
		String preWeekOweStr; //上周欠数情况
		if(request.getParameter("week")==null||request.getParameter("week").trim().length()<1)throw new Exception("周不能为空！");
		if(request.getParameter("materialId")==null||request.getParameter("materialId").trim().length()<1)throw new Exception("物料不能为空！");
		if(request.getParameter("materialName")==null||request.getParameter("materialName").trim().length()<1)throw new Exception("物料名称不能为空！");
		if(request.getParameter("preWeekBal")==null||request.getParameter("preWeekBal").trim().length()<1)throw new Exception("上周库存余额不能为空！");
		if(request.getParameter("preWeekOwe")==null||request.getParameter("preWeekOwe").trim().length()<1)throw new Exception("上周欠数情况不能为空！");
		weekStr=request.getParameter("week");
		materialId=request.getParameter("materialId");
		materialName=request.getParameter("materialName");
		preWeekBalStr=request.getParameter("preWeekBal");
		preWeekOweStr=request.getParameter("preWeekOwe");
		DatePeriod  dp=Utils.getDatePeriodFromWeekStr(weekStr);
		
		//查询对应的周汇总表记录
		Connection conn = ConnectionFactory.getConnection(org.ofbiz.partner.scm.common.Utils.getConnectionHelperName());
		StringBuffer sql =new StringBuffer();
		sql.append("SELECT ");
		sql.append("  weekinout.MATERIAL_ID as MATERIAL_ID,\r\n" );
		sql.append("  material.name as MATERIAL_NAME,\r\n" );
		sql.append("  weekinout.WEEK ,\r\n" );
		sql.append("  ifnull(weekinout.MON_NOR_IN_QTY,0) as MON_NOR_IN_QTY ,\r\n" );
		sql.append("  ifnull(weekinout.MON_NOR_OUT_QTY,0)as MON_NOR_OUT_QTY ,\r\n" );
		sql.append("  ifnull(weekinout.MON_CHG_BRD_QTY,0) as  MON_CHG_BRD_QTY,\r\n" );
		sql.append("  ifnull(weekinout.TUE_NOR_IN_QTY,0) as  TUE_NOR_IN_QTY,\r\n" );
		sql.append("  ifnull(weekinout.TUE_NOR_OUT_QTY,0) as TUE_NOR_OUT_QTY ,\r\n" );
		sql.append("  ifnull(weekinout.TUE_CHG_BRD_QTY,0) as TUE_CHG_BRD_QTY ,\r\n" );
		sql.append("  ifnull(weekinout.WEN_NOR_IN_QTY,0) as  WEN_NOR_IN_QTY,\r\n" );
		sql.append("  ifnull(weekinout.WEN_NOR_OUT_QTY,0) as WEN_NOR_OUT_QTY,\r\n" );
		sql.append("  ifnull(weekinout.WEN_CHG_BRD_QTY,0) as WEN_CHG_BRD_QTY,\r\n" );
		sql.append("  ifnull(weekinout.THU_NOR_IN_QTY,0) as THU_NOR_IN_QTY,\r\n" );
		sql.append("  ifnull(weekinout.THU_NOR_OUT_QTY,0) as THU_NOR_OUT_QTY,\r\n" );
		sql.append("  ifnull(weekinout.THU_CHG_BRD_QTY,0) as THU_CHG_BRD_QTY,\r\n" );
		sql.append("  ifnull(weekinout.FRI_NOR_IN_QTY,0) as FRI_NOR_IN_QTY,\r\n" );
		sql.append("  ifnull(weekinout.FRI_NOR_OUT_QTY,0) as FRI_NOR_OUT_QTY,\r\n" );
		sql.append("  ifnull(weekinout.FRI_CHG_BRD_QTY,0) as FRI_CHG_BRD_QTY,\r\n" );
		sql.append("  ifnull(weekinout.STA_NOR_IN_QTY,0) as STA_NOR_IN_QTY,\r\n" );
		sql.append("  ifnull(weekinout.STA_NOR_OUT_QTY,0) as STA_NOR_OUT_QTY,\r\n" );
		sql.append("  ifnull(weekinout.STA_CHG_BRD_QTY,0) as STA_CHG_BRD_QTY,\r\n" );
		sql.append("  ifnull(weekinout.SUN_NOR_IN_QTY,0) as SUN_NOR_IN_QTY,\r\n" );
		sql.append("  ifnull(weekinout.SUN_NOR_OUT_QTY,0) as SUN_NOR_OUT_QTY,\r\n" );
		sql.append("  ifnull(weekinout.SUN_CHG_BRD_QTY,0) as SUN_CHG_BRD_QTY" );
		sql.append(" FROM prd_in_out_week_detail weekinout inner join t_material material on weekinout.material_id=material.id where weekinout.week=? and weekinout.material_id=?");
		
		
		StringBuffer plnQtySql=new StringBuffer();
		plnQtySql.append(" SELECT  \r\n" );
		plnQtySql.append(" 	SUM(ORDER_QTY) AS THIS_WEEK_PLN_QTY \r\n" );
		plnQtySql.append(" FROM ( \r\n" );
		plnQtySql.append(" 	SELECT \r\n" );
		plnQtySql.append(" 		DISTINCT \r\n" );
		plnQtySql.append(" 	  	VERIFYENTRY.ID, \r\n" );
		plnQtySql.append(" 	  	VERIFYENTRY.MATERIAL_ID, \r\n" );
		plnQtySql.append(" 		IFNULL(VERIFYENTRY.ORDER_QTY,0) AS ORDER_QTY \r\n" );
		plnQtySql.append(" 	FROM PRODUCT_OUT_NOTIFICATION NOTIFICATION \r\n" );
		plnQtySql.append(" 	INNER JOIN PRODUCT_OUT_NOTIFICATION_ENTRY NOTIFICATIONENTRY ON NOTIFICATIONENTRY.PARENT_ID=NOTIFICATION.ID \r\n" );
		plnQtySql.append(" 	INNER JOIN PRODUCT_OUT_VERIFY_ENTRY VERIFYENTRY ON (NOTIFICATION.DELIVER_NUMBER=VERIFYENTRY.DELIVER_NUMBER AND NOTIFICATIONENTRY.MATERIAL_ID=VERIFYENTRY.PARENT_MATERIAL_ID) \r\n" );
		plnQtySql.append(" 	WHERE NOTIFICATION.PLAN_DELIVERY_DATE >= ? \r\n" );
		plnQtySql.append(" 		AND NOTIFICATION.PLAN_DELIVERY_DATE <= ? \r\n" );
		plnQtySql.append(" 		AND NOTIFICATION.STATUS = 4 \r\n" );
		plnQtySql.append(" 	AND VERIFYENTRY.MATERIAL_ID = ? \r\n" );
		plnQtySql.append(" ) T GROUP BY MATERIAL_ID \r\n" );
		
		
		// 可以通过前端传数得到
//		StringBuffer oweSql =new StringBuffer();
//		oweSql.append(" SELECT \r\n" );
//		oweSql.append(" 	SUM(LAST_WEEK_IN_QTY)+SUM(LAST_WEEK_CHG_QTY)-SUM(LAST_WEEK_PLN_QTY) AS LAST_WEEK_OWE_QTY \r\n" );
//		oweSql.append(" FROM (     \r\n" );
//		oweSql.append(" 		SELECT WEEKINOUT.MATERIAL_ID AS MATERIAL_ID, \r\n" );
//		oweSql.append(" 			SUM(IFNULL(WEEKINOUT.SUN_NOR_IN_QTY,0))+SUM(IFNULL(WEEKINOUT.MON_NOR_IN_QTY,0))+SUM(IFNULL(WEEKINOUT.TUE_NOR_IN_QTY,0))+SUM(IFNULL(WEEKINOUT.WEN_NOR_IN_QTY,0))+SUM(IFNULL(WEEKINOUT.THU_NOR_IN_QTY,0))+SUM(IFNULL(WEEKINOUT.FRI_NOR_IN_QTY,0))+SUM(IFNULL(WEEKINOUT.STA_NOR_IN_QTY,0)) AS LAST_WEEK_IN_QTY, \r\n" );
//		oweSql.append(" 			SUM(IFNULL(WEEKINOUT.SUN_CHG_BRD_QTY,0))+SUM(IFNULL(WEEKINOUT.MON_CHG_BRD_QTY,0))+SUM(IFNULL(WEEKINOUT.TUE_CHG_BRD_QTY,0))+SUM(IFNULL(WEEKINOUT.WEN_CHG_BRD_QTY,0))+SUM(IFNULL(WEEKINOUT.THU_CHG_BRD_QTY,0))+SUM(IFNULL(WEEKINOUT.FRI_CHG_BRD_QTY,0))+SUM(IFNULL(WEEKINOUT.STA_CHG_BRD_QTY,0)) AS LAST_WEEK_CHG_QTY, \r\n" );
//		oweSql.append(" 			0 AS LAST_WEEK_PLN_QTY \r\n" );
//		oweSql.append(" 		FROM PRD_IN_OUT_WEEK_DETAIL WEEKINOUT	 \r\n" );
//		oweSql.append(" 		INNER JOIN PRODUCT_MAP PM ON WEEKINOUT.MATERIAL_ID=PM.MATERIAL_ID  \r\n" );
//		oweSql.append(" 		WHERE WEEKINOUT.WEEK < ?  \r\n" );
//		oweSql.append(" 		AND LENGTH(PM.IKEA_ID) = 8  \r\n" );
//		oweSql.append(" 		GROUP BY WEEKINOUT.MATERIAL_ID  \r\n" );
//		oweSql.append(" 		UNION ALL	 \r\n" );
//		oweSql.append(" 		SELECT \r\n" );
//		oweSql.append(" 			T2.MATERIAL_ID AS MATERIAL_ID, \r\n" );
//		oweSql.append(" 			0 AS LAST_WEEK_IN_QTY, \r\n" );
//		oweSql.append(" 			0 AS LAST_WEEK_CHG_QTY, \r\n" );
//		oweSql.append(" 			SUM(IFNULL(T2.ORDER_QTY,0)) AS LAST_WEEK_PLN_QTY \r\n" );
//		oweSql.append(" 		FROM (  \r\n" );
//		oweSql.append(" 			SELECT  \r\n" );
//		oweSql.append(" 				DISTINCT  \r\n" );
//		oweSql.append(" 				VERIFYENTRY.ID,  \r\n" );
//		oweSql.append(" 				VERIFYENTRY.MATERIAL_ID, \r\n" );
//		oweSql.append(" 				VERIFYENTRY.ORDER_QTY \r\n" );
//		oweSql.append(" 			FROM PRODUCT_OUT_NOTIFICATION NOTIFICATION \r\n" );
//		oweSql.append(" 			INNER JOIN PRODUCT_OUT_NOTIFICATION_ENTRY NOTIFICATIONENTRY ON NOTIFICATIONENTRY.PARENT_ID=NOTIFICATION.ID  \r\n" );
//		oweSql.append(" 			INNER JOIN PRODUCT_OUT_VERIFY_ENTRY VERIFYENTRY ON (NOTIFICATION.DELIVER_NUMBER=VERIFYENTRY.DELIVER_NUMBER AND NOTIFICATIONENTRY.MATERIAL_ID=VERIFYENTRY.PARENT_MATERIAL_ID) \r\n" );
//		oweSql.append(" 			INNER JOIN PRODUCT_MAP PM ON VERIFYENTRY.MATERIAL_ID=PM.MATERIAL_ID  \r\n" );
//		oweSql.append(" 			WHERE NOTIFICATION.PLAN_DELIVERY_DATE < ? \r\n" );
//		oweSql.append(" 				AND NOTIFICATION.STATUS=4 \r\n" );
//		oweSql.append(" 				AND LENGTH(PM.IKEA_ID) = 8  \r\n" );
//		oweSql.append(" 			) T2 \r\n" );
//		oweSql.append(" 		GROUP BY T2.MATERIAL_ID \r\n" );
//		oweSql.append(" 	) T  \r\n" );
//		oweSql.append(" LEFT JOIN MATERIAL_BOM MB ON T.MATERIAL_ID = MB.MATERIAL_ID    \r\n" );
//		oweSql.append(" WHERE MB.VALID = 'Y' \r\n" );
//		oweSql.append(" 	AND T.MATERIAL_ID = ? \r\n" );
//		oweSql.append(" GROUP BY T.MATERIAL_ID \r\n" );

				
		//json 结果
		JSONObject jsResult=new JSONObject();
		jsResult.put("sucess", true);
		
		
		JSONArray records=new JSONArray();
		try {
			PreparedStatement ps=conn.prepareStatement(sql.toString());
			ps.setString(1, weekStr);
			ps.setString(2, materialId);
			
			
			ResultSet rs=ps.executeQuery();
			
			Date firstDate=dp.fromDate;//周的第一天星期日
			Calendar cal=Calendar.getInstance();
			cal.setTime(firstDate);
			
			BigDecimal preDayBal=new BigDecimal(preWeekBalStr);//上一天余额
			BigDecimal preOweQty=new BigDecimal(preWeekOweStr);//前一天欠数情况
			
			PreparedStatement plnPs=conn.prepareStatement(plnQtySql.toString());
//			PreparedStatement owePs=conn.prepareStatement(oweSql.toString());
			
			if(rs!=null&&rs.next()){
				for(int i=1;i<=7;i++){
					//查询改天的计划出货数
					plnPs.setString(1, dateFormat.format(cal.getTime())+" 00:00:00");
					plnPs.setString(2, dateFormat.format(cal.getTime())+" 23:59:59");
					plnPs.setString(3, materialId);
				    ResultSet plnRs=plnPs.executeQuery();
				    BigDecimal plnQty=BigDecimal.ZERO;
					if(plnRs!=null&&plnRs.next()){
						plnQty=plnRs.getBigDecimal(1);
					}
					
//					// 本周第一天欠数情况需要通过SQL获得，第二天开始可以通过前一天得到结果获得
//					if(i==1){	
//						owePs.setString(1, weekStr);
//						owePs.setString(2, dateFormat.format(cal.getTime())+" 00:00:00");
//						owePs.setString(3, materialId);
//					    ResultSet oweRs=plnPs.executeQuery();
//						if(oweRs!=null&&oweRs.next()){
//							preOweQty=oweRs.getBigDecimal(1);
//						}
//					}
					
				    
					String dayStr=getStrForDay(i);
					BigDecimal dayOutQty=rs.getBigDecimal(dayStr+"_NOR_OUT_QTY");
					BigDecimal dayInQty=rs.getBigDecimal(dayStr+"_NOR_IN_QTY");
					BigDecimal dayChgQty=rs.getBigDecimal(dayStr+"_CHG_BRD_QTY");
					BigDecimal dayBalQty=preDayBal.add(dayInQty).subtract(dayChgQty).subtract(dayOutQty);
					BigDecimal dayOweQty=preOweQty.add(dayInQty).subtract(dayChgQty).subtract(plnQty);
					JSONObject dayJson=buildRecord(cal.getTime(),rs.getString("MATERIAL_NAME"),dayOutQty,dayInQty,dayChgQty,dayBalQty,plnQty,dayOweQty);
					records.add(dayJson);
					
					cal.add(Calendar.DATE, 1);
					preDayBal=dayBalQty;
					preOweQty = dayOweQty; // 将欠数情况传递给第二天
				}
				
			}else{
//				throw new Exception("周汇总表没有对应记录,week :"+weekStr+" ; material:"+materialId);
				for(int i=1;i<=7;i++){
					//查询改天的计划出货数
					plnPs.setString(1, dateFormat.format(cal.getTime())+" 00:00:00");
					plnPs.setString(2, dateFormat.format(cal.getTime())+" 23:59:59");
					plnPs.setString(3, materialId);
				    ResultSet plnRs=plnPs.executeQuery();
				    BigDecimal plnQty=BigDecimal.ZERO;
					if(plnRs!=null&&plnRs.next()){
						plnQty=plnRs.getBigDecimal(1);
					}
					
//					// 本周第一天欠数情况需要通过SQL获得，第二天开始可以通过前一天得到结果获得
//					if(i==1){	
//						owePs.setString(1, weekStr);
//						owePs.setString(2, dateFormat.format(cal.getTime())+" 00:00:00");
//						owePs.setString(3, materialId);
//					    ResultSet oweRs=plnPs.executeQuery();
//						if(oweRs!=null&&oweRs.next()){
//							preOweQty=oweRs.getBigDecimal(1);
//						}
//					}
					
					BigDecimal dayOutQty=BigDecimal.ZERO;
					BigDecimal dayInQty=BigDecimal.ZERO;
					BigDecimal dayChgQty=BigDecimal.ZERO;
					BigDecimal dayBalQty=preDayBal.add(dayInQty).subtract(dayChgQty).subtract(dayOutQty);
					BigDecimal dayOweQty=preOweQty.add(dayInQty).subtract(dayChgQty).subtract(plnQty);
					JSONObject dayJson=buildRecord(cal.getTime(),materialName,dayOutQty,dayInQty,dayChgQty,dayBalQty,plnQty,dayOweQty);
					records.add(dayJson);
					
					cal.add(Calendar.DATE, 1);
					preDayBal=dayBalQty;
					preOweQty = dayOweQty; // 将欠数情况传递给第二天
				}
			}
			
		} catch (Exception e) {
			throw e;
		}finally{
			if(conn!=null)conn.close();
		}
		
		
		jsResult.put("records", records);
		CommonEvents.writeJsonDataToExt(response, jsResult.toString());
		return "sucess";
	}
	
	private static String getStrForDay(int dayOfWeek) throws Exception{
		if(dayOfWeek<1||dayOfWeek>7)throw new Exception("星期范围出错");
		switch(dayOfWeek){
		case 1  : return "SUN" ;
		case 2  : return "MON";
		case 3  : return "TUE";
		case 4  : return "WEN";
		case 5  : return "THU";
		case 6  : return "FRI";
		case 7  : return "STA";
		default : throw new Exception("星期范围出错");
		}
	}
	/**
	 *  生成一天出入库明细记录
	 * @param day
	 * @param materialName
	 * @param dayOutQty    当天出
	 * @param dayInQty	  当天入
	 * @param dayChgQty   当天改板入
	 * @param dayBalQty   当天库存
	 * @param dayPlnQty   当天计划出
	 * @param dayOweQty   当天欠数
	 * @return
	 */
	private static  JSONObject buildRecord(Date day,String materialName,BigDecimal dayOutQty,BigDecimal dayInQty,BigDecimal dayChgQty,BigDecimal dayBalQty,BigDecimal dayPlnQty,BigDecimal dayOweQty){
		JSONObject temp=new JSONObject();
		temp.put("DAY_IN_WEEK", dateFormat.format(day));
		temp.put("MATERIAL_NAME",materialName);
		temp.put("THIS_DAY_OUT_QTY", dayOutQty);
		temp.put("THIS_DAY_IN_QTY", dayInQty);
		temp.put("THIS_DAY_CHG_QTY", dayChgQty);
		temp.put("THIS_DAY_BAL_QTY", dayBalQty);
		temp.put("THIS_DAY_PLN_QTY", dayPlnQty);
		temp.put("THIS_DAY_OWE_QTY", dayOweQty);
		return temp;
	}
	
}
