package org.ofbiz.partner.scm.pricemgr;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.base.util.Debug;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.condition.EntityOperator;
import org.ofbiz.entity.jdbc.ConnectionFactory;
import org.ofbiz.entity.transaction.GenericTransactionException;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.partner.scm.common.GenericValue4Compare;
import org.ofbiz.partner.scm.common.SystemLock;

/**
 * 月结类 提供系统月度结算功能，根据业务发生日期时间顺序，计算物料单价
 * 物料有两大类：独立需求物料、关联物料;关联物料的单价是根据bom单计算，通过得到其它物料的单价相加
 * 
 * @author Mark
 * 
 */
public class MonthlySettlement {
	private static final String module = org.ofbiz.partner.scm.pricemgr.MonthlySettlement.class.getName();
	private int year;// 结算年度
	private int month;// 结算月份
	private Delegator delegator = null;

	// 单实例模式
	private static MonthlySettlement instance = null;

	public static MonthlySettlement getInstance() {
		if (instance == null) {
			instance = new MonthlySettlement();
		}
		return instance;
	}

	private MonthlySettlement() {
		// 获取当前系统操作年月
		Date curDate = Utils.getCurDate();
		Calendar cal = Calendar.getInstance();
		cal.setTime(curDate);
		year = cal.get(Calendar.YEAR);
		month = cal.get(Calendar.MONTH) + 1;
		delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
	}

	/**
	 * 锁住系统，用户不能进行编辑系统单据
	 * 
	 * @return
	 */
	private void lockSystem() throws Exception {
		SystemLock.setLock(true);
	}

	/**
	 * 释放系统，用户可以进行编辑系统单据
	 * 
	 * @return
	 */
	private void unlockSystem() throws Exception {
		SystemLock.setLock(false);
	}

