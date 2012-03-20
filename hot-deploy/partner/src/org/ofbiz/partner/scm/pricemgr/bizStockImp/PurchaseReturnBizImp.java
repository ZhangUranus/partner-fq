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
import org.ofbiz.partner.scm.pricemgr.PurchasePriceMgr;

public class PurchaseReturnBizImp implements IBizStock {
	private Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();

	public void updateStock(GenericValue billValue, boolean isOut, boolean isCancel) throws Exception {
		Date bizDate = (Date) billValue.get("bizDate");

		int billType = billValue.getInteger("type");
		
		// 获取单据id分录条目
		List<GenericValue> entryList = delegator.findByAnd("PurchaseReturnEntry", UtilMisc.toMap("parentId", billValue.getString("id")));

		for (GenericValue v : entryList) {
			String warehouseId = v.getString("warehouseWarehouseId");// 仓库id
			String materialId = v.getString("materialMaterialId");// 物料id
			BigDecimal volume = v.getBigDecimal("volume");// 数量
			BigDecimal price = v.getBigDecimal("price");// 单价
			if(volume.compareTo(BigDecimal.ZERO)<=0){
				throw new Exception("委外退货数量不能小于等于零，请重新输入！");
			}
			BigDecimal sum = v.getBigDecimal("entrysum");// 金额
			Debug.log("采购退货单价计算:物料id" + materialId + ";数量" + volume + ";金额" + sum, "PurchaseReturnBizImp");

			if (isOut) {
				// 如果是出库业务，数量、金额转换为负数
				volume = volume.negate();
				sum = sum.negate();
			}

			// 构建计算条目
			PriceCalItem item = new PriceCalItem(bizDate, warehouseId, materialId, volume, sum, BillType.PurchaseReturn, v.getString("id"), isOut, isCancel, null);

			// 计算分录单价
			PriceMgr.getInstance().calPrice(item);
			
			if(billType == 1){
				// 供应商id
				String supplierId = billValue.getString("supplierSupplierId");
				if (supplierId == null || supplierId.length() < 1) {
					throw new Exception("采购退货单供应商为空！！！");
				}
				PurchasePriceMgr.getInstance().update(supplierId, materialId, volume.negate(), price, isOut, isCancel);
			}
		}
	}
}
