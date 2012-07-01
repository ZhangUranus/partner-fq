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
import org.ofbiz.partner.scm.pricemgr.ConsignProcessedPriceMgr;
import org.ofbiz.partner.scm.pricemgr.IBizStock;
import org.ofbiz.partner.scm.pricemgr.MaterialBomMgr;
import org.ofbiz.partner.scm.pricemgr.PriceCalItem;
import org.ofbiz.partner.scm.pricemgr.PriceMgr;
import org.ofbiz.partner.scm.pricemgr.Utils;

public class ConsignWarehousingBizImp implements IBizStock {
	private Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();

	public synchronized  void updateStock(GenericValue billValue, boolean isOut, boolean isCancel) throws Exception {
		// 注意不能使用billHead.getDate方法，出产生castException异常
		Date bizDate = (Date) billValue.get("bizDate");
		if (bizDate == null || !Utils.isCurPeriod(bizDate)) {
			throw new Exception("单据业务日期不在当前系统期间");
		}
		// 供应商id
		String processorId = billValue.getString("processorSupplierId");
		if (processorId == null || processorId.length() < 1) {
			throw new Exception("委外入库单加工商为空！！！");
		}

		// 获取单据id分录条目
		List<GenericValue> entryList = delegator.findByAnd("ConsignWarehousingEntry", UtilMisc.toMap("parentId", billValue.getString("id")));

		BigDecimal totalSum = BigDecimal.ZERO;
		for (GenericValue v : entryList) {
			String warehouseId = v.getString("warehouseWarehouseId");// 仓库id
			String materialId = MaterialBomMgr.getInstance().getMaterialIdByBomId(v.getString("bomId"));// 物料id
			BigDecimal volume = v.getBigDecimal("volume");// 数量
			if(volume.compareTo(BigDecimal.ZERO)<=0){
				throw new Exception("委外入库数量不能小于等于零，请重新输入！");
			}
			BigDecimal sum = null;
			if (!isOut) {
				if(!ConsignPriceMgr.getInstance().checkReturnProductWarehousingStatus(processorId, materialId)){
					throw new Exception("供应商存在未验收加工件，不允许进行入库操作，请访问“委外退货”页面进行验收！");
				}
				BigDecimal price = ConsignPriceMgr.getInstance().CreateConsignPriceDetailList(processorId, v.getString("bomId"), v.getString("id"));
				sum = price.add(v.getBigDecimal("processPrice")).multiply(volume);
				
				//耗料金额
//				BigDecimal costSum = price.multiply(volume);
				
				//增加额外耗料金额
//				BigDecimal extraSum = ConsignPriceMgr.getInstance().updateWarehousingExtraCommit(v);
//				sum = sum.add(extraSum);
//				costSum = costSum.add(extraSum);
				
				//返填单价，金额
				v.set("price", price);
				v.set("entrysum", sum);
				
				// 将金额加到总金额中
				totalSum = totalSum.add(sum);
			} else {
				sum = v.getBigDecimal("entrysum");// 金额
				
				//回滚额外耗料计算
//				ConsignPriceMgr.getInstance().updateWarehousingExtraRollback(v);
				
				// 如果是出库业务，数量、金额转换为负数
				volume = volume.negate();
				sum = sum.negate();

				// 将单价、金额返填为零
				v.set("price", BigDecimal.ZERO);
				v.set("entrysum", BigDecimal.ZERO);
			}
			Debug.log("委外入库单价计算:物料id" + materialId + ";数量" + volume + ";金额" + sum, "ConsignWarehousingBizImp");

			// 构建计算条目
			PriceCalItem item = new PriceCalItem(bizDate, warehouseId, materialId, volume, sum, BillType.ConsignWarehousing, v.getString("id"), isOut, isCancel, null);

			// 计算分录单价
			PriceMgr.getInstance().calPrice(item);

			// 更新加工商库存表
			List<List> materialList = ConsignPriceMgr.getInstance().getMaterialList(v.getString("id"));
			for (List element : materialList) {
				String bomMaterialId = (String) element.get(0);
				//取出的耗料数量、金额只是单个加工件的，需要乘于加工件数量
				BigDecimal bomAmount = volume.multiply((BigDecimal) element.get(1));
				BigDecimal bomSum = volume.multiply((BigDecimal) element.get(2));
				ConsignPriceMgr.getInstance().update(processorId, bomMaterialId, bomAmount.negate(), bomSum.negate());
			}
			if(isOut){
				ConsignPriceMgr.getInstance().removeMaterialList(v.getString("id"));
			}
			
			//更新加工商对数表
			ConsignProcessedPriceMgr.getInstance().update(1,processorId, materialId, volume, v.getBigDecimal("processPrice"), isOut, isCancel);
			
			v.store();
		}
		
		// 返填总金额
		billValue.set("totalsum", totalSum);
		billValue.store();
	}

}