	/**
	 * 检查结算当月程序
	 * 
	 * @param response
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public synchronized boolean monthlySettleCheck(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Debug.logInfo("月结操作开始~~~~~~~", module);
		// 判断request结算年月
		Object yearStr = request.getAttribute("year");
		Object monthStr = request.getAttribute("month");
		if (yearStr == null || monthStr == null) {
			throw new Exception("结算年月为空");
		}
		// TODO 结算当期
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();

			// 锁住系统
			lockSystem();

			// 获取系统本期所有业务单据，按提交时间升序排序
			List<GenericValue> seqBillValueList = getSeqBillValue();

			// 清空所有单价表信息到月初状态
			clearMidTable();

			// 按顺序进行业务处理
			processCalItem(seqBillValueList);

			TransactionUtil.rollback(beganTransaction, "结算检查完成，未发现异常，进行回滚操作！", new Exception("结算检查完成，未发现异常，进行回滚操作！"));

		} catch (Exception e) {
			Debug.logError(e, module);
			try {
				TransactionUtil.rollback(beganTransaction, e.getMessage(), e);
			} catch (GenericTransactionException e2) {
				Debug.logError(e2, "Unable to rollback transaction", module);
			}
			Debug.logInfo("月结操作出错~~~~~~~", module);
			throw e;
		} finally {
			// 释放系统
			unlockSystem();
		}
		return true;
	}

	/**
	 * 结算当月，计算所有物料出库单价 当月操作年月设置为一下月
	 * 
	 * @param response
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public synchronized boolean monthlySettle(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Debug.logInfo("月结操作开始~~~~~~~", module);
		// 判断request结算年月
		Object yearStr = request.getAttribute("year");
		Object monthStr = request.getAttribute("month");
		if (yearStr == null || monthStr == null) {
			throw new Exception("结算年月为空");
		}
		if (Integer.valueOf(yearStr.toString()) != year || Integer.valueOf(monthStr.toString()) != month) {
			throw new Exception("结算年月不是当前期间");
		}
		// TODO 结算当期
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();

			// 锁住系统
			lockSystem();

			checkCanSettle();

			// 获取系统本期所有业务单据，按提交时间升序排序
			List<GenericValue> seqBillValueList = getSeqBillValue();

			// 清空所有单价表信息到月初状态
			clearMidTable();

			// 按顺序进行业务处理
			processCalItem(seqBillValueList);

			// 将所有单价表结算到下一个月
			settleMidTable();

			// 修改系统当前期间，滚动到下一个月
			stepToNextPeriod();

			// 提交事务
			TransactionUtil.commit(beganTransaction);

			// 单价计算更新
			PriceMgr.getInstance().refreshPeriod();
			ConsignPriceMgr.getInstance().refreshPeriod();
			ConsignProcessedPriceMgr.getInstance().refreshPeriod();
			PurchasePriceMgr.getInstance().refreshPeriod();
			// ProductPriceMgr.getInstance().refreshPeriod();
			WorkshopPriceMgr.getInstance().refreshPeriod();

		} catch (Exception e) {
			Debug.logError(e, module);
			try {
				TransactionUtil.rollback(beganTransaction, e.getMessage(), e);
			} catch (GenericTransactionException e2) {
				Debug.logError(e2, "Unable to rollback transaction", module);
			}
			Debug.logInfo("月结操作出错~~~~~~~", module);
			throw e;
		} finally {
			// 释放系统
			unlockSystem();
		}
		Debug.logInfo("月结操作结束~~~~~~~", module);
		return true;
	}

	/**
	 * 检查是否满足月结条件 1. 判断是否
	 * 
	 * @throws Exception
	 */
	private void checkCanSettle() throws Exception {
		Debug.logInfo("检查是否当前期间的保存单据，操作开始~~~~~~", module);
		// 过滤条件 ,系统期间时间段，单据状态为保存状态(0)
		Calendar cal = Calendar.getInstance();
		cal.set(year, month - 1, 1, 0, 0, 0);
		cal.set(Calendar.MILLISECOND, 0);
		Date fromDate = cal.getTime();
		cal.add(Calendar.MONTH, 1);
		Date endDate = cal.getTime();
		List<EntityCondition> condList = new ArrayList<EntityCondition>();
		condList.add(EntityCondition.makeCondition("bizDate", EntityOperator.GREATER_THAN_EQUAL_TO, new Timestamp(fromDate.getTime())));
		condList.add(EntityCondition.makeCondition("bizDate", EntityOperator.LESS_THAN, new Timestamp(endDate.getTime())));
		condList.add(EntityCondition.makeCondition("status", EntityOperator.EQUALS, 0));
		EntityCondition cond = EntityCondition.makeCondition(condList);

		if (checkExist("PurchaseWarehousing", cond))
			throw new Exception("本期间存在保存状态的采购入库单，不能进行结算！！");

		if (checkExist("PurchaseReturn", cond))
			throw new Exception("本期间存在保存状态的采购退库单，不能进行结算！！");

		if (checkExist("ConsignDrawMaterial", cond))
			throw new Exception("本期间保存提交状态的委外领料单，不能进行结算！！");

		if (checkExist("ConsignReturnMaterial", cond))
			throw new Exception("本期间保存提交状态的委外退料单，不能进行结算！！");

		if (checkExist("ConsignWarehousing", cond))
			throw new Exception("本期间存在保存状态的委外入库单，不能进行结算！！");

		if (checkExist("ConsignReturnProduct", cond))
			throw new Exception("本期间存在保存状态的委外退货单，不能进行结算！！");

		if (checkExist("WorkshopDrawMaterial", cond))
			throw new Exception("本期间存在保存状态的车间领料单，不能进行结算！！");

		if (checkExist("WorkshopReturnMaterial", cond))
			throw new Exception("本期间存在保存状态的车间退料单，不能进行结算！！");

		if (checkExist("WorkshopWarehousing", cond))
			throw new Exception("本期间存在保存状态的车间入库单，不能进行结算！！");

		if (checkExist("WorkshopReturnProduct", cond))
			throw new Exception("本期间存在保存状态的车间退库单，不能进行结算！！");

		if (checkExist("WorkshopOtherDrawBill", cond))
			throw new Exception("本期间存在保存状态的车间其它领料单，不能进行结算！！");

		if (checkExist("ReturnProductWarehousing", cond))
			throw new Exception("本期间存在保存状态的进货单，不能进行结算！！");

		if (checkExist("StockAdjust", cond))
			throw new Exception("本期间存在保存状态的仓库调整单，不能进行结算！！");

		if (checkExist("WorkshopStockAdjust", cond))
			throw new Exception("本期间存在保存状态的车间调整单，不能进行结算！！");

		if (checkExist("SupplierStockAdjust", cond))
			throw new Exception("本期间存在保存状态的供应商调整单，不能进行结算！！");

		if (checkExist("ProductInwarehouse", cond))
			throw new Exception("本期间存在保存状态的成品进仓单，不能进行结算！！");

		if (checkExist("ProductOutwarehouse", cond))
			throw new Exception("本期间存在保存状态的成品出仓单，不能进行结算！！");

		if (checkExist("ProductManualOutwarehouse", cond))
			throw new Exception("本期间存在保存状态的成品手工出仓单，不能进行结算！！");

		Debug.logInfo("检查是否当前期间的保存单据，操作结束~~~~~~", module);

	}

