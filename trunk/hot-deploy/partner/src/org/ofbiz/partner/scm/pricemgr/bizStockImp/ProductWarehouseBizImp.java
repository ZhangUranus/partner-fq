package org.ofbiz.partner.scm.pricemgr.bizStockImp;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.partner.scm.pricemgr.BillType;
import org.ofbiz.partner.scm.pricemgr.ConsumeMaterial;
import org.ofbiz.partner.scm.pricemgr.IBizStock;
import org.ofbiz.partner.scm.pricemgr.PriceCalItem;
import org.ofbiz.partner.scm.pricemgr.PriceMgr;
import org.ofbiz.partner.scm.pricemgr.Utils;
import org.ofbiz.partner.scm.pricemgr.WorkshopPriceMgr;

public class ProductWarehouseBizImp implements IBizStock {
	private Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
	private static final String module = org.ofbiz.partner.scm.pricemgr.bizStockImp.ProductWarehouseBizImp.class.getName();
	
	/**
	 * 
	 * @author  Mark 
	 * @lastUpdated 2012-7-14
	 * 
	 * 成品进仓单业务实现类，结算时会调用该接口进行计算,应该在一个事务中执行
	 * 
	 * 更新库存余额表，更新打板物料库存
	 * 1. 计算实际耗料 ，从车间物料单价表获取物料单价
	 * 2. 计算耗料列表的成本，合计成为本打板物料的成品
	 * 3. 打板物料入仓
	 * 4. 更新进仓成品的实际耗料表单价，如果没有定义耗料表，就新增实际耗料记录
	 */
	public synchronized  void updateStock(GenericValue billValue, boolean isOut, boolean isCancel) throws Exception {
		// 注意不能使用billHead.getDate方法，出产生castException异常
		Date bizDate = (Date) billValue.get("bizDate");
		if (bizDate == null || !Utils.isCurPeriod(bizDate)) {
			throw new Exception("单据业务日期不在当前系统期间");
		}
		
		//判断业务类型合法性 ，成品进仓单只支持 ，非撤销进仓(!isOut&&!isCancel) 和 撤销出仓(isOut&&isCancel) 两种情况
		if(isOut!=isCancel){
			throw new Exception("成品进仓单业务操作出错!");
		}
		
		// 获取单据分录条目
		List<GenericValue> entryList = delegator.findByAnd("ProductInwarehouseEntry", UtilMisc.toMap("parentId", billValue.getString("id")));

		
		//整单的成本
		BigDecimal totalSum = BigDecimal.ZERO;
		for (GenericValue v : entryList) {
			String entryId=v.getString("id");//分录id
			String workshopId=v.getString("workshopWorkshopId");//车间id
			if (workshopId == null || workshopId.length() < 1) {
				throw new Exception("仓库不能为空，请检查后重新提交！");
			}
			String warehouseId = v.getString("warehouseWarehouseId");// 仓库id
			if (warehouseId == null || warehouseId.length() < 1) {
				throw new Exception("仓库不能为空，请检查后重新提交！");
			}
			String materialId = v.getString("materialMaterialId");// 打板物料id
			BigDecimal volume=v.getBigDecimal("volume");//入库数量（板）
			if(volume.compareTo(BigDecimal.ZERO)<=0){
				throw new Exception("成品进仓数量不能小于等于零！");
			}
			/*1. 获取实际耗料列表  ， 支持10层的bom物料查找*/
			List<ConsumeMaterial> materialList = getMaterialList(entryId,materialId);
			
			
			BigDecimal cost=BigDecimal.ZERO;//打板成品单一板的成本
			
			/*2. 更新耗料明细表,如果没有明细则新增明细信息*/
			for (ConsumeMaterial element : materialList) {
				/*2.1  取每个耗料物料id和耗料金额*/
				String bomMaterialId = element.getMaterialId();
				//手工定义是总耗料
				BigDecimal bomAmount =element.getDetailId()==null? volume.multiply(element.getConsumeQty()):element.getConsumeQty();
				/*2.2  从车间库存表查找耗料单价*/
				BigDecimal curPrice = BigDecimal.ZERO;
				if(!isOut&&!isCancel){
					curPrice = WorkshopPriceMgr.getInstance().getPrice(workshopId, bomMaterialId);
				} else {
					curPrice = element.getPrice();
				}
				/*2.3 计算成本 并汇总总成本*/
				BigDecimal curCost = bomAmount.multiply(curPrice);
				/*2.4 计算成本 并汇总总成本*/
				cost=cost.add(curCost);
				
				
				/*2.4 更新耗料明细单价和金额，更新车间单价表*/
				if(!isOut&&!isCancel){
					/*2.4.1 进仓操作更新耗料明细单价和金额*/
					if(element.getDetailId()==null){
						 /*新增耗料明细*/
					     GenericValue entryDetailValue=delegator.makeValue("ProductInwarehouseEntryDetail");
					     entryDetailValue.set("id", UUID.randomUUID().toString());
					     entryDetailValue.set("parentId", entryId);
					     entryDetailValue.set("barcode1", v.getString("barcode1"));
					     entryDetailValue.set("barcode2", v.getString("barcode2"));
					     /* 设置物料信息, 规格型号、计量单位*/
					     entryDetailValue.set("materialId", bomMaterialId);
					     
					     GenericValue mv=delegator.findOne("TMaterial", false, "id",bomMaterialId);
					     entryDetailValue.set("model", mv.getString("model"));
					     entryDetailValue.set("quantity",volume.multiply(element.getConsumeQty()));//保存总耗料
					     entryDetailValue.set("unitUnitId", mv.getString("defaultUnitId"));
					     
					     entryDetailValue.set("price", curPrice);
					     entryDetailValue.set("amount", curCost);
					     delegator.create(entryDetailValue);
					}else{
						/* 更新耗料明细*/
						delegator.storeByCondition("ProductInwarehouseEntryDetail", UtilMisc.toMap("price",curPrice ,"amount",curCost), EntityCondition.makeCondition("id", element.getDetailId()));
					}
					/*2.4.2 扣减车间单价表数量、金额*/
					WorkshopPriceMgr.getInstance().update(workshopId, bomMaterialId, bomAmount.negate(), curCost.negate());
				}else if (isOut&&isCancel){//撤销出仓
					/*2.4.3 清除明细单价和金额*/
					delegator.storeByCondition("ProductInwarehouseEntryDetail", UtilMisc.toMap("price",BigDecimal.ZERO ,"amount",BigDecimal.ZERO), EntityCondition.makeCondition("id", element.getDetailId()));
					/*2.4.4 仓库出仓到车间返回扣减的耗料*/
					WorkshopPriceMgr.getInstance().update(workshopId, bomMaterialId, bomAmount, curCost);
				} 
			}
			
			/*3. 计算分录成品单价和成本 */
			
			BigDecimal entryCost=cost.multiply(volume);//计算分录总成本
			
			if (!isOut&&!isCancel) {//进仓非撤销
				
				//返填分录单价，金额
				v.set("price", cost);
				v.set("entrysum", entryCost);
				
				// 将金额加到总金额中
				totalSum = totalSum.add(entryCost);
				Debug.log("成品入库单价计算:物料id" + materialId + ";数量" + volume + ";金额" + entryCost, module);
			} else  if (isOut&&isCancel){//出仓 ，进仓反操作，清空进仓操作
				entryCost = v.getBigDecimal("entrysum");// 金额
				
				// 如果是出库业务，数量、金额转换为负数
				volume = volume.negate();
				entryCost = entryCost.negate();

				// 将单价、金额返填为零
				v.set("price", BigDecimal.ZERO);
				v.set("entrysum", BigDecimal.ZERO);
			}

			// 构建计算条目
			PriceCalItem item = new PriceCalItem(bizDate, warehouseId, materialId, volume, entryCost, BillType.ProductWarehouse, v.getString("id"), isOut, isCancel, null);

			// 计算板成品单价
			PriceMgr.getInstance().calPrice(item);
			v.store();
		}
		// 返填总金额
		billValue.set("totalsum", totalSum);
		billValue.store();
	}

