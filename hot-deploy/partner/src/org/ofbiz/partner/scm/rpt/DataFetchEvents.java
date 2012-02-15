package org.ofbiz.partner.scm.rpt;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.jdbc.ConnectionFactory;
import org.ofbiz.entity.util.EntityFindOptions;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.common.Utils;

public class DataFetchEvents {
	
	public static String fetchData(HttpServletRequest request, HttpServletResponse response) throws Exception {
		// 数据库连接
		Connection conn = ConnectionFactory.getConnection("localmysql");
		try {
			String sql = "select a.number,a.biz_date ,b.name from Purchase_Warehousing a inner join supplier b on a.supplier_supplier_id=b.id";
			PreparedStatement ps = conn.prepareStatement(sql);
			ResultSet rs = ps.executeQuery();

			JSONArray ja = Utils.getJsonArr4ResultSet(rs);

			JSONObject result = new JSONObject();
			result.element("success", true);
			result.element("records", ja);
			CommonEvents.writeJsonDataToExt(response, result.toString());
		} finally {
			if (conn != null) {
				conn.close();
			}
		}

		return "sucess";
	}
	
	/**
	 * 库存情况报表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryStockDetailReport(HttpServletRequest request, HttpServletResponse response) throws Exception {
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
		
		String sql ="SELECT "+
						"CMB.WAREHOUSE_ID, "+
						"WH.NAME AS WAREHOUSE_NAME, "+
						"CMB.MATERIAL_ID, "+
						"TM.NAME AS MATERIAL_NAME, "+
						"TM.DEFAULT_UNIT_ID, "+
						"UN.NAME AS DEFAULT_UNIT_NAME, "+
						"ROUND(IFNULL(CMB.BEGINVOLUME,0),4) AS BEGINVOLUME, "+
						"ROUND(IFNULL(CMB.BEGINSUM,0),4) AS BEGINSUM, "+
						"ROUND(IFNULL(CMB.BEGINSUM/CMB.BEGINVOLUME,0),4) AS BEGINPRICE, "+
						"ROUND(IFNULL(CMB.VOLUME,0),4) AS ENDVOLUME, "+
						"ROUND(IFNULL(CMB.TOTAL_SUM,0),4) AS ENDSUM, "+
						"ROUND(IFNULL(CMB.TOTAL_SUM/CMB.VOLUME,0),4) AS ENDPRICE, "+
						"ROUND(IFNULL(CMB.IN_VOLUME,0),4) AS INVOLUME, "+
						"ROUND(IFNULL(CMB.IN_SUM,0),4) AS INSUM, "+
						"ROUND(IFNULL(CMB.IN_SUM/CMB.IN_VOLUME,0),4) AS INPRICE, "+
						"ROUND(IFNULL(CMB.OUT_VOLUME,0),4) AS OUTVOLUME, "+
						"ROUND(IFNULL(CMB.OUT_SUM,0),4) AS OUTSUM, "+
						"ROUND(IFNULL(CMB.OUT_SUM/CMB.OUT_VOLUME,0),4) AS OUTPRICE "+
					"FROM " + tableName + " CMB "+
					"LEFT JOIN WAREHOUSE WH ON CMB.WAREHOUSE_ID = WH.ID "+
					"LEFT JOIN T_MATERIAL TM ON CMB.MATERIAL_ID = TM.ID "+
					"LEFT JOIN UNIT UN ON TM.DEFAULT_UNIT_ID = UN.ID "+
					"WHERE YEAR = " + year +
					" AND MONTH = " + month ;
		if(materialId != null && !"".equals(materialId)){
			sql += " AND CMB.MATERIAL_ID = '" + materialId + "'";
		}
		if(warehouseId != null && !"".equals(warehouseId)){
			sql += " AND CMB.WAREHOUSE_ID = '" + warehouseId + "'";
		}
		
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(sql));
		return "sucess";
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
		
		String sql ="SELECT " +
						"CMB.MATERIAL_ID, " +
						"TM.NAME AS MATERIAL_NAME, " +
						"ROUND(SUM(IFNULL(CMB.TOTAL_SUM,0)),4) AS ENDSUM " +
					"FROM " + tableName + " CMB " +
					"LEFT JOIN T_MATERIAL TM ON CMB.MATERIAL_ID = TM.ID " +
					"WHERE YEAR = " + year +
					" AND MONTH = " + month ;
		if(warehouseId != null && !"".equals(warehouseId)){
			sql += " AND CMB.WAREHOUSE_ID = '" + warehouseId + "'";
		}
		sql += " GROUP BY CMB.MATERIAL_ID,TM.NAME ";
		
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(sql));
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
		String sql ="SELECT "+
						"CCPP.SUPPLIER_ID, "+
						"SUP.NAME AS SUPPLIER_NAME, "+
						"CCPP.MATERIAL_ID, "+
						"TM.NAME AS MATERIAL_NAME, "+
						"TM.DEFAULT_UNIT_ID, "+
						"UNT.NAME AS DEFAULT_UNIT_NAME, "+
						"ROUND(IFNULL(CCPP.IN_SUM/CCPP.IN_VOLUME,0),4) AS PRICE, "+
						"ROUND(IFNULL(CCPP.BEGINVOLUME,0),4) AS BEGINVOLUME, "+
						"ROUND(IFNULL(CCPP.IN_VOLUME,0),4) AS IN_VOLUME, "+
						"ROUND(IFNULL(CCPP.IN_SUM,0),4) AS IN_SUM, "+
						"ROUND(IFNULL(CCPP.OUT_VOLUME,0),4) AS OUT_VOLUME, "+
						"ROUND(IFNULL(CCPP.OUT_VOLUME*(CCPP.IN_SUM/CCPP.IN_VOLUME),0),4) AS OUT_SUM, "+
						"ROUND(IFNULL(CCPP.VOLUME,0),4) AS VOLUME "+
					"FROM "+ tableName +" CCPP "+
					"LEFT JOIN T_MATERIAL TM ON CCPP.MATERIAL_ID = TM.ID "+
					"LEFT JOIN SUPPLIER SUP ON CCPP.SUPPLIER_ID = SUP.ID "+
					"LEFT JOIN UNIT UNT ON TM.DEFAULT_UNIT_ID = UNT.ID "+
					"WHERE YEAR = " + year +
					" AND MONTH = " + month ;
		if(supplierId != null && !"".equals(supplierId)){
			sql += " AND CCPP.SUPPLIER_ID = '" + supplierId + "'";
		}
		
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(sql));
		return "sucess";
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
		
		String sql ="SELECT "+
						"CCPP.SUPPLIER_ID, "+
						"SUP.NAME AS SUPPLIER_NAME, "+
						"SUM(ROUND(IFNULL(CCPP.IN_SUM,0),4)) AS TOTAL_IN_SUM, "+
						"SUM(ROUND(IFNULL(CCPP.OUT_VOLUME*(CCPP.IN_SUM/CCPP.IN_VOLUME),0),4)) AS TOTAL_OUT_SUM "+
					"FROM "+ tableName +" CCPP "+
					"LEFT JOIN T_MATERIAL TM ON CCPP.MATERIAL_ID = TM.ID "+
					"LEFT JOIN SUPPLIER SUP ON CCPP.SUPPLIER_ID = SUP.ID "+
					"LEFT JOIN UNIT UNT ON TM.DEFAULT_UNIT_ID = UNT.ID "+
					"WHERE YEAR = " + year +
					" AND MONTH = " + month +
					" GROUP BY CCPP.SUPPLIER_ID,SUP.NAME";
		CommonEvents.writeJsonDataToExt(response, executeSelectSQL(sql));
		return "sucess";
	}
	
	public static String executeSelectSQL(String sql) throws Exception {
		// 数据库连接
		Connection conn = ConnectionFactory.getConnection("localmysql");
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			JSONArray ja = Utils.getJsonArr4ResultSet(ps.executeQuery());

			JSONObject result = new JSONObject();
			result.element("success", true);
			result.element("records", ja);
			result.element("total", ja.size());
			
			return result.toString();
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
			jsonStr.append("{'id' : '" + v.getString("year") + v.getString("month") + "',");
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
