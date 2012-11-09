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

public class ProductManualOutwarehouseBizImp implements IBizStock {
	private Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();

	public synchronized void updateStock(GenericValue billValue, boolean isOut, boolean isCancel) throws Exception {
		Date bizDate = (Date) billValue.get("bizDate");

		// 获取单据id分录条目
		List<GenericValue> entryList = delegator.findByAnd("ProductManualOutwarehouseEntry", UtilMisc.toMap("parentId", billValue.getString("id")));

		BigDecimal totalSum = BigDecimal.ZERO;
		for (GenericValue v : entryList) {
			String warehouseId = v.getString("warehouseWarehouseId");// 仓库id
			String materialId = v.getString("materialMaterialId");// 物料id
			BigDecimal volume = v.getBigDecimal("volume");// 数量

			if (volume.compareTo(BigDecimal.ZERO) <= 0) {
				throw new Exception("成品手工出仓物料数量不能小于等于零，请重新输入！");
			}
			BigDecimal sum = null;
			if (isOut) {
				BigDecimal price = PriceMgr.getInstance().getPrice(warehouseId, materialId); // 物料单价
				sum = price.multiply(volume); // 物料金额

				// 返填单价和金额
				v.set("price", price);
				v.set("entrysum", sum);
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
			}
			Debug.log("成品手工出仓单价计算:物料id" + materialId + ";数量" + volume + ";金额" + sum, "ProductManualOutwarehouseBizImp");

			// 构建计算条目
			PriceCalItem item = new PriceCalItem(bizDate, warehouseId, materialId, volume, sum, BillType.ProductManualOutwarehouse, v.getString("id"), isOut, isCancel, null);

			// 计算分录单价
			PriceMgr.getInstance().calPrice(item);

			v.store();
		}

		// 返填总金额
		billValue.set("totalsum", totalSum);
		billValue.store();
	}
}