	/**
	 * 获取物料实际耗料明细列表
	 * 如果存在实际耗料明细，则通过实际耗料表计算，不再查找bom单
	 * 如果不存在实际耗料明细，则通过bom单查找耗料明细，该明细只是理论的耗料
	 * @author Mark 2012-7-3
	 * @param  entryId
	 * @param  materialId
	 * @return
	 */
	private List<ConsumeMaterial> getMaterialList(String entryId, String materialId) throws Exception {
		List<ConsumeMaterial> consumeMaterialList=new ArrayList<ConsumeMaterial>();
		/*1. 从实际耗料表取*/
		List<GenericValue> actualMaterialList=delegator.findByAnd("ProductInwarehouseEntryDetail", UtilMisc.toMap("parentId", entryId));
		/*2. 实际耗料表存在耗料信息*/
		if(actualMaterialList!=null&&actualMaterialList.size()>0){
			for(GenericValue v:actualMaterialList){
				consumeMaterialList.add(new ConsumeMaterial(v.getString("materialId"),v.getBigDecimal("quantity"),v.getBigDecimal("price"),v.getString("id")));
			}
		}else{
		/*3. 实际耗料表不存在耗料信息，需要从bom单计算理论耗料*/
			consumeMaterialList.addAll(Utils.getBomMaterialDetail(materialId, 0));
		}
		
		return consumeMaterialList;
	}
	

}