	/**
	 * 获取系统所有业务单据，按时间升序排序
	 * 
	 * @return
	 */
	private List<GenericValue> getSeqBillValue() throws Exception {
		Debug.logInfo("获取系统所有业务单据，按时间升序排序，操作开始~~~~~~~", module);
		List<GenericValue4Compare> allBillList = new ArrayList<GenericValue4Compare>();
		// 过滤条件 ,系统期间时间段，单据状态为提交状态(4)
		Calendar cal = Calendar.getInstance();
		cal.set(year, month - 1, 1, 0, 0, 0);
		Date fromDate = cal.getTime();
		cal.add(Calendar.MONTH, 1);
		Date endDate = cal.getTime();
		List<EntityCondition> condList = new ArrayList<EntityCondition>();
		condList.add(EntityCondition.makeCondition("bizDate", EntityOperator.GREATER_THAN_EQUAL_TO, new Timestamp(fromDate.getTime())));
		condList.add(EntityCondition.makeCondition("bizDate", EntityOperator.LESS_THAN, new Timestamp(endDate.getTime())));
		condList.add(EntityCondition.makeCondition("status", EntityOperator.EQUALS, 4));
		EntityCondition composeCond = EntityCondition.makeCondition(condList);

		// 采购入库单
		mergeCompareValue("PurchaseWarehousing", composeCond, allBillList);

		// 采购退库
		mergeCompareValue("PurchaseReturn", composeCond, allBillList);

		// 委外领料
		mergeCompareValue("ConsignDrawMaterial", composeCond, allBillList);

		// 委外退料
		mergeCompareValue("ConsignReturnMaterial", composeCond, allBillList);

		// 委外入库
		mergeCompareValue("ConsignWarehousing", composeCond, allBillList);

		// 委外退货
		mergeCompareValue("ConsignReturnProduct", composeCond, allBillList);

		// 车间领料
		mergeCompareValue("WorkshopDrawMaterial", composeCond, allBillList);

		// 车间退料
		mergeCompareValue("WorkshopReturnMaterial", composeCond, allBillList);

		// 车间入库
		mergeCompareValue("WorkshopWarehousing", composeCond, allBillList);

		// 车间退货
		mergeCompareValue("WorkshopReturnProduct", composeCond, allBillList);

		// 车间退货
		mergeCompareValue("WorkshopOtherDrawBill", composeCond, allBillList);

		// 进货单
		mergeCompareValue("ReturnProductWarehousing", composeCond, allBillList);

		// 库存调整单
		mergeCompareValue("StockAdjust", composeCond, allBillList);

		// 车间调整单
		mergeCompareValue("WorkshopStockAdjust", composeCond, allBillList);

		// 供应商调整单
		mergeCompareValue("SupplierStockAdjust", composeCond, allBillList);

		// 成品进仓单
		mergeCompareValue("ProductInwarehouse", composeCond, allBillList);

		// 成品出仓单
		mergeCompareValue("ProductOutwarehouse", composeCond, allBillList);

		// 成品手工出仓单
		mergeCompareValue("ProductManualOutwarehouse", composeCond, allBillList);

		// 排序单据
		Object[] billsArr = allBillList.toArray();
		Arrays.sort(billsArr);

		// 封装单据返回
		List<GenericValue> seqList = new ArrayList<GenericValue>();
		for (int i = 0; i < billsArr.length; i++) {
			seqList.add(((GenericValue4Compare) billsArr[i]).getValue());
		}

		Debug.logInfo("获取系统所有业务单据，按时间升序排序，操作结束~~~~~~", module);
		return seqList;
	}

	/**
	 * 清空中间表为月初状态
	 */
	private void clearMidTable() throws Exception {
		Debug.logInfo("清空中间表为月初状态，操作开始~~~~~~~", module);
		Connection conn = ConnectionFactory.getConnection(org.ofbiz.partner.scm.common.Utils.getConnectionHelperName());

		try {
			// 当前余额表CurMaterialBalance 【inVolume、inSum、outVolume、outSum】设置为零
			// 【volume=beginvolume、totalSum=beginsum】
			Debug.logInfo("执行update cur_material_balance set in_Volume=0 ,in_Sum=0,out_Volume=0,out_Sum=0,volume=beginvolume,total_Sum=beginsum ", module);
			PreparedStatement ps = conn.prepareStatement("update cur_material_balance set in_Volume=0 ,in_Sum=0,out_Volume=0,out_Sum=0,volume=beginvolume,total_Sum=beginsum ");
			ps.executeUpdate();

			// 当前委外单价中间表CurConsignPrice 【volume=beginvolume、totalsum=beginsum】
			Debug.logInfo("执行update Cur_Consign_Price set volume=beginvolume,totalsum=beginsum ", module);
			ps = conn.prepareStatement("update Cur_Consign_Price set volume=beginvolume,totalsum=beginsum ");
			ps.executeUpdate();

			// 当前委外加工件数量中间表CurConsignProcessedPrice【outVolume=0、inVolume=0、inSum=0、volume=beginvolume】
			Debug.logInfo("执行update Cur_Consign_Processed_Price set out_Volume=0,in_Volume=0,in_Sum=0,volume=beginvolume ", module);
			ps = conn.prepareStatement("update Cur_Consign_Processed_Price set out_Volume=0,in_Volume=0,in_Sum=0,volume=beginvolume ");
			ps.executeUpdate();

			// 当前采购对数中间表CurPurchasePrice【out_Volume=0,in_Volume=0,entry_Sum=0,volume=0】
			Debug.logInfo("执行update Cur_Purchase_Price set out_Volume=0,in_Volume=0,entry_Sum=0,volume=0 ", module);
			ps = conn.prepareStatement("update Cur_Purchase_Price set out_Volume=0,in_Volume=0,entry_Sum=0,volume=0 ");
			ps.executeUpdate();

			// 当前车间单价中间表CurWorkshopPrice 【volume=beginvolume、totalSum=beginsum】
			Debug.logInfo("执行update Cur_Workshop_Price set volume=beginvolume,totalsum=beginsum ", module);
			ps = conn.prepareStatement("update Cur_Workshop_Price set volume=beginvolume,totalsum=beginsum ");
			ps.executeUpdate();

			// //当前成品单价中间表CurProductPrice 【volume=beginvolume、totalSum=beginsum】
			// Debug.logInfo("执行update Cur_Product_Price set volume=beginvolume,totalsum=beginsum ",
			// module);
			// ps=conn.prepareStatement("update Cur_Product_Price set volume=beginvolume,totalsum=beginsum ");
			// ps.executeUpdate();

		} finally {
			if (conn != null) {
				conn.close();
			}
		}
		Debug.logInfo("清空中间表为月初状态，操作结束~~~~~~", module);
	}

