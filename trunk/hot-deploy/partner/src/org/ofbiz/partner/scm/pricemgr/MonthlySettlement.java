package org.ofbiz.partner.scm.pricemgr;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javolution.util.FastList;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.condition.EntityOperator;
import org.ofbiz.entity.transaction.GenericTransactionException;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.partner.scm.common.GenericValue4Compare;
import org.ofbiz.partner.scm.common.SystemLock;

/**
 * 月结类
 * 提供系统月度结算功能，根据业务发生日期时间顺序，计算物料单价
 * 物料有两大类：独立需求物料、关联物料;关联物料的单价是根据bom单计算，通过得到其它物料的单价相加
 * @author Mark
 *
 */
public class MonthlySettlement {
	private static final String module=org.ofbiz.partner.scm.pricemgr.MonthlySettlement.class.getName();
	private int year;//结算年度
	private int month;//结算月份
	private Delegator delegator=null;
	//单实例模式
	private static MonthlySettlement instance=null;
	public static MonthlySettlement getInstance(){
		if(instance==null){
			instance=new MonthlySettlement();
		}
		return instance;
	}
	private MonthlySettlement(){
		//获取当前系统操作年月
		Date curDate=Utils.getCurDate();
		Calendar   cal   =   Calendar.getInstance();
		cal.setTime(curDate);
		cal.add(Calendar.MONTH, 1);
		year=cal.get(Calendar.YEAR);
		month=cal.get(Calendar.MONTH);
		delegator=org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
	}
	
	/**
	 * 锁住系统，用户不能进行编辑系统单据
	 * @return
	 */
	private void lockSystem() throws Exception{
		SystemLock.setLock(true);
	}
	/**
	 * 释放系统，用户可以进行编辑系统单据
	 * @return
	 */
	private void unlockSystem() throws Exception{
		SystemLock.setLock(false);
	}
	/**
	 * 结算当月，计算所有物料出库单价
	 * 当月操作年月设置为一下月
	 * @param response 
	 * @param request 
	 * @return
	 * @throws Exception
	 */
	public synchronized boolean monthlySettle(HttpServletRequest request, HttpServletResponse response) throws Exception{
		Debug.logInfo("月结操作开始~~~~~~~", module);
		//判断request结算年月
		Object yearStr=request.getAttribute("year");
		Object monthStr=request.getAttribute("month");
		if(yearStr==null||monthStr==null){
			throw new Exception("结算年月为空");
		}
		if(Integer.valueOf(yearStr.toString())!=year||Integer.valueOf(monthStr.toString())!=month){
			throw new Exception("结算年月不是当前期间");
		}
		//TODO 结算当期
		boolean beganTransaction = false;
		try {
	            beganTransaction = TransactionUtil.begin();
	            
	            //锁住系统
	            lockSystem();
	            
	            
	            //获取系统本期所有业务单据，按提交时间升序排序
	            List<GenericValue> seqBillValueList=getSeqBillValue();
	            
	            
	            //清空所有单价表信息到月初状态
	            clearMidTable();
	            
	            //按顺序进行业务处理
	            processCalItem(seqBillValueList);
	            
	         
	            //将所有单价表结算到下一个月
	            settleMidTable();
	            
	            //修改系统当前期间，滚动到下一个月
	            stepToNextPeriod();
	            
	            
	            
		} catch (Exception e) {
            Debug.logError(e, module);
            try {
                TransactionUtil.rollback(beganTransaction, e.getMessage(), e);
            } catch (GenericTransactionException e2) {
                Debug.logError(e2, "Unable to rollback transaction", module);
            }
            Debug.logInfo("月结操作出错~~~~~~~", module);
        } finally {
        	//释放系统
        	unlockSystem();
        	
            try {
                TransactionUtil.commit(beganTransaction);
            } catch (GenericTransactionException e) {
                Debug.logError(e, "Unable to commit transaction", module);
            }
        }
        Debug.logInfo("月结操作结束~~~~~~~", module);
		return true;
	}

