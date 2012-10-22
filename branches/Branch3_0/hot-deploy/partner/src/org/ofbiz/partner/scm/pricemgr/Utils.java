package org.ofbiz.partner.scm.pricemgr;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.base.util.UtilProperties;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.DelegatorFactory;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.transaction.GenericTransactionException;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.partner.scm.common.BillBaseEvent;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.common.DatePeriod;
import org.ofbiz.partner.scm.dao.TMaterial;

/**
 * 
 * @author Mark
 * 
 */
public class Utils {
	private static final String module = org.ofbiz.partner.scm.pricemgr.Utils.class.getName();
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
	 * 获取进仓单最后同步日期记录
	 * @return
	 */
	public static Date getLastPrdInhouseConfDate(){
		Delegator delegator = DelegatorFactory.getDelegator("default");
		try {
			GenericValue value = delegator.findByPrimaryKey("PriceMgrParamters", UtilMisc.toMap("id", "003"));
			String dateStr = value.getString("value");
			SimpleDateFormat timeFormat = new SimpleDateFormat("yyyyMMdd");
			return timeFormat.parse(dateStr);
		} catch (GenericEntityException e) {
			Debug.logError("-----------获取进仓单最后同步日期出错", "common");
			return null;
		} catch (ParseException e) {
			Debug.logError("-----------获取进仓单最后同步日期出错，日期格式出错", "common");
			return null;
		}
	}
	
	/**
	 * 获取是否使用出货通知单
	 * @return
	 */
	public static boolean isNeedNotification(){
		Delegator delegator = DelegatorFactory.getDelegator("default");
		try {
			GenericValue value = delegator.findByPrimaryKey("PriceMgrParamters", UtilMisc.toMap("id", "004"));
			if(value!=null && "Y".equals(value.getString("value"))){
				return true;
			} else {
				return false;
			}
		} catch (GenericEntityException e) {
			Debug.logError("-----------获取是否使用出货通知单出错", "common");
			return false;
		}
	}
	
