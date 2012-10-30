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
	static final SimpleDateFormat timeFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
	static final SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd");
	/*
	 * 查询周出入库汇总情况
	select week ,MATERIAL_ID,MATERIAL_NAME ,
	sum(LAST_WEEK_BAL_QTY) as LAST_WEEK_BAL_QTY,
	sum(THIS_WEEK_OUT_QTY) as THIS_WEEK_OUT_QTY,
	sum(THIS_WEEK_OUT_QTY) as THIS_WEEK_OUT_QTY,
	sum(THIS_WEEK_IN_QTY)  as THIS_WEEK_IN_QTY,
	sum(THIS_WEEK_CHG_QTY) as THIS_WEEK_CHG_QTY,
	sum(THIS_WEEK_BAL_QTY) as THIS_WEEK_BAL_QTY,
	sum(THIS_WEEK_OWE_QTY) as THIS_WEEK_OWE_QTY,
	sum(STOCKING) as STOCKING,
	sum(STOCKINGBAL) as STOCKINGBAL from (
	
	//查询上周库存余额
    SELECT
		'2012-30W' as week,
		weekinout.material_id as MATERIAL_ID,
		material.name as MATERIAL_NAME,
		sum(weekinout.week_Bal_Qty) as LAST_WEEK_BAL_QTY,
		0 as THIS_WEEK_OUT_QTY,
		0 as THIS_WEEK_IN_QTY,
		0 as THIS_WEEK_CHG_QTY,
		0 as THIS_WEEK_BAL_QTY,
		0 as THIS_WEEK_OWE_QTY,
		0 as STOCKING,
		0 as STOCKINGBAL
		FROM prd_in_out_week_detail weekinout
		inner join t_material material on weekinout.material_id=material.id
		where weekinout.week<'2012-30W'
		group by weekinout.material_id,material.name,weekinout.week
		union all
		//查询本周进出改
		SELECT
		'2012-30W' as week,
		weekinout.material_id as MATERIAL_ID,
		material.name as MATERIAL_NAME,
		0 as LAST_WEEK_BAL_QTY,
		sum(ifnull(weekinout.sun_nor_out_qty,0))+sum(ifnull(weekinout.mon_nor_out_qty,0))+sum(ifnull(weekinout.tue_nor_out_qty,0))
		+sum(ifnull(weekinout.wen_nor_out_qty,0))+sum(ifnull(weekinout.thu_nor_out_qty,0))+sum(ifnull(weekinout.fri_nor_out_qty,0))
		+sum(ifnull(weekinout.sta_nor_out_qty,0)) as THIS_WEEK_OUT_QTY,
		
		sum(ifnull(weekinout.sun_nor_in_qty,0))+sum(ifnull(weekinout.mon_nor_in_qty,0))+sum(ifnull(weekinout.tue_nor_in_qty,0))
		+sum(ifnull(weekinout.wen_nor_in_qty,0))+sum(ifnull(weekinout.thu_nor_in_qty,0))+sum(ifnull(weekinout.fri_nor_in_qty,0))
		+sum(ifnull(weekinout.sta_nor_in_qty,0))  as THIS_WEEK_IN_QTY,
		
		sum(ifnull(weekinout.sun_chg_brd_qty,0))+sum(ifnull(weekinout.mon_chg_brd_qty,0))+sum(ifnull(weekinout.tue_chg_brd_qty,0))
		+sum(ifnull(weekinout.wen_chg_brd_qty,0))+sum(ifnull(weekinout.thu_chg_brd_qty,0))+sum(ifnull(weekinout.fri_chg_brd_qty,0))
		+sum(ifnull(weekinout.sta_chg_brd_qty,0))  as THIS_WEEK_CHG_QTY,
		
		0 as THIS_WEEK_BAL_QTY,
		
		0 as THIS_WEEK_OWE_QTY,
		0 as STOCKING,
		0 as STOCKINGBAL
		FROM prd_in_out_week_detail weekinout
		inner join t_material material on weekinout.material_id=material.id
		where weekinout.week='2012-30W'
		group by weekinout.material_id,material.name,weekinout.week
		
    union all
    //查询本周欠货
		 SELECT
		'2012-30W' as week,
		notificationEntryDetail.material_id as MATERIAL_ID,
		material.name as MATERIAL_NAME,
		0 as LAST_WEEK_BAL_QTY,
		0 as THIS_WEEK_OUT_QTY,
		0 as THIS_WEEK_IN_QTY,
		0 as THIS_WEEK_CHG_QTY,
		0 as THIS_WEEK_BAL_QTY,
		sum(ifnull(notificationEntryDetail.order_Qty,0))-sum(ifnull(notificationEntryDetail.sent_Qty,0)) as THIS_WEEK_OWE_QTY,
		sum(ifnull(material.safe_Stock,0) )as STOCKING,
		sum(ifnull(notificationEntryDetail.order_Qty,0))-sum(ifnull(notificationEntryDetail.sent_Qty,0))-sum(ifnull(material.safe_Stock,0) ) as STOCKINGBAL
		FROM Product_Out_Notification notification
		left outer join Product_Out_Notification_Entry notificationEntry on notificationEntry.parent_Id=notification.id
    	left outer join Product_Out_Notification_Entry_Detail notificationEntryDetail on notificationEntryDetail.parent_id=notificationEntry.id
	  	inner join t_material material on notificationEntryDetail.material_id=material.id
	  	where notification.plan_Delivery_Date>=DATE('2012-7-22 00:00:00.000') and notification.plan_Delivery_Date<=DATE('2012-7-28 23:59:59.999') and notification.status=4
	  	group by notificationEntry.material_id , material.name

) t group by week ,MATERIAL_ID,MATERIAL_NAME
		
	 * */
	public static String queryMainData(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String weekStr;//查询周
		DatePeriod weekDatePeriod;//周日期范围
		StringBuffer filterMaterial=new StringBuffer();//物料过滤
		
		if(request.getParameter("week")==null)throw new Exception("周不能为空！");
		weekStr=request.getParameter("week");
		weekDatePeriod=Utils.getDatePeriodFromWeekStr(weekStr);
		
//		if(request.getParameter("searchMaterialId")!=null&&request.getParameter("searchMaterialId").trim().length()>0){
//			filterMaterial.append(" and  material.id='").append(request.getParameter("searchMaterialId")).append("'");
//		}
		
		if(request.getParameter("keyWord")!=null&&request.getParameter("keyWord").trim().length()>0){
			filterMaterial.append(" and  (material.name like '%").append(request.getParameter("keyWord")).append("%' or material.number like '%").append(request.getParameter("keyWord")).append("%')");
		}
		
		
		String sql=
			"select WEEK ,MATERIAL_ID,MATERIAL_NAME ,"+
			"sum(LAST_WEEK_BAL_QTY) as LAST_WEEK_BAL_QTY,"+
			"sum(THIS_WEEK_OUT_QTY) as THIS_WEEK_OUT_QTY,"+
			"sum(THIS_WEEK_IN_QTY)  as THIS_WEEK_IN_QTY,"+
			"sum(THIS_WEEK_CHG_QTY) as THIS_WEEK_CHG_QTY,"+
			"sum(LAST_WEEK_BAL_QTY)-sum(THIS_WEEK_OUT_QTY)+sum(THIS_WEEK_IN_QTY)+sum(THIS_WEEK_CHG_QTY) as THIS_WEEK_BAL_QTY,"+
			"sum(THIS_WEEK_OWE_QTY) as THIS_WEEK_OWE_QTY,"+
			"sum(STOCKING) as STOCKING,"+
			"sum(STOCKINGBAL) as STOCKINGBAL from ("+
			"    SELECT"+
			"'"+		weekStr+"' as WEEK,"+
			"		weekinout.material_id as MATERIAL_ID,"+
			"		material.name as MATERIAL_NAME,"+
			"		sum(weekinout.week_Bal_Qty) as LAST_WEEK_BAL_QTY,"+
			"		0 as THIS_WEEK_OUT_QTY,"+
			"		0 as THIS_WEEK_IN_QTY,"+
			"		0 as THIS_WEEK_CHG_QTY,"+
			"		0 as THIS_WEEK_BAL_QTY,"+
			"		0 as THIS_WEEK_OWE_QTY,"+
			"		0 as STOCKING,"+
			"		0 as STOCKINGBAL"+
			"		FROM prd_in_out_week_detail weekinout"+
			"		inner join t_material material on (weekinout.material_id=material.id "+filterMaterial.toString()+")"+
			"		where weekinout.week<'"+weekStr+"'"+
			"		group by weekinout.material_id,material.name,weekinout.week"+
			"		union all"+
			"		SELECT"+
			"'"+		weekStr+"' as WEEK,"+
			"		weekinout.material_id as MATERIAL_ID,"+
			"		material.name as MATERIAL_NAME,"+
			"		0 as LAST_WEEK_BAL_QTY,"+
			"		sum(ifnull(weekinout.sun_nor_out_qty,0))+sum(ifnull(weekinout.mon_nor_out_qty,0))+sum(ifnull(weekinout.tue_nor_out_qty,0))"+
			"		+sum(ifnull(weekinout.wen_nor_out_qty,0))+sum(ifnull(weekinout.thu_nor_out_qty,0))+sum(ifnull(weekinout.fri_nor_out_qty,0))"+
			"		+sum(ifnull(weekinout.sta_nor_out_qty,0)) as THIS_WEEK_OUT_QTY,"+
			"		sum(ifnull(weekinout.sun_nor_in_qty,0))+sum(ifnull(weekinout.mon_nor_in_qty,0))+sum(ifnull(weekinout.tue_nor_in_qty,0))"+
			"		+sum(ifnull(weekinout.wen_nor_in_qty,0))+sum(ifnull(weekinout.thu_nor_in_qty,0))+sum(ifnull(weekinout.fri_nor_in_qty,0))"+
			"		+sum(ifnull(weekinout.sta_nor_in_qty,0))  as THIS_WEEK_IN_QTY,"+
			"		sum(ifnull(weekinout.sun_chg_brd_qty,0))+sum(ifnull(weekinout.mon_chg_brd_qty,0))+sum(ifnull(weekinout.tue_chg_brd_qty,0))"+
			"		+sum(ifnull(weekinout.wen_chg_brd_qty,0))+sum(ifnull(weekinout.thu_chg_brd_qty,0))+sum(ifnull(weekinout.fri_chg_brd_qty,0))"+
			"		+sum(ifnull(weekinout.sta_chg_brd_qty,0))  as THIS_WEEK_CHG_QTY,"+
			"		0 as THIS_WEEK_BAL_QTY,"+
			"		0 as THIS_WEEK_OWE_QTY,"+
			"		0 as STOCKING,"+
			"		0 as STOCKINGBAL"+
			"		FROM prd_in_out_week_detail weekinout"+
			"		inner join t_material material on (weekinout.material_id=material.id "+filterMaterial.toString()+")"+
			"		where weekinout.week='"+weekStr+"'"+
			"		group by weekinout.material_id,material.name,weekinout.week"+
			"   union all"+
			"		 SELECT"+
			"'"+		weekStr+"' as WEEK,"+
			"		notificationEntryDetail.material_id as MATERIAL_ID,"+
			"		material.name as MATERIAL_NAME,"+
			"		0 as LAST_WEEK_BAL_QTY,"+
			"		0 as THIS_WEEK_OUT_QTY,"+
			"		0 as THIS_WEEK_IN_QTY,"+
			"		0 as THIS_WEEK_CHG_QTY,"+
			"		0 as THIS_WEEK_BAL_QTY,"+
			"		sum(ifnull(notificationEntryDetail.order_Qty,0))-sum(ifnull(notificationEntryDetail.sent_Qty,0)) as THIS_WEEK_OWE_QTY,"+
			"		sum(ifnull(material.safe_Stock,0) )as STOCKING,"+
			"		sum(ifnull(notificationEntryDetail.order_Qty,0))-sum(ifnull(notificationEntryDetail.sent_Qty,0))-sum(ifnull(material.safe_Stock,0) ) as STOCKINGBAL"+
			"		FROM Product_Out_Notification notification"+
			"		left outer join Product_Out_Notification_Entry notificationEntry on notificationEntry.parent_Id=notification.id"+
			"   	left outer join Product_Out_Notification_Entry_Detail notificationEntryDetail on notificationEntryDetail.parent_id=notificationEntry.id"+
			"	  	inner join t_material material on (notificationEntryDetail.material_id=material.id"+filterMaterial.toString()+")"+
			"	  	where notification.plan_Delivery_Date>=DATE('"+timeFormat.format(weekDatePeriod.fromDate)+"') and notification.plan_Delivery_Date<=DATE('"+timeFormat.format(weekDatePeriod.endDate)+"') and notification.status=4"+
			"	  	group by notificationEntry.material_id , material.name"+
			") t group by WEEK ,MATERIAL_ID,MATERIAL_NAME" ;
		
		CommonEvents.writeJsonDataToExt(response, DataFetchEvents.executeSelectSQL(request,sql));
		
		return "sucess";
	}
	
	/**
	 * 查询周明细出入库信息
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryDetailData(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String weekStr;//查询周
		String materialId;//物料id
		String preWeekBalStr;//上周库存余额
		if(request.getParameter("week")==null||request.getParameter("week").trim().length()<1)throw new Exception("周不能为空！");
		if(request.getParameter("materialId")==null||request.getParameter("materialId").trim().length()<1)throw new Exception("物料不能为空！");
		if(request.getParameter("preWeekBal")==null||request.getParameter("preWeekBal").trim().length()<1)throw new Exception("上周库存余额不能为空！");
		weekStr=request.getParameter("week");
		materialId=request.getParameter("materialId");
		preWeekBalStr=request.getParameter("preWeekBal");
		DatePeriod  dp=Utils.getDatePeriodFromWeekStr(weekStr);
		
		//查询对应的周汇总表记录
		Connection conn = ConnectionFactory.getConnection(org.ofbiz.partner.scm.common.Utils.getConnectionHelperName());
		String sql ="SELECT " +
		"  weekinout.MATERIAL_ID as MATERIAL_ID," +
		"  material.name as MATERIAL_NAME," +
		"  weekinout.WEEK ," +
		"  ifnull(weekinout.MON_NOR_IN_QTY,0) as MON_NOR_IN_QTY ," +
		"  ifnull(weekinout.MON_NOR_OUT_QTY,0)as MON_NOR_OUT_QTY ," +
		"  ifnull(weekinout.MON_CHG_BRD_QTY,0) as  MON_CHG_BRD_QTY," +
		"  ifnull(weekinout.TUE_NOR_IN_QTY,0) as  TUE_NOR_IN_QTY," +
		"  ifnull(weekinout.TUE_NOR_OUT_QTY,0) as TUE_NOR_OUT_QTY ," +
		"  ifnull(weekinout.TUE_CHG_BRD_QTY,0) as TUE_CHG_BRD_QTY ," +
		"  ifnull(weekinout.WEN_NOR_IN_QTY,0) as  WEN_NOR_IN_QTY," +
		"  ifnull(weekinout.WEN_NOR_OUT_QTY,0) as WEN_NOR_OUT_QTY," +
		"  ifnull(weekinout.WEN_CHG_BRD_QTY,0) as WEN_CHG_BRD_QTY," +
		"  ifnull(weekinout.THU_NOR_IN_QTY,0) as THU_NOR_IN_QTY," +
		"  ifnull(weekinout.THU_NOR_OUT_QTY,0) as THU_NOR_OUT_QTY," +
		"  ifnull(weekinout.THU_CHG_BRD_QTY,0) as THU_CHG_BRD_QTY," +
		"  ifnull(weekinout.FRI_NOR_IN_QTY,0) as FRI_NOR_IN_QTY," +
		"  ifnull(weekinout.FRI_NOR_OUT_QTY,0) as FRI_NOR_OUT_QTY," +
		"  ifnull(weekinout.FRI_CHG_BRD_QTY,0) as FRI_CHG_BRD_QTY," +
		"  ifnull(weekinout.STA_NOR_IN_QTY,0) as STA_NOR_IN_QTY," +
		"  ifnull(weekinout.STA_NOR_OUT_QTY,0) as STA_NOR_OUT_QTY," +
		"  ifnull(weekinout.STA_CHG_BRD_QTY,0) as STA_CHG_BRD_QTY," +
		"  ifnull(weekinout.SUN_NOR_IN_QTY,0) as SUN_NOR_IN_QTY," +
		"  ifnull(weekinout.SUN_NOR_OUT_QTY,0) as SUN_NOR_OUT_QTY," +
		"  ifnull(weekinout.SUN_CHG_BRD_QTY,0) as SUN_CHG_BRD_QTY" +
		" FROM prd_in_out_week_detail weekinout inner join t_material material on weekinout.material_id=material.id where weekinout.week=? and weekinout.material_id=?";
		PreparedStatement ps=conn.prepareStatement(sql);
		ps.setString(1, weekStr);
		ps.setString(2, materialId);
		
		ResultSet rs=ps.executeQuery();
		//封装json结果 
		JSONObject jsResult=new JSONObject();
		jsResult.put("sucess", true);
		if(rs!=null&&rs.next()){
			JSONArray records=new JSONArray();
			Date firstDate=dp.fromDate;//周的第一天星期日
			Calendar cal=Calendar.getInstance();
			cal.setTime(firstDate);
			
			BigDecimal preDayBal=new BigDecimal(preWeekBalStr);//上一天余额
			for(int i=1;i<=7;i++){
				String dayStr=getStrForDay(i);
				BigDecimal dayOutQty=rs.getBigDecimal(dayStr+"_NOR_OUT_QTY");
				BigDecimal dayInQty=rs.getBigDecimal(dayStr+"_NOR_IN_QTY");
				BigDecimal dayChgQty=rs.getBigDecimal(dayStr+"_CHG_BRD_QTY");
				BigDecimal dayBalQty=preDayBal.add(dayInQty).subtract(dayChgQty).subtract(dayOutQty);
				JSONObject dayJson=buildRecord(cal.getTime(),rs.getString("MATERIAL_NAME"),dayOutQty,dayInQty,dayChgQty,dayBalQty);
				records.add(dayJson);
				
				cal.add(Calendar.DATE, 1);
				preDayBal=dayBalQty;
			}
			jsResult.put("records", records);
			
			CommonEvents.writeJsonDataToExt(response, jsResult.toString());
		}else{
			throw new Exception("周汇总表没有对应记录,week :"+weekStr+" ; material:"+materialId);
		}
		
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
	 * @param dayBalQty   当天改板入
	 * @return
	 */
	private static  JSONObject buildRecord(Date day,String materialName,BigDecimal dayOutQty,BigDecimal dayInQty,BigDecimal dayChgQty,BigDecimal dayBalQty){
		JSONObject temp=new JSONObject();
		temp.put("DAY_IN_WEEK", dateFormat.format(day));
		temp.put("MATERIAL_NAME",materialName);
		temp.put("THIS_DAY_OUT_QTY", dayOutQty);
		temp.put("THIS_DAY_IN_QTY", dayInQty);
		temp.put("THIS_DAY_CHG_QTY", dayChgQty);
		temp.put("THIS_DAY_BAL_QTY", dayBalQty);
		return temp;
	}
	
}
