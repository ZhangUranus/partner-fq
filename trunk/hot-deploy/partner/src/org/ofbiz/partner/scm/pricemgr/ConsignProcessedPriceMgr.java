package org.ofbiz.partner.scm.pricemgr;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;

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
	 * 
	 * @param supplierId
	 * @param materialId
	 * @param volume
	 * @param totalsum
	 * @throws Exception
	 */
	public void update(String supplierId, String materialId, BigDecimal volume, BigDecimal processPrice) throws Exception {
		synchronized (updateLock) {
			if (supplierId == null || materialId == null || volume == null) {
				throw new Exception("supplierId or materialId or volume is null");
			}
			// 查找供应商结存对数表
			GenericValue gv = delegator.findOne("CurConsignProcessedPrice", UtilMisc.toMap("year", new Integer(year), "month", new Integer(month), "supplierId", supplierId, "materialId", materialId), false);
			if (gv != null) {
				BigDecimal oldVolume = gv.getBigDecimal("volume");
				if(processPrice == null){
					BigDecimal outVolume = gv.getBigDecimal("outVolume");
					gv.set("outVolume", outVolume.add(volume));
				}else{
					BigDecimal inVolume = gv.getBigDecimal("inVolume");
					if(inVolume == null){
						inVolume = BigDecimal.ZERO;
					}
					BigDecimal curInVolume = inVolume.add(volume);
					BigDecimal inSum = gv.getBigDecimal("inSum");
					if(inSum == null){
						inSum = BigDecimal.ZERO;
					}
					BigDecimal curInSum = processPrice.multiply(volume);
					gv.set("inVolume", curInVolume);
					gv.set("inSum", inSum.add(curInSum));
					volume = volume.negate();//入库操作，结存数应该取反
				}
				gv.set("volume", oldVolume.add(volume));
				delegator.store(gv);
			} else {// 新增记录
				//取上一个月库存信息
				GenericValue preMonthValue=delegator.findOne("HisConsignProcessedPrice", UtilMisc.toMap("year", Utils.getYearOfPreMonth(year, month), "month", Utils.getMonthOfPreMonth(year, month), "supplierId", supplierId, "materialId", materialId), false);
				BigDecimal beginVolume=BigDecimal.ZERO;//月初数量
				BigDecimal outVolume = BigDecimal.ZERO;//本期发出数量
				BigDecimal inVolume = BigDecimal.ZERO;//本期收入数量
				BigDecimal inSum = BigDecimal.ZERO;//本期收入金额
				if(preMonthValue!=null){
					beginVolume=preMonthValue.getBigDecimal("beginVolume").add(preMonthValue.getBigDecimal("volume"));
				}
				
				gv = delegator.makeValue("CurConsignProcessedPrice");
				gv.set("year", year);
				gv.set("month", month);
				gv.set("supplierId", supplierId);
				gv.set("materialId", materialId);
				gv.set("beginvolume", beginVolume);
				gv.set("volume", volume);
				if(processPrice == null){
					gv.set("outVolume", outVolume.add(volume));
				}else{
					BigDecimal curInVolume = inVolume.add(volume);
					BigDecimal curInSum = processPrice.multiply(curInVolume);
					gv.set("inVolume", curInVolume);
					gv.set("inSum", inSum.add(curInSum));
				}
				delegator.create(gv);
			}
		}

	}
}