	/**
	 * 按业务顺序重算
	 * 
	 * @param seqBillValueList
	 */
	private void processCalItem(List<GenericValue> seqBillValueList) throws Exception {
		Debug.logInfo("重算业务，操作开始~~~~~~~", module);
		if (seqBillValueList == null || seqBillValueList.size() < 1) {
			throw new Exception("业务单据顺序列表为空！！！！！");
		}

		for (GenericValue bill : seqBillValueList) {
			String entityName = bill.getEntityName();
			Debug.logInfo("开始模型：" + entityName + "，单据编码：" + bill.getString("number") + "，提交时间：" + ((Date) bill.get("submitStamp")).toString() + "单据的提交", module);
			IBizStock iBiz = getBizImpByName(entityName);
			iBiz.updateStock(bill, isOutByName(entityName), false);
			Debug.logInfo("完成模型：" + entityName + "，单据编码：" + bill.getString("number") + "，提交时间：" + ((Date) bill.get("submitStamp")).toString() + "单据的提交", module);
		}
		Debug.logInfo("重算业务，操作结束~~~~~~~", module);
	}

	/**
	 * 根据实体名称获取是否出入库
	 * 
	 * @param en
	 * @return
	 * @throws Exception
	 */
	private boolean isOutByName(String en) throws Exception {
		if (en.equalsIgnoreCase("PurchaseWarehousing")) {// 采购入库
			return false;

		} else if (en.equalsIgnoreCase("PurchaseReturn")) {// 采购退货
			return true;

		} else if (en.equalsIgnoreCase("ConsignDrawMaterial")) {// 委外领料
			return true;

		} else if (en.equalsIgnoreCase("ConsignReturnMaterial")) {// 委外退料
			return false;

		} else if (en.equalsIgnoreCase("ConsignWarehousing")) {// 委外入库
			return false;

		} else if (en.equalsIgnoreCase("ConsignReturnProduct")) {// 委外退库
			return true;

		} else if (en.equalsIgnoreCase("WorkshopDrawMaterial")) {// 车间领料
			return true;

		} else if (en.equalsIgnoreCase("WorkshopReturnMaterial")) {// 车间退料
			return false;

		} else if (en.equalsIgnoreCase("WorkshopReturnProduct")) {// 车间退库
			return true;

		} else if (en.equalsIgnoreCase("WorkshopWarehousing")) {// 车间入库
			return false;

		} else if (en.equalsIgnoreCase("WorkshopOtherDrawBill")) {// 车间其它领料
			return true;

		} else if (en.equalsIgnoreCase("ReturnProductWarehousing")) {// 进货单
			return false;

		} else if (en.equalsIgnoreCase("StockAdjust")) {// 仓库调整单
			return false;

		} else if (en.equalsIgnoreCase("WorkshopStockAdjust")) {// 车间调整单
			return false;

		} else if (en.equalsIgnoreCase("SupplierStockAdjust")) {// 供应商调整单
			return false;

		} else if (en.equalsIgnoreCase("ProductInwarehouse")) {// 成品进仓单
			return false;

		} else if (en.equalsIgnoreCase("ProductOutwarehouse")) {// 成品出仓单
			return true;

		} else if (en.equalsIgnoreCase("ProductManualOutwarehouse")) {// 成品手工出仓单
			return true;

		} else {
			throw new Exception("没有对应的业务实现类");
		}
	}

