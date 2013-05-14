package org.ofbiz.partner.scm.pricemgr.bizStockImp;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javolution.util.FastList;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.condition.EntityConditionList;
import org.ofbiz.entity.condition.EntityOperator;
import org.ofbiz.partner.scm.pricemgr.BillType;
import org.ofbiz.partner.scm.pricemgr.ConsumeMaterial;
import org.ofbiz.partner.scm.pricemgr.IBizStock;
import org.ofbiz.partner.scm.pricemgr.PriceCalItem;
import org.ofbiz.partner.scm.pricemgr.PriceMgr;
import org.ofbiz.partner.scm.pricemgr.Utils;
import org.ofbiz.partner.scm.pricemgr.WorkshopPriceMgr;

public class ProductOutwarehouseBizImp implements IBizStock {
	private Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();

	/**
	 * 成品出仓单业务实现类，结算时会调用该接口进行计算
	 * 
	 * 成品出仓类型（outwarehouseType）：1.正常出仓，2.改板出仓，3.返工出仓 1.正常出仓：属于成品发货，直接进行成品出仓即可。
	 * 2.改板出仓、返工出仓：需要将成品转化为物料后退回车间。
	 * 
	 * 更新库存余额表，更新打板物料库存 1. 根据条码获得入仓单据，从而获取实际耗料列表 2. 计算耗料列表的及成本，将相关物料退回到车间。 3.
	 * 计算板金额，并进行成品出仓
	 */
	public synchronized void updateStock(GenericValue billValue, boolean isOut, boolean isCancel) throws Exception {
		// 注意不能使用billHead.getDate方法，出产生castException异常
		Date bizDate = (Date) billValue.get("bizDate");
		if (bizDate == null || !Utils.isCurPeriod(bizDate)) {
			throw new Exception("单据业务日期不在当前系统期间");
		}

		// 判断业务类型合法性 ，成品进仓单只支持 ，非撤销出仓(isOut&&!isCancel) 和 撤销进仓(!isOut&&isCancel)
		// 两种情况
		if (isOut == isCancel) {
			throw new Exception("成品出仓单业务操作出错!");
		}

		// 获取单据id分录条目
		List<GenericValue> entryList = delegator.findByAnd("ProductOutwarehouseEntry", UtilMisc.toMap("parentId", billValue.getString("id")));

		// 整单的成本
		BigDecimal totalSum = BigDecimal.ZERO;
		for (GenericValue v : entryList) {
			String outwarehouseType = v.getString("outwarehouseType");// 仓库id
			String workshopId = v.getString("workshopWorkshopId");// 车间id
			String warehouseId = v.getString("warehouseWarehouseId");// 仓库id
			if (warehouseId == null || warehouseId.length() < 1) {
				throw new Exception("仓库不能为空，请检查后重新提交！");
			}
			String materialId = v.getString("materialMaterialId");// 物料id
			BigDecimal volume = v.getBigDecimal("volume");// 出仓数量
			Date lastUpdatedStamp = (Date) v.get("lastUpdatedStamp");

			String barcode1 = v.getString("barcode1");// 条码1
			String barcode2 = v.getString("barcode2");// 条码2

			if (volume.compareTo(BigDecimal.ZERO) <= 0) {
				throw new Exception("成品出仓数量不能小于等于零，请重新输入！");
			}

			/* 1. 获取实际耗料列表 */
			List<ConsumeMaterial> materialList = getMaterialList(barcode1, barcode2, lastUpdatedStamp);
			if (materialList.size() <= 0) {
				throw new Exception("未找到对应入仓单据，请确认输入产品条码、序列号是否正确？");
			}

			BigDecimal cost = BigDecimal.ZERO;// 打板成品单一板的成本

			/* 2. 计算耗料列表的及成本，将相关物料回退到车间 */
			for (ConsumeMaterial element : materialList) {
				/* 2.1 取每个耗料物料id和耗料金额 */
				String bomMaterialId = element.getMaterialId();
				BigDecimal bomAmount = volume.multiply(element.getConsumeQty());
				BigDecimal bomPrice = element.getPrice();
				BigDecimal bomSum = bomAmount.multiply(bomPrice);

				/* 2.2 将物料成本添加到板成本 */
				cost = cost.add(bomSum);

				/* 2.3 非正常出仓，需要将板转化为物料退回车间 */
				if (!"1".equals(outwarehouseType)) {
					/* 2.4 判断是否是出仓操作 */
					if("".equals(workshopId)){
						throw new Exception("出仓类型为改板、返工时，必须选择相应车间！");
					}
					/* 2.5 判断是否是出仓操作 */
					if (!isOut) {
						bomAmount = bomAmount.negate();
						bomSum = bomSum.negate();
					}

					/* 2.6 更新车间库存表 */
					WorkshopPriceMgr.getInstance().update(workshopId, bomMaterialId, bomAmount, bomSum);
				}
			}

			/* 3. 计算板金额，并进行成品出仓 */
			BigDecimal sum = null;
			if (isOut) {
				/* 3.1 计算板单价、金额 */
				BigDecimal price = cost; // 板单价
				sum = price.multiply(volume).setScale(6, RoundingMode.DOWN); // 板金额，取小数点后六位

				/* 3.2 返填单价和金额 */
				v.set("price", price);
				v.set("entrysum", sum);

				/* 3.3 将金额加到总金额中 */
				totalSum = totalSum.add(sum);

				/* 3.3 如果是出库业务，数量、金额转换为负数 */
				volume = volume.negate();
				sum = sum.negate();
			} else {
				sum = v.getBigDecimal("entrysum");// 金额

				/* 3.4 将单价、金额返填为零 */
				v.set("price", BigDecimal.ZERO);
				v.set("entrysum", BigDecimal.ZERO);
			}
			Debug.log("成品出仓单价计算:物料id" + materialId + ";数量" + volume + ";金额" + sum, "ProductOutwarehouseBizImp");

			// 构建计算条目
			PriceCalItem item = new PriceCalItem(bizDate, warehouseId, materialId, volume, sum, BillType.ProductOutwarehouse, v.getString("id"), isOut, isCancel, null);

			// 计算分录单价
			PriceMgr.getInstance().calPrice(item);

			// 保存单价、金额
			v.store();
		}
		// 返填总金额
		billValue.set("totalsum", totalSum);
		billValue.store();
	}

