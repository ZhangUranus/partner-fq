package org.ofbiz.partner.scm.pricemgr.bizStockImp;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import java.util.List;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.pricemgr.BillType;
import org.ofbiz.partner.scm.pricemgr.ConsignProcessedPriceMgr;
import org.ofbiz.partner.scm.pricemgr.IBizStock;
import org.ofbiz.partner.scm.pricemgr.MaterialBomMgr;
import org.ofbiz.partner.scm.pricemgr.PriceCalItem;
import org.ofbiz.partner.scm.pricemgr.PriceMgr;
import org.ofbiz.partner.scm.pricemgr.Utils;
import org.ofbiz.partner.scm.pricemgr.WorkshopPriceMgr;

public class ReturnProductWarehousingBizImp implements IBizStock {
	private Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();

	public synchronized void updateStock(GenericValue billValue, boolean isOut, boolean isCancel) throws Exception {
		// 注意不能使用billHead.getDate方法，出产生castException异常
		Date bizDate = (Date) billValue.get("bizDate");
		if (bizDate == null || !Utils.isCurPeriod(bizDate)) {
			throw new Exception("单据业务日期不在当前系统期间");
		}
		// 供应商id
		String processorId = billValue.getString("processorId");
		if (processorId == null || processorId.length() < 1) {
			throw new Exception("委外退料单加工商为空！！！");
		}
		// 入库单类型CRP委外进货单、WRP车间进货单
		String billType = billValue.getString("note");
		
		// 获取单据id分录条目
		List<GenericValue> entryList = delegator.findByAnd("ReturnProductWarehousingEntry", UtilMisc.toMap("parentId", billValue.getString("id")));
		
		BigDecimal totalSum = BigDecimal.ZERO;
		for (GenericValue v : entryList) {
			String warehouseId = v.getString("warehouseWarehouseId");// 仓库id
			String materialId = MaterialBomMgr.getInstance().getMaterialIdByBomId(v.getString("bomId"));// 物料id
			BigDecimal volume = v.getBigDecimal("volume");// 数量
			if(volume.compareTo(BigDecimal.ZERO)<=0){
				throw new Exception("进货数量不能小于等于零，请重新输入！");
			}
			BigDecimal sum = v.getBigDecimal("entrysum");
			
			//增加额外耗料金额
			BigDecimal extraSum = WorkshopPriceMgr.getInstance().updateMaterialExtra(v);
			sum = sum.add(extraSum);
			totalSum = totalSum.add(sum);
			
			//返填单价，金额
			v.set("price", sum.divide(volume, 6, RoundingMode.DOWN));
			v.set("entrysum", sum);
			v.store();
			
			Debug.log("退货入库库单价计算:物料id" + materialId + ";数量" + volume + ";金额" + sum, "ReturnProductWarehousingBizImp");

			// 构建计算条目
			PriceCalItem item = new PriceCalItem(bizDate, warehouseId, materialId, volume, sum, BillType.ReturnProductWarehousing, v.getString("id"), isOut, isCancel, null);

			// 计算分录单价
			PriceMgr.getInstance().calPrice(item);
			
			//更新加工商对数表
			if(billType.equals("CRP")){
				ConsignProcessedPriceMgr.getInstance().update(2,processorId, materialId, volume, null, isOut, isCancel);
			}
		}
		//返填总金额
		billValue.set("totalsum", totalSum);
		billValue.store();
	}
}
