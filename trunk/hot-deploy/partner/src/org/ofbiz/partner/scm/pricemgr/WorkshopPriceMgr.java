package org.ofbiz.partner.scm.pricemgr;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;

/**
 * 委外单价管理类
 * 
 * @author Mark
 * 
 */
public class WorkshopPriceMgr {
	public static final String module = WorkshopPriceMgr.class.getName();

	private Object updateLock = new Object();// 余额表更新锁

	private static WorkshopPriceMgr instance = null;

	private WorkshopPriceMgr() {

	}

	public static WorkshopPriceMgr getInstance() {
		if (instance == null) {
			instance = new WorkshopPriceMgr();
		}
		return instance;
	}

	/**
	 * 获取当前单价
	 * 
	 * @param workshopId
	 *            车间id
	 * @param materialId
	 *            物料id
	 * @return
	 */
	public BigDecimal getPrice(String workshopId, String materialId) throws Exception {
		if (workshopId == null || materialId == null) {
			throw new Exception("workshopId or materialId is null");
		}
		Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
		GenericValue gv = delegator.findOne("CurWorkshopPrice", UtilMisc.toMap("workshopId", workshopId, "materialId", materialId), false);
		if (gv != null) {
			if (gv.getBigDecimal("volume").equals(BigDecimal.ZERO)) {
				return BigDecimal.ZERO;
			} else {
				return gv.getBigDecimal("totalsum").divide(gv.getBigDecimal("volume"), 4, RoundingMode.HALF_UP);
			}
		} else {
			return BigDecimal.ZERO;
		}
	}

	/**
	 * 更新累计金额数量
	 * 
	 * @param workshopId
	 * @param materialId
	 * @param volume
	 * @param totalsum
	 * @throws Exception
	 */
	public void update(String workshopId, String materialId, BigDecimal volume, BigDecimal totalsum) throws Exception {
		synchronized (updateLock) {
			if (workshopId == null || materialId == null || volume == null || totalsum == null) {
				throw new Exception("supplierId or materialId or volume or totalsum  is null");
			}
			Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
			GenericValue gv = delegator.findOne("CurWorkshopPrice", UtilMisc.toMap("workshopId", workshopId, "materialId", materialId), false);
			if (gv != null) {
				BigDecimal oldVolume = gv.getBigDecimal("volume");
				BigDecimal oldSum = gv.getBigDecimal("totalsum");
				gv.set("volume", oldVolume.add(volume));
				gv.set("totalsum", oldSum.add(totalsum));
				delegator.store(gv);
			} else {// 新增记录
				gv = delegator.makeValue("CurWorkshopPrice");
				gv.set("workshopId", workshopId);
				gv.set("materialId", materialId);
				gv.set("volume", volume);
				gv.set("totalsum", totalsum);
				delegator.create(gv);
			}
		}

	}
}