	/**
	 * 获取物料实际耗料明细列表
	 * 
	 * @author jeff 2012-7-15
	 * @param barcode1
	 * @param barcode2
	 * @return
	 */
	private List<ConsumeMaterial> getMaterialList(String barcode1, String barcode2, Date lastUpdatedStamp) throws Exception {
		List<ConsumeMaterial> consumeMaterialList = new ArrayList<ConsumeMaterial>();
		/* 1.根据条码，获取入仓单据分录编码 */
//		List<GenericValue> entryList = delegator.findByAnd("ProductInwarehouseEntry", UtilMisc.toMap("barcode1", barcode1, "barcode2", barcode2));
//		GenericValue tempValue = null;
//		GenericValue oneValue = null;
//		for(GenericValue entryValue : entryList) {
//			oneValue = entryValue;		//避免最后没有取到值
//			Date inDate = (Date) entryValue.get("lastUpdatedStamp");
//			// 只取出仓单时间大于 进仓单时间的
//			if(lastUpdatedStamp.after(inDate)){
//				if(tempValue != null){
//					// 只去最近一次进仓单单据
//					if(inDate.after((Date) tempValue.get("lastUpdatedStamp"))){
//						tempValue = entryValue;
//					}
//				} else {
//					tempValue = entryValue;
//				}
//			}
//		}
//		String entryId = "";
//		if(tempValue != null){
//			entryId = tempValue.getString("id");
//		} else {
//			entryId = oneValue.getString("id");
//		}
		
		/* 2. 从实际耗料表取 */
//		List<GenericValue> actualMaterialList = delegator.findByAnd("ProductInwarehouseEntryDetail",  UtilMisc.toMap("barcode1", barcode1, "barcode2", barcode2));
		EntityConditionList<EntityCondition> condition = null;
		List<EntityCondition> conds = FastList.newInstance();
		conds.add(EntityCondition.makeCondition("barcode1", barcode1));
		conds.add(EntityCondition.makeCondition("barcode2", barcode2));
		condition = EntityCondition.makeCondition(conds);
		//增加排序字段
		List<String> orders = new ArrayList<String>();
		orders.add("price");
		List<GenericValue> actualMaterialList = delegator.findList("ProductInwarehouseEntryDetail", condition, null, orders, null, false);
		
		/* 3. 实际耗料表存在耗料信息 */
		if (actualMaterialList != null && actualMaterialList.size() > 0) {
			Map<String, Boolean> consumeMaterialMap=new HashMap<String, Boolean>();
			for (GenericValue v : actualMaterialList) {
				String materialId=v.getString("materialId");
				if(!consumeMaterialMap.containsKey(materialId)){
					consumeMaterialList.add(new ConsumeMaterial(materialId, v.getBigDecimal("quantity"), v.getBigDecimal("price"), v.getString("id")));
					consumeMaterialMap.put(materialId, true);
				}
				
			}
		}
		return consumeMaterialList;
	}
}
