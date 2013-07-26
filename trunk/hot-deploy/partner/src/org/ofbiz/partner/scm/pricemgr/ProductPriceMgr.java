package org.ofbiz.partner.scm.pricemgr;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Calendar;
import java.util.List;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.dao.TMaterial;
import org.ofbiz.partner.scm.pricemgr.Utils;

/**
 * 移动加权平均法实现类
 * 
 * 说明：为了避免出库后，金额为负数，出库时，单价计算使用舍弃法保存小数点后六位
 * 
 * @author Jeff
 * 
 */
public class ProductPriceMgr {
	private static final String module = org.ofbiz.partner.scm.pricemgr.priceCalImp.PriceCalImp4WMA.class.getName();
	private int year, month;// 当期年月
	Delegator delegator = null;
	private static ProductPriceMgr instance = null;

	private ProductPriceMgr() {
		refreshPeriod();
	}

	public void refreshPeriod() {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(Utils.getCurDate());
		year = calendar.get(Calendar.YEAR);
		month = calendar.get(Calendar.MONTH) + 1;
		delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
	}
	
	public static ProductPriceMgr getInstance() {
		if (instance == null) {
			instance = new ProductPriceMgr();
		}
		return instance;
	}
	
	public ProductPriceMgr(int year, int month) {
		delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
		if (delegator == null) {
			Debug.logError("Delegator init error!!!", module);
		}
		this.year = year;
		this.month = month;
	}

