package org.ofbiz.partner.scm.pricemgr.bizStockImp;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.pricemgr.BillType;
import org.ofbiz.partner.scm.pricemgr.IBizStock;
import org.ofbiz.partner.scm.pricemgr.MaterialBomMgr;
import org.ofbiz.partner.scm.pricemgr.PriceCalItem;
import org.ofbiz.partner.scm.pricemgr.PriceMgr;
import org.ofbiz.partner.scm.pricemgr.Utils;

public class WorkshopReturnProductBizImp implements IBizStock {
	private Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();

	public synchronized void updateStock(GenericValue billValue, boolean isOut, boolean isCancel) throws Exception {
		// 注意不能使用billHead.getDate方法，出产生castException异常
		Date bizDate = (Date) billValue.get("bizDate");
		if (bizDate == null || !Utils.isCurPeriod(bizDate)) {
			throw new Exception("单据业务日期不在当前系统期间");
		}

		// 供应商id
		String workshopId = billValue.getString("workshopWorkshopId");
		if (workshopId == null || workshopId.length() < 1) {
			throw new Exception("制造退货单车间为空！！！");
		}

		// 获取单据id分录条目
		List<GenericValue> entryList = delegator.findByAnd("WorkshopReturnProductEntry", UtilMisc.toMap("parentId", billValue.getString("id")));

		BigDecimal totalSum = BigDecimal.ZERO;
		for (GenericValue v : entryList) {
			String warehouseId = v.getString("warehouseWarehouseId");// 仓库id
			if (warehouseId == null || warehouseId.length() < 1) {
				throw new Exception("仓库不能为空，请检查后重新提交！");
			}
			String materialId = MaterialBomMgr.getInstance().getMaterialIdByBomId(v.getString("bomId"));// 物料id
			BigDecimal volume = v.getBigDecimal("volume");// 数量
			if (volume.compareTo(BigDecimal.ZERO) <= 0) {
				throw new Exception("制造退货数量不能小于等于零，请重新输入！");
			}
			BigDecimal sum = null;
			if (isOut) {
//				GenericValue warehouseValue = PriceMgr.getInstance().getCurMaterialBalanceValue(warehouseId, materialId);
//				if (volume.compareTo(warehouseValue.getBigDecimal("volume")) > 0) {
//					throw new Exception("委外退货数量不能大于库存数量，请重新输入！");
//				}
				BigDecimal price = PriceMgr.getInstance().getPrice(warehouseId, materialId); // 物料单价
				sum = price.multiply(volume); // 物料金额

				// 返填单价和金额
				v.set("price", price);
				v.set("entrysum", sum);
				// v.set("checkedVolume", BigDecimal.ZERO);//避免结算后变零
				// 将金额加到总金额中
				totalSum = totalSum.add(sum);

				// 如果是出库业务，数量、金额转换为负数
				volume = volume.negate();
				sum = sum.negate();
			} else {
				sum = v.getBigDecimal("entrysum");// 金额

				// 将单价、金额返填为零
				v.set("price", BigDecimal.ZERO);
				v.set("entrysum", BigDecimal.ZERO);
				v.set("checkedVolume", BigDecimal.ZERO);
			}
			v.set("currentCheckVolume", BigDecimal.ZERO);
			v.store();
			Debug.log("委外退货单价计算:物料id" + materialId + ";数量" + volume + ";金额" + sum, "WorkshopReturnProductBizImp");

			// 构建计算条目
			PriceCalItem item = new PriceCalItem(bizDate, warehouseId, materialId, volume, sum, BillType.WorkshopReturnProduct, v.getString("id"), isOut, isCancel, null);

			// 计算分录单价
			PriceMgr.getInstance().calPrice(item);

			/*
			 * 由于委外退货后需要通过委外退货再重新入库，按客户要求，此处退货不影响加工商库存表
			 */
			// // 更新加工商库存表
			// ConsignPriceMgr.getInstance().update(processorId, materialId,
			// volume.negate(), sum.negate());
		}
		// 返填总金额
		billValue.set("totalsum", totalSum);
		billValue.store();
	}

}
