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
import org.ofbiz.partner.scm.pricemgr.PriceCalItem;
import org.ofbiz.partner.scm.pricemgr.PriceMgr;

public class InspectiveBizImp implements IBizStock {
	private Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();

	public void updateStock(GenericValue billValue, boolean isOut) throws Exception {
		Date bizDate = (Date) billValue.get("bizDate");

		// 获取单据id分录条目
		List<GenericValue> entryList = delegator.findByAnd("PurchaseWarehousingEntry", UtilMisc.toMap("parentId", billValue.getString("id")));

		for (GenericValue v : entryList) {
			String warehouseId = v.getString("warehouseWarehouseId");// 仓库id
			String materialId = v.getString("materialMaterialId");// 物料id
			BigDecimal volume = v.getBigDecimal("volume");// 数量
			BigDecimal sum = v.getBigDecimal("entrysum");// 金额
			Debug.log("采购入库单价计算:物料id" + materialId + ";数量" + volume + ";金额" + sum, "InspectiveBizImp");

			if (isOut) {
				// 如果是出库业务，数量、金额转换为负数
				volume = volume.negate();
				sum = sum.negate();
			}

			// 构建计算条目
			PriceCalItem item = new PriceCalItem(bizDate, warehouseId, materialId, volume, sum, BillType.PurchaseWarehouse, v.getString("id"), isOut, null);

			// 计算分录单价
			PriceMgr.getInstance().calPrice(item);
		}
	}
}
