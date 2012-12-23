package org.ofbiz.partner.scm.pricemgr.bizStockImp;

import java.math.BigDecimal;
import java.util.List;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.pricemgr.IBizStock;
import org.ofbiz.partner.scm.pricemgr.PurchasePriceMgr;

public class PurchaseBillBizImp implements IBizStock {
	private Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();

	public synchronized void updateStock(GenericValue billValue, boolean isOut, boolean isCancel) throws Exception {
		// 获取单据id分录条目
		List<GenericValue> entryList = delegator.findByAnd("PurchaseBillEntry", UtilMisc.toMap("parentId", billValue.getString("id")));

		for (GenericValue v : entryList) {
			String materialId = v.getString("materialMaterialId");// 物料id
			BigDecimal volume = v.getBigDecimal("volume");// 数量
			BigDecimal price = v.getBigDecimal("price");// 单价
			
			if(volume.compareTo(BigDecimal.ZERO)<=0){
				throw new Exception("采购单物料数量不能小于等于零，请重新输入！");
			}
			
			// 供应商id
			String supplierId = billValue.getString("supplierSupplierId");
			if (supplierId == null || supplierId.length() < 1) {
				throw new Exception("采购单供应商为空！！！");
			}
			PurchasePriceMgr.getInstance().updateBillValue(supplierId, materialId, volume, price, isOut, isCancel);
		}
	}
}
