package org.ofbiz.partner.scm.pricemgr;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javolution.util.FastList;

import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.condition.EntityConditionList;
import org.ofbiz.entity.condition.EntityOperator;

/**
 * 委外单价管理类
 * 
 * @author Mark
 * 
 */
public class ConsignPriceMgr {
	public static final String module = ConsignPriceMgr.class.getName();

	Delegator delegator = null;

	private Object updateLock = new Object();// 余额表更新锁

	private static ConsignPriceMgr instance = null;
	
	private int year ,month ;//当期年月

	private ConsignPriceMgr() {
		refreshPeriod();
	}
	
	public void refreshPeriod(){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(Utils.getCurDate());
		year = calendar.get(Calendar.YEAR);
		month = calendar.get(Calendar.MONTH)+1;
		delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
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
		GenericValue gv = delegator.findOne("CurConsignPrice", UtilMisc.toMap("year", new Integer(year), "month", new Integer(month), "supplierId", supplierId, "materialId", materialId), false);
		if (gv != null) {
			if (gv.getBigDecimal("volume").compareTo(BigDecimal.ZERO) == 0) {
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
		List<GenericValue> entryList = delegator.findByAnd("MaterialBomListView", UtilMisc.toMap("materialId", materialId));
		BigDecimal totalSum = BigDecimal.ZERO;
		for(GenericValue value:entryList){
			String bomMaterialId = value.getString("bomMaterialId");
			BigDecimal price = this.getPrice(supplierId, bomMaterialId);
			BigDecimal volume =  value.getBigDecimal("volume");
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
			totalSum = totalSum.add(price.multiply(volume));
		}
		return totalSum;
	}
	
	/**
	 * 根据分录编码删除耗料列表
	 * @param entryId
	 * @throws Exception
	 */
	public void removeMaterialList(String entryId) throws Exception {
		delegator.removeByAnd("ConsignPriceDetail", UtilMisc.toMap("parentId", entryId));
	}
	
	/**
	 * 根据分录编码获取耗料列表
	 * @param entryId
	 * @return
	 * @throws Exception
	 */
	public List<List> getMaterialList(String entryId) throws Exception {
		// 根据入库加工件，获取耗料列表
		List<GenericValue> entryList = delegator.findByAnd("ConsignPriceDetail", UtilMisc.toMap("parentId", entryId));
		List<List> result = new ArrayList<List>();
		for(GenericValue value:entryList){
			List<Object> element = new ArrayList<Object>();
			element.add(value.getString("materialId"));
			element.add(value.getBigDecimal("volume"));		//每个加工件耗料
			element.add(value.getBigDecimal("volume").multiply(value.getBigDecimal("price")));	//每个加工件金额
			result.add(element);
		}
		return result;
	}
	
	/**
	 * 根据分录编码获取耗料金额
	 * @param entryId
	 * @return
	 * @throws Exception
	 */
	public BigDecimal getMaterialCostPrice(String entryId) throws Exception {
		// 根据入库加工件，获取耗料列表
		List<GenericValue> entryList = delegator.findByAnd("ConsignPriceDetail", UtilMisc.toMap("parentId", entryId));
		BigDecimal totalSum = BigDecimal.ZERO;
		for(GenericValue value:entryList){
			totalSum = totalSum.add(value.getBigDecimal("volume").multiply(value.getBigDecimal("price")));
		}
		return totalSum;
	}
	
	/**
	 * 提交制造入库额外耗料，返回金额（并返填耗料的单价、金额到额外耗料金额）
	 */
	public BigDecimal updateWarehousingExtraCommit(GenericValue value) throws Exception {
		List<GenericValue> entryList = delegator.findByAnd("ConsignWarehousingEntryExtra", UtilMisc.toMap("entryId", value.getString("id")));
		BigDecimal sum = BigDecimal.ZERO;
		BigDecimal totalSum = sum ;
		for (GenericValue entryValue : entryList) {
			// 通过制造退货单获取车间编码
			GenericValue gv = delegator.findOne("ConsignWarehousing", UtilMisc.toMap("id", value.getString("parentId")), false);
			
			BigDecimal price = this.getPrice(gv.getString("processorSupplierId"), entryValue.getString("materialMaterialId"));
			BigDecimal volume = entryValue.getBigDecimal("volume");
			entryValue.set("price", price);
			sum = volume.multiply(price);
			totalSum = totalSum.add(sum);
			entryValue.set("entrysum", sum);
			entryValue.store();
			
			// 更新车间库存表，车间物料出库
			this.update(gv.getString("processorSupplierId"), entryValue.getString("materialMaterialId"), volume.negate(), sum.negate());
		}
		return totalSum;
	}
	
	/**
	 * 回滚制造入库额外耗料（并返填耗料的单价、金额到额外耗料金额）
	 */
	public void updateWarehousingExtraRollback(GenericValue value) throws Exception {
		List<GenericValue> entryList = delegator.findByAnd("ConsignWarehousingEntryExtra", UtilMisc.toMap("entryId", value.getString("id")));
		BigDecimal sum = BigDecimal.ZERO;
		for (GenericValue entryValue : entryList) {
			// 通过制造退货单获取车间编码
			GenericValue gv = delegator.findOne("ConsignWarehousing", UtilMisc.toMap("id", value.getString("parentId")), false);
						
			BigDecimal volume = entryValue.getBigDecimal("volume");
			sum = entryValue.getBigDecimal("entrysum");
			
			//将金额和单价返填为零
			entryValue.set("price", BigDecimal.ZERO);
			entryValue.set("entrysum", BigDecimal.ZERO);
			entryValue.store();
			
			// 更新车间库存表，车间物料出库
			this.update(gv.getString("processorSupplierId"), entryValue.getString("materialMaterialId"), volume, sum);
		}
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
			GenericValue gv = delegator.findOne("CurConsignPrice", UtilMisc.toMap("year", new Integer(year), "month", new Integer(month), "supplierId", supplierId, "materialId", materialId), false);
			if (gv != null) {
				BigDecimal oldVolume = gv.getBigDecimal("volume");
				BigDecimal oldSum = gv.getBigDecimal("totalsum");
				BigDecimal curVolume = oldVolume.add(volume);
				gv.set("volume", curVolume);
				
				if(curVolume.compareTo(BigDecimal.ZERO)<0){
					throw new Exception("供应商物料数量小于供应商出库数量，请检查并调整供应商出库数量！");
				}
				
				gv.set("totalsum", oldSum.add(totalsum));
				delegator.store(gv);
			} else {// 新增记录
				if(volume.compareTo(BigDecimal.ZERO)<0){
					throw new Exception("供应商物料数量小于供应商出库数量，请检查并调整供应商出库数量！");
				}
				BigDecimal beginVolume=BigDecimal.ZERO;//月初数量
				BigDecimal beginSum=BigDecimal.ZERO;//月初金额
				gv = delegator.makeValue("CurConsignPrice");
				gv.set("year", year);
				gv.set("month", month);
				gv.set("supplierId", supplierId);
				gv.set("materialId", materialId);
				gv.set("beginvolume", beginVolume);
				gv.set("beginsum", beginSum);
				gv.set("volume", volume);
				gv.set("totalsum", totalsum);
				delegator.create(gv);
			}
		}
	}
	
	/**
	 * 获取物料库存数量
	 * @param supplierId
	 * @param materialId
	 * @return
	 * @throws Exception
	 */
	public BigDecimal getVolumeOfMaterial(String supplierId, String materialId) throws Exception {
		if (supplierId == null || materialId == null ) {
			throw new Exception("supplierId or materialId is null");
		}
		// 查找供应商可入库余额表
		GenericValue gv = delegator.findOne("CurConsignPrice", UtilMisc.toMap("year", new Integer(year), "month", new Integer(month), "supplierId", supplierId, "materialId", materialId), false);
		if (gv != null) {
			return gv.getBigDecimal("volume");
		}else{
			return BigDecimal.ZERO;
		}
	}
	
	/**
	 * 检查是否有未验收的退货单
	 * @param supplierId
	 * @param materialId
	 * @return
	 * @throws Exception
	 */
	public boolean checkReturnProductWarehousingStatus(String supplierId, String materialId) throws Exception {
		if (supplierId == null || materialId == null ) {
			throw new Exception("supplierId or materialId is null");
		}
		EntityConditionList<EntityCondition> condition = null;
		List<EntityCondition> conds = FastList.newInstance();
		conds.add(EntityCondition.makeCondition("processorSupplierId", EntityOperator.EQUALS, supplierId));
		conds.add(EntityCondition.makeCondition("materialId", EntityOperator.EQUALS, materialId));
		conds.add(EntityCondition.makeCondition("checkStatus", EntityOperator.NOT_EQUAL, 2));
		condition = EntityCondition.makeCondition(conds);
		long count = delegator.findCountByCondition("ConsignReturnProductList", condition, null, null);
		if(count > 0){
			return false;
		}else{
			return true;
		}
	}
}