	/**
	 * 获取系统所有业务单据，按时间升序排序
	 * @return
	 */
	private List<GenericValue> getSeqBillValue()throws Exception {
		Debug.logInfo("获取系统所有业务单据，按时间升序排序，操作开始~~~~~~~", module);
		List<GenericValue4Compare> allBillList=new ArrayList<GenericValue4Compare>();
		//过滤条件 ,系统期间时间段，单据状态为提交状态(4)
		Calendar cal=Calendar.getInstance();
		cal.set(year, month-1, 1, 0, 0, 0);
		Date fromDate=cal.getTime();
		cal.add(Calendar.MONTH, 1);
		Date endDate=cal.getTime();
		List<EntityCondition> condList=new ArrayList<EntityCondition>();
		condList.add(EntityCondition.makeCondition("submitStamp",EntityOperator.GREATER_THAN_EQUAL_TO,fromDate));
		condList.add(EntityCondition.makeCondition("submitStamp",EntityOperator.LESS_THAN,endDate));
		condList.add(EntityCondition.makeCondition("status",EntityOperator.EQUALS,4));
		EntityCondition composeCond=EntityCondition.makeCondition(condList);
		
		//采购入库单
		mergeCompareValue("PurchaseWarehousing",composeCond,allBillList);
		
		//采购退库
		mergeCompareValue("PurchaseReturn",composeCond,allBillList);
		
		//委外领料
		mergeCompareValue("ConsignDrawMaterial",composeCond,allBillList);
		
		//委外退料
		mergeCompareValue("ConsignReturnMaterial",composeCond,allBillList);
		
		//委外入库
		mergeCompareValue("ConsignWarehousing",composeCond,allBillList);
		
		//委外退货
		mergeCompareValue("ConsignReturnProduct",composeCond,allBillList);
		
		//车间领料
		mergeCompareValue("WorkshopDrawMaterial",composeCond,allBillList);
		
		//车间退料
		mergeCompareValue("WorkshopReturnMaterial",composeCond,allBillList);
		
		//车间入库
		mergeCompareValue("WorkshopWarehousing",composeCond,allBillList);
		
		//车间退货
		mergeCompareValue("WorkshopReturnProduct",composeCond,allBillList);
		
		//排序单据
		Object[] billsArr=allBillList.toArray();
		Arrays.sort(billsArr);
		
		//封装单据返回
		List<GenericValue> seqList=new ArrayList<GenericValue>();
		for(int i=0;i<billsArr.length;i++){
			seqList.add(((GenericValue4Compare)billsArr[i]).getValue());
		}
		
		Debug.logInfo("获取系统所有业务单据，按时间升序排序，操作结束~~~~~~", module);
		return seqList;
	}
	
	/**
	 * 清空中间表为月初状态
	 */
	private void clearMidTable()throws Exception {
		Debug.logInfo("清空中间表为月初状态，操作开始~~~~~~~", module);
		//当前余额表CurMaterialBalance 【volume、totalSum】设置为零
		delegator.storeByCondition("CurMaterialBalance", UtilMisc.toMap("volume", BigDecimal.ZERO, "totalSum", BigDecimal.ZERO), null);
		
		//当前委外单价中间表CurConsignPrice 【volume、totalSum】设置为零
		delegator.storeByCondition("CurConsignPrice", UtilMisc.toMap("volume", BigDecimal.ZERO, "totalSum", BigDecimal.ZERO), null);
		
		//当前车间单价中间表CurWorkshopPrice 【volume、totalSum】设置为零
		delegator.storeByCondition("CurWorkshopPrice", UtilMisc.toMap("volume", BigDecimal.ZERO, "totalSum", BigDecimal.ZERO), null);
		
		//当前成品单价中间表CurProductPrice 【volume、totalSum】设置为零
		delegator.storeByCondition("CurProductPrice", UtilMisc.toMap("volume", BigDecimal.ZERO, "totalSum", BigDecimal.ZERO), null);
		
		Debug.logInfo("清空中间表为月初状态，操作结束~~~~~~", module);
	}
	
