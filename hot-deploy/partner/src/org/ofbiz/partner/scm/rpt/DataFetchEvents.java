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
//		 LocalDispatcher dispatcher=(LocalDispatcher) request.getAttribute("dispatcher");
//		 Map<String, Object> result = null;
//         try {
//             result = dispatcher.runSync("productInwarehouseServices", null);
//         } catch (GenericServiceException e) {
//        	 
//         }
//         if(true)return "success";
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
		} else if("WSDR".equals(request.getParameter("report"))){
			list = getWorkshopStockDetailReportList(request);
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
		} else if("CPMRD".equals(request.getParameter("report"))){
			list = getConsignMatchReportDetailList(request);
		} else if("PMR".equals(request.getParameter("report"))){
			list = getPurchaseMatchReportList(request);
		} else if("PMRD".equals(request.getParameter("report"))){
			list = getPurchaseMatchReportDetailList(request);
		} else if("PSR".equals(request.getParameter("report"))){
			list = getProductStaticsReportList(request);
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
		String keyWord = null;
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
		if(request.getParameter("keyWord") != null){
			keyWord = request.getParameter("keyWord");
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
		if(warehouseId != null && !"".equals(warehouseId)){
			sql += " AND CMB.WAREHOUSE_ID = '" + warehouseId + "'";
		}
		if(keyWord != null && !"".equals(keyWord)){
			sql += " AND (TM.NUMBER LIKE '%" + keyWord + "%' OR TM.NAME LIKE '%" + keyWord + "%')";
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
	 * 车间储备情况报表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryWorkshopStockDetailReport(HttpServletRequest request, HttpServletResponse response) throws Exception {
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(request,getWorkshopStockDetailReportSql(request)));
		return "sucess";
	}
	
	/**
	 * 车间储备情况数据列表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static List<Map<String ,Object>> getWorkshopStockDetailReportList(HttpServletRequest request) throws Exception {
		return getListWithSQL(request,getWorkshopStockDetailReportSql(request));
	}
	
	/**
	 * 车间储备情况报表SQL
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public static String getWorkshopStockDetailReportSql(HttpServletRequest request) throws Exception {
		String year = null;
		String month = null;
		String workshopId = null;
		String keyWord = null;
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
			tableName = " CUR_WORKSHOP_PRICE ";
		} else {
			tableName = " HIS_WORKSHOP_PRICE ";
		}
		
		if(request.getParameter("workshopId") != null){
			workshopId = request.getParameter("workshopId");
		}
		if(request.getParameter("keyWord") != null){
			keyWord = request.getParameter("keyWord");
		}
		
		String sql =" SELECT "+
						" CWP.WORKSHOP_ID, "+
						" WS.NAME AS WORKSHOP_NAME, "+
						" CWP.MATERIAL_ID, "+
						" TM.NAME AS MATERIAL_NAME, "+
						" TM.DEFAULT_UNIT_ID, "+
						" UN.NAME AS DEFAULT_UNIT_NAME, "+
						" ROUND(IFNULL(CWP.BEGINVOLUME,0),4) AS BEGINVOLUME, "+
						" ROUND(IFNULL(CWP.BEGINSUM,0),4) AS BEGINSUM, "+
						" ROUND(IFNULL(CWP.BEGINSUM/CWP.BEGINVOLUME,0),4) AS BEGINPRICE, "+
						" ROUND(IFNULL(CWP.VOLUME,0),4) AS ENDVOLUME, "+
						" ROUND(IFNULL(CWP.TOTALSUM,0),4) AS ENDSUM, "+
						" ROUND(IFNULL(CWP.TOTALSUM/CWP.VOLUME,0),4) AS ENDPRICE "+
					" FROM " + tableName + " CWP "+
					" LEFT JOIN WORKSHOP WS ON CWP.WORKSHOP_ID = WS.ID "+
					" LEFT JOIN T_MATERIAL TM ON CWP.MATERIAL_ID = TM.ID "+
					" LEFT JOIN UNIT UN ON TM.DEFAULT_UNIT_ID = UN.ID "+
					" WHERE YEAR = " + year +
					" AND MONTH = " + month ;
		if(workshopId != null && !"".equals(workshopId)){
			sql += " AND CWP.WORKSHOP_ID = '" + workshopId + "'";
		}
		if(keyWord != null && !"".equals(keyWord)){
			sql += " AND (TM.NUMBER LIKE '%" + keyWord + "%' OR TM.NAME LIKE '%" + keyWord + "%')";
		}
		return sql;
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
						" CASE WHEN CCPP.TYPE=1 THEN '正常出入库' ELSE '退货验收' END AS TYPE_NAME, "+
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
	 * 发外加工对数明细列表（用于导出）
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static List<Map<String ,Object>> getConsignMatchReportDetailList(HttpServletRequest request) throws Exception {
		return getListWithSQL(request,getConsignMatchReportDetailSql(request));
	}
	
	/**
	 * 获取发外加工对数明细SQL
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public static String getConsignMatchReportDetailSql(HttpServletRequest request) throws Exception {
		String year = null;
		String month = null;
		String supplierId = null;
		String supplierSeleteStr1 = "";
		String supplierSeleteStr2 = "";
		String supplierSeleteStr3 = "";
		if(request.getParameter("year") != null && request.getParameter("month") != null){
			year = request.getParameter("year");
			month = request.getParameter("month");
		}else{
			throw new Exception("找不到日期参数！");
		}
		
		if(request.getParameter("supplier") != null){
			supplierId = request.getParameter("supplier");
		}
		
		if(supplierId != null && !"".equals(supplierId)){
			supplierSeleteStr1 = " AND CW.PROCESSOR_SUPPLIER_ID = '" + supplierId + "'";
			supplierSeleteStr2 = " AND CRP.PROCESSOR_SUPPLIER_ID = '" + supplierId + "'";
			supplierSeleteStr3 = " AND RPW.PROCESSOR_ID = '" + supplierId + "'";
		}
		
		String sql =" SELECT DATE(CW.BIZ_DATE) AS BIZ_DATE," +
				" '委外入库' AS NAME," +
				" CW.NUMBER," +
				" SP.NAME AS SUPPLIER_NAME," +
				" TSU.USER_NAME AS USER_NAME," +
				" WH.NAME AS WAREHOUSE_NAME," +
				" TM.NAME AS MATERIAL_NAME," +
				" UNT.NAME AS UNIT_NAME," +
				" ROUND(IFNULL(CWE.VOLUME,0),4) AS VOLUME," +
				" ROUND(IFNULL(CWE.PROCESS_PRICE,0),4) AS PROCESS_PRICE," +
				" ROUND(IFNULL(CWE.VOLUME * CWE.PROCESS_PRICE,0),4) AS PROCESS_SUM" +
				" FROM CONSIGN_WAREHOUSING CW" +
				" LEFT JOIN CONSIGN_WAREHOUSING_ENTRY CWE ON CW.ID = CWE.PARENT_ID" +
				" LEFT JOIN SUPPLIER SP ON CW.PROCESSOR_SUPPLIER_ID = SP.ID" +
				" LEFT JOIN T_SYSTEM_USER TSU ON CW.SUBMITTER_SYSTEM_USER_ID = TSU.ID" +
				" LEFT JOIN WAREHOUSE WH ON CWE.WAREHOUSE_WAREHOUSE_ID = WH.ID" +
				" LEFT JOIN MATERIAL_BOM MB ON CWE.BOM_ID = MB.ID" +
				" LEFT JOIN T_MATERIAL TM ON MB.MATERIAL_ID = TM.ID" +
				" LEFT JOIN UNIT UNT ON CWE.UNIT_UNIT_ID = UNT.ID" +
				" WHERE CW.STATUS = 4" +
				" AND YEAR(BIZ_DATE) = " + year +
				" AND MONTH(BIZ_DATE) = " + month +
				supplierSeleteStr1 +
				" UNION" +
				" SELECT DATE(CRP.BIZ_DATE) AS BIZ_DATE," +
				" '委外退货' AS NAME," +
				" CRP.NUMBER," +
				" SP.NAME AS SUPPLIER_NAME," +
				" TSU.USER_NAME AS USER_NAME," +
				" WH.NAME AS WAREHOUSE_NAME," +
				" TM.NAME AS MATERIAL_NAME," +
				" UNT.NAME AS UNIT_NAME," +
				" ROUND(IFNULL(-CRPE.VOLUME,0),4) AS VOLUME," +
				" 0 AS PROCESS_PRICE," +
				" 0 AS PROCESS_SUM" +
				" FROM CONSIGN_RETURN_PRODUCT CRP" +
				" LEFT JOIN CONSIGN_RETURN_PRODUCT_ENTRY CRPE ON CRP.ID = CRPE.PARENT_ID" +
				" LEFT JOIN SUPPLIER SP ON CRP.PROCESSOR_SUPPLIER_ID = SP.ID" +
				" LEFT JOIN T_SYSTEM_USER TSU ON CRP.SUBMITTER_SYSTEM_USER_ID = TSU.ID" +
				" LEFT JOIN WAREHOUSE WH ON CRPE.WAREHOUSE_WAREHOUSE_ID = WH.ID" +
				" LEFT JOIN MATERIAL_BOM MB ON CRPE.BOM_ID = MB.ID" +
				" LEFT JOIN T_MATERIAL TM ON MB.MATERIAL_ID = TM.ID" +
				" LEFT JOIN UNIT UNT ON CRPE.UNIT_UNIT_ID = UNT.ID" +
				" WHERE CRP.STATUS = 4" +
				" AND YEAR(BIZ_DATE) = " + year +
				" AND MONTH(BIZ_DATE) = " + month +
				supplierSeleteStr2 +
				" UNION" +
				" SELECT DATE(RPW.BIZ_DATE) AS BIZ_DATE," +
				" '委外验收' AS NAME," +
				" RPW.NUMBER," +
				" SP.NAME AS SUPPLIER_NAME," +
				" TSU.USER_NAME AS USER_NAME," +
				" WH.NAME AS WAREHOUSE_NAME," +
				" TM.NAME AS MATERIAL_NAME," +
				" UNT.NAME AS UNIT_NAME," +
				" ROUND(IFNULL(RPWE.VOLUME,0),4) AS VOLUME," +
				" 0 AS PROCESS_PRICE," +
				" 0 AS PROCESS_SUM" +
				" FROM RETURN_PRODUCT_WAREHOUSING RPW" +
				" LEFT JOIN RETURN_PRODUCT_WAREHOUSING_ENTRY RPWE ON RPW.ID = RPWE.PARENT_ID" +
				" LEFT JOIN SUPPLIER SP ON RPW.PROCESSOR_ID = SP.ID" +
				" LEFT JOIN T_SYSTEM_USER TSU ON RPW.SUBMITTER_SYSTEM_USER_ID = TSU.ID" +
				" LEFT JOIN WAREHOUSE WH ON RPWE.WAREHOUSE_WAREHOUSE_ID = WH.ID" +
				" LEFT JOIN MATERIAL_BOM MB ON RPWE.BOM_ID = MB.ID" +
				" LEFT JOIN T_MATERIAL TM ON MB.MATERIAL_ID = TM.ID" +
				" LEFT JOIN UNIT UNT ON RPWE.UNIT_UNIT_ID = UNT.ID" +
				" WHERE RPW.STATUS = 4" +
				" AND YEAR(BIZ_DATE) = " + year +
				" AND MONTH(BIZ_DATE) = " + month +
				supplierSeleteStr3 +
				" AND SP.NAME != ''";
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
	 * 采购供应对数报表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryPurchaseMatchReport(HttpServletRequest request, HttpServletResponse response) throws Exception {
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(request,getPurchaseMatchReportSql(request)));
		return "sucess";
	}
	
	/**
	 * 采购供应对数数据列表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static List<Map<String ,Object>> getPurchaseMatchReportList(HttpServletRequest request) throws Exception {
		return getListWithSQL(request,getPurchaseMatchReportSql(request));
	}
	
	/**
	 * 获取采购供应对数报表SQL
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public static String getPurchaseMatchReportSql(HttpServletRequest request) throws Exception {
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
			tableName = " CUR_PURCHASE_PRICE ";
		} else {
			tableName = " HIS_PURCHASE_PRICE ";
		}
		
		if(request.getParameter("supplier") != null){
			supplierId = request.getParameter("supplier");
		}
		String sql =" SELECT "+
						" CPP.SUPPLIER_ID, "+
						" SUP.NAME AS SUPPLIER_NAME, "+
						" CPP.MATERIAL_ID, "+
						" TM.NAME AS MATERIAL_NAME, "+
						" TM.DEFAULT_UNIT_ID, "+
						" UNT.NAME AS DEFAULT_UNIT_NAME, "+
						" ROUND(IFNULL(CPP.ENTRY_SUM/CPP.VOLUME,0),4) AS PRICE, "+
						" ROUND(IFNULL(CPP.IN_VOLUME,0),4) AS IN_VOLUME, "+
						" ROUND(IFNULL(CPP.OUT_VOLUME,0),4) AS OUT_VOLUME, "+
						" ROUND(IFNULL(CPP.ENTRY_SUM,0),4) AS ENTRY_SUM, "+
						" ROUND(IFNULL(CPP.VOLUME,0),4) AS VOLUME "+
					" FROM "+ tableName +" CPP "+
					" LEFT JOIN T_MATERIAL TM ON CPP.MATERIAL_ID = TM.ID "+
					" LEFT JOIN SUPPLIER SUP ON CPP.SUPPLIER_ID = SUP.ID "+
					" LEFT JOIN UNIT UNT ON TM.DEFAULT_UNIT_ID = UNT.ID "+
					" WHERE YEAR = " + year +
					" AND MONTH = " + month ;
		if(supplierId != null && !"".equals(supplierId)){
			sql += " AND CPP.SUPPLIER_ID = '" + supplierId + "'";
		}
		return sql;
	}
	
	/**
	 * 采购供应对数明细列表（用于导出）
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static List<Map<String ,Object>> getPurchaseMatchReportDetailList(HttpServletRequest request) throws Exception {
		return getListWithSQL(request,getPurchaseMatchReportDetailSql(request));
	}
	
	/**
	 * 获取采购供应对数明细SQL
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public static String getPurchaseMatchReportDetailSql(HttpServletRequest request) throws Exception {
		String year = null;
		String month = null;
		String supplierId = null;
		String supplierSeleteStr1 = "";
		String supplierSeleteStr2 = "";
		if(request.getParameter("year") != null && request.getParameter("month") != null){
			year = request.getParameter("year");
			month = request.getParameter("month");
		}else{
			throw new Exception("找不到日期参数！");
		}
		
		if(request.getParameter("supplier") != null){
			supplierId = request.getParameter("supplier");
		}
		
		if(supplierId != null && !"".equals(supplierId)){
			supplierSeleteStr1 = " AND PW.SUPPLIER_SUPPLIER_ID = '" + supplierId + "'";
			supplierSeleteStr2 = " AND PR.SUPPLIER_SUPPLIER_ID = '" + supplierId + "'";
		}
		
		String sql =" SELECT DATE(PW.BIZ_DATE) AS BIZ_DATE," +
				" '采购入库' AS NAME," +
				" PW.NUMBER," +
				" SP.NAME AS SUPPLIER_NAME," +
				" TSU.USER_NAME AS USER_NAME," +
				" WH.NAME AS WAREHOUSE_NAME," +
				" TM.NAME AS MATERIAL_NAME," +
				" UNT.NAME AS UNIT_NAME," +
				" ROUND(IFNULL(PWE.VOLUME,0),4) AS VOLUME," +
				" ROUND(IFNULL(PWE.PRICE,0),4) AS PRICE," +
				" ROUND(IFNULL(PWE.VOLUME * PWE.PRICE,0),4) AS ENTRY_SUM" +
				" FROM PURCHASE_WAREHOUSING PW" +
				" LEFT JOIN PURCHASE_WAREHOUSING_ENTRY PWE ON PW.ID = PWE.PARENT_ID" +
				" LEFT JOIN SUPPLIER SP ON PW.SUPPLIER_SUPPLIER_ID = SP.ID" +
				" LEFT JOIN T_SYSTEM_USER TSU ON PW.SUBMITTER_SYSTEM_USER_ID = TSU.ID" +
				" LEFT JOIN WAREHOUSE WH ON PWE.WAREHOUSE_WAREHOUSE_ID = WH.ID" +
				" LEFT JOIN T_MATERIAL TM ON PWE.MATERIAL_MATERIAL_ID = TM.ID" +
				" LEFT JOIN UNIT UNT ON PWE.UNIT_UNIT_ID = UNT.ID" +
				" WHERE PW.STATUS = 4" +
				" AND YEAR(BIZ_DATE) = " + year +
				" AND MONTH(BIZ_DATE) = " + month +
				supplierSeleteStr1 +
				" UNION" +
				" SELECT DATE(PR.BIZ_DATE) AS BIZ_DATE," +
				" '采购退货' AS NAME," +
				" PR.NUMBER," +
				" SP.NAME AS SUPPLIER_NAME," +
				" TSU.USER_NAME AS USER_NAME," +
				" WH.NAME AS WAREHOUSE_NAME," +
				" TM.NAME AS MATERIAL_NAME," +
				" UNT.NAME AS UNIT_NAME," +
				" ROUND(IFNULL(-PRE.VOLUME,0),4) AS VOLUME," +
				" ROUND(IFNULL(PRE.PRICE,0),4) AS PRICE," +
				" ROUND(IFNULL(-PRE.VOLUME * PRE.PRICE,0),4) AS ENTRY_SUM" +
				" FROM PURCHASE_RETURN PR" +
				" LEFT JOIN PURCHASE_RETURN_ENTRY PRE ON PR.ID = PRE.PARENT_ID" +
				" LEFT JOIN SUPPLIER SP ON PR.SUPPLIER_SUPPLIER_ID = SP.ID" +
				" LEFT JOIN T_SYSTEM_USER TSU ON PR.SUBMITTER_SYSTEM_USER_ID = TSU.ID" +
				" LEFT JOIN WAREHOUSE WH ON PRE.WAREHOUSE_WAREHOUSE_ID = WH.ID" +
				" LEFT JOIN T_MATERIAL TM ON PRE.MATERIAL_MATERIAL_ID = TM.ID" +
				" LEFT JOIN UNIT UNT ON PRE.UNIT_UNIT_ID = UNT.ID" +
				" WHERE PR.STATUS = 4" +
				" AND YEAR(BIZ_DATE) = " + year +
				" AND MONTH(BIZ_DATE) = " + month +
				supplierSeleteStr2 +
				" ORDER BY BIZ_DATE,SUPPLIER_NAME" ;
		return sql;
	}
	
	/**
	 * 发外采购供应对数图形
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryPurchaseMatchChart(HttpServletRequest request, HttpServletResponse response) throws Exception {
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
			tableName = " CUR_PURCHASE_PRICE ";
		} else {
			tableName = " HIS_PURCHASE_PRICE ";
		}
		
		String sql =" SELECT "+
						" CPP.SUPPLIER_ID, "+
						" SUP.NAME AS SUPPLIER_NAME, "+
						" SUM(ROUND(IFNULL(CPP.ENTRY_SUM,0),4)) AS ENTRY_SUM "+
					" FROM "+ tableName +" CPP "+
					" LEFT JOIN T_MATERIAL TM ON CPP.MATERIAL_ID = TM.ID "+
					" LEFT JOIN SUPPLIER SUP ON CPP.SUPPLIER_ID = SUP.ID "+
					" LEFT JOIN UNIT UNT ON TM.DEFAULT_UNIT_ID = UNT.ID "+
					" WHERE YEAR = " + year +
					" AND MONTH = " + month +
					" GROUP BY CPP.SUPPLIER_ID,SUP.NAME";
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
						" PI.BIZ_DATE, " +
						" PI.NUMBER, " +
						" PI.STATUS, " +
						" WH.NAME AS WAREHOUSENAME, " +
						" PIE.MATERIAL_MATERIAL_ID AS MATERIALID, " +
						" TM.NAME AS MATERIALNAME, " +
						" TM.MODEL AS MATERIALMODEL, " +
						" UIT.NAME AS UNITNAME, " +
						" SUM(ROUND(IFNULL(PIE.VOLUME,0),4)) AS VOLUME, " +
						" SUM(ROUND(IFNULL(PIE.PRICE,0),4)) AS PRICE, " +
						" SUM(ROUND(IFNULL(PIE.ENTRYSUM,0),4)) AS ENTRYSUM " +
					" FROM PRODUCT_INWAREHOUSE PI " +
					" LEFT JOIN PRODUCT_INWAREHOUSE_ENTRY PIE ON PI.ID = PIE.PARENT_ID " +
					" LEFT JOIN T_MATERIAL TM ON PIE.MATERIAL_MATERIAL_ID = TM.ID " +
					" LEFT JOIN T_MATERIAL_TYPE TMT ON TM.MATERIAL_TYPE_ID = TMT.ID " +
					" LEFT JOIN WAREHOUSE WH ON PIE.WAREHOUSE_WAREHOUSE_ID = WH.ID " +
					" LEFT JOIN UNIT UIT ON PIE.UNIT_UNIT_ID = UIT.ID " +
					" WHERE TMT.NUMBER = 'MTT100005' " +
					" AND PI.BIZ_DATE >= '" + startDate + "'" +
					" AND PI.BIZ_DATE <= '" + endDate + "'" ;
		if(warehouseId != null && !"".equals(warehouseId)){
			sql += " AND PIE.WAREHOUSE_WAREHOUSE_ID = '" + warehouseId + "'";
		}
		sql += " GROUP BY PI.NUMBER,WH.NAME,TM.NAME,TM.MODEL,UIT.NAME ";
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
		String materialId = null;
		
		if(request.getParameter("number") != null){
			number = request.getParameter("number");
		}
		
		if(request.getParameter("materialId") != null){
			materialId = request.getParameter("materialId");
		}
		String sql =" SELECT " +
						" PI.NUMBER, " +
						" PIE.WAREHOUSE_WAREHOUSE_ID AS WAREHOUSEID, " +
						" PIE.MATERIAL_MATERIAL_ID AS MATERIALID, " +
						" TM.NUMBER AS MATERIALNUMBER, " +
						" TM.NAME AS MATERIALNAME, " +
						" AVG(ROUND(IFNULL(PIED.QUANTITY,0),4)) AS PERVOLUME, " +
						" AVG(ROUND(IFNULL(PIED.PRICE,0),4)) AS PRICE, " +
						" ROUND(IFNULL(AVG(PIED.QUANTITY),0),4) AS VOLUME, " +
						" ROUND(IFNULL(AVG(PIED.PRICE*PIED.QUANTITY),0),4) AS ENTRYSUM " +
					" FROM PRODUCT_INWAREHOUSE PI " +
					" LEFT JOIN PRODUCT_INWAREHOUSE_ENTRY PIE ON PI.ID = PIE.PARENT_ID " +
					" LEFT JOIN PRODUCT_INWAREHOUSE_ENTRY_DETAIL PIED ON PIE.ID = PIED.PARENT_ID " +
					" LEFT JOIN T_MATERIAL TM ON PIED.MATERIAL_ID = TM.ID " +
					" LEFT JOIN UNIT UIT ON TM.DEFAULT_UNIT_ID = UIT.ID " +
					" WHERE PI.NUMBER = '" + number + "'" +
					" AND PIE.MATERIAL_MATERIAL_ID = '" + materialId + "'";
		sql += " GROUP BY PI.NUMBER,PIE.WAREHOUSE_WAREHOUSE_ID,PIE.MATERIAL_MATERIAL_ID,TM.NUMBER,TM.NAME ";
		
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
		String bomId = null;
		String materialVolume = "0";
		if(request.getParameter("bomId") != null){
			bomId = request.getParameter("bomId");
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
					" WHERE MB.ID = '" + bomId + "'";
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
		String keyWord = null;
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
		if(request.getParameter("keyWord") != null){
			keyWord = request.getParameter("keyWord");
		}
		
		String sql =" SELECT "+
						" CMB.WAREHOUSE_ID, "+
						" WH.NAME AS WAREHOUSE_NAME, "+
						" PM.ENTRY_MATERIAL_ID AS MATERIAL_ID, "+
						" TM.NAME AS MATERIAL_NAME, "+
						" TM.DEFAULT_UNIT_ID, "+
						" UN.NAME AS DEFAULT_UNIT_NAME, "+
						" SUM(ROUND(IFNULL(CMB.BEGINVOLUME,0)*IFNULL(PM.BOARD_COUNT,0),4)) AS BEGINVOLUME, "+
						" SUM(ROUND(IFNULL(CMB.BEGINSUM,0),4)) AS BEGINSUM, "+
						" SUM(ROUND(IFNULL(CMB.BEGINSUM,0)/(IFNULL(CMB.BEGINVOLUME,0)*IFNULL(PM.BOARD_COUNT,0)),4)) AS BEGINPRICE, "+
						" SUM(ROUND(IFNULL(CMB.VOLUME,0)*IFNULL(PM.BOARD_COUNT,0),4)) AS ENDVOLUME, "+
						" SUM(ROUND(IFNULL(CMB.TOTAL_SUM,0),4)) AS ENDSUM, "+
						" SUM(ROUND(IFNULL(CMB.TOTAL_SUM,0)/(IFNULL(CMB.VOLUME,0)*IFNULL(PM.BOARD_COUNT,0)),4)) AS ENDPRICE, "+
						" SUM(ROUND(IFNULL(CMB.IN_VOLUME,0)*IFNULL(PM.BOARD_COUNT,0),4)) AS INVOLUME, "+
						" SUM(ROUND(IFNULL(CMB.IN_SUM,0),4)) AS INSUM, "+
						" SUM(ROUND(IFNULL(CMB.IN_SUM,0)/(IFNULL(CMB.IN_VOLUME,0)*IFNULL(PM.BOARD_COUNT,0)),4)) AS INPRICE, "+
						" SUM(ROUND(IFNULL(CMB.OUT_VOLUME,0)*IFNULL(PM.BOARD_COUNT,0),4)) AS OUTVOLUME, "+
						" SUM(ROUND(IFNULL(CMB.OUT_SUM,0),4)) AS OUTSUM, "+
						" SUM(ROUND(IFNULL(CMB.OUT_SUM,0)/(IFNULL(CMB.OUT_VOLUME,0)*IFNULL(PM.BOARD_COUNT,0)),4)) AS OUTPRICE "+
					" FROM " + tableName + " CMB "+
					" LEFT JOIN WAREHOUSE WH ON CMB.WAREHOUSE_ID = WH.ID "+
					" LEFT JOIN PRODUCT_MAP PM ON CMB.MATERIAL_ID = PM.MATERIAL_ID "+
					" LEFT JOIN T_MATERIAL TM ON PM.ENTRY_MATERIAL_ID = TM.ID "+
					" LEFT JOIN T_MATERIAL TMB ON CMB.MATERIAL_ID = TMB.ID "+
					" LEFT JOIN T_MATERIAL_TYPE TMT ON TMB.MATERIAL_TYPE_ID = TMT.ID " +
					" LEFT JOIN UNIT UN ON TM.DEFAULT_UNIT_ID = UN.ID "+
					" WHERE TMT.NUMBER = 'MTT100005' " +
					" AND YEAR = " + year +
					" AND MONTH = " + month ;
		if(keyWord != null && !"".equals(keyWord)){
			sql += " AND (TM.NUMBER LIKE '%" + keyWord + "%' OR TM.NAME LIKE '%" + keyWord + "%')";
		}
		if(warehouseId != null && !"".equals(warehouseId)){
			sql += " AND CMB.WAREHOUSE_ID = '" + warehouseId + "'";
		}
		sql += " GROUP BY CMB.WAREHOUSE_ID,WH.NAME,PM.ENTRY_MATERIAL_ID,TM.NAME,TM.DEFAULT_UNIT_ID,UN.NAME ";
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
		String keyWord = null;
		
		if(request.getParameter("warehouseId") != null){
			warehouseId = request.getParameter("warehouseId");
		}
		if(request.getParameter("keyWord") != null){
			keyWord = request.getParameter("keyWord");
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
					" WHERE TMT.NUMBER = 'MTT100005' ";
		if(keyWord != null && !"".equals(keyWord)){
			sql += " AND (TM.NUMBER LIKE '%" + keyWord + "%' OR TM.NAME LIKE '%" + keyWord + "%')";
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
		sql += " WHERE TMT.NUMBER = 'MTT100005' " ;
		if(keyWord != null && !"".equals(keyWord)){
			sql += " AND (TM.NUMBER LIKE '%" + keyWord + "%' OR TM.NAME LIKE '%" + keyWord + "%')";
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
	 * 综合成品帐报表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryProductStaticsReport(HttpServletRequest request, HttpServletResponse response) throws Exception {
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(request,getProductStaticsReportSql(request)));
		return "sucess";
	}
	
	/**
	 * 获取综合成品帐数据列表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static List<Map<String ,Object>> getProductStaticsReportList(HttpServletRequest request) throws Exception {
		return getListWithSQL(request,getProductStaticsReportSql(request));
	}
	
	/**
	 * 获取综合成品帐报表SQL
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public static String getProductStaticsReportSql(HttpServletRequest request) throws Exception {
		String searchDate = null;
		String keyWord = null;

		if(request.getParameter("searchDate") != null){
			searchDate = request.getParameter("searchDate");
		}
		if(request.getParameter("keyWord") != null){
			keyWord = request.getParameter("keyWord");
		}
		
		String sql =" SELECT "+
					" 	PIODD.TRAD_DATE, "+
					" 	PIODD.MATERIAL_ID, "+
					" 	TM.NAME AS MATERIAL_NAME, "+
					" 	PIODD.QANTITY, "+
					" 	ROUND(IFNULL(PIODD.PRE_MONTH_VOLUME,0),4) AS PRE_MONTH_VOLUME, "+
					" 	ROUND(IFNULL(PIODD.PRE_MONTH_VOLUME*PIODD.QANTITY,0),4) AS PRE_MONTH_PRODUCT_VOLUME, "+
					" 	ROUND(IFNULL(PIODD.TODAY_IN_VOLUME,0),4) AS TODAY_IN_VOLUME, "+
					" 	ROUND(IFNULL(PIODD.TODAY_OUT_VOLUME,0),4) AS TODAY_OUT_VOLUME, "+
					" 	ROUND(IFNULL(PIODD.TODAY_VOLUME,0),4) AS TODAY_VOLUME, "+
					" 	ROUND(IFNULL(PIODD.TODAY_VOLUME*PIODD.QANTITY,0),4) AS TODAY_PRODUCT_VOLUME, "+
					" 	ROUND(IFNULL(PIODD.THIS_MONTH_IN_VOLUME,0),4) AS THIS_MONTH_IN_VOLUME, "+
					" 	ROUND(IFNULL(PIODD.THIS_MONTH_IN_VOLUME*PIODD.QANTITY,0),4) AS THIS_MONTH_IN_PRODUCT_VOLUME, "+
					" 	ROUND(IFNULL(PIODD.THIS_MONTH_OUT_VOLUME,0),4) AS THIS_MONTH_OUT_VOLUME, "+
					" 	ROUND(IFNULL(PIODD.THIS_MONTH_OUT_VOLUME*PIODD.QANTITY,0),4) AS THIS_MONTH_OUT_PRODUCT_VOLUME "+
					" FROM PRO_IN_OUT_DATE_DETAIL PIODD "+
					" LEFT JOIN T_MATERIAL TM ON PIODD.MATERIAL_ID = TM.ID "+
					" WHERE ";
		if(keyWord == null ){
			keyWord = "";
		}
		sql += " (TM.NUMBER LIKE '%" + keyWord + "%' OR TM.NAME LIKE '%" + keyWord + "%')";
		if(searchDate != null && !"".equals(searchDate)){
			String dateStr = searchDate.substring(0, 4) + searchDate.substring(5, 7) + searchDate.substring(8, 10);
			sql += " AND PIODD.TRAD_DATE = '" + dateStr + "'";
		}
		return sql;
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
		String keyWord = null;
		if(request.getParameter("startDate") != null && request.getParameter("endDate") != null){
			startDate = request.getParameter("startDate");
			endDate = request.getParameter("endDate");
		}else{
			throw new Exception("找不到日期参数！");
		}
		
		if(request.getParameter("warehouseId") != null){
			warehouseId = request.getParameter("warehouseId");
		}
		if(request.getParameter("keyWord") != null){
			keyWord = request.getParameter("keyWord");
		}
		
		String sql =" SELECT " +
						" WW.BIZ_DATE, " +
						" WW.NUMBER, " +
						" WW.STATUS, " +
						" WH.NAME AS WAREHOUSENAME, " +
						" WWE.BOM_ID AS BOM_ID, " +
						" TM.NAME AS MATERIALNAME, " +
						" WWE.MATERIAL_MATERIAL_MODEL AS MATERIALMODEL, " +
						" UIT.NAME AS UNITNAME, " +
						" SUM(ROUND(IFNULL(WWE.VOLUME,0),4)) AS VOLUME, " +
						" SUM(ROUND(IFNULL(WWE.PRICE,0),4)) AS PRICE, " +
						" SUM(ROUND(IFNULL(WWE.ENTRYSUM,0),4)) AS ENTRYSUM " +
					" FROM WORKSHOP_WAREHOUSING WW " +
					" LEFT JOIN WORKSHOP_WAREHOUSING_ENTRY WWE ON WW.ID = WWE.PARENT_ID " +
					" LEFT JOIN MATERIAL_BOM MB ON WWE.BOM_ID = MB.ID " +
					" LEFT JOIN T_MATERIAL TM ON MB.MATERIAL_ID = TM.ID " +
					" LEFT JOIN T_MATERIAL_TYPE TMT ON TM.MATERIAL_TYPE_ID = TMT.ID " +
					" LEFT JOIN WAREHOUSE WH ON WWE.WAREHOUSE_WAREHOUSE_ID = WH.ID " +
					" LEFT JOIN UNIT UIT ON WWE.UNIT_UNIT_ID = UIT.ID " +
					" WHERE TMT.NUMBER = 'MTT100002' " +
					" AND WW.BIZ_DATE >= '" + startDate + "'" +
					" AND WW.BIZ_DATE <= '" + endDate + "'" ;
		if(warehouseId != null && !"".equals(warehouseId)){
			sql += " AND WWE.WAREHOUSE_WAREHOUSE_ID = '" + warehouseId + "'";
		}
		if(keyWord != null && !"".equals(keyWord)){
			sql += " AND (TM.NUMBER LIKE '%" + keyWord + "%' OR TM.NAME LIKE '%" + keyWord + "%')";
		}
		sql += " GROUP BY WW.NUMBER,WH.NAME,WWE.BOM_ID,TM.NAME,WWE.MATERIAL_MATERIAL_MODEL,UIT.NAME ";
		sql += " union ";
		sql += " SELECT ";
		sql += " 	CW.BIZ_DATE, ";
		sql += " 	CW.NUMBER, ";
		sql += " 	CW.STATUS, ";
		sql += " 	WH.NAME AS WAREHOUSENAME, ";
		sql += " 	CWE.BOM_ID AS BOM_ID, ";
		sql += " 	TM.NAME AS MATERIALNAME, ";
		sql += " 	CWE.MATERIAL_MATERIAL_MODEL AS MATERIALMODEL, ";
		sql += " 	UIT.NAME AS UNITNAME, ";
		sql += " 	SUM(ROUND(IFNULL(CWE.VOLUME,0),4)) AS VOLUME, ";
		sql += " 	SUM(ROUND(IFNULL(CWE.PRICE,0),4)) AS PRICE, ";
		sql += " 	SUM(ROUND(IFNULL(CWE.ENTRYSUM,0),4)) AS ENTRYSUM ";
		sql += " FROM CONSIGN_WAREHOUSING CW ";
		sql += " LEFT JOIN CONSIGN_WAREHOUSING_ENTRY CWE ON CW.ID = CWE.PARENT_ID ";
		sql += " LEFT JOIN MATERIAL_BOM MB ON CWE.BOM_ID = MB.ID ";
		sql += " LEFT JOIN T_MATERIAL TM ON MB.MATERIAL_ID = TM.ID ";
		sql += " LEFT JOIN T_MATERIAL_TYPE TMT ON TM.MATERIAL_TYPE_ID = TMT.ID ";
		sql += " LEFT JOIN WAREHOUSE WH ON CWE.WAREHOUSE_WAREHOUSE_ID = WH.ID ";
		sql += " LEFT JOIN UNIT UIT ON CWE.UNIT_UNIT_ID = UIT.ID ";
		sql += " WHERE TMT.NUMBER = 'MTT100002' ";
		sql += " AND CW.BIZ_DATE >= '" + startDate + "'";
		sql += " AND CW.BIZ_DATE <= '" + endDate + "'" ;
		if(warehouseId != null && !"".equals(warehouseId)){
			sql += " AND CWE.WAREHOUSE_WAREHOUSE_ID = '" + warehouseId + "'";
		}
		if(keyWord != null && !"".equals(keyWord)){
			sql += " AND (TM.NUMBER LIKE '%" + keyWord + "%' OR TM.NAME LIKE '%" + keyWord + "%')";
		}
		sql += " GROUP BY CW.NUMBER,WH.NAME,CWE.BOM_ID,TM.NAME,CWE.MATERIAL_MATERIAL_MODEL,UIT.NAME ";
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
		String bomId = null;
		
		if(request.getParameter("number") != null){
			number = request.getParameter("number");
		}
		if(request.getParameter("bomId") != null){
			bomId = request.getParameter("bomId");
		}
		String sql =" SELECT " +
						" WW.NUMBER, " +
						" WWE.WAREHOUSE_WAREHOUSE_ID AS WAREHOUSEID, " +
						" MB.MATERIAL_ID AS MATERIALID, " +
						" TM.NUMBER AS MATERIALNUMBER, " +
						" TM.NAME AS MATERIALNAME, " +
						" AVG(ROUND(IFNULL(WPD.VOLUME,0),4)) AS PERVOLUME, " +
						" AVG(ROUND(IFNULL(WPD.PRICE,0),4)) AS PRICE, " +
						" ROUND(IFNULL(AVG(WPD.VOLUME),0),4) AS VOLUME, " +
						" ROUND(IFNULL(AVG(WPD.PRICE*WPD.VOLUME),0),4) AS ENTRYSUM " +
					" FROM WORKSHOP_WAREHOUSING WW " +
					" LEFT JOIN WORKSHOP_WAREHOUSING_ENTRY WWE ON WW.ID = WWE.PARENT_ID " +
					" LEFT JOIN MATERIAL_BOM MB ON WWE.BOM_ID = MB.ID " +
					" LEFT JOIN WORKSHOP_PRICE_DETAIL WPD ON WWE.ID = WPD.PARENT_ID " +
					" LEFT JOIN T_MATERIAL TM ON WPD.MATERIAL_ID = TM.ID " +
					" LEFT JOIN UNIT UIT ON TM.DEFAULT_UNIT_ID = UIT.ID " +
					" WHERE WW.NUMBER = '" + number + "'" +
					" AND WWE.BOM_ID = '" + bomId + "'";
		sql += " GROUP BY WW.NUMBER,WWE.WAREHOUSE_WAREHOUSE_ID,MB.MATERIAL_ID,TM.NUMBER,TM.NAME,WWE.VOLUME ";
		sql += " UNION ";
		sql += " SELECT ";
		sql += " 	CW.NUMBER, ";
		sql += " 	CWE.WAREHOUSE_WAREHOUSE_ID AS WAREHOUSEID, ";
		sql += " 	MB.MATERIAL_ID AS MATERIALID, ";
		sql += " 	TM.NUMBER AS MATERIALNUMBER, ";
		sql += " 	TM.NAME AS MATERIALNAME, ";
		sql += " 	AVG(ROUND(IFNULL(CPD.VOLUME,0),4)) AS PERVOLUME, ";
		sql += " 	AVG(ROUND(IFNULL(CPD.PRICE,0),4)) AS PRICE, ";
		sql += " 	ROUND(IFNULL(AVG(CPD.VOLUME),0),4) AS VOLUME, ";
		sql += " 	ROUND(IFNULL(AVG(CPD.PRICE*CPD.VOLUME),0),4) AS ENTRYSUM ";
		sql += " FROM CONSIGN_WAREHOUSING CW ";
		sql += " LEFT JOIN CONSIGN_WAREHOUSING_ENTRY CWE ON CW.ID = CWE.PARENT_ID ";
		sql += " LEFT JOIN MATERIAL_BOM MB ON CWE.BOM_ID = MB.ID ";
		sql += " LEFT JOIN CONSIGN_PRICE_DETAIL CPD ON CWE.ID = CPD.PARENT_ID ";
		sql += " LEFT JOIN T_MATERIAL TM ON CPD.MATERIAL_ID = TM.ID ";
		sql += " LEFT JOIN UNIT UIT ON TM.DEFAULT_UNIT_ID = UIT.ID ";
		sql += " WHERE CW.NUMBER = '" + number + "'" ;
		sql += " AND CWE.BOM_ID = '" + bomId + "'" ;
		sql += " GROUP BY CW.NUMBER,CWE.WAREHOUSE_WAREHOUSE_ID,MB.MATERIAL_ID,TM.NUMBER,TM.NAME,CWE.VOLUME ";
		
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
				} else {
					sql += " , ";
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
		String materialString = "";
		if(request.getParameter("materialId") != null && request.getParameter("materialId")!=""){
			materialString = " WHERE CMB.MATERIAL_ID = '" + request.getParameter("materialId") + "'";
		}
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
					materialString +
					" GROUP BY TM.ID,TM.NUMBER,TM.NAME " + 
					" ORDER BY TM.NUMBER LIMIT 8";
		
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
