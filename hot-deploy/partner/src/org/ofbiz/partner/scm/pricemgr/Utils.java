package org.ofbiz.partner.scm.pricemgr;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.DelegatorFactory;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.common.CommonEvents;

/**
 * 
 * @author Mark
 * 
 */
public class Utils {
	/**
	 * 获取当期操作年月
	 * 
	 * @return
	 */
	public static Date getCurDate() {
		Delegator delegator = DelegatorFactory.getDelegator("default");
		try {
			GenericValue value = delegator.findByPrimaryKey("PriceMgrParamters", UtilMisc.toMap("id", "001"));
			String dateStr = value.getString("value");
			SimpleDateFormat timeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:SS.sss");
			return timeFormat.parse(dateStr);
		} catch (GenericEntityException e) {
			Debug.logError("-----------获取当期年月出错", "common");
			return null;
		} catch (ParseException e) {
			Debug.logError("-----------获取当期年月出错，日期格式出错", "common");
			return null;
		}
	}
	
	/**
	 * 获取初始化年月
	 * 
	 * @return
	 */
	public static Date getSysInitDate() {
		Delegator delegator = DelegatorFactory.getDelegator("default");
		try {
			GenericValue value = delegator.findByPrimaryKey("PriceMgrParamters", UtilMisc.toMap("id", "002"));
			String dateStr = value.getString("value");
			SimpleDateFormat timeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:SS.sss");
			return timeFormat.parse(dateStr);
		} catch (GenericEntityException e) {
			Debug.logError("-----------获取当期年月出错", "common");
			return null;
		} catch (ParseException e) {
			Debug.logError("-----------获取当期年月出错，日期格式出错", "common");
			return null;
		}
	}
	
	/**
	 * 判断系统是否处于初始化月份
	 * @return
	 */
	public static boolean isSysInitMonth() throws Exception{
		Date curDate=getCurDate(); //当前期间
		Date initDate=getSysInitDate();//初始化期间
		
		if(curDate==null||initDate==null){
			throw new Exception("当前期间或者初始化期间为空，请联系管理员！");
		}
		
		Calendar cal=Calendar.getInstance();
		cal.setTime(curDate);
		int curYear=cal.get(Calendar.YEAR);
		int curMonth=cal.get(Calendar.MONTH);
		
		cal.setTime(initDate);
		int initYear=cal.get(Calendar.YEAR);
		int initMonth=cal.get(Calendar.MONTH);
		
		if(curYear==initYear&&curMonth==initMonth){
			return true;
		}else{
			return false;
		}
		
	}
	
	
	/**
	 * 设置当前期间
	 * @param year
	 * @param month
	 * @throws Exception
	 */
	public static void setCurPeriod(int year ,int month) throws Exception{ 
		
		Calendar cal= Calendar.getInstance();
		//月份需要减一，月份是从0开始
		cal.set(year, month-1, 01, 0, 0, 0);
		cal.set(Calendar.MILLISECOND, 0);
		Delegator delegator=org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
		GenericValue value=delegator.findByPrimaryKey("PriceMgrParamters", UtilMisc.toMap("id","001"));
		SimpleDateFormat timeFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:SS.sss");
		
		value.set("value", timeFormat.format(cal.getTime()));
		
		delegator.store(value);
		
	}
	
	/**
	 * 判断是否是当前期间
	 * 
	 * @return
	 */
	public static boolean isCurPeriod(Date date) {
		if (date == null)
			return false;
		Calendar cal = Calendar.getInstance();

		Date curDate = getCurDate();// 获取当前系统期间
		cal.setTime(curDate);
		int curYear = cal.get(Calendar.YEAR);
		int curMonth = cal.get(Calendar.MONTH)+1;

		cal.setTime(date);
		int year = cal.get(Calendar.YEAR);
		int month = cal.get(Calendar.MONTH)+1;

		if (curYear == year && curMonth == month) {
			return true;
		}
		return false;

	}