	/**
	 * 按业务顺序重算
	 * @param seqBillValueList
	 */
	private void processCalItem(List<GenericValue> seqBillValueList)throws Exception {
		Debug.logInfo("重算业务，操作开始~~~~~~~", module);
		if(seqBillValueList==null||seqBillValueList.size()<1){
			throw new Exception("业务单据顺序列表为空！！！！！");
		}
		
		for(GenericValue bill:seqBillValueList){
			String entityName=bill.getEntityName();
			IBizStock iBiz=getBizImpByName(entityName);
			iBiz.updateStock(bill,isOutByName(entityName));
		}
		Debug.logInfo("重算业务，操作结束~~~~~~~", module);
	}
	/**
	 * 根据实体名称获取是否出入库
	 * @param en
	 * @return
	 * @throws Exception
	 */
	private boolean isOutByName(String en) throws Exception{
		if(en.equalsIgnoreCase("PurchaseWarehousing")){//采购入库
			return false;
			
		}else if(en.equalsIgnoreCase("PurchaseReturn")){//采购退货
			return true;
			
		}else if(en.equalsIgnoreCase("ConsignDrawMaterial")){//委外领料
			return true;
			
		}else  if(en.equalsIgnoreCase("ConsignReturnMaterial")){//委外退料
			return false;
			
		}else if(en.equalsIgnoreCase("ConsignWarehousing")){//委外入库
			return false;
			
		}else if(en.equalsIgnoreCase("ConsignReturnProduct")){//委外退库
			return true;
			
		}else if(en.equalsIgnoreCase("WorkshopDrawMaterial")){//车间领料
			return true;
			
		}else if(en.equalsIgnoreCase("WorkshopReturnMaterial")){//车间退料
			return false;
			
		}else if(en.equalsIgnoreCase("WorkshopReturnProduct")){//车间退库
			return false;
			
		}else if(en.equalsIgnoreCase("WorkshopWarehousing")){//车间入库
			return true;
			
		}else{
			throw new Exception("没有对应的业务实现类");
		}
	}
	
	/**
	 * 根据实体名称取业务实现类
	 * @param en
	 * @return
	 * @throws Exception
	 */
	private IBizStock getBizImpByName(String en) throws Exception{
		if(en.equalsIgnoreCase("PurchaseWarehousing")){//采购入库
			return BizStockImpFactory.getBizStockImp(BillType.PurchaseWarehouse);
			
		}else if(en.equalsIgnoreCase("PurchaseReturn")){//采购退货
			return BizStockImpFactory.getBizStockImp(BillType.PurchaseReturn);
			
		}else if(en.equalsIgnoreCase("ConsignDrawMaterial")){//委外领料
			return BizStockImpFactory.getBizStockImp(BillType.ConsignDrawMaterial);
			
		}else  if(en.equalsIgnoreCase("ConsignReturnMaterial")){//委外退料
			return BizStockImpFactory.getBizStockImp(BillType.ConsignReturnMaterial);
			
		}else if(en.equalsIgnoreCase("ConsignWarehousing")){//委外入库
			return BizStockImpFactory.getBizStockImp(BillType.ConsignWarehousing);
			
		}else if(en.equalsIgnoreCase("ConsignReturnProduct")){//委外退库
			return BizStockImpFactory.getBizStockImp(BillType.ConsignReturnProduct);
			
		}else if(en.equalsIgnoreCase("WorkshopDrawMaterial")){//车间领料
			return BizStockImpFactory.getBizStockImp(BillType.WorkshopDrawMaterial);
			
		}else if(en.equalsIgnoreCase("WorkshopReturnMaterial")){//车间退料
			return BizStockImpFactory.getBizStockImp(BillType.WorkshopReturnMaterial);
			
		}else if(en.equalsIgnoreCase("WorkshopReturnProduct")){//车间退库
			return BizStockImpFactory.getBizStockImp(BillType.WorkshopReturnProduct);
			
		}else if(en.equalsIgnoreCase("WorkshopWarehousing")){//车间入库
			return BizStockImpFactory.getBizStockImp(BillType.WorkshopWarehousing);
			
		}else{
			throw new Exception("没有对应的业务实现类");
		}
	}
	
	
	/**
	 * 设置单价表到下一个月状态
	 */
	private void settleMidTable() throws Exception {
		EntityCondition cond=EntityCondition.makeCondition(UtilMisc.toMap("year", year, "month", month));
		//转移库存余额表
		transferEntityData("CurMaterialBalance", "HisMaterialBalance",cond,null);
		
		//转移委外中间表 CurConsignPrice HisConsignPrice
		transferEntityData("CurConsignPrice", "HisConsignPrice",cond,null);
		
		//转移车间中间表 CurWorkshopPrice HisWorkshopPrice
		transferEntityData("CurWorkshopPrice", "HisWorkshopPrice",cond,null);
		
	}

