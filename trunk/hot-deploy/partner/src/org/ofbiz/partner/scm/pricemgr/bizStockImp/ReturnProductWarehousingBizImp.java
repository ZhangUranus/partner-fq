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
import org.ofbiz.partner.scm.pricemgr.Utils;
import org.ofbiz.partner.scm.pricemgr.WorkshopPriceMgr;

public class ReturnProductWarehousingBizImp implements IBizStock {
	private Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();

	public void updateStock(GenericValue billValue, boolean isOut) throws Exception {
		// 注意不能使用billHead.getDate方法，出产生castException异常
		Date bizDate = (Date) billValue.get("bizDate");
		if (bizDate == null || !Utils.isCurPeriod(bizDate)) {
			throw new Exception("单据业务日期不在当前系统期间");
		}
		// 获取单据id分录条目
		List<GenericValue> entryList = delegator.findByAnd("ReturnProductWarehousingEntry", UtilMisc.toMap("parentId", billValue.getString("id")));
		
		for (GenericValue v : entryList) {
			String warehouseId = v.getString("warehouseWarehouseId");// 仓库id
			String materialId = v.getString("materialMaterialId");// 物料id
			BigDecimal volume = v.getBigDecimal("volume");// 数量
			BigDecimal sum = v.getBigDecimal("entrysum");
			
			//增加额外耗料金额
			BigDecimal extraSum = WorkshopPriceMgr.getInstance().updateMaterialExtra(v);
			sum = sum.add(extraSum);
			
			Debug.log("退货入库库单价计算:物料id" + materialId + ";数量" + volume + ";金额" + sum, "ReturnProductWarehousingBizImp");

			// 构建计算条目
			PriceCalItem item = new PriceCalItem(bizDate, warehouseId, materialId, volume, sum, BillType.ReturnProductWarehousing, v.getString("id"), isOut, null);

			// 计算分录单价
			PriceMgr.getInstance().calPrice(item);
		}
	}
}