	/**
	 * 创建进库单
	 * 
	 * @param billValue
	 * @throws Exception
	 */
	public static void createReturnProductWarehousingBill(GenericValue billValue, HttpServletRequest request) throws Exception {
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		GenericValue billHead = delegator.findOne("ReturnProductWarehousing", UtilMisc.toMap("id", billValue.getString("id")), false);
		if (billHead != null) {
			billHead.remove();
		}
		billHead = delegator.makeValue("ReturnProductWarehousing");
		billHead.set("id", billValue.getString("id"));
		billHead.set("number", billValue.getString("number"));
		billHead.set("bizDate", new Timestamp(System.currentTimeMillis()));
		billHead.set("processorId", billValue.containsKey("processorSupplierId") ? billValue.getString("processorSupplierId"):billValue.getString("workshopWorkshopId"));
		billHead.set("submitterSystemUserId", billValue.getString("submitterSystemUserId"));
		billHead.set("totalsum", billValue.getBigDecimal("totalsum"));
		billHead.set("note", billValue.containsKey("processorSupplierId") ? "CRP":"WRP");
		billHead.set("status", 0);
		billHead.set("createdStamp", new Timestamp(System.currentTimeMillis()));
		billHead.set("submitStamp", new Timestamp(System.currentTimeMillis()));
		billHead.create();
		List<GenericValue> entryList = delegator.findByAnd("ReturnProductWarehousingEntry", UtilMisc.toMap("parentId", billValue.getString("id")));
		if (entryList != null && entryList.size() > 0) {
			delegator.removeByAnd("ReturnProductWarehousingEntry", UtilMisc.toMap("parentId", billValue.getString("id")));
		}
		entryList = delegator.findByAnd(billValue.getEntityName() + "Entry", UtilMisc.toMap("parentId", billValue.getString("id")));
		for (GenericValue entryValue : entryList) {
			GenericValue tempEntry = delegator.makeValue("ReturnProductWarehousingEntry");
			tempEntry.set("id", entryValue.getString("id"));
			tempEntry.set("parentId", entryValue.getString("parentId"));
			tempEntry.set("warehouseWarehouseId", entryValue.getString("warehouseWarehouseId"));
			tempEntry.set("bomId", entryValue.getString("bomId"));
			tempEntry.set("unitUnitId", entryValue.getString("unitUnitId"));
			tempEntry.set("volume", entryValue.getBigDecimal("volume"));
			tempEntry.set("price", entryValue.getBigDecimal("price"));
			tempEntry.set("entrysum", entryValue.getBigDecimal("entrysum"));
			tempEntry.create();
		}
	}
	
