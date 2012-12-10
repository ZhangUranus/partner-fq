package org.ofbiz.partner.scm.rpt;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
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


public class BarcodeQryReportEvents {
	static final SimpleDateFormat timeFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	static final SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd");
	/*
	 * 在库条码查询
	 * */
	public static String queryInBarcode(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		CommonEvents.writeJsonDataToExt(response, DataFetchEvents.executeSelectSQL(request,getQueryInBarcodeSQl(request)));
		
		return "sucess";
	}
	
	public static String getQueryInBarcodeSQl(HttpServletRequest request) throws Exception {
//		String weekStr;//查询周
//		StringBuffer filterMaterial=new StringBuffer();//物料过滤?
		
//		if(request.getParameter("week")==null)throw new Exception("周不能为空！");
//		weekStr=request.getParameter("week");
		
//		if(request.getParameter("searchMaterialId")!=null&&request.getParameter("searchMaterialId").trim().length()>0){
//			filterMaterial.append(" and  material.id='").append(request.getParameter("searchMaterialId")).append("'");
//		}
		
//		if(request.getParameter("keyWord")!=null&&request.getParameter("keyWord").trim().length()>0){
//			filterMaterial.append(" and  (material.name like '%").append(request.getParameter("keyWord")).append("%' or material.number like '%").append(request.getParameter("keyWord")).append("%')");
//		}
		StringBuffer  sql=new StringBuffer();
		sql.append("SELECT \r\n");
		sql.append("p.ikea_number IKEA_NUMBER, \r\n");
		sql.append("material.name MATERIAL_NAME, \r\n");
		sql.append("p.week PRODUCT_WEEK, \r\n");
		sql.append("date_format(p.biz_Date,'%Y-%m-%d') PRODUCT_IN_DATE, \r\n");
		sql.append("p.PER_BOARD_QTY PER_BOARD_QTY, \r\n");
		sql.append("p.BARCODE1 BARCODE1, \r\n");
		sql.append("p.BARCODE2 BARCODE2, \r\n");
		sql.append("wh.name WAREHOUSE \r\n");
		sql.append("FROM product_barcode_box p \r\n");
		sql.append("inner join warehouse wh on wh.id=p.warehouse_id \r\n");
		sql.append("inner join t_material material on material.id=p.material_id \r\n");
		sql.append("where 1=1 \r\n");
		if(request.getParameter("week")!=null&&request.getParameter("week").trim().length()>0){
			sql.append("and p.week='").append(request.getParameter("week")).append("' \r\n");
		}
		if(request.getParameter("ikeaNumber")!=null&&request.getParameter("ikeaNumber").trim().length()>0){
			sql.append("and p.ikea_number like '%").append(request.getParameter("ikeaNumber")).append("%' \r\n");
		}
		if(request.getParameter("materialName")!=null&&request.getParameter("materialName").trim().length()>0){
			sql.append("and material.name like '%").append(request.getParameter("materialName")).append("%' \r\n");
		}
		if(request.getParameter("barcode")!=null&&request.getParameter("barcode").trim().length()>0){
			sql.append("and p.barcode1 like '%").append(request.getParameter("barcode")).append("%' \r\n");
		}
		return sql.toString();
	}
	
	/**
	 * 出库条码查询
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryOutBarcode(HttpServletRequest request, HttpServletResponse response) throws Exception {
		

		CommonEvents.writeJsonDataToExt(response, DataFetchEvents.executeSelectSQL(request,getQueryOutBarcodeSql(request)));
		
		return "sucess";
	}
	public static String getQueryOutBarcodeSql(HttpServletRequest request) throws Exception {
		String startDate,endDate;
		if(request.getParameter("startDate") != null && request.getParameter("endDate") != null){
			startDate = request.getParameter("startDate");
			endDate = request.getParameter("endDate");
		}else{
			throw new Exception("日期不能为空！");
		}
		
		
		StringBuffer  sql=new StringBuffer();
		sql.append("SELECT \r\n");
		sql.append("noti.DELIVER_NUMBER DELIVERY_NUMBER, \r\n");
		sql.append("proMap.ikea_id IKEA_NUMBER, \r\n");
		sql.append("material.name MATERIAL_NAME, \r\n");
		sql.append("entry.PRD_WEEK PRODUCT_WEEK, \r\n");
		sql.append("date_format(head.biz_date,'%Y-%m-%d') PRODUCT_OUT_DATE, \r\n");
		sql.append("proMap.board_count PER_BOARD_QTY, \r\n");
		sql.append("entry.BARCODE1 BARCODE1, \r\n");
		sql.append("entry.BARCODE2 BARCODE2 \r\n");
		sql.append("FROM product_outwarehouse_entry entry \r\n");
		sql.append("inner join product_outwarehouse head on entry.parent_id=head.id \r\n");
		sql.append("inner join product_out_notification noti on noti.good_number=entry.good_number \r\n");
		sql.append("inner join t_material material on entry.material_material_id=material.id \r\n");
		sql.append("inner join product_map proMap on proMap.material_id=entry.material_material_id \r\n");
		sql.append("where head.status=4 and entry.is_return<>'Y' and head.biz_date>='"+startDate+"' and head.biz_date<='"+endDate+"' \r\n");
		if(request.getParameter("deliveryNumber")!=null&&request.getParameter("deliveryNumber").trim().length()>0){
			sql.append("and noti.DELIVER_NUMBER like '%"+request.getParameter("deliveryNumber")+"%' \r\n");
		}
		if(request.getParameter("ikeaNumber")!=null&&request.getParameter("ikeaNumber").trim().length()>0){
			sql.append("and proMap.ikea_id like '%"+request.getParameter("ikeaNumber")+"%' \r\n");
		}
		return sql.toString();
	}
}
