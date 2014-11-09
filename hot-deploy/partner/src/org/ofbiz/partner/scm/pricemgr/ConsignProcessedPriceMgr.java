package org.ofbiz.partner.scm.pricemgr;

import java.math.BigDecimal;
import java.util.Calendar;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.dao.TMaterial;

/**
 * 委外加工件对数表管理类
 * 
 * @author Mark
 * 
 */
public class ConsignProcessedPriceMgr {
	public static final String module = ConsignProcessedPriceMgr.class.getName();

	Delegator delegator = null;

	private Object updateLock = new Object();// 余额表更新锁

	private static ConsignProcessedPriceMgr instance = null;
	
	private int year ,month ;//当期年月

	private ConsignProcessedPriceMgr() {
		refreshPeriod();
	}
	
	public void refreshPeriod(){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(Utils.getCurDate());
		year = calendar.get(Calendar.YEAR);
		month = calendar.get(Calendar.MONTH)+1;
		delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
	}

	public static ConsignProcessedPriceMgr getInstance() {
		if (instance == null) {
			instance = new ConsignProcessedPriceMgr();
		}
		return instance;
	}

	/**
	 * 更新金额、数量
	 * @param type 1:正常出入库；2:退货验收
	 * @param supplierId
	 * @param materialId
	 * @param volume
	 * @param totalsum
	 * @throws Exception
	 * 
	 * 说明：
	 * 	1.正常出入库，类型为入库的提交或者撤销，需要更新入库金额（加工金额）
	 *  2.退货验收出入库，不需要更新入库金额（不需要加工金额）
	 */
	public void update(int type, String supplierId, String materialId, BigDecimal volume, BigDecimal processPrice, boolean isOut, boolean isCancel) throws Exception {
		synchronized (updateLock) {
			if (supplierId == null || materialId == null || volume == null) {
				throw new Exception("supplierId or materialId or volume is null");
			}
			// 查找供应商结存对数表
			GenericValue gv = delegator.findOne("CurConsignProcessedPrice", UtilMisc.toMap("year", new Integer(year), "month", new Integer(month), "supplierId", supplierId, "materialId", materialId, "type", new Integer(type)), false);
			if (gv != null) {
				BigDecimal oldVolume = gv.getBigDecimal("volume");
				if((isOut && !isCancel) || (!isOut && isCancel)){
					BigDecimal outVolume = gv.getBigDecimal("outVolume");
					gv.set("outVolume", outVolume.add(volume));
				}else{
					BigDecimal inVolume = gv.getBigDecimal("inVolume");
					if(inVolume == null){
						inVolume = BigDecimal.ZERO;
					}
					BigDecimal curInVolume = inVolume.add(volume);
					gv.set("inVolume", curInVolume);
					if(type == 1){
						BigDecimal inSum = gv.getBigDecimal("inSum");
						if(inSum == null){
							inSum = BigDecimal.ZERO;
						}
						BigDecimal curInSum = processPrice.multiply(volume);
						gv.set("inSum", inSum.add(curInSum));
					}
					volume = volume.negate();//入库操作，结存数应该取反
				}
				BigDecimal tempVolume = oldVolume.add(volume);
				if(tempVolume.compareTo(BigDecimal.ZERO)<0){
					throwExceptionOfMaterialNotEnough(materialId);
				}
				gv.set("volume", tempVolume);
				delegator.store(gv);
			} else {// 新增记录
				//取上一个月库存信息
				GenericValue preMonthValue=delegator.findOne("HisConsignProcessedPrice", UtilMisc.toMap("year", Utils.getYearOfPreMonth(year, month), "month", Utils.getMonthOfPreMonth(year, month), "supplierId", supplierId, "materialId", materialId, "type", new Integer(type)), false);
				BigDecimal beginVolume=BigDecimal.ZERO;//月初数量
				BigDecimal outVolume = BigDecimal.ZERO;//本期发出数量
				BigDecimal inVolume = BigDecimal.ZERO;//本期收入数量
				BigDecimal inSum = BigDecimal.ZERO;//本期收入金额
				if(preMonthValue!=null){
					beginVolume=preMonthValue.getBigDecimal("volume");
				}
				
				gv = delegator.makeValue("CurConsignProcessedPrice");
				gv.set("year", year);
				gv.set("month", month);
				gv.set("supplierId", supplierId);
				gv.set("type", type);
				gv.set("materialId", materialId);
				gv.set("beginvolume", beginVolume);
				
				if((isOut && !isCancel) || (!isOut && isCancel)){
					gv.set("outVolume", outVolume.add(volume));
				}else{
					BigDecimal curInVolume = inVolume.add(volume);
					gv.set("inVolume", curInVolume);
					if(type == 1){
						BigDecimal curInSum = processPrice.multiply(curInVolume);
						gv.set("inSum", inSum.add(curInSum));
					}
					volume = volume.negate();//入库操作，结存数应该取反
				}
				BigDecimal tempVolume = beginVolume.add(volume);
				if(tempVolume.compareTo(BigDecimal.ZERO)<0){
					throwExceptionOfMaterialNotEnough(materialId);
				}
				gv.set("volume", tempVolume);
				
				delegator.create(gv);
			}
		}
	}
	
	public void changeTypeOfFinishBill(String supplierId, String materialId, BigDecimal volume) throws Exception {
		synchronized (updateLock) {
			TMaterial material = new TMaterial(materialId);
			if (supplierId == null || materialId == null || volume == null) {
				throw new Exception("supplierId or materialId or volume is null");
			}
			// 查找供应商结存对数表
			GenericValue returnValue = delegator.findOne("CurConsignProcessedPrice", UtilMisc.toMap("year", new Integer(year), "month", new Integer(month), "supplierId", supplierId, "materialId", materialId, "type", new Integer(2)), false);
			if (returnValue != null) {
				returnValue.set("volume", returnValue.getBigDecimal("volume").add(volume.negate()));
				returnValue.store();
			} else {
				throw new Exception("加工商仓（退货验收）中未找到记录（名称："+material.getName()+"，编码："+material.getNumber()+"）！");
			}
			
			// 查找供应商结存对数表
			GenericValue value = delegator.findOne("CurConsignProcessedPrice", UtilMisc.toMap("year", new Integer(year), "month", new Integer(month), "supplierId", supplierId, "materialId", materialId, "type", new Integer(1)), false);
			if (value != null) {
				value.set("volume", value.getBigDecimal("volume").add(volume));
				value.store();
			} else {
				throw new Exception("加工商仓（正常出入库）中未找到记录（名称："+material.getName()+"，编码："+material.getNumber()+"）！");
			}
		}
	}
	
	/**
	 * 库存不足，抛出异常
	 * @param materialId
	 * @throws Exception
	 */
	private void throwExceptionOfMaterialNotEnough(String materialId) throws Exception {
		TMaterial material = new TMaterial(materialId);
		throw new Exception("供应商库存物料（名称："+material.getName()+"，编码："+material.getNumber()+"）数量小于供应商出库数量/金额，请检查并调整出库数量/单价！");
	}
}
