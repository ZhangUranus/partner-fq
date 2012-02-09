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
 * 委外单价管理类
 * 
 * @author Mark
 * 
 */
public class ConsignPriceMgr {
	public static final String module = ConsignPriceMgr.class.getName();

	private Object updateLock = new Object();// 余额表更新锁

	private static ConsignPriceMgr instance = null;
	
	private int year ,month ;//当期年月

	private ConsignPriceMgr() {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(Utils.getCurDate());
		year = calendar.get(Calendar.YEAR);
		month = calendar.get(Calendar.MONTH);
	}

	public static ConsignPriceMgr getInstance() {
		if (instance == null) {
			instance = new ConsignPriceMgr();
		}
		return instance;
	}

	/**
	 * 获取物料当前单价
	 * 
	 * @param supplierId
	 *            加工商id
	 * @param materialId
	 *            物料id
	 * @return
	 */
	public BigDecimal getPrice(String supplierId, String materialId) throws Exception {
		if (supplierId == null || materialId == null) {
			throw new Exception("supplierId or materialId is null");
		}
		// 查找加工商物料入库单价
		Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
		GenericValue gv = delegator.findOne("CurConsignPrice", UtilMisc.toMap("year", new Integer(year), "month", new Integer(month), "supplierId", supplierId, "materialId", materialId), false);
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
	 * 创建加工件耗料详细列表
	 * 
	 * @param supplierId
	 *            加工商id
	 * @param materialId
	 *            加工件物料id
	 * @return
	 */
	public BigDecimal CreateConsignPriceDetailList(String supplierId, String materialId, String entryId) throws Exception {
		if (supplierId == null || materialId == null) {
			throw new Exception("supplierId or materialId is null");
		}
		// 根据入库加工件，获取耗料列表
		Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
		List<GenericValue> entryList = delegator.findByAnd("MaterialBomListView", UtilMisc.toMap("materialId", materialId));
		BigDecimal totalSum = BigDecimal.ZERO;
		for(GenericValue value:entryList){
			String bomMaterialId = value.getString("bomMaterialId");
			BigDecimal price = this.getPrice(supplierId, bomMaterialId);
			BigDecimal volume =  value.getBigDecimal("volume");
			BigDecimal sum = null;
			GenericValue gv = delegator.findOne("ConsignPriceDetail", UtilMisc.toMap("parentId", entryId, "materialId", bomMaterialId), false);
			if (gv != null) {
				gv.set("volume", volume);
				gv.set("price", price);
				gv.store();
			}else{
				gv = delegator.makeValue("ConsignPriceDetail");// 新建一个值对象
				gv.set("parentId", entryId);
				gv.set("materialId", bomMaterialId);
				gv.set("volume", volume);
				gv.set("price", price);
				gv.create();
			}
			sum = price.multiply(volume);
			totalSum = totalSum.add(price.multiply(volume));
		}
		return totalSum;
	}
	
	public List<List> getMaterialList(String entryId) throws Exception {
		// 根据入库加工件，获取耗料列表
		Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
		List<GenericValue> entryList = delegator.findByAnd("ConsignPriceDetail", UtilMisc.toMap("parentId", entryId));
		List<List> result = new ArrayList<List>();
		for(GenericValue value:entryList){
			List<Object> element = new ArrayList<Object>();
			element.add(value.getString("materialId"));
			element.add(value.getBigDecimal("volume"));
			element.add(value.getBigDecimal("volume").multiply(value.getBigDecimal("price")));
			result.add(element);
		}
		return result;
	}
	
	public BigDecimal getMaterialCostPrice(String entryId) throws Exception {
		// 根据入库加工件，获取耗料列表
		Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
		List<GenericValue> entryList = delegator.findByAnd("ConsignPriceDetail", UtilMisc.toMap("parentId", entryId));
		BigDecimal totalSum = BigDecimal.ZERO;
		for(GenericValue value:entryList){
			totalSum = totalSum.add(value.getBigDecimal("volume").multiply(value.getBigDecimal("price")));
		}
		return totalSum;
	}

	/**
	 * 更新累计金额数量
	 * 
	 * @param supplierId
	 * @param materialId
	 * @param volume
	 * @param totalsum
	 * @throws Exception
	 */
	public void update(String supplierId, String materialId, BigDecimal volume, BigDecimal totalsum) throws Exception {
		synchronized (updateLock) {
			if (supplierId == null || materialId == null || volume == null || totalsum == null) {
				throw new Exception("supplierId or materialId or volume or totalsum  is null");
			}
			// 查找供应商可入库余额表
			Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
			GenericValue gv = delegator.findOne("CurConsignPrice", UtilMisc.toMap("year", new Integer(year), "month", new Integer(month), "supplierId", supplierId, "materialId", materialId), false);
			if (gv != null) {
				BigDecimal oldVolume = gv.getBigDecimal("volume");
				BigDecimal oldSum = gv.getBigDecimal("totalsum");
				gv.set("volume", oldVolume.add(volume));
				gv.set("totalsum", oldSum.add(totalsum));
				delegator.store(gv);
			} else {// 新增记录
				gv = delegator.makeValue("ConsignPrice");
				gv.set("year", year);
				gv.set("month", month);
				gv.set("supplierId", supplierId);
				gv.set("materialId", materialId);
				gv.set("volume", volume);
				gv.set("totalsum", totalsum);
				delegator.create(gv);
			}
		}

	}
}