	/**
	 * 成品出入仓情况
	 * type 1.正常出入仓，2.改板出入仓，3.返工入出仓
	 * warehouseId 仓库编码
	 * materialId 成品编码
	 * volume 出入仓数量，正数为进仓，复数为出仓
	 * totalsum 出入仓金额，正数为进仓，复数为出仓
	 * 
	 */
	public BigDecimal update(String type, String warehouseId, String materialId, BigDecimal volume, BigDecimal totalsum,boolean isOut,boolean isCancel) throws Exception {
		Debug.logInfo("开始更新成品余额表……", module);
		if (type.isEmpty()) {
			Debug.logError("出入仓类型为空！", module);
			throw new Exception("出入仓类型为空！");
		}
		if (warehouseId.isEmpty()) {
			Debug.logError("仓库编码为空！", module);
			throw new Exception("仓库编码为空！");
		}
		if (materialId.isEmpty()) {
			Debug.logError("成品编码为空！ ", module);
			throw new Exception("成品编码为空！");
		}
		if (volume == null) {
			Debug.logError("数量为空！", module);
			throw new Exception("数量为空！");
		}
		if (totalsum == null) {
			Debug.logError("金额为空！", module);
			throw new Exception("金额为空！");
		}
		Debug.logInfo("类型："+type+"仓库编码："+warehouseId+"成品编码："+materialId + "数量："+volume +"金额："+totalsum +"。", module);

		// 取库存余额表
		List<GenericValue> curValueList = delegator.findByAnd("CurProductBalance",UtilMisc.toMap("year", new Integer(year), "month", new Integer(month), "warehouseId", warehouseId, "materialId", materialId));
		GenericValue curValue = null;
		BigDecimal curVolumme = BigDecimal.ZERO;// 当前数量
		BigDecimal curSum = BigDecimal.ZERO;// 当前金额

		BigDecimal calVolumme = BigDecimal.ZERO;// 计算后数量
		BigDecimal calSum = BigDecimal.ZERO;// 计算后金额

		BigDecimal curChangeVolume = BigDecimal.ZERO;// 当前改板数量
		BigDecimal curChangeSum = BigDecimal.ZERO;// 当前改板金额

		BigDecimal calChangeVolume = BigDecimal.ZERO;// 计算后改板数量
		BigDecimal calChangeSum = BigDecimal.ZERO;// 计算后改板金额

		BigDecimal curReworkVolume = BigDecimal.ZERO;// 当前返工数量
		BigDecimal curReworkSum = BigDecimal.ZERO;// 当前返工金额

		BigDecimal calReworkVolume = BigDecimal.ZERO;// 计算后返工数量
		BigDecimal calReworkSum = BigDecimal.ZERO;// 计算后返工金额
		
		if("1".equals(type)){
			BigDecimal curInVolume = BigDecimal.ZERO;// 当前正常收入数量
			BigDecimal curInSum = BigDecimal.ZERO;// 当前正常收入金额
			BigDecimal curOutVolume = BigDecimal.ZERO;// 当前正常发出数量
			BigDecimal curOutSum = BigDecimal.ZERO;// 当前正常发出金额
			
			BigDecimal inVolume = BigDecimal.ZERO;// 计算后正常收入数量
			BigDecimal inSum = BigDecimal.ZERO;// 计算后正常收入金额
			BigDecimal outVolume = BigDecimal.ZERO;// 计算后正常发出数量
			BigDecimal outSum = BigDecimal.ZERO;// 计算后正常发出金额
			
			if (curValueList != null && curValueList.size() > 0) {
				// 取第一条匹配记录
				curValue = curValueList.get(0);
				Debug.logInfo("计算前成品数量单价" + curValue.getString("volume") + ";" + curValue.getString("totalSum"), module);
				
				if(curValue.getBigDecimal("volume") != null){
					curVolumme = curValue.getBigDecimal("volume");// 设置当前数量
				}
				if(curValue.getBigDecimal("totalSum") != null){
					curSum = curValue.getBigDecimal("totalSum");// 设置当前金额
				}
				if(curValue.getBigDecimal("inVolume") != null){
					curInVolume = curValue.getBigDecimal("inVolume");// 设置当前收入金额
				}
				if(curValue.getBigDecimal("inSum") != null){
					curInSum = curValue.getBigDecimal("inSum");// 设置当前收入金额
				}
				if(curValue.getBigDecimal("outVolume") != null){
					curOutVolume = curValue.getBigDecimal("outVolume");// 设置当前发出金额
				}
				if(curValue.getBigDecimal("outSum") != null){
					curOutSum = curValue.getBigDecimal("outSum");// 设置当前发出金额
				}
				
				calVolumme = curVolumme.add(volume);// 计算后数量
				calSum = curSum.add(totalsum);// 计算后金额
				
				if(calVolumme.compareTo(BigDecimal.ZERO) < 0 || calSum.compareTo(BigDecimal.ZERO) < 0){
					throwExceptionOfMaterialNotEnough(materialId);		//库存数量不足，抛出异常
				}
				
				if(isOut == isCancel){//取消操作并非正常出入库
					inVolume = volume;
					inSum = totalsum;
				} else {
					outVolume = volume.negate();
					outSum = totalsum.negate();
				}

				curValue.set("volume", calVolumme);
				curValue.set("totalSum", calSum);
				curValue.set("inVolume", curInVolume.add(inVolume));
				curValue.set("inSum", curInSum.add(inSum));
				curValue.set("outVolume", curOutVolume.add(outVolume));
				curValue.set("outSum", curOutSum.add(outSum));

				delegator.store(curValue);// 更新当前库存表
			} else {
				Debug.logInfo("成品库存余额表不存在成品" + materialId + "，添加该成品记录！", module);
				//查找上一个月末数量金额
				GenericValue preMonthValue=delegator.findOne("HisProductBalance", UtilMisc.toMap("year", Utils.getYearOfPreMonth(year, month), "month", Utils.getMonthOfPreMonth(year, month), "warehouseId", warehouseId, "materialId", materialId), false);
				BigDecimal beginVolume=BigDecimal.ZERO;//月初数量
				BigDecimal beginSum=BigDecimal.ZERO;//月初金额
				
				BigDecimal changeBeginVolume=BigDecimal.ZERO;//改板月初数量
				BigDecimal changeBeginSum=BigDecimal.ZERO;//改板月初金额
				
				BigDecimal reworkBeginVolume=BigDecimal.ZERO;//返工月初数量
				BigDecimal reworkBeginSum=BigDecimal.ZERO;//返工月初金额
				if(preMonthValue!=null){
					beginVolume=preMonthValue.getBigDecimal("volume");
					beginSum=preMonthValue.getBigDecimal("totalSum");
					
					changeBeginVolume=preMonthValue.getBigDecimal("changeVolume");
					changeBeginSum=preMonthValue.getBigDecimal("changeTotalSum");
					
					reworkBeginVolume=preMonthValue.getBigDecimal("reworkVolume");
					reworkBeginSum=preMonthValue.getBigDecimal("reworkTotalSum");
				}
				
				calVolumme = beginVolume.add(volume);// 计算后数量
				calSum = beginSum.add(totalsum);// 计算后金额
				
				// 正常出入仓时候不需要增加
				calChangeVolume = changeBeginVolume;// 计算后改板数量
				calChangeSum = changeBeginSum;// 计算后改板金额

				calReworkVolume = reworkBeginVolume;// 计算后返工数量
				calReworkSum = reworkBeginSum;// 计算后返工金额
				
				if(calVolumme.compareTo(BigDecimal.ZERO)<0 || calSum.compareTo(BigDecimal.ZERO)<0){
					throwExceptionOfMaterialNotEnough(materialId);  //库存数量不足，抛出异常
				}
				
				// 如果库存余额表没有改物料，则新增
				curValue = delegator.makeValue("CurProductBalance");
				curValue.set("year", year);
				curValue.set("month", month);
				curValue.set("warehouseId", warehouseId);
				curValue.set("materialId", materialId);
				curValue.set("beginvolume", beginVolume);
				curValue.set("beginsum", beginSum);
				curValue.set("volume", calVolumme);	//期初数量加当前数量
				curValue.set("totalSum", calSum);	//期初金额加当前金额
				
				if(isOut){
					outVolume = volume.negate();
					outSum = totalsum.negate();
				} else {
					inVolume = volume;
					inSum = totalsum;
				}
				curValue.set("inVolume", inVolume);
				curValue.set("inSum", inSum);
				curValue.set("outVolume", outVolume);
				curValue.set("outSum", outSum);

				curValue.set("changeBeginVolume", changeBeginVolume);
				curValue.set("changeBeginSum", changeBeginSum);
				curValue.set("changeInVolume", BigDecimal.ZERO);
				curValue.set("changeInSum", BigDecimal.ZERO);
				curValue.set("changeOutVolume", BigDecimal.ZERO);
				curValue.set("changeOutSum", BigDecimal.ZERO);
				curValue.set("changeVolume", calChangeVolume);	//期初数量
				curValue.set("changeTotalSum", calChangeSum);	//期初金额
				
				curValue.set("reworkBeginVolume", reworkBeginVolume);
				curValue.set("reworkBeginSum", reworkBeginSum);
				curValue.set("reworkInVolume", BigDecimal.ZERO);
				curValue.set("reworkInSum", BigDecimal.ZERO);
				curValue.set("reworkOutVolume", BigDecimal.ZERO);
				curValue.set("reworkOutSum", BigDecimal.ZERO);
				curValue.set("reworkVolume", calReworkVolume);	//期初数量
				curValue.set("reworkTotalSum", calReworkSum);	//期初金额
				
				delegator.create(curValue);// 新增条目
			}
			
		}else if("2".equals(type)){
			BigDecimal curChangeInVolume = BigDecimal.ZERO;// 当前改板收入数量
			BigDecimal curChangeInSum = BigDecimal.ZERO;// 当前改板收入金额
			BigDecimal curChangeOutVolume = BigDecimal.ZERO;// 当前改板发出数量
			BigDecimal curChangeOutSum = BigDecimal.ZERO;// 当前改板发出金额
			
			BigDecimal changeInVolume = BigDecimal.ZERO;// 计算后改板收入数量
			BigDecimal changeInSum = BigDecimal.ZERO;// 计算后改板收入金额
			BigDecimal changeOutVolume = BigDecimal.ZERO;// 计算后改板发出数量
			BigDecimal changeOutSum = BigDecimal.ZERO;// 计算后改板发出金额
			
			
			if (curValueList != null && curValueList.size() > 0) {
				// 取第一条匹配记录
				curValue = curValueList.get(0);
				Debug.logInfo("计算前成品数量单价" + curValue.getString("volume") + ";" + curValue.getString("totalSum"), module);
				
				if(curValue.getBigDecimal("volume") != null){
					curVolumme = curValue.getBigDecimal("volume");// 设置当前数量
				}
				if(curValue.getBigDecimal("totalSum") != null){
					curSum = curValue.getBigDecimal("totalSum");// 设置当前金额
				}
				
				if(curValue.getBigDecimal("changeVolume") != null){
					curChangeVolume = curValue.getBigDecimal("changeVolume");// 设置当前改板数量
				}
				if(curValue.getBigDecimal("changeTotalSum") != null){
					curChangeSum = curValue.getBigDecimal("changeTotalSum");// 设置当前改板金额
				}
				if(curValue.getBigDecimal("changeInVolume") != null){
					curChangeInVolume = curValue.getBigDecimal("changeInVolume");// 设置当前改板收入金额
				}
				if(curValue.getBigDecimal("changeInSum") != null){
					curChangeInSum = curValue.getBigDecimal("changeInSum");// 设置当前改板收入金额
				}
				if(curValue.getBigDecimal("changeOutVolume") != null){
					curChangeOutVolume = curValue.getBigDecimal("changeOutVolume");// 设置当前改板发出金额
				}
				if(curValue.getBigDecimal("changeOutSum") != null){
					curChangeOutSum = curValue.getBigDecimal("changeOutSum");// 设置当前改板发出金额
				}
				
				calVolumme = curVolumme.add(volume);// 计算后数量
				calSum = curSum.add(totalsum);// 计算后金额
				
				calChangeVolume = curChangeVolume.add(volume);// 计算后改板数量
				calChangeSum = curChangeSum.add(totalsum);// 计算后改板金额
				
				if(calVolumme.compareTo(BigDecimal.ZERO) < 0 || calSum.compareTo(BigDecimal.ZERO) < 0){
					throwExceptionOfMaterialNotEnough(materialId);		//库存数量不足，抛出异常
				}
				
//				if(calChangeVolume.compareTo(BigDecimal.ZERO) > 0 ){
//					throwExceptionOfMaterialNotEnoughOther(materialId,"改板");		//出仓数量不足，抛出异常
//				}
				
				if(isOut == isCancel){//取消操作并非正常出入库
					changeInVolume = volume;
					changeInSum = totalsum;
				} else {
					changeOutVolume = volume.negate();
					changeOutSum = totalsum.negate();
				}

				curValue.set("volume", calVolumme);
				curValue.set("totalSum", calSum);

				curValue.set("changeVolume", calChangeVolume);
				curValue.set("changeTotalSum", calChangeSum);
				
				curValue.set("changeInVolume", curChangeInVolume.add(changeInVolume));
				curValue.set("changeInSum", curChangeInSum.add(changeInSum));
				curValue.set("changeOutVolume", curChangeOutVolume.add(changeOutVolume));
				curValue.set("changeOutSum", curChangeOutSum.add(changeOutSum));

				delegator.store(curValue);// 更新当前库存表
			} else {
				Debug.logInfo("成品库存余额表不存在成品" + materialId + "，添加该成品记录！", module);
				//查找上一个月末数量金额
				GenericValue preMonthValue=delegator.findOne("HisProductBalance", UtilMisc.toMap("year", Utils.getYearOfPreMonth(year, month), "month", Utils.getMonthOfPreMonth(year, month), "warehouseId", warehouseId, "materialId", materialId), false);
				BigDecimal beginVolume=BigDecimal.ZERO;//月初数量
				BigDecimal beginSum=BigDecimal.ZERO;//月初金额
				
				BigDecimal changeBeginVolume=BigDecimal.ZERO;//改板月初数量
				BigDecimal changeBeginSum=BigDecimal.ZERO;//改板月初金额
				
				BigDecimal reworkBeginVolume=BigDecimal.ZERO;//返工月初数量
				BigDecimal reworkBeginSum=BigDecimal.ZERO;//返工月初金额
				if(preMonthValue!=null){
					beginVolume=preMonthValue.getBigDecimal("volume");
					beginSum=preMonthValue.getBigDecimal("totalSum");
					
					changeBeginVolume=preMonthValue.getBigDecimal("changeVolume");
					changeBeginSum=preMonthValue.getBigDecimal("changeTotalSum");
					
					reworkBeginVolume=preMonthValue.getBigDecimal("reworkVolume");
					reworkBeginSum=preMonthValue.getBigDecimal("reworkTotalSum");
				}
				
				calVolumme = beginVolume.add(volume);// 计算后数量
				calSum = beginSum.add(totalsum);// 计算后金额
				
				calChangeVolume = changeBeginVolume.add(volume);// 计算后数量
				calChangeSum = changeBeginSum.add(totalsum);// 计算后金额

				calReworkVolume = reworkBeginVolume;// 计算后数量
				calReworkSum = reworkBeginSum;// 计算后金额
				
				if(calVolumme.compareTo(BigDecimal.ZERO)<0 || calSum.compareTo(BigDecimal.ZERO)<0){
					throwExceptionOfMaterialNotEnough(materialId);  //库存数量不足，抛出异常
				}
				
//				if(calChangeVolume.compareTo(BigDecimal.ZERO) > 0 ){
//					throwExceptionOfMaterialNotEnoughOther(materialId,"改板");		//出仓数量不足，抛出异常
//				}
				
				// 如果库存余额表没有改物料，则新增
				curValue = delegator.makeValue("CurProductBalance");
				curValue.set("year", year);
				curValue.set("month", month);
				curValue.set("warehouseId", warehouseId);
				curValue.set("materialId", materialId);
				curValue.set("beginvolume", beginVolume);
				curValue.set("beginsum", beginSum);
				curValue.set("volume", calVolumme);	//期初数量加当前数量
				curValue.set("totalSum", calSum);	//期初金额加当前金额
				
				if(isOut){
					changeOutVolume = volume.negate();
					changeOutSum = totalsum.negate();
				} else {
					changeInVolume = volume;
					changeInSum = totalsum;
				}
				curValue.set("inVolume", BigDecimal.ZERO);
				curValue.set("inSum", BigDecimal.ZERO);
				curValue.set("outVolume", BigDecimal.ZERO);
				curValue.set("outSum", BigDecimal.ZERO);

				curValue.set("changeBeginVolume", changeBeginVolume);
				curValue.set("changeBeginSum", changeBeginSum);
				curValue.set("changeInVolume", changeInVolume);
				curValue.set("changeInSum", changeInSum);
				curValue.set("changeOutVolume", changeOutVolume);
				curValue.set("changeOutSum", changeOutSum);
				curValue.set("changeVolume", calChangeVolume);	//期初数量
				curValue.set("changeTotalSum", calChangeSum);	//期初金额
				
				curValue.set("reworkBeginVolume", reworkBeginVolume);
				curValue.set("reworkBeginSum", reworkBeginSum);
				curValue.set("reworkInVolume", BigDecimal.ZERO);
				curValue.set("reworkInSum", BigDecimal.ZERO);
				curValue.set("reworkOutVolume", BigDecimal.ZERO);
				curValue.set("reworkOutSum", BigDecimal.ZERO);
				curValue.set("reworkVolume", calReworkVolume);	//期初数量
				curValue.set("reworkTotalSum", calReworkSum);	//期初金额
				
				delegator.create(curValue);// 新增条目
			}
		} else if("3".equals(type)){
			BigDecimal curReworkInVolume = BigDecimal.ZERO;// 当前返工收入数量
			BigDecimal curReworkInSum = BigDecimal.ZERO;// 当前返工收入金额
			BigDecimal curReworkOutVolume = BigDecimal.ZERO;// 当前返工发出数量
			BigDecimal curReworkOutSum = BigDecimal.ZERO;// 当前返工发出金额
			
			BigDecimal reworkInVolume = BigDecimal.ZERO;// 计算后返工收入数量
			BigDecimal reworkInSum = BigDecimal.ZERO;// 计算后返工收入金额
			BigDecimal reworkOutVolume = BigDecimal.ZERO;// 计算后返工发出数量
			BigDecimal reworkOutSum = BigDecimal.ZERO;// 计算后返工发出金额
			
			if (curValueList != null && curValueList.size() > 0) {
				// 取第一条匹配记录
				curValue = curValueList.get(0);
				Debug.logInfo("计算前成品数量单价" + curValue.getString("volume") + ";" + curValue.getString("totalSum"), module);
				
				if(curValue.getBigDecimal("volume") != null){
					curVolumme = curValue.getBigDecimal("volume");// 设置当前数量
				}
				if(curValue.getBigDecimal("totalSum") != null){
					curSum = curValue.getBigDecimal("totalSum");// 设置当前金额
				}
				
				if(curValue.getBigDecimal("reworkVolume") != null){
					curReworkVolume = curValue.getBigDecimal("reworkVolume");// 设置当前返工数量
				}
				if(curValue.getBigDecimal("reworkTotalSum") != null){
					curReworkSum = curValue.getBigDecimal("reworkTotalSum");// 设置当前返工金额
				}
				if(curValue.getBigDecimal("reworkInVolume") != null){
					curReworkInVolume = curValue.getBigDecimal("reworkInVolume");// 设置当前返工收入金额
				}
				if(curValue.getBigDecimal("reworkInSum") != null){
					curReworkInSum = curValue.getBigDecimal("reworkInSum");// 设置当前返工收入金额
				}
				if(curValue.getBigDecimal("reworkOutVolume") != null){
					curReworkOutVolume = curValue.getBigDecimal("reworkOutVolume");// 设置当前返工发出金额
				}
				if(curValue.getBigDecimal("reworkOutSum") != null){
					curReworkOutSum = curValue.getBigDecimal("reworkOutSum");// 设置当前返工发出金额
				}
				
				calVolumme = curVolumme.add(volume);// 计算后数量
				calSum = curSum.add(totalsum);// 计算后金额
				
				calReworkVolume = curReworkVolume.add(volume);// 计算后返工数量
				calReworkSum = curReworkSum.add(totalsum);// 计算后返工金额
				
				if(calVolumme.compareTo(BigDecimal.ZERO) < 0 || calSum.compareTo(BigDecimal.ZERO) < 0){
					throwExceptionOfMaterialNotEnough(materialId);		//库存数量不足，抛出异常
				}
				
//				if(calReworkVolume.compareTo(BigDecimal.ZERO) > 0 ){
//					throwExceptionOfMaterialNotEnoughOther(materialId,"返工");		//出仓数量不足，抛出异常
//				}
				
				if(isOut == isCancel){//取消操作并非正常出入库
					reworkInVolume = volume;
					reworkInSum = totalsum;
				} else {
					reworkOutVolume = volume.negate();
					reworkOutSum = totalsum.negate();
				}

				curValue.set("volume", calVolumme);
				curValue.set("totalSum", calSum);

				curValue.set("reworkVolume", calReworkVolume);
				curValue.set("reworkTotalSum", calReworkSum);
				
				curValue.set("reworkInVolume", curReworkInVolume.add(reworkInVolume));
				curValue.set("reworkInSum", curReworkInSum.add(reworkInSum));
				curValue.set("reworkOutVolume", curReworkOutVolume.add(reworkOutVolume));
				curValue.set("reworkOutSum", curReworkOutSum.add(reworkOutSum));

				delegator.store(curValue);// 更新当前库存表
			} else {
				Debug.logInfo("成品库存余额表不存在成品" + materialId + "，添加该成品记录！", module);
				//查找上一个月末数量金额
				GenericValue preMonthValue=delegator.findOne("HisProductBalance", UtilMisc.toMap("year", Utils.getYearOfPreMonth(year, month), "month", Utils.getMonthOfPreMonth(year, month), "warehouseId", warehouseId, "materialId", materialId), false);
				BigDecimal beginVolume=BigDecimal.ZERO;//月初数量
				BigDecimal beginSum=BigDecimal.ZERO;//月初金额
				
				BigDecimal changeBeginVolume=BigDecimal.ZERO;//月初改板数量
				BigDecimal changeBeginSum=BigDecimal.ZERO;//月初改板金额
				
				BigDecimal reworkBeginVolume=BigDecimal.ZERO;//月初返工数量
				BigDecimal reworkBeginSum=BigDecimal.ZERO;//月初返工金额
				if(preMonthValue!=null){
					beginVolume=preMonthValue.getBigDecimal("volume");
					beginSum=preMonthValue.getBigDecimal("totalSum");
					
					changeBeginVolume=preMonthValue.getBigDecimal("changeVolume");
					changeBeginSum=preMonthValue.getBigDecimal("changeTotalSum");
					
					reworkBeginVolume=preMonthValue.getBigDecimal("reworkVolume");
					reworkBeginSum=preMonthValue.getBigDecimal("reworkTotalSum");
				}
				
				calVolumme = beginVolume.add(volume);// 计算后数量
				calSum = beginSum.add(totalsum);// 计算后金额
				
				calChangeVolume = changeBeginVolume;// 计算后改板数量
				calChangeSum = changeBeginSum;// 计算后改板金额

				calReworkVolume = reworkBeginVolume.add(volume);// 计算后返工数量
				calReworkSum = reworkBeginSum.add(totalsum);// 计算后返工金额
				
				if(calVolumme.compareTo(BigDecimal.ZERO)<0 || calSum.compareTo(BigDecimal.ZERO)<0){
					throwExceptionOfMaterialNotEnough(materialId);  //库存数量不足，抛出异常
				}
				
//				if(calReworkVolume.compareTo(BigDecimal.ZERO) > 0 ){
//					throwExceptionOfMaterialNotEnoughOther(materialId,"返工");		//出仓数量不足，抛出异常
//				}
				
				// 如果库存余额表没有改物料，则新增
				curValue = delegator.makeValue("CurProductBalance");
				curValue.set("year", year);
				curValue.set("month", month);
				curValue.set("warehouseId", warehouseId);
				curValue.set("materialId", materialId);
				curValue.set("beginvolume", beginVolume);
				curValue.set("beginsum", beginSum);
				curValue.set("volume", calVolumme);	//期初数量加当前数量
				curValue.set("totalSum", calSum);	//期初金额加当前金额
				
				if(isOut){
					reworkOutVolume = volume.negate();
					reworkOutSum = totalsum.negate();
				} else {
					reworkInVolume = volume;
					reworkInSum = totalsum;
				}
				curValue.set("inVolume", BigDecimal.ZERO);
				curValue.set("inSum", BigDecimal.ZERO);
				curValue.set("outVolume", BigDecimal.ZERO);
				curValue.set("outSum", BigDecimal.ZERO);

				curValue.set("changeBeginVolume", changeBeginVolume);
				curValue.set("changeBeginSum", changeBeginSum);
				curValue.set("changeInVolume", BigDecimal.ZERO);
				curValue.set("changeInSum", BigDecimal.ZERO);
				curValue.set("changeOutVolume", BigDecimal.ZERO);
				curValue.set("changeOutSum", BigDecimal.ZERO);
				curValue.set("changeVolume", calChangeVolume);	//期初数量
				curValue.set("changeTotalSum", calChangeSum);	//期初金额
				
				curValue.set("reworkBeginVolume", reworkBeginVolume);
				curValue.set("reworkBeginSum", reworkBeginSum);
				curValue.set("reworkInVolume", reworkInVolume);
				curValue.set("reworkInSum", reworkInSum);
				curValue.set("reworkOutVolume", reworkOutVolume);
				curValue.set("reworkOutSum", reworkOutSum);
				curValue.set("reworkVolume", calReworkVolume);	//期初数量
				curValue.set("reworkTotalSum", calReworkSum);	//期初金额
				
				delegator.create(curValue);// 新增条目
			}
		}
		
		//返回入库后单价
		if(calVolumme.compareTo(BigDecimal.ZERO) == 0){
			return BigDecimal.ZERO;
		}else{
			return calSum.divide(calVolumme,6,RoundingMode.DOWN);
		}
	}
	
	/**
	 * 库存不足，抛出异常
	 * @param materialId
	 * @throws Exception
	 */
	private void throwExceptionOfMaterialNotEnough(String materialId) throws Exception {
		TMaterial material = new TMaterial(materialId);
		throw new Exception("仓库库存物料（名称："+material.getName()+"，编码："+material.getNumber()+"）数量小于出库数量/金额，请检查并调整出库数量/单价！");
	}
	
	/**
	 * 该类型出仓数量不足，抛出异常
	 * @param materialId
	 * @throws Exception
	 */
	private void throwExceptionOfMaterialNotEnoughOther(String materialId,String type) throws Exception {
		TMaterial material = new TMaterial(materialId);
		throw new Exception("已出仓物料（名称："+material.getName()+"，编码："+material.getNumber()+"）数量小于进仓数量/金额，请检查并调整进仓数量/单价！（"+type+"）");
	}
	
}