	/**
	 * 转移实体数据,转移表和目标表字段要一致
	 * @throws Exception
	 */
	private void transferEntityData(String fromEntityName,String targetEntityName,EntityCondition cond,Set<String> fields) throws Exception{
		if(fromEntityName==null||fromEntityName.length()<1||targetEntityName==null||targetEntityName.length()<1||cond==null){
			throw new Exception("转移实体名称为空,或者条件为空！");
		}
		List<GenericValue> curList=delegator.findList(fromEntityName,cond,fields,null,null,true);
		if(curList!=null&&curList.size()>0){
			List<GenericValue> hisList=FastList.newInstance();
			for(GenericValue cv:curList){
				GenericValue hisv=delegator.makeValue(targetEntityName,fields==null?cv.getAllFields():cv.getFields(fields));
				hisList.add(hisv);
			}
			//清除目标表数据
			delegator.removeByCondition(targetEntityName, cond);
			
			//插入数据
			delegator.storeAll(hisList);
			
			//清除源数据
			delegator.removeByCondition(fromEntityName, cond);
		}
	}

	/**
	 * 当前期间进入下一个月份
	 */
	private void stepToNextPeriod() throws Exception{
		++month;
		Utils.setCurPeriod(year, month);
	}
	
	
	/**
	 * 反结算当期，如果当期有审核的单据，则不能反结算
	 * 当月操作年月设置为前一个月
	 * @param response 
	 * @param request 
	 * @return
	 * @throws Exception
	 */
	public synchronized boolean rollbackSettle(HttpServletRequest request, HttpServletResponse response) throws Exception{
	
		//判断request结算年月
		Object yearStr=request.getAttribute("year");
		Object monthStr=request.getAttribute("month");
		if(yearStr==null||monthStr==null){
			throw new Exception("结算年月为空");
		}
		if(Integer.valueOf(yearStr.toString())!=year||Integer.valueOf(monthStr.toString())!=month){
			throw new Exception("结算年月不是当前期间");
		}
		//TODO 结算当期
		boolean beganTransaction = false;
		try {
	            beganTransaction = TransactionUtil.begin();
	            
	            //锁住系统
	            lockSystem();
	            
	          //判断是否能够反结算，是否已经有提交当前期间的业务单据
	    		checkCanRollback();
	    		
	    		//清空单价中间表信息,结算中间表到上一个月月末状态
	    		clearMidTableToPre();
	    		
	    		//修改系统当前期间，滚动到上一个月
	    		 stepToPrePeriod();
	            
		} catch (Exception e) {
            Debug.logError(e, module);
            try {
                TransactionUtil.rollback(beganTransaction, e.getMessage(), e);
            } catch (GenericTransactionException e2) {
                Debug.logError(e2, "Unable to rollback transaction", module);
            }
        } finally {
        	//释放系统
        	unlockSystem();
        	
            try {
                TransactionUtil.commit(beganTransaction);
            } catch (GenericTransactionException e) {
                Debug.logError(e, "Unable to commit transaction", module);
            }
        }
		
		return true;
	}
	/**
	 * 系统期间回到上一个月
	 */
	private void stepToPrePeriod() throws Exception{
		--month;
		Utils.setCurPeriod(year, month);
	}
	/**
	 *检查是否当前期间的提交单据 
	 */
	private void checkCanRollback() throws Exception{
		Debug.logInfo("检查是否当前期间的提交单据，操作开始~~~~~~", module);
		//过滤条件 ,系统期间时间段，单据状态为提交状态(4)
		Calendar cal=Calendar.getInstance();
		cal.set(year, month-1, 1, 0, 0, 0);
		Date fromDate=cal.getTime();
		cal.add(Calendar.MONTH, 1);
		Date endDate=cal.getTime();
		List<EntityCondition> condList=new ArrayList<EntityCondition>();
		condList.add(EntityCondition.makeCondition("submitStamp",EntityOperator.GREATER_THAN_EQUAL_TO,fromDate));
		condList.add(EntityCondition.makeCondition("submitStamp",EntityOperator.LESS_THAN,endDate));
		condList.add(EntityCondition.makeCondition("status",EntityOperator.EQUALS,4));
		EntityCondition cond=EntityCondition.makeCondition(condList);
		
		if(checkExist("PurchaseWarehousing", cond))throw new Exception("本期间存在提交状态的采购入库单，不能进行反结算！！");
		
		if(checkExist("PurchaseReturn", cond))throw new Exception("本期间存在提交状态的采购退库单，不能进行反结算！！");
		
		if(checkExist("ConsignDrawMaterial", cond))throw new Exception("本期间存在提交状态的委外领料单，不能进行反结算！！");
		
		if(checkExist("ConsignReturnMaterial", cond))throw new Exception("本期间存在提交状态的委外退料单，不能进行反结算！！");
		
		if(checkExist("ConsignWarehousing", cond))throw new Exception("本期间存在提交状态的委外入库单，不能进行反结算！！");
		
		if(checkExist("ConsignReturnProduct", cond))throw new Exception("本期间存在提交状态的委外退货单，不能进行反结算！！");
		
		if(checkExist("WorkshopDrawMaterial", cond))throw new Exception("本期间存在提交状态的车间领料单，不能进行反结算！！");
		
		if(checkExist("WorkshopReturnMaterial", cond))throw new Exception("本期间存在提交状态的车间退料单，不能进行反结算！！");
		
		if(checkExist("WorkshopWarehousing", cond))throw new Exception("本期间存在提交状态的车间入库单，不能进行反结算！！");
		
		if(checkExist("WorkshopReturnProduct", cond))throw new Exception("本期间存在提交状态的车间退库单，不能进行反结算！！");
		
		Debug.logInfo("检查是否当前期间的提交单据，操作结束~~~~~~", module);
		
	}
	/**
	 * 检查是否存在记录
	 * @param entityName
	 * @param cond
	 * @return
	 */
	private boolean checkExist(String entityName,EntityCondition cond) throws Exception {
		long count=delegator.findCountByCondition(entityName, cond, null, null);
		if(count>0){
			return true;
		}
		return false;
	}
	
