package org.ofbiz.partner.scm.pricemgr.priceCalImp;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.DelegatorFactory;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.sql.EntityViewPlan;
import org.ofbiz.partner.scm.pricemgr.IPriceCal;
import org.ofbiz.partner.scm.pricemgr.PriceCalItem;
import org.ofbiz.partner.scm.pricemgr.Utils;

/**
 * 移动加权平均法实现类
 * 
 * @author Mark
 * 
 */
public class PriceCalImp4WMA implements IPriceCal {
	private static final String module = org.ofbiz.partner.scm.pricemgr.priceCalImp.PriceCalImp4WMA.class.getName();
	private int year, month;// 当期年月
	Delegator delegator = null;

	public PriceCalImp4WMA(int year, int month) {
		delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
		if (delegator == null) {
			Debug.logError("Delegator init error!!!", module);
		}
		this.year = year;
		this.month = month;
	}

	/**
	 * 根据移动加权平均法计算单价
	 */
	public BigDecimal calPrice(PriceCalItem item) throws Exception {
		Debug.logInfo("开始更新库存余额表:", module);
		String mpk = item.getMaterialId();// 获取物料id
		if (mpk == null || mpk.length() < 1) {
			Debug.logError("物料id为空", module);
			throw new Exception("物料id为空");
		}
		if (item.getBizTime() == null) {
			Debug.logError("业务日期为空", module);
			throw new Exception("业务日期为空");
		}
		Calendar cal = Calendar.getInstance();
		cal.setTime(item.getBizTime());
		cal.add(Calendar.MONTH, 1);
		if (cal.get(Calendar.YEAR) != year || (cal.get(Calendar.MONTH)) != month) {
			Debug.logError("计算条目业务日期不是当前期间", module);
			throw new Exception("计算条目业务日期不是当前期间");
		}
		if (item.getAmount() == null) {
			Debug.logError("数量为空", module);
			throw new Exception("数量为空");
		}
		if (item.getSum() == null) {
			Debug.logError("金额为空", module);
			throw new Exception("金额为空");
		}

		// 记录计算的信息
		StringBuffer strbuf = new StringBuffer();
		strbuf.append("物料id:").append(item.getMaterialId());
		strbuf.append(";数量：").append(item.getAmount());
		strbuf.append(";金额：").append(item.getSum());
		Debug.logInfo(strbuf.toString(), module);

		// 取库存余额表
		List<GenericValue> curValueList = delegator.findByAnd("CurMaterialBalance",
				UtilMisc.toMap("year", new Integer(year), "month", new Integer(month), "warehouseId", item.getWarehouseId(), "materialId", item.getMaterialId()));
		GenericValue curValue = null;
		BigDecimal curAmount = null;// 当前数量
		BigDecimal curSum = null;// 当前金额
		BigDecimal calAmount = null;// 计算后数量
		BigDecimal calSum = null;// 计算后金额
		if (curValueList != null && curValueList.size() > 0) {
			// 取第一条匹配记录
			curValue = curValueList.get(0);
			Debug.logInfo("计算前物料数量单价" + curValue.getString("volume") + ";" + curValue.getString("totalSum"), module);
			curAmount = curValue.getBigDecimal("volume");// 设置当前数量
			curSum = curValue.getBigDecimal("totalSum");// 设置当前金额

			BigDecimal amount = item.getAmount();// 数量
			BigDecimal sum = item.getSum();// 金额
			
			calAmount = curAmount.add(amount);// 计算后数量
			calSum = curSum.add(sum);// 计算后金额

			curValue.set("volume", calAmount);
			curValue.set("totalSum", calSum);

			delegator.store(curValue);// 更新当前库存表
		} else {
			Debug.logInfo("库存余额表不存在物料" + item.getMaterialId() + "，添加该物料记录！", module);
			//查找上一个月末数量金额
			GenericValue preMonthValue=delegator.findOne("HisMaterialBalance", UtilMisc.toMap("year", Utils.getYearOfPreMonth(year, month), "month", Utils.getMonthOfPreMonth(year, month), "warehouseId", item.getWarehouseId(), "materialId", item.getMaterialId()), false);
			BigDecimal beginVolume=BigDecimal.ZERO;//月初数量
			BigDecimal beginSum=BigDecimal.ZERO;//月初金额
			if(preMonthValue!=null){
				beginVolume=preMonthValue.getBigDecimal("beginVolume").add(preMonthValue.getBigDecimal("volume"));
				beginSum=preMonthValue.getBigDecimal("beginsum").add(preMonthValue.getBigDecimal("totalSum"));
			}
			
			
			// 如果库存余额表没有改物料，则新增
			curValue = delegator.makeValue("CurMaterialBalance");
			curValue.set("year", year);
			curValue.set("month", month);
			curValue.set("warehouseId", item.getWarehouseId());
			curValue.set("materialId", item.getMaterialId());
			curValue.set("beginvolume", beginVolume);
			curValue.set("beginsum", beginSum);
			curValue.set("volume", item.getAmount());
			curValue.set("totalSum", item.getSum());

			calAmount = item.getAmount();// 计算后数量
			calSum = item.getSum();// 计算后金额

			delegator.create(curValue);// 新增条目
		}
		//返回入库后单价
		if(calAmount.compareTo(BigDecimal.ZERO) == 0){
			return BigDecimal.ZERO;
		}else{
			return calSum.divide(calAmount,4,RoundingMode.HALF_UP);
		}
	}
	
	/**
	 * 根据仓库编码和物料编码获取记录
	 * @param warehouseId
	 * @param materialId
	 * @return
	 * @throws Exception
	 */
	public GenericValue getCurMaterialBalanceValue(String warehouseId, String materialId) throws Exception {
		// 取库存余额表
		List<GenericValue> curValueList = delegator.findByAnd("CurMaterialBalance", UtilMisc.toMap("year", new Integer(year), "month", new Integer(month), "warehouseId", warehouseId, "materialId", materialId));
		if (curValueList != null && curValueList.size() > 0) {
			return curValueList.get(0);
		} else {
			return null;
		}
	}
	
	/**
	 * 获取物料加权平均单价
	 */
	public BigDecimal getPrice(String warehouseId, String materialId) throws Exception {
		GenericValue value = this.getCurMaterialBalanceValue(warehouseId, materialId);
		if(value==null){
			return BigDecimal.ZERO;
		}else{
			if(value.getBigDecimal("volume").compareTo(BigDecimal.ZERO) == 0){
				return BigDecimal.ZERO;
			}else{
				return value.getBigDecimal("totalSum").divide(value.getBigDecimal("volume"),4,RoundingMode.HALF_UP);
			}
		}
	}
}
