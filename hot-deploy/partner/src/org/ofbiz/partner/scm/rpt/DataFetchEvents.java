package org.ofbiz.partner.scm.rpt;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import org.codehaus.jackson.map.ObjectMapper;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.jdbc.ConnectionFactory;
import org.ofbiz.entity.util.EntityFindOptions;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.common.Utils;
import org.ofbiz.partner.scm.pojo.OrderPojo;

public class DataFetchEvents {
	
	public static String fetchData(HttpServletRequest request, HttpServletResponse response) throws Exception {
		// 数据库连接
		Connection conn = ConnectionFactory.getConnection(Utils.getConnectionHelperName());
		try {
			String sql = "select a.number,a.biz_date ,b.name from Purchase_Warehousing a inner join supplier b on a.supplier_supplier_id=b.id";
			PreparedStatement ps = conn.prepareStatement(sql);
			ResultSet rs = ps.executeQuery();

			CommonEvents.writeJsonDataToExt(response, Utils.getJsonArr4ResultSet(rs,request).toString());
		} finally {
			if (conn != null) {
				conn.close();
			}
		}
		return "sucess";
	}
	
	public static List<Map<String, Object>> getListWithReportName(HttpServletRequest request) throws Exception{
		List<Map<String, Object>> list = null;
		if("SDR".equals(request.getParameter("report"))){
			list = getStockDetailReportList(request);
		} else if("PKM".equals(request.getParameter("report"))){
			list = getPackingMaterialReportList(request);
		} else if("CPMR".equals(request.getParameter("report"))){
			list = getConsignMatchReportList(request);
		} else if("PR".equals(request.getParameter("report"))){
			list = getProductReportList(request);
		} else if("SPC".equals(request.getParameter("report"))){
			list = getSemiProductCostReportList(request);
		} else if("SL".equals(request.getParameter("report"))){
			list = getSystemLogList(request);
		}
		return list;
	}
	
