package org.ofbiz.partner.scm.pricemgr;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.UUID;

import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.dao.TMaterial;

/**
 * 车间单价管理类
 * 
 * @author Mark
 * 
 */
public class WorkshopPriceMgr {
	public static final String module = WorkshopPriceMgr.class.getName();

	Delegator delegator = null;

	private final Object updateLock = new Object();// 余额表更新锁

	private static WorkshopPriceMgr instance = null;

	private int year, month;// 当期年月
	
	public Object getUpdateLock(){
		return updateLock;
	}
	
	private WorkshopPriceMgr() {
		refreshPeriod();
	}

	public void refreshPeriod() {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(Utils.getCurDate());
		year = calendar.get(Calendar.YEAR);
		month = calendar.get(Calendar.MONTH) + 1;
		delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
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
	 * 说明：出库时，单价计算时使用舍弃法取小数点六位（防止出库后，金额为负数情况）
	 */
	public BigDecimal getPrice(String workshopId, String materialId) throws Exception {
		if (workshopId == null || materialId == null) {
			throw new Exception("workshopId or materialId is null");
		}
		// 查找车间物料入库单价
		GenericValue gv = delegator.findOne("CurWorkshopPrice", UtilMisc.toMap("year", new Integer(year), "month", new Integer(month), "workshopId", workshopId, "materialId", materialId), false);
		if (gv != null) {
			if (gv.getBigDecimal("volume").compareTo(BigDecimal.ZERO) == 0) {
				return BigDecimal.ZERO;
			} else {
				return gv.getBigDecimal("totalsum").divide(gv.getBigDecimal("volume"), 6, RoundingMode.DOWN);
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
	 * @return price 单价
	 * @log 20120814 jeff 将单件耗料改为总耗料
	 */
	public BigDecimal CreateWorkshopPriceDetailList(String workshopId, String bomId, String entryId, BigDecimal entryVolume) throws Exception {
		if (workshopId == null || bomId == null) {
			throw new Exception("workshopId or bomId is null");
		}
		// 根据入库加工件，获取耗料列表
		/** 修改逻辑，允许用户修改耗料列表 20130613
		List<GenericValue> entryList = delegator.findByAnd("MaterialBomListView", "id", bomId, "status", 1, "valid", "Y");
		BigDecimal totalSum = BigDecimal.ZERO;
		for (GenericValue value : entryList) {
			String bomMaterialId = value.getString("bomMaterialId");
			BigDecimal price = this.getPrice(workshopId, bomMaterialId);
			BigDecimal volume = value.getBigDecimal("volume");
			List<GenericValue> valusList = delegator.findByAnd("WorkshopPriceDetail", UtilMisc.toMap("parentId", entryId, "bomId", bomId, "materialId", bomMaterialId));//修复bug
			GenericValue gv = null;
			if (valusList.size() > 0) {
				gv = valusList.get(0);
				volume = gv.getBigDecimal("volume");
				gv.set("price", price);
				gv.store();
			} else {
				volume = entryVolume.multiply(volume);	//将单件耗料改为总耗料
				gv = delegator.makeValue("WorkshopPriceDetail");// 新建一个值对象
				gv.set("id", UUID.randomUUID().toString());
				gv.set("parentId", entryId);
				gv.set("bomId", bomId);
				gv.set("materialId", bomMaterialId);
				gv.set("volume", volume);
				gv.set("price", price);
				gv.create();
			}
			totalSum = totalSum.add(price.multiply(volume));
		}
		return totalSum;
		**/
		List<GenericValue> valusList = delegator.findByAnd("WorkshopPriceDetail", UtilMisc.toMap("parentId", entryId, "bomId", bomId));//修复bug
		BigDecimal totalSum = BigDecimal.ZERO;
		BigDecimal volume = BigDecimal.ZERO;
		if(valusList.size() > 0){
			// 存在用户编辑耗料
			for (GenericValue value : valusList) {
				String materialId = value.getString("materialId");
				BigDecimal price = this.getPrice(workshopId, materialId);
				volume = value.getBigDecimal("volume");
				value.set("price", price);
				value.store();
				totalSum = totalSum.add(price.multiply(volume));
			}
		} else {
			// 不存在用户编辑耗料
			List<GenericValue> entryList = delegator.findByAnd("MaterialBomListView", "id", bomId, "status", 1, "valid", "Y");
			for (GenericValue entry : entryList) {
				volume = entry.getBigDecimal("volume");
				String bomMaterialId = entry.getString("bomMaterialId");
				BigDecimal price = this.getPrice(workshopId, bomMaterialId);
				
				volume = entryVolume.multiply(volume);	//将单件耗料改为总耗料
				GenericValue gv = delegator.makeValue("WorkshopPriceDetail");// 新建一个值对象
				gv.set("id", UUID.randomUUID().toString());
				gv.set("parentId", entryId);
				gv.set("bomId", bomId);
				gv.set("materialId", bomMaterialId);
				gv.set("volume", volume);
				gv.set("price", price);
				gv.create();
			}
			
		}
		return totalSum;
	}

	/**
	 * 根据分录编码删除耗料列表
	 * 
	 * @param entryId
	 * @throws Exception
	 */
	public void removeMaterialList(String entryId) throws Exception {
		delegator.removeByAnd("WorkshopPriceDetail", UtilMisc.toMap("parentId", entryId));
	}

	/**
	 * 根据分录编码获取耗料列表
	 * 
	 * @param entryId
	 * @return
	 * @throws Exception
	 * @log 20120814 jeff 将单件耗料改为总耗料
	 */
	public List<List<Object>> getMaterialList(String entryId) throws Exception {
		// 根据入库加工件，获取耗料列表
		List<GenericValue> entryList = delegator.findByAnd("WorkshopPriceDetail", UtilMisc.toMap("parentId", entryId));
		List<List<Object>> result = new ArrayList<List<Object>>();
		for (GenericValue value : entryList) {
			List<Object> element = new ArrayList<Object>();
			element.add(value.getString("materialId"));
			element.add(value.getBigDecimal("volume")); // 加工件总耗料
			element.add(value.getBigDecimal("volume").multiply(value.getBigDecimal("price"))); // 加工件总金额
			result.add(element);
		}
		return result;
	}

	/**
	 * 根据分录编码获取耗料金额
	 * 
	 * @param entryId
	 * @return
	 * @throws Exception
	 * @log 20120814 jeff 将单件耗料改为总耗料
	 */
	public BigDecimal getMaterialCostPrice(String entryId) throws Exception {
		// 根据入库加工件，获取耗料列表
		List<GenericValue> entryList = delegator.findByAnd("WorkshopPriceDetail", UtilMisc.toMap("parentId", entryId));
		BigDecimal totalSum = BigDecimal.ZERO;
		for (GenericValue value : entryList) {
			totalSum = totalSum.add(value.getBigDecimal("volume").multiply(value.getBigDecimal("price")));
		}
		return totalSum;
	}

	/**
	 * 获取额外耗料金额（并返填耗料的单价、金额到额外耗料金额）
	 */
	public BigDecimal updateMaterialExtra(GenericValue value) throws Exception {
		List<GenericValue> entryList = delegator.findByAnd("ReturnProductWarehousingEntryExtra", UtilMisc.toMap("entryId", value.getString("id")));
		BigDecimal sum = BigDecimal.ZERO;
		BigDecimal totalSum = sum;
		for (GenericValue entryValue : entryList) {
			// 通过制造入库单获取车间编码
			GenericValue gv = delegator.findOne("WorkshopReturnProduct", UtilMisc.toMap("id", value.getString("parentId")), false);

			BigDecimal price = this.getPrice(gv.getString("workshopWorkshopId"), entryValue.getString("materialMaterialId"));
			BigDecimal volume = entryValue.getBigDecimal("volume");
			entryValue.set("price", price);
			sum = volume.multiply(price);
			totalSum = totalSum.add(sum);
			entryValue.set("entrysum", sum);
			entryValue.store();

			// 更新车间库存表，车间物料出库
			this.update(gv.getString("workshopWorkshopId"), entryValue.getString("materialMaterialId"), volume.negate(), sum.negate());
		}
		return totalSum;
	}

	// /**
	// * 提交制造入库额外耗料，返回金额（并返填耗料的单价、金额到额外耗料金额）
	// */
	// public BigDecimal updateWarehousingExtraCommit(GenericValue value) throws
	// Exception {
	// List<GenericValue> entryList =
	// delegator.findByAnd("WorkshopWarehousingEntryExtra",
	// UtilMisc.toMap("entryId", value.getString("id")));
	// BigDecimal sum = BigDecimal.ZERO;
	// BigDecimal totalSum = sum ;
	// for (GenericValue entryValue : entryList) {
	// // 通过制造退货单获取车间编码
	// GenericValue gv = delegator.findOne("WorkshopWarehousing",
	// UtilMisc.toMap("id", value.getString("parentId")), false);
	//
	// BigDecimal price = this.getPrice(gv.getString("workshopWorkshopId"),
	// entryValue.getString("materialMaterialId"));
	// BigDecimal volume = entryValue.getBigDecimal("volume");
	// entryValue.set("price", price);
	// sum = volume.multiply(price);
	// totalSum = totalSum.add(sum);
	// entryValue.set("entrysum", sum);
	// entryValue.store();
	//
	// // 更新车间库存表，车间物料出库
	// this.update(gv.getString("workshopWorkshopId"),
	// entryValue.getString("materialMaterialId"), volume.negate(),
	// sum.negate());
	// }
	// return totalSum;
	// }
	//
	// /**
	// * 回滚制造入库额外耗料（并返填耗料的单价、金额到额外耗料金额）
	// */
	// public void updateWarehousingExtraRollback(GenericValue value) throws
	// Exception {
	// List<GenericValue> entryList =
	// delegator.findByAnd("WorkshopWarehousingEntryExtra",
	// UtilMisc.toMap("entryId", value.getString("id")));
	// BigDecimal sum = BigDecimal.ZERO;
	// for (GenericValue entryValue : entryList) {
	// // 通过制造退货单获取车间编码
	// GenericValue gv = delegator.findOne("WorkshopWarehousing",
	// UtilMisc.toMap("id", value.getString("parentId")), false);
	//
	// BigDecimal volume = entryValue.getBigDecimal("volume");
	// sum = entryValue.getBigDecimal("entrysum");
	//
	// //将金额和单价返填为零
	// entryValue.set("price", BigDecimal.ZERO);
	// entryValue.set("entrysum", BigDecimal.ZERO);
	// entryValue.store();
	//
	// // 更新车间库存表，车间物料出库
	// this.update(gv.getString("workshopWorkshopId"),
	// entryValue.getString("materialMaterialId"), volume, sum);
	// }
	// }

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
				throw new Exception("workshopId or materialId or volume or totalsum  is null");
			}
			// 查找供应商可入库余额表
			GenericValue gv = delegator.findOne("CurWorkshopPrice", UtilMisc.toMap("year", new Integer(year), "month", new Integer(month), "workshopId", workshopId, "materialId", materialId), false);
			if (gv != null) {
				BigDecimal oldVolume = BigDecimal.ZERO;
				if(gv.getBigDecimal("volume") != null){
					oldVolume = gv.getBigDecimal("volume");
				}
				BigDecimal oldSum = BigDecimal.ZERO;
				if(gv.getBigDecimal("totalsum") != null){
					oldSum = gv.getBigDecimal("totalsum");
				}
				BigDecimal curVolume = oldVolume.add(volume);
				gv.set("volume", curVolume);
				BigDecimal curSum = oldSum.add(totalsum);
				gv.set("totalsum", curSum);
				if (curVolume.compareTo(BigDecimal.ZERO) < 0 || curSum.compareTo(BigDecimal.ZERO) < 0) {
					throwExceptionOfMaterialNotEnough(materialId);	//车间库存数量不足，抛出异常
				}
				
				delegator.store(gv);
			} else {// 新增记录
				//取上月库存数据
				GenericValue preMonthValue = delegator.findOne("HisWorkshopPrice", UtilMisc.toMap("year", Utils.getYearOfPreMonth(year, month), "month", Utils.getMonthOfPreMonth(year, month), "workshopId", workshopId, "materialId", materialId), false);
				BigDecimal beginVolume = BigDecimal.ZERO;//月初数量
				BigDecimal beginSum = BigDecimal.ZERO;//月初金额
				BigDecimal curVolume = BigDecimal.ZERO;//库存数量
				BigDecimal curTotalSum = BigDecimal.ZERO;//库存金额
				
				if(preMonthValue != null){
					beginVolume = preMonthValue.getBigDecimal("volume");
					beginSum = preMonthValue.getBigDecimal("totalsum");
					curVolume = preMonthValue.getBigDecimal("volume");
					curTotalSum = preMonthValue.getBigDecimal("totalsum");
				}
				
				BigDecimal tempVolume = curVolume.add(volume);
				BigDecimal tempSum = curTotalSum.add(totalsum);
				if(tempVolume.compareTo(BigDecimal.ZERO)<0 || tempSum.compareTo(BigDecimal.ZERO)<0){
					throwExceptionOfMaterialNotEnough(materialId);	//车间库存数量不足，抛出异常
				}
				
				gv = delegator.makeValue("CurWorkshopPrice");
				gv.set("year", year);
				gv.set("month", month);
				gv.set("workshopId", workshopId);
				gv.set("materialId", materialId);
				gv.set("beginvolume", beginVolume);
				gv.set("beginsum", beginSum);
				gv.set("volume", tempVolume);
				gv.set("totalsum", tempSum);
				delegator.create(gv);
			}
		}
	}

	/**
	 * 获取物料库存数量、金额
	 * 
	 * @param supplierId
	 * @param materialId
	 * @return
	 * @throws Exception
	 */
	public ArrayList<BigDecimal> getVolumeOfMaterial(String workshopId, String materialId) throws Exception {
		ArrayList<BigDecimal> number = new ArrayList<BigDecimal>();
		if (workshopId == null || materialId == null) {
			throw new Exception("workshopId or materialId is null");
		}
		// 查找供应商可入库余额表
		GenericValue gv = delegator.findOne("CurWorkshopPrice", UtilMisc.toMap("year", new Integer(year), "month", new Integer(month), "workshopId", workshopId, "materialId", materialId), false);
		if (gv != null) {
			number.add(gv.getBigDecimal("volume"));
			number.add(gv.getBigDecimal("totalsum"));
		} else {
			number.add(BigDecimal.ZERO);
			number.add(BigDecimal.ZERO);
		}
		return number;
	}
	
	/**
	 * 库存不足，抛出异常
	 * @param materialId
	 * @throws Exception
	 */
	private void throwExceptionOfMaterialNotEnough(String materialId) throws Exception {
		TMaterial material = new TMaterial(materialId);
		throw new Exception("车间库存物料（名称："+material.getName()+"，编码："+material.getNumber()+"）数量小于车间出库数量/金额，请检查并调整出库数量/单价！");
	}
}