	/**
	 * 获取进仓单最后同步日期记录
	 * @return
	 */
//	private static Object lLock=new Object();//003参数更新锁
	public static void updateLastPrdInhouseConfDate(Date d) throws Exception{
		Delegator delegator = DelegatorFactory.getDelegator("default");
		GenericValue value = delegator.makeValue("PriceMgrParamters");
		value.setString("id", "003");
		SimpleDateFormat timeFormat = new SimpleDateFormat("yyyyMMdd");
		value.setString("value", timeFormat.format(d));
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
			tempEntry.set("sort", entryValue.getInteger("sort"));
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
	 * 根据周返回开始介绍日期 周格式为 2012-11W
	 * @param s
	 * @return
	 * @throws Exception
	 */
	public static DatePeriod getDatePeriodFromWeekStr(String s ) throws Exception{
		if(s==null||s.length()<1||s.length()>8)throw new Exception("周字符长度出错");
		
		DatePeriod dp=new DatePeriod();
		
		int year =Integer.valueOf(s.substring(0,4));
		int week =Integer.valueOf(s.substring(5,s.length()-1));
		
		Calendar c = Calendar.getInstance();
		c.setFirstDayOfWeek(Calendar.SUNDAY);
		c.setMinimalDaysInFirstWeek(3);
		c.set(Calendar.YEAR,year);
		c.set(Calendar.WEEK_OF_YEAR,week);
		c.set(Calendar.DAY_OF_WEEK, 1);
		c.set(Calendar.HOUR_OF_DAY, 0);
		c.set(Calendar.MINUTE, 0);
		c.set(Calendar.SECOND, 0);
		c.set(Calendar.MILLISECOND, 0);
		dp.fromDate=c.getTime();
		c.set(Calendar.DAY_OF_WEEK,7);
		c.set(Calendar.HOUR_OF_DAY, 23);
		c.set(Calendar.MINUTE, 59);
		c.set(Calendar.SECOND, 59);
		c.set(Calendar.MILLISECOND, 999);
		dp.endDate=c.getTime();

		return dp;
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
	
	/**
	 * 根据宜家编码和板数量，获取物料编码
	 * @param ikeaId
	 * @param qantity
	 * @return
	 * @throws Exception
	 */
	public static String getMaterialIdByIkea(String ikeaId, String qantity) throws Exception{
		Delegator delegator = DelegatorFactory.getDelegator("default");
		List<GenericValue> entryList = delegator.findByAnd("ProductMap", UtilMisc.toMap("ikeaId", ikeaId, "boardCount", qantity));
		if(entryList.size() > 0 && !"".equals(entryList.get(0).getString("materialId")) && entryList.get(0).getString("materialId") != null){
			return entryList.get(0).getString("materialId");
		} else {
			throw new Exception("未找到产品条码对应的产品编码，请检查“产品资料表”！");
		}
	}
	
	/**
	 * 清理加工件耗料列表
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	public static String removeDataByParentId(HttpServletRequest request, HttpServletResponse response) throws Exception {
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();
			Delegator delegator = (Delegator) request.getAttribute("delegator");
			String parentId = request.getParameter("parentId");// 单据id
			String entityName = request.getParameter("entityName");// 实体名称
			if ( parentId != null ) {
				Debug.log("清理实体:" + entityName + "数据，parentId：" + parentId, module);
				delegator.removeByAnd(entityName, UtilMisc.toMap("parentId", parentId));
			}
			BillBaseEvent.writeSuccessMessageToExt(response, "清理成功");
			TransactionUtil.commit(beganTransaction);
		} catch (Exception e) {
			Debug.logError(e, module);
			try {
				TransactionUtil.rollback(beganTransaction, e.getMessage(), e);
			} catch (GenericTransactionException e2) {
				Debug.logError(e2, "Unable to rollback transaction", module);
			}
			throw e;
		}
		return "success";
	}
	
	/**
	 * 前端调用事件
	 * 根据物料id获取明细物料，获取该物料的第一个bom单，
	 * 如果bom单明细物料是bom物料，则对该bom物料进行递归操作，递归的次数不能超过10层 ，对物料不进行合并
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	public static String getBomMaterialDetailList(HttpServletRequest request, HttpServletResponse response) throws Exception {
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();
			String materialId = request.getParameter("materialId");// 物料
			// 封装实体数据，构建json字符串
			StringBuffer jsonStr = new StringBuffer();
			if ( materialId != null ) {
				List<ConsumeMaterial> consumeMaterialList = getBomMaterialDetail(materialId, 0);
				if (consumeMaterialList == null || consumeMaterialList.size() < 1) {
					return "{'success':true,total:0,'records':[]}";
				}
				int total = consumeMaterialList.size();
				boolean isFirstValue = true;
				jsonStr.append("{'success':true,'records':[");
				TMaterial tmaterial = null;
				for (ConsumeMaterial v : consumeMaterialList) {
					if (isFirstValue) {
						isFirstValue = false;
					} else {
						jsonStr.append(",");
					}
					try {
						tmaterial = new TMaterial(v.getMaterialId());
						String model = "";
						if(tmaterial.getModel()!=null){
							model = tmaterial.getModel();
						}
						String unitId = "";
						if(tmaterial.getUnitId()!=null){
							unitId = tmaterial.getUnitId();
						}
						jsonStr.append("{'materialId':'"+v.getMaterialId()+"',");
						jsonStr.append("'volume':'"+v.getConsumeQty()+"',");
						jsonStr.append("'model':'"+model+"',");
						jsonStr.append("'unitId':'"+unitId+"'}");
					} catch (Exception e) {
						Debug.logError(e, module);
						throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "EntityObjectToStringException"));
					}
				}
				jsonStr.append("],total:"+total+"}");
			} else {
				throw new Exception("成品编码不能为空！");
			}
			
			BillBaseEvent.writeSuccessMessageToExt(response, jsonStr.toString());
			TransactionUtil.commit(beganTransaction);
		} catch (Exception e) {
			Debug.logError(e, module);
			try {
				TransactionUtil.rollback(beganTransaction, e.getMessage(), e);
			} catch (GenericTransactionException e2) {
				Debug.logError(e2, "Unable to rollback transaction", module);
			}
			throw e;
		}
		return "success";
	}
	
}