	/**
	 * 库存情况报表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryStockDetailReport(HttpServletRequest request, HttpServletResponse response) throws Exception {
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(request,getStockDetailReportSql(request)));
		return "sucess";
	}
	
	/**
	 * 库存情况数据列表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static List<Map<String ,Object>> getStockDetailReportList(HttpServletRequest request) throws Exception {
		return getListWithSQL(request,getStockDetailReportSql(request));
	}
	
	/**
	 * 库存情况报表SQL
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public static String getStockDetailReportSql(HttpServletRequest request) throws Exception {
		String year = null;
		String month = null;
		String warehouseId = null;
		String materialId = null;
		String tableName = null;
		if(request.getParameter("year") != null && request.getParameter("month") != null){
			year = request.getParameter("year");
			month = request.getParameter("month");
		}else{
			throw new Exception("找不到日期参数！");
		}
		Calendar cal= Calendar.getInstance();
		//月份需要减一，月份是从0开始
		cal.set(Integer.parseInt(year), Integer.parseInt(month)-1, 01, 0, 0, 0);
		cal.set(Calendar.MILLISECOND, 0);
		if(org.ofbiz.partner.scm.pricemgr.Utils.isCurPeriod(cal.getTime())){
			tableName = " CUR_MATERIAL_BALANCE ";
		} else {
			tableName = " HIS_MATERIAL_BALANCE ";
		}
		
		if(request.getParameter("warehouseId") != null){
			warehouseId = request.getParameter("warehouseId");
		}
		if(request.getParameter("materialId") != null){
			materialId = request.getParameter("materialId");
		}
		
		String sql =" SELECT "+
						" CMB.WAREHOUSE_ID, "+
						" WH.NAME AS WAREHOUSE_NAME, "+
						" CMB.MATERIAL_ID, "+
						" TM.NAME AS MATERIAL_NAME, "+
						" TM.DEFAULT_UNIT_ID, "+
						" UN.NAME AS DEFAULT_UNIT_NAME, "+
						" ROUND(IFNULL(CMB.BEGINVOLUME,0),4) AS BEGINVOLUME, "+
						" ROUND(IFNULL(CMB.BEGINSUM,0),4) AS BEGINSUM, "+
						" ROUND(IFNULL(CMB.BEGINSUM/CMB.BEGINVOLUME,0),4) AS BEGINPRICE, "+
						" ROUND(IFNULL(CMB.VOLUME,0),4) AS ENDVOLUME, "+
						" ROUND(IFNULL(CMB.TOTAL_SUM,0),4) AS ENDSUM, "+
						" ROUND(IFNULL(CMB.TOTAL_SUM/CMB.VOLUME,0),4) AS ENDPRICE, "+
						" ROUND(IFNULL(CMB.IN_VOLUME,0),4) AS INVOLUME, "+
						" ROUND(IFNULL(CMB.IN_SUM,0),4) AS INSUM, "+
						" ROUND(IFNULL(CMB.IN_SUM/CMB.IN_VOLUME,0),4) AS INPRICE, "+
						" ROUND(IFNULL(CMB.OUT_VOLUME,0),4) AS OUTVOLUME, "+
						" ROUND(IFNULL(CMB.OUT_SUM,0),4) AS OUTSUM, "+
						" ROUND(IFNULL(CMB.OUT_SUM/CMB.OUT_VOLUME,0),4) AS OUTPRICE "+
					" FROM " + tableName + " CMB "+
					" LEFT JOIN WAREHOUSE WH ON CMB.WAREHOUSE_ID = WH.ID "+
					" LEFT JOIN T_MATERIAL TM ON CMB.MATERIAL_ID = TM.ID "+
					" LEFT JOIN UNIT UN ON TM.DEFAULT_UNIT_ID = UN.ID "+
					" WHERE YEAR = " + year +
					" AND MONTH = " + month ;
		if(materialId != null && !"".equals(materialId)){
			sql += " AND CMB.MATERIAL_ID = '" + materialId + "'";
		}
		if(warehouseId != null && !"".equals(warehouseId)){
			sql += " AND CMB.WAREHOUSE_ID = '" + warehouseId + "'";
		}
		return sql;
	}
	
	/**
	 * 库存情况图形
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryStockDetailChart(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String year = null;
		String month = null;
		String warehouseId = null;
		String tableName = null;
		if(request.getParameter("year") != null && request.getParameter("month") != null){
			year = request.getParameter("year");
			month = request.getParameter("month");
		}else{
			throw new Exception("找不到日期参数！");
		}
		Calendar cal= Calendar.getInstance();
		//月份需要减一，月份是从0开始
		cal.set(Integer.parseInt(year), Integer.parseInt(month)-1, 01, 0, 0, 0);
		cal.set(Calendar.MILLISECOND, 0);
		if(org.ofbiz.partner.scm.pricemgr.Utils.isCurPeriod(cal.getTime())){
			tableName = " CUR_MATERIAL_BALANCE ";
		} else {
			tableName = " HIS_MATERIAL_BALANCE ";
		}
		
		if(request.getParameter("warehouseId") != null){
			warehouseId = request.getParameter("warehouseId");
		}
		
		String sql =" SELECT " +
						" CMB.MATERIAL_ID, " +
						" TM.NAME AS MATERIAL_NAME, " +
						" ROUND(SUM(IFNULL(CMB.TOTAL_SUM,0)),4) AS ENDSUM " +
					" FROM " + tableName + " CMB " +
					" LEFT JOIN T_MATERIAL TM ON CMB.MATERIAL_ID = TM.ID " +
					" WHERE YEAR = " + year +
					" AND MONTH = " + month ;
		if(warehouseId != null && !"".equals(warehouseId)){
			sql += " AND CMB.WAREHOUSE_ID = '" + warehouseId + "'";
		}
		sql += " GROUP BY CMB.MATERIAL_ID,TM.NAME ";
		
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(request,sql));
		return "sucess";
	}
	
	
	/**
	 * 发外加工对数报表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryConsignMatchReport(HttpServletRequest request, HttpServletResponse response) throws Exception {
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(request,getConsignMatchReportSql(request)));
		return "sucess";
	}
	
	/**
	 * 发外加工对数数据列表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static List<Map<String ,Object>> getConsignMatchReportList(HttpServletRequest request) throws Exception {
		return getListWithSQL(request,getConsignMatchReportSql(request));
	}
	
	/**
	 * 获取发外加工对数报表SQL
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public static String getConsignMatchReportSql(HttpServletRequest request) throws Exception {
		String year = null;
		String month = null;
		String supplierId = null;
		String tableName = null;
		if(request.getParameter("year") != null && request.getParameter("month") != null){
			year = request.getParameter("year");
			month = request.getParameter("month");
		}else{
			throw new Exception("找不到日期参数！");
		}
		Calendar cal= Calendar.getInstance();
		//月份需要减一，月份是从0开始
		cal.set(Integer.parseInt(year), Integer.parseInt(month)-1, 01, 0, 0, 0);
		cal.set(Calendar.MILLISECOND, 0);
		if(org.ofbiz.partner.scm.pricemgr.Utils.isCurPeriod(cal.getTime())){
			tableName = " CUR_CONSIGN_PROCESSED_PRICE ";
		} else {
			tableName = " HIS_CONSIGN_PROCESSED_PRICE ";
		}
		
		if(request.getParameter("supplier") != null){
			supplierId = request.getParameter("supplier");
		}
		String sql =" SELECT "+
						" CCPP.SUPPLIER_ID, "+
						" SUP.NAME AS SUPPLIER_NAME, "+
						" CCPP.MATERIAL_ID, "+
						" TM.NAME AS MATERIAL_NAME, "+
						" TM.DEFAULT_UNIT_ID, "+
						" UNT.NAME AS DEFAULT_UNIT_NAME, "+
						" ROUND(IFNULL(CCPP.IN_SUM/CCPP.IN_VOLUME,0),4) AS PRICE, "+
						" ROUND(IFNULL(CCPP.BEGINVOLUME,0),4) AS BEGINVOLUME, "+
						" ROUND(IFNULL(CCPP.IN_VOLUME,0),4) AS IN_VOLUME, "+
						" ROUND(IFNULL(CCPP.IN_SUM,0),4) AS IN_SUM, "+
						" ROUND(IFNULL(CCPP.OUT_VOLUME,0),4) AS OUT_VOLUME, "+
						" ROUND(IFNULL(CCPP.OUT_VOLUME*(CCPP.IN_SUM/CCPP.IN_VOLUME),0),4) AS OUT_SUM, "+
						" ROUND(IFNULL(CCPP.VOLUME,0),4) AS VOLUME "+
					" FROM "+ tableName +" CCPP "+
					" LEFT JOIN T_MATERIAL TM ON CCPP.MATERIAL_ID = TM.ID "+
					" LEFT JOIN SUPPLIER SUP ON CCPP.SUPPLIER_ID = SUP.ID "+
					" LEFT JOIN UNIT UNT ON TM.DEFAULT_UNIT_ID = UNT.ID "+
					" WHERE YEAR = " + year +
					" AND MONTH = " + month ;
		if(supplierId != null && !"".equals(supplierId)){
			sql += " AND CCPP.SUPPLIER_ID = '" + supplierId + "'";
		}
		return sql;
	}
	
	/**
	 * 发外加工对数图形
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryConsignMatchChart(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String year = null;
		String month = null;
		String tableName = null;
		if(request.getParameter("year") != null && request.getParameter("month") != null){
			year = request.getParameter("year");
			month = request.getParameter("month");
		}else{
			throw new Exception("找不到日期参数！");
		}
		Calendar cal= Calendar.getInstance();
		//月份需要减一，月份是从0开始
		cal.set(Integer.parseInt(year), Integer.parseInt(month)-1, 01, 0, 0, 0);
		cal.set(Calendar.MILLISECOND, 0);
		if(org.ofbiz.partner.scm.pricemgr.Utils.isCurPeriod(cal.getTime())){
			tableName = " CUR_CONSIGN_PROCESSED_PRICE ";
		} else {
			tableName = " HIS_CONSIGN_PROCESSED_PRICE ";
		}
		
		String sql =" SELECT "+
						" CCPP.SUPPLIER_ID, "+
						" SUP.NAME AS SUPPLIER_NAME, "+
						" SUM(ROUND(IFNULL(CCPP.IN_SUM,0),4)) AS TOTAL_IN_SUM, "+
						" SUM(ROUND(IFNULL(CCPP.OUT_VOLUME*(CCPP.IN_SUM/CCPP.IN_VOLUME),0),4)) AS TOTAL_OUT_SUM "+
					" FROM "+ tableName +" CCPP "+
					" LEFT JOIN T_MATERIAL TM ON CCPP.MATERIAL_ID = TM.ID "+
					" LEFT JOIN SUPPLIER SUP ON CCPP.SUPPLIER_ID = SUP.ID "+
					" LEFT JOIN UNIT UNT ON TM.DEFAULT_UNIT_ID = UNT.ID "+
					" WHERE YEAR = " + year +
					" AND MONTH = " + month +
					" GROUP BY CCPP.SUPPLIER_ID,SUP.NAME";
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(request,sql));
		return "sucess";
	}
	
	/**
	 * 安装包装报表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryPackingMaterialReport(HttpServletRequest request, HttpServletResponse response) throws Exception {
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(request,getPackingMaterialReportSql(request)));
		return "sucess";
	}
	
	/**
	 * 获取安装包数据列表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static List<Map<String ,Object>> getPackingMaterialReportList(HttpServletRequest request) throws Exception {
		return getListWithSQL(request,getPackingMaterialReportSql(request));
	}
	
	/**
	 * 获取安装包报表SQL
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public static String getPackingMaterialReportSql(HttpServletRequest request) throws Exception {
		String startDate = null;
		String endDate = null;
		String warehouseId = null;
		if(request.getParameter("startDate") != null && request.getParameter("endDate") != null){
			startDate = request.getParameter("startDate");
			endDate = request.getParameter("endDate");
		}else{
			throw new Exception("找不到日期参数！");
		}
		
		if(request.getParameter("warehouseId") != null){
			warehouseId = request.getParameter("warehouseId");
		}
		String sql =" SELECT " +
						" WW.BIZ_DATE, " +
						" WW.NUMBER, " +
						" WW.STATUS, " +
						" WH.NAME AS WAREHOUSENAME, " +
						" TM.NAME AS MATERIALNAME, " +
						" WWE.MATERIAL_MATERIAL_MODEL AS MATERIALMODEL, " +
						" UIT.NAME AS UNITNAME, " +
						" SUM(ROUND(IFNULL(WWE.VOLUME,0),4)) AS VOLUME, " +
						" SUM(ROUND(IFNULL(WWE.PRICE,0),4)) AS PRICE, " +
						" SUM(ROUND(IFNULL(WWE.ENTRYSUM,0),4)) AS ENTRYSUM " +
					" FROM WORKSHOP_WAREHOUSING WW " +
					" LEFT JOIN WORKSHOP_WAREHOUSING_ENTRY WWE ON WW.ID = WWE.PARENT_ID " +
					" LEFT JOIN T_MATERIAL TM ON WWE.MATERIAL_MATERIAL_ID = TM.ID " +
					" LEFT JOIN T_MATERIAL_TYPE TMT ON TM.MATERIAL_TYPE_ID = TMT.ID " +
					" LEFT JOIN WAREHOUSE WH ON WWE.WAREHOUSE_WAREHOUSE_ID = WH.ID " +
					" LEFT JOIN UNIT UIT ON WWE.UNIT_UNIT_ID = UIT.ID " +
					" WHERE TMT.NUMBER = 'MTT100005' " +
					" AND WW.BIZ_DATE >= '" + startDate + "'" +
					" AND WW.BIZ_DATE <= '" + endDate + "'" ;
		if(warehouseId != null && !"".equals(warehouseId)){
			sql += " AND WWE.WAREHOUSE_WAREHOUSE_ID = '" + warehouseId + "'";
		}
		sql += " GROUP BY WW.NUMBER,WH.NAME,TM.NAME,WWE.MATERIAL_MATERIAL_MODEL,UIT.NAME ";
		return sql;
	}
	
	
	/**
	 * 安装包装报表明细
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryPackingMaterialDetail(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String number = null;
		
		if(request.getParameter("number") != null){
			number = request.getParameter("number");
		}
		String sql =" SELECT " +
						" WW.NUMBER, " +
						" WWE.WAREHOUSE_WAREHOUSE_ID AS WAREHOUSEID, " +
						" WWE.MATERIAL_MATERIAL_ID AS MATERIALID, " +
						" TM.NUMBER AS MATERIALNUMBER, " +
						" TM.NAME AS MATERIALNAME, " +
						" AVG(ROUND(IFNULL(WPD.VOLUME,0),4)) AS PERVOLUME, " +
						" AVG(ROUND(IFNULL(WPD.PRICE,0),4)) AS PRICE, " +
						" ROUND(IFNULL(AVG(WPD.VOLUME*WWE.VOLUME),0),4) AS VOLUME, " +
						" ROUND(IFNULL(AVG(WPD.PRICE*WPD.VOLUME*WWE.VOLUME),0),4) AS ENTRYSUM " +
					" FROM WORKSHOP_WAREHOUSING WW " +
					" LEFT JOIN WORKSHOP_WAREHOUSING_ENTRY WWE ON WW.ID = WWE.PARENT_ID " +
					" LEFT JOIN WORKSHOP_PRICE_DETAIL WPD ON WWE.ID = WPD.PARENT_ID " +
					" LEFT JOIN T_MATERIAL TM ON WPD.MATERIAL_ID = TM.ID " +
					" LEFT JOIN UNIT UIT ON TM.DEFAULT_UNIT_ID = UIT.ID " +
					" WHERE WW.NUMBER = '" + number + "'";
		sql += " GROUP BY WW.NUMBER,WWE.WAREHOUSE_WAREHOUSE_ID,WWE.MATERIAL_MATERIAL_ID,TM.NUMBER,TM.NAME,WWE.VOLUME ";
		
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(request,sql));
		return "sucess";
	}
	
	/**
	 * 生产计划
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryProductionPlan(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String materialId = null;
		String materialVolume = "0";
		if(request.getParameter("materialId") != null){
			materialId = request.getParameter("materialId");
		}else{
			throw new Exception("找不到加工件参数！");
		}
		if(request.getParameter("materialVolume") != null){
			materialVolume = request.getParameter("materialVolume");
		}
		
		String sql =" SELECT " +
						" WH.NAME AS WAREHOUSENAME, " +
						" TM.NAME AS MATERIALNAME, " +
						" TM.MODEL AS MATERIALMODEL, " +
						" UNT.NAME AS UNITNAME, " +
						" ROUND(IFNULL(MBE.VOLUME*"+ materialVolume +",0),4) AS VOLUME, " +
						" ROUND(IFNULL(CMB.VOLUME,0),4) AS STOCKVOLUME, " +
						" ROUND(IFNULL(CMB.TOTAL_SUM/CMB.VOLUME,0),4) AS PRICE, " +
						" ROUND(IFNULL((CMB.TOTAL_SUM/CMB.VOLUME) * (MBE.VOLUME * " + materialVolume + "),0),4) AS ENDSUM " +
					" FROM MATERIAL_BOM MB " +
					" LEFT JOIN MATERIAL_BOM_ENTRY MBE ON MB.ID = MBE.PARENT_ID " +
					" LEFT JOIN T_MATERIAL TM ON MBE.ENTRY_MATERIAL_ID = TM.ID " +
					" LEFT JOIN UNIT UNT ON TM.DEFAULT_UNIT_ID = UNT.ID " +
					" LEFT JOIN CUR_MATERIAL_BALANCE CMB ON MBE.ENTRY_MATERIAL_ID = CMB.MATERIAL_ID " +
					" LEFT JOIN WAREHOUSE WH ON CMB.WAREHOUSE_ID = WH.ID " +
					" WHERE MB.MATERIAL_ID = '" + materialId + "'";
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(request,sql));
		return "sucess";
	}
	
	/**
	 * 成品报表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryProductReport(HttpServletRequest request, HttpServletResponse response) throws Exception {
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(request,getProductReportSql(request)));
		return "sucess";
	}
	
	/**
	 * 获取成品数据列表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static List<Map<String ,Object>> getProductReportList(HttpServletRequest request) throws Exception {
		return getListWithSQL(request,getProductReportSql(request));
	}
	
	/**
	 * 获取成品报表SQL
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public static String getProductReportSql(HttpServletRequest request) throws Exception {
		String year = null;
		String month = null;
		String warehouseId = null;
		String materialId = null;
		String tableName = null;
		if(request.getParameter("year") != null && request.getParameter("month") != null){
			year = request.getParameter("year");
			month = request.getParameter("month");
		}else{
			throw new Exception("找不到日期参数！");
		}
		Calendar cal= Calendar.getInstance();
		//月份需要减一，月份是从0开始
		cal.set(Integer.parseInt(year), Integer.parseInt(month)-1, 01, 0, 0, 0);
		cal.set(Calendar.MILLISECOND, 0);
		if(org.ofbiz.partner.scm.pricemgr.Utils.isCurPeriod(cal.getTime())){
			tableName = " CUR_MATERIAL_BALANCE ";
		} else {
			tableName = " HIS_MATERIAL_BALANCE ";
		}
		
		if(request.getParameter("warehouseId") != null){
			warehouseId = request.getParameter("warehouseId");
		}
		if(request.getParameter("materialId") != null){
			materialId = request.getParameter("materialId");
		}
		
		String sql =" SELECT "+
						" CMB.WAREHOUSE_ID, "+
						" WH.NAME AS WAREHOUSE_NAME, "+
						" CMB.MATERIAL_ID, "+
						" TM.NAME AS MATERIAL_NAME, "+
						" TM.DEFAULT_UNIT_ID, "+
						" UN.NAME AS DEFAULT_UNIT_NAME, "+
						" ROUND(IFNULL(CMB.BEGINVOLUME,0),4) AS BEGINVOLUME, "+
						" ROUND(IFNULL(CMB.BEGINSUM,0),4) AS BEGINSUM, "+
						" ROUND(IFNULL(CMB.BEGINSUM/CMB.BEGINVOLUME,0),4) AS BEGINPRICE, "+
						" ROUND(IFNULL(CMB.VOLUME,0),4) AS ENDVOLUME, "+
						" ROUND(IFNULL(CMB.TOTAL_SUM,0),4) AS ENDSUM, "+
						" ROUND(IFNULL(CMB.TOTAL_SUM/CMB.VOLUME,0),4) AS ENDPRICE, "+
						" ROUND(IFNULL(CMB.IN_VOLUME,0),4) AS INVOLUME, "+
						" ROUND(IFNULL(CMB.IN_SUM,0),4) AS INSUM, "+
						" ROUND(IFNULL(CMB.IN_SUM/CMB.IN_VOLUME,0),4) AS INPRICE, "+
						" ROUND(IFNULL(CMB.OUT_VOLUME,0),4) AS OUTVOLUME, "+
						" ROUND(IFNULL(CMB.OUT_SUM,0),4) AS OUTSUM, "+
						" ROUND(IFNULL(CMB.OUT_SUM/CMB.OUT_VOLUME,0),4) AS OUTPRICE "+
					" FROM " + tableName + " CMB "+
					" LEFT JOIN WAREHOUSE WH ON CMB.WAREHOUSE_ID = WH.ID "+
					" LEFT JOIN T_MATERIAL TM ON CMB.MATERIAL_ID = TM.ID "+
					" LEFT JOIN T_MATERIAL_TYPE TMT ON TM.MATERIAL_TYPE_ID = TMT.ID " +
					" LEFT JOIN UNIT UN ON TM.DEFAULT_UNIT_ID = UN.ID "+
					" WHERE TMT.NUMBER = 'MTT100004' " +
					" AND YEAR = " + year +
					" AND MONTH = " + month ;
		if(materialId != null && !"".equals(materialId)){
			sql += " AND CMB.MATERIAL_ID = '" + materialId + "'";
		}
		if(warehouseId != null && !"".equals(warehouseId)){
			sql += " AND CMB.WAREHOUSE_ID = '" + warehouseId + "'";
		}
		return sql;
	}
	
	/**
	 * 成品报表图形
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryProductChart(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String warehouseId = null;
		String materialId = null;
		
		if(request.getParameter("warehouseId") != null){
			warehouseId = request.getParameter("warehouseId");
		}
		if(request.getParameter("materialId") != null){
			materialId = request.getParameter("materialId");
		}
		
		String sql =" SELECT " +
						" CONCAT(YEAR,IF(MONTH<10,CONCAT(0,MONTH),MONTH)) AS MONTH, " +
						" ROUND(IFNULL(CMB.IN_SUM,0),4) AS INSUM, " +
						" ROUND(IFNULL(CMB.OUT_SUM,0),4) AS OUTSUM " +
					" FROM HIS_MATERIAL_BALANCE CMB " +
					" LEFT JOIN WAREHOUSE WH ON CMB.WAREHOUSE_ID = WH.ID " +
					" LEFT JOIN T_MATERIAL TM ON CMB.MATERIAL_ID = TM.ID " +
					" LEFT JOIN T_MATERIAL_TYPE TMT ON TM.MATERIAL_TYPE_ID = TMT.ID " +
					" LEFT JOIN UNIT UN ON TM.DEFAULT_UNIT_ID = UN.ID " +
					" WHERE TMT.NUMBER = 'MTT100004' ";
		if(materialId != null && !"".equals(materialId)){
			sql += " AND CMB.MATERIAL_ID = '" + materialId + "'";
		}
		if(warehouseId != null && !"".equals(warehouseId)){
			sql += " AND CMB.WAREHOUSE_ID = '" + warehouseId + "'";
		}
		sql += " GROUP BY CONCAT(YEAR,IF(MONTH<10,CONCAT(0,MONTH),MONTH)) ";
		sql += " LIMIT 11 " ;
		sql += " UNION " ;
		sql += " SELECT " ;
		sql += 	" CONCAT(YEAR,IF(MONTH<10,CONCAT(0,MONTH),MONTH)) AS MONTH, " ;
		sql +=	" ROUND(IFNULL(CMB.IN_SUM,0),4) AS INSUM, " ;
		sql +=	" ROUND(IFNULL(CMB.OUT_SUM,0),4) AS OUTSUM " ;
		sql += " FROM CUR_MATERIAL_BALANCE CMB " ;
		sql += " LEFT JOIN WAREHOUSE WH ON CMB.WAREHOUSE_ID = WH.ID " ;
		sql += " LEFT JOIN T_MATERIAL TM ON CMB.MATERIAL_ID = TM.ID " ;
		sql += " LEFT JOIN T_MATERIAL_TYPE TMT ON TM.MATERIAL_TYPE_ID = TMT.ID ";
		sql += " LEFT JOIN UNIT UN ON TM.DEFAULT_UNIT_ID = UN.ID " ;
		sql += " WHERE TMT.NUMBER = 'MTT100004' " ;
		if(materialId != null && !"".equals(materialId)){
			sql += " AND CMB.MATERIAL_ID = '" + materialId + "'";
		}
		if(warehouseId != null && !"".equals(warehouseId)){
			sql += " AND CMB.WAREHOUSE_ID = '" + warehouseId + "'";
		}
		sql += " GROUP BY CONCAT(YEAR,IF(MONTH<10,CONCAT(0,MONTH),MONTH)) ";
		sql += " ORDER BY MONTH " ;
		
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(request,sql));
		return "sucess";
	}
	
	/**
	 * 黑坯件材料耗用表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String querySemiProductCostReport(HttpServletRequest request, HttpServletResponse response) throws Exception {
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(request,getSemiProductCostReportSql(request)));
		return "sucess";
	}
	
	/**
	 * 获取黑坯件材料耗用表数据列表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static List<Map<String ,Object>> getSemiProductCostReportList(HttpServletRequest request) throws Exception {
		return getListWithSQL(request,getSemiProductCostReportSql(request));
	}
	
	/**
	 * 获取黑坯件材料耗用表SQL
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public static String getSemiProductCostReportSql(HttpServletRequest request) throws Exception {
		String startDate = null;
		String endDate = null;
		String warehouseId = null;
		String materialId = null;
		if(request.getParameter("startDate") != null && request.getParameter("endDate") != null){
			startDate = request.getParameter("startDate");
			endDate = request.getParameter("endDate");
		}else{
			throw new Exception("找不到日期参数！");
		}
		
		if(request.getParameter("warehouseId") != null){
			warehouseId = request.getParameter("warehouseId");
		}
		if(request.getParameter("materialId") != null){
			materialId = request.getParameter("materialId");
		}
		
		String sql =" SELECT " +
						" WW.BIZ_DATE, " +
						" WW.NUMBER, " +
						" WW.STATUS, " +
						" WH.NAME AS WAREHOUSENAME, " +
						" TM.NAME AS MATERIALNAME, " +
						" WWE.MATERIAL_MATERIAL_MODEL AS MATERIALMODEL, " +
						" UIT.NAME AS UNITNAME, " +
						" SUM(ROUND(IFNULL(WWE.VOLUME,0),4)) AS VOLUME, " +
						" SUM(ROUND(IFNULL(WWE.PRICE,0),4)) AS PRICE, " +
						" SUM(ROUND(IFNULL(WWE.ENTRYSUM,0),4)) AS ENTRYSUM " +
					" FROM WORKSHOP_WAREHOUSING WW " +
					" LEFT JOIN WORKSHOP_WAREHOUSING_ENTRY WWE ON WW.ID = WWE.PARENT_ID " +
					" LEFT JOIN T_MATERIAL TM ON WWE.MATERIAL_MATERIAL_ID = TM.ID " +
					" LEFT JOIN T_MATERIAL_TYPE TMT ON TM.MATERIAL_TYPE_ID = TMT.ID " +
					" LEFT JOIN WAREHOUSE WH ON WWE.WAREHOUSE_WAREHOUSE_ID = WH.ID " +
					" LEFT JOIN UNIT UIT ON WWE.UNIT_UNIT_ID = UIT.ID " +
					" WHERE TMT.NUMBER = 'MTT100002' " +
					" AND WW.BIZ_DATE >= '" + startDate + "'" +
					" AND WW.BIZ_DATE <= '" + endDate + "'" ;
		if(warehouseId != null && !"".equals(warehouseId)){
			sql += " AND WWE.WAREHOUSE_WAREHOUSE_ID = '" + warehouseId + "'";
		}
		if(materialId != null && !"".equals(materialId)){
			sql += " AND TM.ID = '" + materialId + "'";
		}
		sql += " GROUP BY WW.NUMBER,WH.NAME,TM.NAME,WWE.MATERIAL_MATERIAL_MODEL,UIT.NAME ";
		sql += " union ";
		sql += " SELECT ";
		sql += " 	CW.BIZ_DATE, ";
		sql += " 	CW.NUMBER, ";
		sql += " 	CW.STATUS, ";
		sql += " 	WH.NAME AS WAREHOUSENAME, ";
		sql += " 	TM.NAME AS MATERIALNAME, ";
		sql += " 	CWE.MATERIAL_MATERIAL_MODEL AS MATERIALMODEL, ";
		sql += " 	UIT.NAME AS UNITNAME, ";
		sql += " 	SUM(ROUND(IFNULL(CWE.VOLUME,0),4)) AS VOLUME, ";
		sql += " 	SUM(ROUND(IFNULL(CWE.PRICE,0),4)) AS PRICE, ";
		sql += " 	SUM(ROUND(IFNULL(CWE.ENTRYSUM,0),4)) AS ENTRYSUM ";
		sql += " FROM CONSIGN_WAREHOUSING CW ";
		sql += " LEFT JOIN CONSIGN_WAREHOUSING_ENTRY CWE ON CW.ID = CWE.PARENT_ID ";
		sql += " LEFT JOIN T_MATERIAL TM ON CWE.MATERIAL_MATERIAL_ID = TM.ID ";
		sql += " LEFT JOIN T_MATERIAL_TYPE TMT ON TM.MATERIAL_TYPE_ID = TMT.ID ";
		sql += " LEFT JOIN WAREHOUSE WH ON CWE.WAREHOUSE_WAREHOUSE_ID = WH.ID ";
		sql += " LEFT JOIN UNIT UIT ON CWE.UNIT_UNIT_ID = UIT.ID ";
		sql += " WHERE TMT.NUMBER = 'MTT100002' ";
		sql += " AND CW.BIZ_DATE >= '" + startDate + "'";
		sql += " AND CW.BIZ_DATE <= '" + endDate + "'" ;
		if(warehouseId != null && !"".equals(warehouseId)){
			sql += " AND CWE.WAREHOUSE_WAREHOUSE_ID = '" + warehouseId + "'";
		}
		if(materialId != null && !"".equals(materialId)){
			sql += " AND TM.ID = '" + materialId + "'";
		}
		sql += " GROUP BY CW.NUMBER,WH.NAME,TM.NAME,CWE.MATERIAL_MATERIAL_MODEL,UIT.NAME ";
		return sql;
	}
	
	/**
	 * 黑坯件材料耗用明细表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String querySemiProductCostDetail(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String number = null;
		
		if(request.getParameter("number") != null){
			number = request.getParameter("number");
		}
		String sql =" SELECT " +
						" WW.NUMBER, " +
						" WWE.WAREHOUSE_WAREHOUSE_ID AS WAREHOUSEID, " +
						" WWE.MATERIAL_MATERIAL_ID AS MATERIALID, " +
						" TM.NUMBER AS MATERIALNUMBER, " +
						" TM.NAME AS MATERIALNAME, " +
						" AVG(ROUND(IFNULL(WPD.VOLUME,0),4)) AS PERVOLUME, " +
						" AVG(ROUND(IFNULL(WPD.PRICE,0),4)) AS PRICE, " +
						" ROUND(IFNULL(AVG(WPD.VOLUME*WWE.VOLUME),0),4) AS VOLUME, " +
						" ROUND(IFNULL(AVG(WPD.PRICE*WPD.VOLUME*WWE.VOLUME),0),4) AS ENTRYSUM " +
					" FROM WORKSHOP_WAREHOUSING WW " +
					" LEFT JOIN WORKSHOP_WAREHOUSING_ENTRY WWE ON WW.ID = WWE.PARENT_ID " +
					" LEFT JOIN WORKSHOP_PRICE_DETAIL WPD ON WWE.ID = WPD.PARENT_ID " +
					" LEFT JOIN T_MATERIAL TM ON WPD.MATERIAL_ID = TM.ID " +
					" LEFT JOIN UNIT UIT ON TM.DEFAULT_UNIT_ID = UIT.ID " +
					" WHERE WW.NUMBER = '" + number + "'";
		sql += " GROUP BY WW.NUMBER,WWE.WAREHOUSE_WAREHOUSE_ID,WWE.MATERIAL_MATERIAL_ID,TM.NUMBER,TM.NAME,WWE.VOLUME ";
		sql += " UNION ";
		sql += " SELECT ";
		sql += " 	CW.NUMBER, ";
		sql += " 	CWE.WAREHOUSE_WAREHOUSE_ID AS WAREHOUSEID, ";
		sql += " 	CWE.MATERIAL_MATERIAL_ID AS MATERIALID, ";
		sql += " 	TM.NUMBER AS MATERIALNUMBER, ";
		sql += " 	TM.NAME AS MATERIALNAME, ";
		sql += " 	AVG(ROUND(IFNULL(CPD.VOLUME,0),4)) AS PERVOLUME, ";
		sql += " 	AVG(ROUND(IFNULL(CPD.PRICE,0),4)) AS PRICE, ";
		sql += " 	ROUND(IFNULL(AVG(CPD.VOLUME*CWE.VOLUME),0),4) AS VOLUME, ";
		sql += " 	ROUND(IFNULL(AVG(CPD.PRICE*CPD.VOLUME*CWE.VOLUME),0),4) AS ENTRYSUM ";
		sql += " FROM CONSIGN_WAREHOUSING CW ";
		sql += " LEFT JOIN CONSIGN_WAREHOUSING_ENTRY CWE ON CW.ID = CWE.PARENT_ID ";
		sql += " LEFT JOIN CONSIGN_PRICE_DETAIL CPD ON CWE.ID = CPD.PARENT_ID ";
		sql += " LEFT JOIN T_MATERIAL TM ON CPD.MATERIAL_ID = TM.ID ";
		sql += " LEFT JOIN UNIT UIT ON TM.DEFAULT_UNIT_ID = UIT.ID ";
		sql += " WHERE CW.NUMBER = '" + number + "'";
		sql += " GROUP BY CW.NUMBER,CWE.WAREHOUSE_WAREHOUSE_ID,CWE.MATERIAL_MATERIAL_ID,TM.NUMBER,TM.NAME,CWE.VOLUME ";
		
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(request,sql));
		return "sucess";
	}
	
	/**
	 * 获取日志列表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String querySystemLogReport(HttpServletRequest request, HttpServletResponse response) throws Exception {
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(request,querySystemLogListSql(request)));
		return "sucess";
	}
	
	/**
	 * 获取日志列表（用于导出）
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public static List<Map<String ,Object>> getSystemLogList(HttpServletRequest request) throws Exception {
		return getListWithSQL(request,querySystemLogListSql(request));
	}
	
	/**
	 * 获取日志列表SQL
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public static String querySystemLogListSql(HttpServletRequest request) throws Exception {
		String startDate = null;
		String endDate = null;
		String userId = null;
		if(request.getParameter("startDate") != null && request.getParameter("endDate") != null){
			startDate = request.getParameter("startDate");
			endDate = request.getParameter("endDate");
		}else{
			throw new Exception("找不到日期参数！");
		}
		
		if(request.getParameter("userId") != null){
			userId = request.getParameter("userId");
		}
		String sql =" SELECT " + 
						" SH.id, " + 
						" SH.HIT_START_DATE_TIME AS hitTime, " + 
						" SH.HIT_TYPE_ID AS hitType, " + 
						" SH.RUNNING_TIME_MILLIS AS runningTime, " + 
						" SH.USER_LOGIN_ID AS userId, " + 
						" SH.REQUEST_URL AS url, " + 
						" TSLT.NAME AS name, " + 
						" TSLT.OPERATE_TYPE AS operateType, " + 
						" TSLT.KEY_WORD AS keyWord, " + 
						" TSLT.VALID AS valid, " + 
						" VIT.CLIENT_IP_ADDRESS AS ipAddress, " + 
						" VIT.CLIENT_HOST_NAME AS hostName " + 
					" FROM SERVER_HIT SH, T_SYSTEM_LOG_TYPE TSLT, VISIT VIT " + 
					" WHERE TSLT.VALID = '1' " + 
					" AND SH.VISIT_ID = VIT.VISIT_ID " + 
					" AND SH.REQUEST_URL LIKE CONCAT('%',TSLT.KEY_WORD,'%') " + 
					" AND SH.HIT_START_DATE_TIME >= '" + startDate + "'" +
					" AND SH.HIT_START_DATE_TIME <= '" + endDate + "'" ;
		if(userId != null && !"".equals(userId)){
			sql += " AND SH.USER_LOGIN_ID = '" + userId + "'";
		}
		return sql;
	}
	
	public static String addOrderParam(HttpServletRequest request, String sql) throws Exception{
		if(request.getParameter("sort")!=null){
			ObjectMapper objMapper = new ObjectMapper();//新建局部变量
			JSONArray array = JSONArray.fromObject(request.getParameter("sort").toString());
			for(int i = 0; i < array.size(); i++) {
				OrderPojo order = objMapper.readValue(array.getString(i), OrderPojo.class); 
				if(i==0){
					sql += " ORDER BY ";
				}
				sql += order.getProperty() + " " + order.getDirection();
			}
		}
		return sql;
	}
	
	/**
	 * 查询物料库存情况
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryMaterialVolumeDetail(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		String sql =" SELECT " +
						" TM.ID AS ID, " +
						" TM.NUMBER AS NUMBER, " +
						" TM.NAME AS NAME, " +
						" SUM(IFNULL(CMB.VOLUME,0)) AS WH_VOLUME, " +
						" SUM(IFNULL(CMB.TOTAL_SUM,0)) AS WH_SUM, " +
						" SUM(IFNULL(CWP.VOLUME,0)) AS WS_VOLUME, " +
						" SUM(IFNULL(CWP.TOTALSUM,0)) AS WS_SUM, " +
						" SUM(IFNULL(CCP.VOLUME,0)) AS CS_VOLUME, " +
						" SUM(IFNULL(CCP.TOTALSUM,0)) AS CS_SUM " +
					" FROM CUR_MATERIAL_BALANCE CMB " +
					" LEFT JOIN T_MATERIAL TM ON CMB.MATERIAL_ID = TM.ID " +
					" LEFT JOIN CUR_WORKSHOP_PRICE CWP ON CMB.MATERIAL_ID = CWP.MATERIAL_ID " +
					" LEFT JOIN CUR_CONSIGN_PRICE CCP ON CMB.MATERIAL_ID = CCP.MATERIAL_ID " +
					" GROUP BY TM.ID,TM.NUMBER,TM.NAME " + 
					" ORDER BY TM.NUMBER ";
		
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(request,sql));
		return "sucess";
	}
	
	/**
	 * 查询物料库存分布情况图形
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryMaterialVolumeChart(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String materialString = "";
		if(request.getParameter("materialId") != null){
			materialString = "WHERE MATERIAL_ID = '" + request.getParameter("materialId") + "'";
		}
		
		String sql =" SELECT " +
						" WH.NAME AS NAME, " +
						" SUM(IFNULL(CMB.VOLUME,0)) AS VOLUME " +
					" FROM CUR_MATERIAL_BALANCE CMB " +
					" LEFT JOIN WAREHOUSE WH ON CMB.WAREHOUSE_ID = WH.ID " +
					materialString +
					" GROUP BY WH.NAME " +
					" UNION " +
					" SELECT " +
						" WS.NAME AS NAME, " +
						" SUM(IFNULL(CWP.VOLUME,0)) AS VOLUME " +
					" FROM CUR_WORKSHOP_PRICE CWP " +
					" LEFT JOIN WORKSHOP WS ON CWP.WORKSHOP_ID = WS.ID " +
					materialString +
					" GROUP BY WS.NAME " +
					" UNION " +
					" SELECT " +
						" SP.NAME AS NAME, " +
						" SUM(IFNULL(CCP.VOLUME,0)) AS VOLUME " +
					" FROM CUR_CONSIGN_PRICE CCP " +
					" LEFT JOIN SUPPLIER SP ON CCP.SUPPLIER_ID = SP.ID " +
					materialString +
					" GROUP BY SP.NAME ";
		
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(request,sql));
		return "sucess";
	}
	
	/**
	 * 单据状态查询
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryBillStatusList(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(org.ofbiz.partner.scm.pricemgr.Utils.getCurDate());
		int year = calendar.get(Calendar.YEAR);
		int month = calendar.get(Calendar.MONTH)+1;
		
		String conditionString = " WHERE YEAR(BIZ_DATE) = '" + year + "' AND MONTH(BIZ_DATE) = '" + month +"'";
		String monthString = "'" + year + "年" + month + "月" + "' AS MONTH, ";
		
		String sql =" SELECT " +
					" 0 AS ODER, " +
					monthString +
					" '采购单' AS NAME, " +
					" CONCAT( " +
					" 	CONCAT('<font color=red>已保存(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 0 THEN 1 ELSE 0 END),0),char),'单)</font></font>、'), " +
					" 	CONCAT('<font color=green>审核通过(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 1 THEN 1 ELSE 0 END),0),char),'单)</font>、'), " +
					" 	CONCAT('<font color=Maroon>审核不通过(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 2 THEN 1 ELSE 0 END),0),char),'单)</font>') " +
					" ) AS DETAIL " +
					" FROM PURCHASE_BILL " +
					conditionString +
					" UNION " +
					" SELECT " +
					" 1 AS ODER, " +
					monthString +
					" '采购入库单' AS NAME, " +
					" CONCAT( " +
					" 	CONCAT('<font color=red>已保存(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 0 THEN 1 ELSE 0 END),0),char),'单)</font>、'), " +
					" 	CONCAT('<font color=green>已提交(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 4 THEN 1 ELSE 0 END),0),char),'单)</font> ') " +
					" ) AS DETAIL " +
					" FROM PURCHASE_WAREHOUSING " +
					conditionString +
					" UNION " +
					" SELECT " +
					" 2 AS ODER, " +
					monthString +
					" '采购退货单' AS NAME, " +
					" CONCAT( " +
					" 	CONCAT('<font color=red>已保存(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 0 THEN 1 ELSE 0 END),0),char),'单)</font>、'), " +
					" 	CONCAT('<font color=green>已提交(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 4 THEN 1 ELSE 0 END),0),char),'单)</font> ') " +
					" ) AS DETAIL " +
					" FROM PURCHASE_RETURN " +
					conditionString +
					" UNION " +
					" SELECT " +
					" 3 AS ODER, " +
					monthString +
					" '委外领料单' AS NAME, " +
					" CONCAT( " +
					" 	CONCAT('<font color=red>已保存(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 0 THEN 1 ELSE 0 END),0),char),'单)</font>、'), " +
					" 	CONCAT('<font color=green>已提交(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 4 THEN 1 ELSE 0 END),0),char),'单)</font> ') " +
					" ) AS DETAIL " +
					" FROM CONSIGN_DRAW_MATERIAL " +
					conditionString +
					" UNION " +
					" SELECT " +
					" 4 AS ODER, " +
					monthString +
					" '委外退料单' AS NAME, " +
					" CONCAT( " +
					" 	CONCAT('<font color=red>已保存(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 0 THEN 1 ELSE 0 END),0),char),'单)</font>、'), " +
					" 	CONCAT('<font color=green>已提交(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 4 THEN 1 ELSE 0 END),0),char),'单)</font> ') " +
					" ) AS DETAIL " +
					" FROM CONSIGN_RETURN_MATERIAL " +
					conditionString +
					" UNION " +
					" SELECT " +
					" 5 AS ODER, " +
					monthString +
					" '委外入库单' AS NAME, " +
					" CONCAT( " +
					" 	CONCAT('<font color=red>已保存(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 0 THEN 1 ELSE 0 END),0),char),'单)</font>、'), " +
					" 	CONCAT('<font color=green>已提交(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 4 THEN 1 ELSE 0 END),0),char),'单)</font> ') " +
					" ) AS DETAIL " +
					" FROM CONSIGN_WAREHOUSING " +
					conditionString +
					" UNION " +
					" SELECT " +
					" 6 AS ODER, " +
					monthString +
					" '委外退货单' AS NAME, " +
					" CONCAT( " +
					" 	CONCAT('<font color=red>已保存(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 0 THEN 1 ELSE 0 END),0),char),'单)</font>、'), " +
					" 	CONCAT('<font color=green>已提交(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 4 THEN 1 ELSE 0 END),0),char),'单)</font>【'), " +
					" 	CONCAT('<font color=red>未验收(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 4 AND CHECK_STATUS = 0 THEN 1 ELSE 0 END),0),char),'单)</font>、'), " +
					" 	CONCAT('<font color=Maroon>验收中(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 4 AND CHECK_STATUS = 1 THEN 1 ELSE 0 END),0),char),'单)</font>、'), " +
					" 	CONCAT('<font color=green>验收完成(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 4 AND CHECK_STATUS = 2 THEN 1 ELSE 0 END),0),char),'单)</font>】') " +
					" ) AS DETAIL " +
					" FROM CONSIGN_RETURN_PRODUCT " +
					conditionString +
					" UNION " +
					" SELECT " +
					" 7 AS ODER, " +
					monthString +
					" '制造领料单' AS NAME, " +
					" CONCAT( " +
					" 	CONCAT('<font color=red>已保存(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 0 THEN 1 ELSE 0 END),0),char),'单)</font>、'), " +
					" 	CONCAT('<font color=green>已提交(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 4 THEN 1 ELSE 0 END),0),char),'单)</font> ') " +
					" ) AS DETAIL " +
					" FROM WORKSHOP_DRAW_MATERIAL " +
					conditionString +
					" UNION " +
					" SELECT " +
					" 8 AS ODER, " +
					monthString +
					" '制造退料单' AS NAME, " +
					" CONCAT( " +
					" 	CONCAT('<font color=red>已保存(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 0 THEN 1 ELSE 0 END),0),char),'单)</font>、'), " +
					" 	CONCAT('<font color=green>已提交(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 4 THEN 1 ELSE 0 END),0),char),'单)</font> ') " +
					" ) AS DETAIL " +
					" FROM WORKSHOP_RETURN_MATERIAL " +
					conditionString +
					" UNION " +
					" SELECT " +
					" 9 AS ODER, " +
					monthString +
					" '制造入库单' AS NAME, " +
					" CONCAT( " +
					" 	CONCAT('<font color=red>已保存(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 0 THEN 1 ELSE 0 END),0),char),'单)</font>、'), " +
					" 	CONCAT('<font color=green>已提交(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 4 THEN 1 ELSE 0 END),0),char),'单)</font> ') " +
					" ) AS DETAIL " +
					" FROM WORKSHOP_WAREHOUSING " +
					conditionString +
					" UNION " +
					" SELECT " +
					" 10 AS ODER, " +
					monthString +
					" '制造退货单' AS NAME, " +
					" CONCAT( " +
					" 	CONCAT('<font color=red>已保存(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 0 THEN 1 ELSE 0 END),0),char),'单)</font>、'), " +
					" 	CONCAT('<font color=green>已提交(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 4 THEN 1 ELSE 0 END),0),char),'单)</font>【'), " +
					" 	CONCAT('<font color=red>未验收(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 4 AND CHECK_STATUS = 0 THEN 1 ELSE 0 END),0),char),'单)</font>、'), " +
					" 	CONCAT('<font color=Maroon>验收中(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 4 AND CHECK_STATUS = 1 THEN 1 ELSE 0 END),0),char),'单)</font>、'), " +
					" 	CONCAT('<font color=green>验收完成(',CONVERT(IFNULL(SUM(CASE WHEN STATUS = 4 AND CHECK_STATUS = 2 THEN 1 ELSE 0 END),0),char),'单)</font>】') " +
					" ) AS DETAIL " +
					" FROM WORKSHOP_RETURN_PRODUCT " +
					conditionString +
					" ORDER BY ODER " ;
		
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(request,sql));
		return "sucess";
	}

	public static String executeSelectSQL(HttpServletRequest request,String sql) throws Exception {
		// 数据库连接
		Connection conn = ConnectionFactory.getConnection(Utils.getConnectionHelperName());
		try {
			PreparedStatement ps = conn.prepareStatement(addOrderParam(request,sql));
			ResultSet rs = ps.executeQuery();
			return Utils.getJsonArr4ResultSet(rs,request).toString();
		} finally {
			if (conn != null) {
				conn.close();
			}
		}
	}

	public static List<Map<String, Object>> getListWithSQL(HttpServletRequest request,String sql) throws Exception {
		// 数据库连接
		Connection conn = ConnectionFactory.getConnection(Utils.getConnectionHelperName());
		try {
			PreparedStatement ps = conn.prepareStatement(addOrderParam(request,sql));
			List<Map<String, Object>> list = Utils.getList4ResultSet(ps.executeQuery());
			return list;
		} finally {
			if (conn != null) {
				conn.close();
			}
		}
	}
	
	/**
	 * 获取系统结算月份列表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String getMonthList(HttpServletRequest request, HttpServletResponse response) throws Exception {
		//只获取年、月字段数据
		Set<String> fields = new HashSet<String>();
		fields.add("year");
		fields.add("month");
		
		//去重
		EntityFindOptions findOptions = new EntityFindOptions();
		findOptions.setDistinct(true);
		
		//增加排序字段
		List<String> orders = new ArrayList<String>();
		orders.add("year");
		orders.add("month");
		
		List<GenericValue> valueList = CommonEvents.getDelegator(request).findList("HisMaterialBalance", null, fields, orders, findOptions, false);
		
		StringBuffer jsonStr = new StringBuffer();
		boolean isFirstValue = true;
		jsonStr.append("{'success':true,'records':[");
		for (GenericValue v : valueList) {
			if (isFirstValue) {
				isFirstValue = false;
			} else {
				jsonStr.append(",");
			}
			jsonStr.append("{'id' : '" + v.getString("year") + "-" + v.getString("month") + "',");
			jsonStr.append("'name' : '" + v.getString("year") + "年" + v.getString("month") + "月" + "'}");
		}
		if (!isFirstValue) {
			jsonStr.append(",");
		}
		Calendar cal= Calendar.getInstance();
		cal.setTime(org.ofbiz.partner.scm.pricemgr.Utils.getCurDate());
		jsonStr.append("{'id' : '" + cal.get(Calendar.YEAR) + "-" + (cal.get(Calendar.MONTH)+1) + "',");
		jsonStr.append("'name' : '" + cal.get(Calendar.YEAR) + "年" + (cal.get(Calendar.MONTH)+1) + "月" + "'}");
		
		jsonStr.append("]}");
		CommonEvents.writeJsonDataToExt(response, jsonStr.toString());
		return "sucess";
	}
}
