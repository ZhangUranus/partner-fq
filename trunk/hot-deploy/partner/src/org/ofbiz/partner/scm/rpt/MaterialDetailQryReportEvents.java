package org.ofbiz.partner.scm.rpt;

import java.text.SimpleDateFormat;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.partner.scm.common.CommonEvents;


public class MaterialDetailQryReportEvents {
	static final SimpleDateFormat timeFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	static final SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd");
	
	/**
	 * 材料耗用汇总明细表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryMaterialDetail(HttpServletRequest request, HttpServletResponse response) throws Exception {
		CommonEvents.writeJsonDataToExt(response, DataFetchEvents.executeSelectSQL(request,getQueryMaterialDetailSql(request)));
		return "sucess";
	}
	public static String getQueryMaterialDetailSql(HttpServletRequest request) throws Exception {
		String startDate,endDate;
		if(request.getParameter("startDate") != null && request.getParameter("endDate") != null){
			startDate = request.getParameter("startDate");
			endDate = request.getParameter("endDate");
		}else{
			throw new Exception("日期不能为空！");
		}

		StringBuffer  sql=new StringBuffer();
		sql.append(" SELECT ");
		sql.append(" 	MD.ID AS ID, ");
		sql.append(" 	TM.NUMBER AS NUMBER, ");
		sql.append(" 	TM.NAME AS NAME, ");
		sql.append(" 	ROUND(IFNULL(SUM(MD.VOLUME),0),4) VOLUME, ");
		sql.append(" 	ROUND(IFNULL(SUM(MD.SUM)/SUM(MD.VOLUME),0),4) AS PRICE, ");
		sql.append(" 	ROUND(IFNULL(SUM(MD.SUM),0),4) AS SUM  ");
		sql.append(" FROM ");
		sql.append(" ( ");
		sql.append(" 	SELECT  ");
		sql.append(" 		MATERIAL_ID AS ID, ");
		sql.append(" 		QUANTITY AS VOLUME, ");
		sql.append(" 		AMOUNT AS SUM  ");
		sql.append(" 	FROM PRODUCT_INWAREHOUSE_ENTRY_DETAIL ");
		sql.append(" 	WHERE IN_BIZ_DATE > '"+startDate+"' ");
		sql.append(" 		AND IN_BIZ_DATE < '"+endDate+"' ");
		if(!request.getParameter("ikeaNumber").isEmpty()){
			sql.append(" 		AND SUBSTR(BARCODE1,4,8) = '"+request.getParameter("ikeaNumber").trim()+"' ");
		}
		sql.append(" 	UNION ALL ");
		sql.append(" 	SELECT  ");
		sql.append(" 		MATERIAL_ID AS ID, ");
		sql.append(" 		QUANTITY AS VOLUME, ");
		sql.append(" 		AMOUNT AS SUM  ");
		sql.append(" 	FROM PRODUCT_INWAREHOUSE_ENTRY_DETAIL_HIS ");
		sql.append(" 	WHERE IN_BIZ_DATE > '"+startDate+"' ");
		sql.append(" 		AND IN_BIZ_DATE < '"+endDate+"' ");
		if(!request.getParameter("ikeaNumber").isEmpty()){
			sql.append(" 		AND SUBSTR(BARCODE1,4,8) = '"+request.getParameter("ikeaNumber").trim()+"' ");
		}
		sql.append(" 	UNION ALL ");
		sql.append(" 	SELECT  ");
		sql.append(" 		PIED.MATERIAL_ID AS ID, ");
		sql.append(" 		-PIED.QUANTITY AS VOLUME, ");
		sql.append(" 		-PIED.AMOUNT AS SUM  ");
		sql.append(" 	FROM PRODUCT_OUTWAREHOUSE_ENTRY POE  ");
		sql.append(" 	LEFT JOIN PRODUCT_INWAREHOUSE_ENTRY_DETAIL PIED ON POE.ID = PIED.OUT_PARENT_ID ");
		sql.append(" 	WHERE PIED.OUT_BIZ_DATE > '"+startDate+"' ");
		sql.append(" 		AND PIED.OUT_BIZ_DATE < '"+endDate+"' ");
		sql.append(" 		AND (POE.OUTWAREHOUSE_TYPE = 2 OR POE.OUTWAREHOUSE_TYPE = 3) ");
		if(!request.getParameter("ikeaNumber").isEmpty()){
			sql.append(" 		AND SUBSTR(PIED.BARCODE1,4,8) = '"+request.getParameter("ikeaNumber").trim()+"' ");
		}
		sql.append(" 	UNION ALL ");
		sql.append(" 	SELECT  ");
		sql.append(" 		PIED.MATERIAL_ID AS ID, ");
		sql.append(" 		-PIED.QUANTITY AS VOLUME, ");
		sql.append(" 		-PIED.AMOUNT AS SUM  ");
		sql.append(" 	FROM PRODUCT_OUTWAREHOUSE_ENTRY POE  ");
		sql.append(" 	LEFT JOIN PRODUCT_INWAREHOUSE_ENTRY_DETAIL_HIS PIED ON POE.ID = PIED.OUT_PARENT_ID ");
		sql.append(" 	WHERE PIED.OUT_BIZ_DATE > '"+startDate+"' ");
		sql.append(" 		AND PIED.OUT_BIZ_DATE < '"+endDate+"' ");
		sql.append(" 		AND (POE.OUTWAREHOUSE_TYPE = 2 OR POE.OUTWAREHOUSE_TYPE = 3) ");
		if(!request.getParameter("ikeaNumber").isEmpty()){
			sql.append(" 		AND SUBSTR(PIED.BARCODE1,4,8) = '"+request.getParameter("ikeaNumber").trim()+"' ");
		}
		sql.append(" ) AS MD  ");
		sql.append(" LEFT JOIN T_MATERIAL TM ON MD.ID = TM.ID ");

		if(!request.getParameter("materialName").isEmpty()){
			sql.append(" WHERE TM.NAME LIKE '%"+request.getParameter("materialName")+"%' ");
		}
		sql.append(" GROUP BY MD.ID,TM.NUMBER,TM.NAME ");
		
		return sql.toString();
	}
}