	/**
	 * 根据实体名称取业务实现类
	 * 
	 * @param en
	 * @return
	 * @throws Exception
	 */
	private IBizStock getBizImpByName(String en) throws Exception {
		if (en.equalsIgnoreCase("PurchaseWarehousing")) {// 采购入库
			return BizStockImpFactory.getBizStockImp(BillType.PurchaseWarehouse);

		} else if (en.equalsIgnoreCase("PurchaseReturn")) {// 采购退货
			return BizStockImpFactory.getBizStockImp(BillType.PurchaseReturn);

		} else if (en.equalsIgnoreCase("ConsignDrawMaterial")) {// 委外领料
			return BizStockImpFactory.getBizStockImp(BillType.ConsignDrawMaterial);

		} else if (en.equalsIgnoreCase("ConsignReturnMaterial")) {// 委外退料
			return BizStockImpFactory.getBizStockImp(BillType.ConsignReturnMaterial);

		} else if (en.equalsIgnoreCase("ConsignWarehousing")) {// 委外入库
			return BizStockImpFactory.getBizStockImp(BillType.ConsignWarehousing);

		} else if (en.equalsIgnoreCase("ConsignReturnProduct")) {// 委外退库
			return BizStockImpFactory.getBizStockImp(BillType.ConsignReturnProduct);

		} else if (en.equalsIgnoreCase("WorkshopDrawMaterial")) {// 车间领料
			return BizStockImpFactory.getBizStockImp(BillType.WorkshopDrawMaterial);

		} else if (en.equalsIgnoreCase("WorkshopReturnMaterial")) {// 车间退料
			return BizStockImpFactory.getBizStockImp(BillType.WorkshopReturnMaterial);

		} else if (en.equalsIgnoreCase("WorkshopReturnProduct")) {// 车间退库
			return BizStockImpFactory.getBizStockImp(BillType.WorkshopReturnProduct);

		} else if (en.equalsIgnoreCase("WorkshopWarehousing")) {// 车间入库
			return BizStockImpFactory.getBizStockImp(BillType.WorkshopWarehousing);

		} else if (en.equalsIgnoreCase("WorkshopOtherDrawBill")) {// 车间其它领料
			return BizStockImpFactory.getBizStockImp(BillType.WorkshopOtherDrawBill);

		} else if (en.equalsIgnoreCase("ReturnProductWarehousing")) {// 进货单
			return BizStockImpFactory.getBizStockImp(BillType.ReturnProductWarehousing);

		} else if (en.equalsIgnoreCase("StockAdjust")) {// 仓库调整单
			return BizStockImpFactory.getBizStockImp(BillType.StockAdjust);

		} else if (en.equalsIgnoreCase("WorkshopStockAdjust")) {// 车间调整单
			return BizStockImpFactory.getBizStockImp(BillType.WorkshopStockAdjust);

		} else if (en.equalsIgnoreCase("SupplierStockAdjust")) {// 供应商调整单
			return BizStockImpFactory.getBizStockImp(BillType.SupplierStockAdjust);

		} else if (en.equalsIgnoreCase("ProductInwarehouse")) {// 成品进仓单
			return BizStockImpFactory.getBizStockImp(BillType.ProductWarehouse);

		} else if (en.equalsIgnoreCase("ProductOutwarehouse")) {// 成品出仓单
			return BizStockImpFactory.getBizStockImp(BillType.ProductOutwarehouse);

		} else if (en.equalsIgnoreCase("ProductManualOutwarehouse")) {// 成品手工出仓单
			return BizStockImpFactory.getBizStockImp(BillType.ProductManualOutwarehouse);

		} else {
			throw new Exception("没有对应的业务实现类");
		}
	}