	/**
	 * 清除本期间的中间表信息，还原到上一个月
	 */
	private void clearMidTableToPre() throws Exception{
		
		EntityCondition cond=EntityCondition.makeCondition(UtilMisc.toMap("year", Utils.getYearOfPreMonth(year, month), "month", Utils.getMonthOfPreMonth(year, month)));
		//删除本期数据,转移库存余额表
		delegator.removeAll("CurMaterialBalance");
		transferEntityData("HisMaterialBalance", "CurMaterialBalance",cond,null);
		
		//删除本期数据,转移委外中间表
		delegator.removeAll("CurConsignPrice");
		transferEntityData("HisConsignPrice", "CurConsignPrice",cond,null);
		
		//删除本期数据,转移车间中间表 
		delegator.removeAll("CurWorkshopPrice");
		transferEntityData("HisWorkshopPrice", "CurWorkshopPrice",cond,null);
	}
	
	
	public int getYear() {
		return year;
	}
	public void setYear(int year) {
		this.year = year;
	}
	
	public int getMonth() {
		return month;
	}
	public void setMonth(int month) {
		this.month = month;
	}
	
	/**
	 * 查找业务单据
	 * @param entityName
	 * @param list
	 */
	private void mergeCompareValue(String entityName,EntityCondition composeCond,List<GenericValue4Compare> allBillList) throws Exception{
		List<GenericValue> purInWsList=delegator.findList(entityName, composeCond, null, null, null, false);
		if(purInWsList!=null&&purInWsList.size()>0){
			for(GenericValue v:purInWsList){
				if(v.getTimestamp("submitStamp")==null)throw new Exception("submitStamp is null !!!!!!");
				allBillList.add(new GenericValue4Compare(v,"submitStamp"));
			}
		}
	}
	
}
