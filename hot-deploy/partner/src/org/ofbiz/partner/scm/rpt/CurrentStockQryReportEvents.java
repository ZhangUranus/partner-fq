package org.ofbiz.partner.scm.rpt;

import java.text.SimpleDateFormat;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.partner.scm.common.CommonEvents;


public class CurrentStockQryReportEvents {
	static final SimpleDateFormat timeFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	static final SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd");
	
	/**
	 * 材料耗用汇总明细表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryCurrentStock(HttpServletRequest request, HttpServletResponse response) throws Exception {
		CommonEvents.writeJsonDataToExt(response, DataFetchEvents.executeSelectSQL(request,getQueryCurrentStockSql(request)));
		return "sucess";
	}
	public static String getQueryCurrentStockSql(HttpServletRequest request) throws Exception {

		StringBuffer  sql=new StringBuffer();
		sql.append(" SELECT ");
		sql.append(" 	TM.NUMBER, ");
		sql.append(" 	TM.NAME AS MATERIAL_NAME, ");
		sql.append(" 	UT.NAME AS UNIT_NAME, ");
		sql.append(" 	WH.NAME AS HOUSE_NAME, ");
		sql.append(" 	SUM(IFNULL(VOLUME,0)) AS VOLUME, ");
		sql.append(" 	0 AS WORKSHOP_VOLUME, ");
		sql.append(" 	0 AS SUPPLIER_VOLUME, ");
		sql.append(" 	0 AS PLAN_VOLUME ");
		sql.append(" FROM  ");
		sql.append(" ( ");
		sql.append(" 	SELECT  ");
		sql.append(" 		WAREHOUSE_ID, ");
		sql.append(" 		MATERIAL_ID, ");
		sql.append(" 		VOLUME ");
		sql.append(" 	FROM CUR_MATERIAL_BALANCE ");
		sql.append(" 	UNION ALL ");
		sql.append(" 	SELECT  ");
		sql.append(" 		WAREHOUSE_ID, ");
		sql.append(" 		MATERIAL_ID, ");
		sql.append(" 		VOLUME ");
		sql.append(" 	FROM CUR_SAVE_MATERIAL_BALANCE ");
		sql.append(" ) CMB  ");
		sql.append(" LEFT JOIN WAREHOUSE WH ON CMB.WAREHOUSE_ID = WH.ID ");
		sql.append(" LEFT JOIN T_MATERIAL TM ON CMB.MATERIAL_ID = TM.ID ");
		sql.append(" LEFT JOIN UNIT UT ON TM.DEFAULT_UNIT_ID = UT.ID ");
		sql.append(" WHERE WH.NAME IS NOT NULL AND TM.NAME IS NOT NULL ");
		if(!request.getParameter("warehouse").isEmpty()){
			sql.append(" 		AND WH.NAME like '%"+request.getParameter("warehouse").trim()+"%'");
		}
		if(!request.getParameter("material").isEmpty()){
			sql.append(" 		AND (TM.NAME like '%"+request.getParameter("material").trim()+"%' OR TM.NUMBER like '%"+request.getParameter("material").trim()+"%')");
		}
		sql.append(" GROUP BY TM.NUMBER,TM.NAME,UT.NAME,WH.NAME ");
		sql.append(" UNION ALL ");
		sql.append(" SELECT ");
		sql.append(" 	TM.NUMBER, ");
		sql.append(" 	TM.NAME AS MATERIAL_NAME, ");
		sql.append(" 	UT.NAME AS UNIT_NAME, ");
		sql.append(" 	WS.NAME AS HOUSE_NAME, ");
		sql.append(" 	0 AS VOLUME, ");
		sql.append(" 	SUM(IFNULL(VOLUME,0)) AS WORKSHOP_VOLUME, ");
		sql.append(" 	0 AS SUPPLIER_VOLUME, ");
		sql.append(" 	0 AS PLAN_VOLUME ");
		sql.append(" FROM  ");
		sql.append(" ( ");
		sql.append(" 	SELECT  ");
		sql.append(" 		WORKSHOP_ID, ");
		sql.append(" 		MATERIAL_ID, ");
		sql.append(" 		VOLUME ");
		sql.append(" 	FROM CUR_WORKSHOP_PRICE ");
		sql.append(" 	UNION ALL ");
		sql.append(" 	SELECT  ");
		sql.append(" 		WORKSHOP_ID, ");
		sql.append(" 		MATERIAL_ID, ");
		sql.append(" 		VOLUME ");
		sql.append(" 	FROM CUR_SAVE_WORKSHOP_BALANCE ");
		sql.append(" ) CWP  ");
		sql.append(" LEFT JOIN WORKSHOP WS ON CWP.WORKSHOP_ID = WS.ID ");
		sql.append(" LEFT JOIN T_MATERIAL TM ON CWP.MATERIAL_ID = TM.ID ");
		sql.append(" LEFT JOIN UNIT UT ON TM.DEFAULT_UNIT_ID = UT.ID ");
		sql.append(" WHERE WS.NAME IS NOT NULL AND TM.NAME IS NOT NULL ");
		if(!request.getParameter("warehouse").isEmpty()){
			sql.append(" 		AND WS.NAME like '%"+request.getParameter("warehouse").trim()+"%'");
		}
		if(!request.getParameter("material").isEmpty()){
			sql.append(" 		AND (TM.NAME like '%"+request.getParameter("material").trim()+"%' OR TM.NUMBER like '%"+request.getParameter("material").trim()+"%')");
		}
		sql.append(" GROUP BY TM.NUMBER,TM.NAME,UT.NAME,WS.NAME ");
		sql.append(" UNION ALL ");
		sql.append(" SELECT ");
		sql.append(" 	TM.NUMBER, ");
		sql.append(" 	TM.NAME AS MATERIAL_NAME, ");
		sql.append(" 	UT.NAME AS UNIT_NAME, ");
		sql.append(" 	SP.NAME AS HOUSE_NAME, ");
		sql.append(" 	0 AS VOLUME, ");
		sql.append(" 	0 AS WORKSHOP_VOLUME, ");
		sql.append(" 	SUM(IFNULL(VOLUME,0)) AS SUPPLIER_VOLUME, ");
		sql.append(" 	0 AS PLAN_VOLUME ");
		sql.append(" FROM  ");
		sql.append(" ( ");
		sql.append(" 	SELECT  ");
		sql.append(" 		SUPPLIER_ID, ");
		sql.append(" 		MATERIAL_ID, ");
		sql.append(" 		VOLUME ");
		sql.append(" 	FROM CUR_CONSIGN_PROCESSED_PRICE ");
		sql.append(" 	UNION ALL ");
		sql.append(" 	SELECT  ");
		sql.append(" 		SUPPLIER_ID, ");
		sql.append(" 		MATERIAL_ID, ");
		sql.append(" 		VOLUME ");
		sql.append(" 	FROM CUR_SAVE_CONSIGN_BALANCE ");
		sql.append(" ) CCP  ");
		sql.append(" LEFT JOIN SUPPLIER SP ON CCP.SUPPLIER_ID = SP.ID ");
		sql.append(" LEFT JOIN T_MATERIAL TM ON CCP.MATERIAL_ID = TM.ID ");
		sql.append(" LEFT JOIN UNIT UT ON TM.DEFAULT_UNIT_ID = UT.ID ");
		sql.append(" WHERE SP.NAME IS NOT NULL AND TM.NAME IS NOT NULL ");
		if(!request.getParameter("warehouse").isEmpty()){
			sql.append(" 		AND SP.NAME like '%"+request.getParameter("warehouse").trim()+"%'");
		}
		if(!request.getParameter("material").isEmpty()){
			sql.append(" 		AND (TM.NAME like '%"+request.getParameter("material").trim()+"%' OR TM.NUMBER like '%"+request.getParameter("material").trim()+"%')");
		}
		sql.append(" GROUP BY TM.NUMBER,TM.NAME,UT.NAME,SP.NAME ");
		sql.append(" UNION ALL ");
		sql.append(" SELECT ");
		sql.append(" 	TM.NUMBER, ");
		sql.append(" 	TM.NAME AS MATERIAL_NAME, ");
		sql.append(" 	UT.NAME AS UNIT_NAME, ");
		sql.append(" 	SP.NAME AS HOUSE_NAME, ");
		sql.append(" 	0 AS VOLUME, ");
		sql.append(" 	0 AS WORKSHOP_VOLUME, ");
		sql.append(" 	0 AS SUPPLIER_VOLUME, ");
		sql.append(" 	SUM(IFNULL(BALANCE,0)) AS PLAN_VOLUME ");
		sql.append(" FROM  ");
		sql.append(" PUR_PLAN_BALANCE PPB ");
		sql.append(" LEFT JOIN SUPPLIER SP ON PPB.SUPPLIER_ID = SP.ID ");
		sql.append(" LEFT JOIN T_MATERIAL TM ON PPB.MATERIAL_ID = TM.ID ");
		sql.append(" LEFT JOIN UNIT UT ON TM.DEFAULT_UNIT_ID = UT.ID ");
		sql.append(" WHERE SP.NAME IS NOT NULL AND TM.NAME IS NOT NULL ");
		if(!request.getParameter("warehouse").isEmpty()){
			sql.append(" 		AND SP.NAME like '%"+request.getParameter("warehouse").trim()+"%'");
		}
		if(!request.getParameter("material").isEmpty()){
			sql.append(" 		AND (TM.NAME like '%"+request.getParameter("material").trim()+"%' OR TM.NUMBER like '%"+request.getParameter("material").trim()+"%')");
		}
		sql.append(" GROUP BY TM.NUMBER,TM.NAME,UT.NAME,SP.NAME ");
		
		return sql.toString();
	}
}