	/**
	 * 设置单价表到下一个月状态
	 */
	private void settleMidTable() throws Exception {
		Debug.logInfo("设置中间表到下一个月状态，操作开始", module);
		Connection conn = ConnectionFactory.getConnection(org.ofbiz.partner.scm.common.Utils.getConnectionHelperName());
		int yearOfnextMonth = Utils.getYearOfNextMonth(year, month);
		int monthOfnextMonth = Utils.getMonthOfNextMonth(year, month);
		try {
			// 当前余额表CurMaterialBalance 转移到历史表 ，当前余额表【in_Volume=0
			// ,in_Sum=0,out_Volume=0,out_Sum=0,beginvolume=volume,beginsum=total_Sum】
			Debug.logInfo("执行delete from  his_material_balance where year=" + year + " and month=" + month, module);
			PreparedStatement ps = conn.prepareStatement("delete from  his_material_balance where year=" + year + " and month=" + month);
			ps.executeUpdate();
			Debug.logInfo("执行insert his_material_balance select * from cur_material_balance", module);
			ps = conn.prepareStatement("insert his_material_balance select * from cur_material_balance");
			ps.executeUpdate();
			Debug.logInfo("执行update cur_material_balance set year=" + yearOfnextMonth + " ,month=" + monthOfnextMonth
					+ " ,in_Volume=0 ,in_Sum=0,out_Volume=0,out_Sum=0,beginvolume=volume,beginsum=total_Sum", module);
			ps = conn.prepareStatement("update cur_material_balance set year=" + yearOfnextMonth + " ,month=" + monthOfnextMonth
					+ " ,in_Volume=0 ,in_Sum=0,out_Volume=0,out_Sum=0,beginvolume=volume,beginsum=total_Sum");
			ps.executeUpdate();

			// 当前委外单价中间表CurConsignPrice数据转移到历史表，当前余额表更新【年、月、期初数量、期初金额】
			Debug.logInfo("执行delete from  His_Consign_Price where year=" + year + " and month=" + month, module);
			ps = conn.prepareStatement("delete from  His_Consign_Price where year=" + year + " and month=" + month);
			ps.executeUpdate();
			Debug.logInfo("执行insert His_Consign_Price select * from Cur_Consign_Price", module);
			ps = conn.prepareStatement("insert His_Consign_Price select * from Cur_Consign_Price");
			ps.executeUpdate();
			Debug.logInfo("执行update Cur_Consign_Price set year=" + yearOfnextMonth + " ,month=" + monthOfnextMonth + " , beginvolume=volume,beginsum=totalsum", module);
			ps = conn.prepareStatement("update Cur_Consign_Price set year=" + yearOfnextMonth + " ,month=" + monthOfnextMonth + " , beginvolume=volume,beginsum=totalsum");
			ps.executeUpdate();

			// 当前委外加工件数量中间表CurConsignProcessedPrice数据转移到历史表，当前余额表更新【年、月、期初数量】
			Debug.logInfo("执行delete from  His_Consign_Processed_Price where year=" + year + " and month=" + month, module);
			ps = conn.prepareStatement("delete from  His_Consign_Processed_Price where year=" + year + " and month=" + month);
			ps.executeUpdate();
			Debug.logInfo("执行insert His_Consign_Processed_Price select * from Cur_Consign_Processed_Price", module);
			ps = conn.prepareStatement("insert His_Consign_Processed_Price select * from Cur_Consign_Processed_Price");
			ps.executeUpdate();
			Debug.logInfo("执行update Cur_Consign_Processed_Price set year=" + yearOfnextMonth + " ,month=" + monthOfnextMonth + " ,  out_Volume=0,in_Volume=0,in_Sum=0,beginvolume=volume ", module);
			ps = conn.prepareStatement("update Cur_Consign_Processed_Price set year=" + yearOfnextMonth + " ,month=" + monthOfnextMonth + " ,  out_Volume=0,in_Volume=0,in_Sum=0,beginvolume=volume ");
			ps.executeUpdate();

			// 当前采购对数中间表CurPurchasePrice数据转移到历史表，当前余额表更新【年、月、期初数量】
			Debug.logInfo("执行delete from  His_Purchase_Price where year=" + year + " and month=" + month, module);
			ps = conn.prepareStatement("delete from  His_Purchase_Price where year=" + year + " and month=" + month);
			ps.executeUpdate();
			Debug.logInfo("执行insert His_Purchase_Price select * from Cur_Purchase_Price", module);
			ps = conn.prepareStatement("insert His_Purchase_Price select * from Cur_Purchase_Price");
			ps.executeUpdate();
			Debug.logInfo("执行update Cur_Purchase_Price set year=" + yearOfnextMonth + " ,month=" + monthOfnextMonth + " ,  out_Volume=0,in_Volume=0,entry_Sum=0,volume=0 ", module);
			ps = conn.prepareStatement("update Cur_Purchase_Price set year=" + yearOfnextMonth + " ,month=" + monthOfnextMonth + " ,  out_Volume=0,in_Volume=0,entry_Sum=0,volume=0 ");
			ps.executeUpdate();

			// 当前车间单价中间表CurWorkshopPrice 数据转移到历史表，当前余额表更新【年、月、期初数量、期初金额】
			Debug.logInfo("执行delete from  His_Workshop_Price where year=" + year + " and month=" + month, module);
			ps = conn.prepareStatement("delete from  His_Workshop_Price where year=" + year + " and month=" + month);
			ps.executeUpdate();
			Debug.logInfo("执行insert His_Workshop_Price select * from Cur_Workshop_Price", module);
			ps = conn.prepareStatement("insert His_Workshop_Price select * from Cur_Workshop_Price");
			ps.executeUpdate();
			Debug.logInfo("执行update Cur_Workshop_Price set year=" + yearOfnextMonth + " ,month=" + monthOfnextMonth + " , beginvolume=volume,beginsum=totalsum", module);
			ps = conn.prepareStatement("update Cur_Workshop_Price set year=" + yearOfnextMonth + " ,month=" + monthOfnextMonth + " , beginvolume=volume,beginsum=totalsum");
			ps.executeUpdate();

			// //当前成品单价中间表CurProductPrice 数据转移到历史表，当前余额表更新【年、月、期初数量、期初金额】
			// Debug.logInfo("执行delete from  His_Product_Price where year="+year+" and month="+month,
			// module);
			// ps=conn.prepareStatement("delete from  His_Product_Price where year="+year+" and month="+month);
			// ps.executeUpdate();
			// Debug.logInfo("执行insert His_Product_Price select * from Cur_Product_Price",
			// module);
			// ps=conn.prepareStatement("insert His_Product_Price select * from Cur_Product_Price");
			// ps.executeUpdate();
			// Debug.logInfo("执行update Cur_Product_Price set year="+yearOfnextMonth+" ,month="+monthOfnextMonth+" , beginvolume=volume,beginsum=totalsum",
			// module);
			// ps=conn.prepareStatement("update Cur_Product_Price set year="+yearOfnextMonth+" ,month="+monthOfnextMonth+" , beginvolume=volume,beginsum=totalsum");
			// ps.executeUpdate();

		} finally {
			if (conn != null) {
				conn.close();
			}
		}
		Debug.logInfo("设置中间表到下一个月状态，操作结束", module);

	}

