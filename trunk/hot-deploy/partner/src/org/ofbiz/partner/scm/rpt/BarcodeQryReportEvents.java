package org.ofbiz.partner.scm.rpt;

import java.text.SimpleDateFormat;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.partner.scm.common.CommonEvents;


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
		sql.append("p.biz_Date PRODUCT_IN_DATE, \r\n");
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
		sql.append(" SELECT \r\n");
		sql.append(" 	NOTI.DELIVER_NUMBER DELIVERY_NUMBER,  \r\n");
		sql.append(" 	PROMAP.IKEA_ID IKEA_NUMBER,  \r\n");
		sql.append(" 	MATERIAL.NAME MATERIAL_NAME,  \r\n");
		sql.append(" 	ENTRY_TEMP.PRD_WEEK PRODUCT_WEEK,  \r\n");
		sql.append(" 	ENTRY_TEMP.BIZ_DATE PRODUCT_OUT_DATE, \r\n");
		sql.append(" 	PROMAP.BOARD_COUNT PER_BOARD_QTY,  \r\n");
		sql.append(" 	ENTRY_TEMP.BARCODE1 BARCODE1,  \r\n");
		sql.append(" 	ENTRY_TEMP.BARCODE2 BARCODE2  \r\n");
		sql.append(" FROM ( \r\n");
		sql.append(" 		SELECT  \r\n");
		sql.append(" 			ENTRY.PRD_WEEK PRODUCT_WEEK,  \r\n");
		sql.append(" 			HEAD.BIZ_DATE BIZ_DATE, \r\n");
		sql.append(" 			ENTRY.BARCODE1 BARCODE1,  \r\n");
		sql.append(" 			ENTRY.BARCODE2 BARCODE2, \r\n");
		sql.append(" 			ENTRY.GOOD_NUMBER, \r\n");
		sql.append(" 			ENTRY.PRD_WEEK, \r\n");
		sql.append(" 			ENTRY.MATERIAL_MATERIAL_ID \r\n");
		sql.append(" 		FROM ( \r\n");
		sql.append(" 				SELECT  \r\n");
		sql.append(" 					ID, \r\n");
		sql.append(" 					BIZ_DATE \r\n");
		sql.append(" 				FROM PRODUCT_OUTWAREHOUSE \r\n");
		sql.append(" 				WHERE STATUS IN (0,4) \r\n");
		sql.append(" 				AND BIZ_DATE BETWEEN '"+startDate+"' AND '"+endDate+"' \r\n");
		sql.append(" 			) HEAD  \r\n");
		sql.append(" 		INNER JOIN PRODUCT_OUTWAREHOUSE_ENTRY ENTRY ON HEAD.ID = ENTRY.PARENT_ID \r\n");
		sql.append(" 		) ENTRY_TEMP \r\n");
		sql.append(" INNER JOIN PRODUCT_OUT_NOTIFICATION NOTI ON ENTRY_TEMP.GOOD_NUMBER=NOTI.GOOD_NUMBER \r\n");
		sql.append(" INNER JOIN T_MATERIAL MATERIAL ON ENTRY_TEMP.MATERIAL_MATERIAL_ID=MATERIAL.ID  \r\n");
		sql.append(" INNER JOIN PRODUCT_MAP PROMAP ON ENTRY_TEMP.MATERIAL_MATERIAL_ID=PROMAP.MATERIAL_ID \r\n");
		if(request.getParameter("deliveryNumber")!=null&&request.getParameter("deliveryNumber").trim().length()>0){
			sql.append("AND NOTI.DELIVER_NUMBER like '%"+request.getParameter("deliveryNumber")+"%' \r\n");
		}
		if(request.getParameter("ikeaNumber")!=null&&request.getParameter("ikeaNumber").trim().length()>0){
			sql.append("AND PROMAP.IKEA_ID like '%"+request.getParameter("ikeaNumber")+"%' \r\n");
		}
		return sql.toString();
	}
	
	
}
