package org.ofbiz.partner.scm.pricemgr.bizStockImp;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.pricemgr.BillType;
import org.ofbiz.partner.scm.pricemgr.ConsignPriceMgr;
import org.ofbiz.partner.scm.pricemgr.IBizStock;
import org.ofbiz.partner.scm.pricemgr.PriceCalItem;
import org.ofbiz.partner.scm.pricemgr.PriceMgr;
import org.ofbiz.partner.scm.pricemgr.WorkshopPriceMgr;

public class SupplierStockAdjustBizImp implements IBizStock {
	private Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();

	public synchronized void updateStock(GenericValue billValue, boolean isOut, boolean isCancel) throws Exception {
		Date bizDate = (Date) billValue.get("bizDate");

		// 获取单据id分录条目
		List<GenericValue> entryList = delegator.findByAnd("SupplierStockAdjustEntry", UtilMisc.toMap("parentId", billValue.getString("id")));
		
		BigDecimal totalsum = BigDecimal.ZERO;
		for (GenericValue v : entryList) {
			String billType = v.getString("billType");
			//根据盈亏类型判断出入库。
			if( ("0".equals(billType)) == !isCancel){
				isOut = false;
			}else{
				isOut = true;
			}
			
			String supplierId = v.getString("processorSupplierId");// 仓库id
			String materialId = v.getString("materialMaterialId");// 物料id
			BigDecimal volume = v.getBigDecimal("volume");// 数量
			BigDecimal price = ConsignPriceMgr.getInstance().getPrice(supplierId, materialId);
			if(price == BigDecimal.ZERO){
				price = v.getBigDecimal("price");
			}
			
			if(volume.compareTo(BigDecimal.ZERO)<=0){
				throw new Exception("供应商调整单入库物料数量不能小于等于零，请重新输入！");
			}
			BigDecimal sum = volume.multiply(price);// 金额
			Debug.log("供应商调整单入库单价计算:物料id" + materialId + ";数量" + volume + ";金额" + sum, "SupplierStockAdjustBizImp");
			
			v.set("price", price);
			v.set("entrysum", sum);
			
			totalsum = totalsum.add(sum);
			
			if (isOut) {
				// 如果是出库业务，数量、金额转换为负数
				volume = volume.negate();
				sum = sum.negate();
			}
			
			//更新供应商库存
			ConsignPriceMgr.getInstance().update(supplierId, materialId, volume, totalsum);
			
			v.store();
		}
		
		billValue.set("totalsum", totalsum);
		billValue.store();
	}
}