	/**
	 * 当前期间进入下一个月份
	 */
	private void stepToNextPeriod() throws Exception {
		++month;
		Utils.setCurPeriod(year, month);
	}

	/**
	 * 反结算当期，如果当期有审核的单据，则不能反结算 当月操作年月设置为前一个月
	 * 
	 * @param response
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public synchronized boolean rollbackSettle(HttpServletRequest request, HttpServletResponse response) throws Exception {

		// 判断request结算年月
		Object yearStr = request.getAttribute("year");
		Object monthStr = request.getAttribute("month");
		if (yearStr == null || monthStr == null) {
			throw new Exception("结算年月为空");
		}
		if (Integer.valueOf(yearStr.toString()) != year || Integer.valueOf(monthStr.toString()) != month) {
			throw new Exception("结算年月不是当前期间");
		}
		// TODO 结算当期
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();

			// 锁住系统
			lockSystem();

			// 判断是否能够反结算，是否已经有提交当前期间的业务单据
			checkCanRollback();

			// 清空单价中间表信息,结算中间表到上一个月月末状态
			clearMidTableToPre();

			// 修改系统当前期间，滚动到上一个月
			stepToPrePeriod();

			// 提交事务
			TransactionUtil.commit(beganTransaction);

			// 单价计算更新
			PriceMgr.getInstance().refreshPeriod();
			ConsignPriceMgr.getInstance().refreshPeriod();
			ConsignProcessedPriceMgr.getInstance().refreshPeriod();
			PurchasePriceMgr.getInstance().refreshPeriod();
			// ProductPriceMgr.getInstance().refreshPeriod();
			WorkshopPriceMgr.getInstance().refreshPeriod();

		} catch (Exception e) {
			Debug.logError(e, module);
			try {
				TransactionUtil.rollback(beganTransaction, e.getMessage(), e);
			} catch (GenericTransactionException e2) {
				Debug.logError(e2, "Unable to rollback transaction", module);
			}
			throw e;
		} finally {
			// 释放系统
			unlockSystem();
		}

		return true;
	}

	/**
	 * 系统期间回到上一个月
	 */
	private void stepToPrePeriod() throws Exception {
		--month;
		Utils.setCurPeriod(year, month);
	}

	/**
	 * 检查是否当前期间的提交单据 ,检查当前月份是否是初始化月份
	 */
	private void checkCanRollback() throws Exception {
		boolean isInitPeriod = Utils.isSysInitMonth();
		if (isInitPeriod) {
			throw new Exception("当前月份是初始化月份，不允许反结算！");
		}
		Debug.logInfo("检查是否当前期间的提交单据，操作开始~~~~~~", module);
		// 过滤条件 ,系统期间时间段，单据状态为提交状态(4)
		Calendar cal = Calendar.getInstance();
		cal.set(year, month - 1, 1, 0, 0, 0);
		Date fromDate = cal.getTime();
		cal.add(Calendar.MONTH, 1);
		Date endDate = cal.getTime();
		List<EntityCondition> condList = new ArrayList<EntityCondition>();
		condList.add(EntityCondition.makeCondition("bizDate", EntityOperator.GREATER_THAN_EQUAL_TO, new Timestamp(fromDate.getTime())));
		condList.add(EntityCondition.makeCondition("bizDate", EntityOperator.LESS_THAN, new Timestamp(endDate.getTime())));
		condList.add(EntityCondition.makeCondition("status", EntityOperator.EQUALS, 4));
		EntityCondition cond = EntityCondition.makeCondition(condList);

		if (checkExist("PurchaseWarehousing", cond))
			throw new Exception("本期间存在提交状态的采购入库单，不能进行反结算！！");

		if (checkExist("PurchaseReturn", cond))
			throw new Exception("本期间存在提交状态的采购退库单，不能进行反结算！！");

		if (checkExist("ConsignDrawMaterial", cond))
			throw new Exception("本期间存在提交状态的委外领料单，不能进行反结算！！");

		if (checkExist("ConsignReturnMaterial", cond))
			throw new Exception("本期间存在提交状态的委外退料单，不能进行反结算！！");

		if (checkExist("ConsignWarehousing", cond))
			throw new Exception("本期间存在提交状态的委外入库单，不能进行反结算！！");

		if (checkExist("ConsignReturnProduct", cond))
			throw new Exception("本期间存在提交状态的委外退货单，不能进行反结算！！");

		if (checkExist("WorkshopDrawMaterial", cond))
			throw new Exception("本期间存在提交状态的车间领料单，不能进行反结算！！");

		if (checkExist("WorkshopReturnMaterial", cond))
			throw new Exception("本期间存在提交状态的车间退料单，不能进行反结算！！");

		if (checkExist("WorkshopWarehousing", cond))
			throw new Exception("本期间存在提交状态的车间入库单，不能进行反结算！！");

		if (checkExist("WorkshopReturnProduct", cond))
			throw new Exception("本期间存在提交状态的车间退库单，不能进行反结算！！");

		if (checkExist("WorkshopOtherDrawBill", cond))
			throw new Exception("本期间存在提交状态的车间其它领料单，不能进行反结算！！");

		if (checkExist("ReturnProductWarehousing", cond))
			throw new Exception("本期间存在提交状态的进货单，不能进行反结算！！");

		if (checkExist("StockAdjust", cond))
			throw new Exception("本期间存在提交状态的库存调整单，不能进行反结算！！");

		if (checkExist("WorkshopStockAdjust", cond))
			throw new Exception("本期间存在提交状态的车间调整单，不能进行反结算！！");

		if (checkExist("SupplierStockAdjust", cond))
			throw new Exception("本期间存在提交状态的供应商调整单，不能进行反结算！！");

		if (checkExist("ProductInwarehouse", cond))
			throw new Exception("本期间存在提交状态的成品进仓单，不能进行反结算！！");

		if (checkExist("ProductOutwarehouse", cond))
			throw new Exception("本期间存在提交状态的成品出仓单，不能进行反结算！！");

		if (checkExist("ProductManualOutwarehouse", cond))
			throw new Exception("本期间存在提交状态的成品手工出仓单，不能进行反结算！！");

		Debug.logInfo("检查是否当前期间的提交单据，操作结束~~~~~~", module);

	}