	/**
	 * 提交入库单
	 * @param billValue
	 * @param request
	 * @throws Exception
	 */
	public static void submitReturnProductWarehousing(GenericValue billValue, HttpServletRequest request) throws Exception {
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		GenericValue billHead = delegator.findOne("ReturnProductWarehousing", UtilMisc.toMap("id", billValue.getString("id")), false);
		if(billHead != null){
			BizStockImpFactory.getBizStockImp(BillType.ReturnProductWarehousing).updateStock(billHead, false, false);
			if (billHead != null) {
				billHead.set("status", 4);
				billHead.set("submitterSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
				billHead.set("submitStamp", new Timestamp(System.currentTimeMillis()));
				billHead.store();
			}
		}
	}
	/**
	 * 返回下一个月的年段
	 * @param year
	 * @param month
	 * @return
	 */
	public static Integer getYearOfNextMonth(int year,int month) throws Exception{
		if(month>12||month<1)throw new Exception("月份不合理");
		if(month!=12){
			return year;
		}else{
			return ++year;
		}
	}
	/**
	 * 返回下一个月的月段
	 * @param year
	 * @param month
	 * @return
	 */
	public static Integer getMonthOfNextMonth(int year,int month)throws Exception{
		if(month>12||month<1)throw new Exception("月份不合理");
		if(month!=12){
			return ++month;
		}else{
			return 1;
		}
	}
	
	/**
	 * 返回上一个月的年段
	 * @param year
	 * @param month
	 * @return
	 */
	public static Integer getYearOfPreMonth(int year,int month) throws Exception{
		if(month>12||month<1)throw new Exception("月份不合理");
		if(month!=1){
			return year;
		}else{
			return --year;
		}
	}
	/**
	 * 返回上一个月的月段
	 * @param year
	 * @param month
	 * @return
	 */
	public static Integer getMonthOfPreMonth(int year,int month)throws Exception{
		if(month>12||month<1)throw new Exception("月份不合理");
		if(month!=1){
			return --month;
		}else{
			return 12;
		}
	}
	
	/**
	 * 根据日期返回当年周数
	 *  	1 . 一周开始时间是从星期天开始
	 * 		2 . 一年的第一周最少是3天以及以上才算是当年第一周，否则算是上一年最后一周
	 * 
	 * @author Mark 2012-7-11
	 */
	public static int getWeekOfYear(Calendar cl) throws Exception{
        cl.setFirstDayOfWeek(Calendar.SUNDAY);// 每周以周日开始
        cl.setMinimalDaysInFirstWeek(3);  // 每年的第一周必须大于或等于3天，否则就算上一年的最后一周
        return cl.get(Calendar.WEEK_OF_YEAR);
	}
	
	/**
	 * 根据日期返回当年周数字符串(含年度)
	 * @author Mark 2012-7-11
	 */
	public static String getYearWeekStr(Date d) throws Exception{
		Calendar cl = Calendar.getInstance();
		cl.setTime(d);
		int year=cl.get(Calendar.YEAR);
		int week=getWeekOfYear(cl);
		//计算年度,是上一年、本年、或者下一年
		if(cl.get(Calendar.MONTH)==Calendar.JANUARY && cl.get(Calendar.WEEK_OF_YEAR)>50){
			year--; //上一年
		}else if(cl.get(Calendar.MONTH)==Calendar.DECEMBER && cl.get(Calendar.WEEK_OF_YEAR)==1){
			year++; //下一年
		}
        return ""+year+"-"+week+"W";
	}
	
	
	/**
	 * 根据物料id获取明细物料，获取该物料的第一个bom单，
	 * 如果bom单明细物料是bom物料，则对该bom物料进行递归操作，递归的次数不能超过10层 ，对物料不进行合并
	 * @author Mark 2012-06-28
	 * @param materialId 物料id
	 * @param level 递归层次
	 */
	public static List<ConsumeMaterial> getBomMaterialDetail(String materialId, int level) throws Exception{
		//防止死循环
		level++;
		if(level>10)throw new Exception("Recursion level is higher than 10 !!");
		
		Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
		
		
		/* 1.  查找第一个bom单 , 已经核准 、 有效*/
		List<GenericValue> bomBillList =delegator.findByAnd("MaterialBom","materialId", materialId,"status",1,"valid","Y");
		if(bomBillList==null||bomBillList.size()<1){
			GenericValue mv=delegator.findOne("TMaterial", false, "id",materialId);
			throw new Exception("系统没有定义物料【"+mv.getString("name")+"】bom单");
		}
		
		GenericValue bomBill=bomBillList.get(0);
		
		List<ConsumeMaterial> consumeList=new ArrayList<ConsumeMaterial>();
		/* 2.  获取明细物料列表*/
		if(bomBill!=null){
			List<GenericValue> bomEntry=delegator.findByAnd("MaterialBomEntry", "parentId",bomBill.getString("id"));
			if(bomEntry!=null){
				for(GenericValue v:bomEntry){
					/*2.1 是否bom物料，递归获取物料*/
					String isBomMaterial=v.getString("isBomMaterial");
					String entryMaterialId=v.getString("entryMaterialId");
					BigDecimal qty=v.getBigDecimal("volume");
					if(isBomMaterial.equals("Y")&&entryMaterialId!=null){
						List<ConsumeMaterial> detailBomMaterialList=getBomMaterialDetail(entryMaterialId, level);
						if(detailBomMaterialList==null||detailBomMaterialList.size()<1)throw new Exception("Can`t find bom material for  "+entryMaterialId);
						
						//剩余上层物料数量
						for(ConsumeMaterial c:detailBomMaterialList){
							c.setConsumeQty(qty.multiply(c.getConsumeQty()));
						}
						consumeList.addAll(detailBomMaterialList);//添加返回的物料列表
					}else{
						/*2.2 添加到物料列表*/
						consumeList.add(new ConsumeMaterial(entryMaterialId,qty,null,null));
					}
				}
			}
		}
		return consumeList;
	}
	
	
}
