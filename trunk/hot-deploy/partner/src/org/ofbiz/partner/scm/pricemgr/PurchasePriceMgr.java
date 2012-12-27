package org.ofbiz.partner.scm.pricemgr;

import java.math.BigDecimal;
import java.util.Calendar;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;

/**
 * 采购供应对数表管理类
 * 
 * @author Mark
 * 
 */
public class PurchasePriceMgr {
	public static final String module = PurchasePriceMgr.class.getName();

	Delegator delegator = null;

	private Object updateLock = new Object();// 余额表更新锁

	private static PurchasePriceMgr instance = null;
	
	private int year ,month ;//当期年月

	private PurchasePriceMgr() {
		refreshPeriod();
	}
	
	public void refreshPeriod(){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(Utils.getCurDate());
		year = calendar.get(Calendar.YEAR);
		month = calendar.get(Calendar.MONTH)+1;
		delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
	}

	public static PurchasePriceMgr getInstance() {
		if (instance == null) {
			instance = new PurchasePriceMgr();
		}
		return instance;
	}

	/**
	 * 更新金额、数量（采购入库单）
	 * @param supplierId
	 * @param materialId
	 * @param volume
	 * @param totalsum
	 * @throws Exception
	 */
	public void update(String supplierId, String materialId, BigDecimal volume, BigDecimal price, boolean isOut, boolean isCancel) throws Exception {
		synchronized (updateLock) {
			if (supplierId == null || materialId == null || volume == null || price == null) {
				throw new Exception("supplierId or materialId or volume or price is null");
			}
			// 查找供应商结存对数表
			GenericValue gv = delegator.findOne("CurPurchasePrice", UtilMisc.toMap("year", new Integer(year), "month", new Integer(month), "supplierId", supplierId, "materialId", materialId), false);
			if (gv != null) {
				BigDecimal oldVolume = gv.getBigDecimal("volume");
				if(oldVolume == null){
					oldVolume = BigDecimal.ZERO;
				}
				if((isOut && !isCancel) || (!isOut && isCancel)){
					BigDecimal outVolume = gv.getBigDecimal("outVolume");
					if(outVolume == null){
						outVolume = BigDecimal.ZERO;
					}
					gv.set("outVolume", outVolume.add(volume));
					volume = volume.negate();
				}else{
					BigDecimal inVolume = gv.getBigDecimal("inVolume");
					if(inVolume == null){
						inVolume = BigDecimal.ZERO;
					}
					BigDecimal curInVolume = inVolume.add(volume);
					gv.set("inVolume", curInVolume);
				}
				BigDecimal entrySum = gv.getBigDecimal("entrySum");
				if(entrySum == null){
					entrySum = BigDecimal.ZERO;
				}
				BigDecimal curInSum = price.multiply(volume);
				gv.set("entrySum", entrySum.add(curInSum));
				
				BigDecimal tempVolume = oldVolume.add(volume);
				
				gv.set("volume", tempVolume);
				delegator.store(gv);
			} else {// 新增记录
				BigDecimal outVolume = BigDecimal.ZERO;//本期发出数量
				BigDecimal inVolume = BigDecimal.ZERO;//本期收入数量
				BigDecimal entrySum = BigDecimal.ZERO;//本期收入金额
				
				gv = delegator.makeValue("CurPurchasePrice");
				gv.set("year", year);
				gv.set("month", month);
				gv.set("supplierId", supplierId);
				gv.set("materialId", materialId);
				
				if((isOut && !isCancel) || (!isOut && isCancel)){
					gv.set("outVolume", outVolume.add(volume));
					volume = volume.negate();
				}else{
					BigDecimal curInVolume = inVolume.add(volume);
					gv.set("inVolume", curInVolume);
				}

				BigDecimal curInSum = price.multiply(volume);
				gv.set("entrySum", entrySum.add(curInSum));
				
				gv.set("volume", volume);
				
				delegator.create(gv);
			}
		}
	}
	/**
	 * 更新金额、数量（采购单）
	 * @param supplierId
	 * @param materialId
	 * @param volume
	 * @param totalsum
	 * @throws Exception
	 */
	public void updateBillValue(String supplierId, String materialId, BigDecimal volume, BigDecimal price, boolean isOut, boolean isCancel) throws Exception {
		synchronized (updateLock) {
			if (supplierId == null || materialId == null || volume == null || price == null) {
				throw new Exception("supplierId or materialId or volume or price is null");
			}
			// 查找供应商结存对数表
			GenericValue gv = delegator.findOne("CurPurchasePrice", UtilMisc.toMap("year", new Integer(year), "month", new Integer(month), "supplierId", supplierId, "materialId", materialId), false);
			if (gv != null) {
				BigDecimal oldVolume = gv.getBigDecimal("billVolume");
				if( oldVolume==null ){
					oldVolume = BigDecimal.ZERO;
				}
				if(isOut){
					volume = volume.negate();
				}
				BigDecimal entrySum = gv.getBigDecimal("billEntrySum");
				if(entrySum == null){
					entrySum = BigDecimal.ZERO;
				}
				BigDecimal curInSum = price.multiply(volume);
				gv.set("billEntrySum", entrySum.add(curInSum));
				
				BigDecimal tempVolume = oldVolume.add(volume);
				gv.set("billVolume", tempVolume);
				
				delegator.store(gv);
			} else {// 新增记录
				BigDecimal billEntrySum = BigDecimal.ZERO;//本期收入金额
				
				gv = delegator.makeValue("CurPurchasePrice");
				gv.set("year", year);
				gv.set("month", month);
				gv.set("supplierId", supplierId);
				gv.set("materialId", materialId);
				
				if(isOut){
					volume = volume.negate();
				}
				gv.set("billVolume", volume);

				BigDecimal curInSum = price.multiply(volume);
				gv.set("billEntrySum", billEntrySum.add(curInSum));
				
				delegator.create(gv);
			}
		}
	}
}