	/**
	 * 检查是否存在记录
	 * 
	 * @param entityName
	 * @param cond
	 * @return
	 */
	private boolean checkExist(String entityName, EntityCondition cond) throws Exception {
		long count = delegator.findCountByCondition(entityName, cond, null, null);
		if (count > 0) {
			return true;
		}
		return false;
	}

	/**
	 * 清除本期间的中间表信息，还原到上一个月
	 */
	private void clearMidTableToPre() throws Exception {

		Connection conn = ConnectionFactory.getConnection(org.ofbiz.partner.scm.common.Utils.getConnectionHelperName());
		// 删除本期数据,转移库存余额表
		copyPreMonthData(conn, "His_Material_Balance", "Cur_Material_Balance");

		// 删除本期数据,转移委外中间表
		copyPreMonthData(conn, "His_Consign_Price", "Cur_Consign_Price");

		// 删除本期数据,转移委外加工件中间表
		copyPreMonthData(conn, "His_Consign_Processed_Price", "Cur_Consign_Processed_Price");

		// 删除本期数据,转移采购对数中间表
		copyPreMonthData(conn, "His_Purchase_Price", "Cur_Purchase_Price");

		// 删除本期数据,转移车间中间表
		copyPreMonthData(conn, "His_Workshop_Price", "Cur_Workshop_Price");

		// 删除本期数据,转移发外加工对数表
		copyPreMonthData(conn, "His_Consign_Processed_Price", "Cur_Consign_Processed_Price");
	}

	/**
	 * 删除当前表数据，拷贝上个月的数据到当前表
	 * 
	 * @param conn
	 * @param string
	 * @param string2
	 */
	private void copyPreMonthData(Connection conn, String hisTable, String targetTable) throws Exception {
		int yearOfnextMonth = Utils.getYearOfPreMonth(year, month);
		int monthOfnextMonth = Utils.getMonthOfPreMonth(year, month);

		Debug.logInfo("执行delete from " + targetTable, module);
		PreparedStatement ps = conn.prepareStatement("delete from " + targetTable);
		ps.executeUpdate();
		Debug.logInfo("执行insert " + targetTable + " select * from " + hisTable + " where year=" + yearOfnextMonth + " and month=" + monthOfnextMonth, module);
		ps = conn.prepareStatement("insert " + targetTable + " select * from " + hisTable + " where year=" + yearOfnextMonth + " and month=" + monthOfnextMonth);
		ps.executeUpdate();

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
	 * 
	 * @param entityName
	 * @param list
	 */
	private void mergeCompareValue(String entityName, EntityCondition composeCond, List<GenericValue4Compare> allBillList) throws Exception {
		List<GenericValue> purInWsList = delegator.findList(entityName, composeCond, null, null, null, false);
		if (purInWsList != null && purInWsList.size() > 0) {
			for (GenericValue v : purInWsList) {
				if (v.getTimestamp("submitStamp") == null)
					throw new Exception("submitStamp is null !!!!!!");
				allBillList.add(new GenericValue4Compare(v, "submitStamp"));
			}
		}
	}

}
