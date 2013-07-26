package org.ofbiz.partner.scm.pricemgr.bizStockImp;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javolution.util.FastList;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.condition.EntityConditionList;
import org.ofbiz.entity.jdbc.ConnectionFactory;
import org.ofbiz.partner.scm.pricemgr.BillType;
import org.ofbiz.partner.scm.pricemgr.ConsumeMaterial;
import org.ofbiz.partner.scm.pricemgr.IBizStock;
import org.ofbiz.partner.scm.pricemgr.PriceCalItem;
import org.ofbiz.partner.scm.pricemgr.PriceMgr;
import org.ofbiz.partner.scm.pricemgr.ProductPriceMgr;
import org.ofbiz.partner.scm.pricemgr.Utils;

public class ProductReturnBizImp implements IBizStock {
	private Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
	private static final String module = org.ofbiz.partner.scm.pricemgr.bizStockImp.ProductReturnBizImp.class.getName();
	
	/**
	 * 
	 * @author  Mark 
	 * @lastUpdated 2012-7-14
	 * 
	 * 成品退货单业务实现类，结算时会调用该接口进行计算,应该在一个事务中执行
	 * 
	 * 1.通过条码、序列号获取成品单价
	 * 2.更新库存余额表，更新打板物料库存
	 */
	public synchronized  void updateStock(GenericValue billValue, boolean isOut, boolean isCancel) throws Exception {
		// 注意不能使用billHead.getDate方法，出产生castException异常
		Date bizDate = (Date) billValue.get("bizDate");
		if (bizDate == null || !Utils.isCurPeriod(bizDate)) {
			throw new Exception("单据业务日期不在当前系统期间");
		}
		
		//判断业务类型合法性 ，成品退货单只支持 ，非撤销退货(!isOut&&!isCancel) 和 撤销出仓(isOut&&isCancel) 两种情况
		if(isOut!=isCancel){
			throw new Exception("成品退货单业务操作出错!");
		}
		
		// 获取单据分录条目
		List<GenericValue> entryList = delegator.findByAnd("ProductReturnEntry", UtilMisc.toMap("parentId", billValue.getString("id")));

		
		//整单的成本
		BigDecimal totalSum = BigDecimal.ZERO;
		for (GenericValue v : entryList) {
			String warehouseId = v.getString("warehouseWarehouseId");// 仓库id
			if (warehouseId == null || warehouseId.length() < 1) {
				throw new Exception("仓库不能为空，请检查后重新提交！");
			}
			String materialId = v.getString("materialMaterialId");// 打板物料id
			BigDecimal volume=v.getBigDecimal("volume");//入库数量（板）
			if(volume.compareTo(BigDecimal.ZERO)<=0){
				throw new Exception("成品退货数量不能小于等于零！");
			}
			/*1. 获取实际耗料列表  ， 支持10层的bom物料查找*/
			List<ConsumeMaterial> materialList = getMaterialList(v.getString("barcode1"),v.getString("barcode2"),isOut,bizDate,v.getString("id"),billValue.getString("id"));
			
			if (materialList.size() <= 0) {
				throw new Exception("未找到对应出仓单据，请确认输入产品条码、序列号是否正确？");
			}
			
			BigDecimal cost=BigDecimal.ZERO;//打板成品单一板的成本
			
			/*2. 更新耗料明细表,如果没有明细则新增明细信息*/
			for (ConsumeMaterial element : materialList) {
				//手工定义是总耗料
				BigDecimal bomAmount =element.getDetailId()==null? volume.multiply(element.getConsumeQty()):element.getConsumeQty();
				/*2.2  从车间库存表查找耗料单价*/
				BigDecimal curPrice=element.getPrice();
				/*2.3 计算成本 并汇总总成本*/
				BigDecimal curCost = bomAmount.multiply(curPrice);
				/*2.4 计算成本 并汇总总成本*/
				cost=cost.add(curCost);
			}
			
			/*3. 计算分录成品单价和成本 */
			
			BigDecimal entryCost=cost;//计算分录总成本
			
			if (!isOut&&!isCancel) {//退货非撤销
				
				//返填分录单价，金额
				v.set("price", cost);
				v.set("entrysum", entryCost);
				
				// 将金额加到总金额中
				totalSum = totalSum.add(entryCost);
				Debug.log("成品退货单价计算:物料id" + materialId + ";数量" + volume + ";金额" + entryCost, module);
			} else  if (isOut&&isCancel){//出仓 ，退货反操作，清空退货操作
				entryCost = v.getBigDecimal("entrysum");// 金额
				
				// 如果是出库业务，数量、金额转换为负数
				volume = volume.negate();
				entryCost = entryCost.negate();

				// 将单价、金额返填为零
				v.set("price", BigDecimal.ZERO);
				v.set("entrysum", BigDecimal.ZERO);
			}

			// 构建计算条目
			PriceCalItem item = new PriceCalItem(bizDate, warehouseId, materialId, volume, entryCost, BillType.ProductReturn, v.getString("id"), isOut, isCancel, null);

			// 计算板成品单价
			PriceMgr.getInstance().calPrice(item);
			
			// 成品报表计算
			ProductPriceMgr.getInstance().update("1", warehouseId, materialId, volume, entryCost, isOut, isCancel);
			
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
	private List<ConsumeMaterial> getMaterialList(String barcode1, String barcode2, boolean isOut,Date bizDate,String parentId,String parentParentId) throws Exception {
		List<ConsumeMaterial> consumeMaterialList = new ArrayList<ConsumeMaterial>();
		List<GenericValue> actualMaterialList = new ArrayList<GenericValue>();
		if(isOut){
			actualMaterialList = delegator.findByAnd("ProductInwarehouseEntryDetail", UtilMisc.toMap("barcode1", barcode1,"barcode2",barcode2));
			moveDetailData(barcode1, barcode2, isOut,bizDate,parentId,parentParentId);
		} else {
			moveDetailData(barcode1, barcode2, isOut,bizDate,parentId,parentParentId);
			actualMaterialList = delegator.findByAnd("ProductInwarehouseEntryDetail", UtilMisc.toMap("barcode1", barcode1,"barcode2",barcode2));
		}
		/*2. 实际耗料表存在耗料信息*/
		if(actualMaterialList!=null&&actualMaterialList.size()>0){
			for(GenericValue v:actualMaterialList){
				consumeMaterialList.add(new ConsumeMaterial(v.getString("materialId"),v.getBigDecimal("quantity"),v.getBigDecimal("price"),v.getString("id")));
			}
		}
		return consumeMaterialList;
	}
	
	/**
	 * 成品退货进仓时，复制历史表中最新出仓记录数据，生成进仓耗料明细数据
	 * @param barcode1
	 * @param barcode2
	 */
	private void moveDetailData(String barcode1, String barcode2, boolean isOut,Date bizDate,String parentId,String parentParentId) throws Exception{
		if(isOut){
			Connection conn = null;
			try {
				conn = ConnectionFactory.getConnection(org.ofbiz.partner.scm.common.Utils.getConnectionHelperName());
				
				// 删除原表记录
				String deleteSql = "DELETE FROM PRODUCT_INWAREHOUSE_ENTRY_DETAIL WHERE IN_PARENT_ID='"+parentId+"'";
				
				Statement st = conn.createStatement();
				st.addBatch(deleteSql);
				st.executeBatch();
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				if (conn != null) {
					try {
						conn.close();
					} catch (SQLException e) {
						e.printStackTrace();
					}
				}
			}
		} else {
			List<GenericValue> actualMaterialList = new ArrayList<GenericValue>();
			
			EntityConditionList<EntityCondition> condition = null;
			List<EntityCondition> conds = FastList.newInstance();
			conds.add(EntityCondition.makeCondition("barcode1", barcode1));
			conds.add(EntityCondition.makeCondition("barcode2", barcode2));
			condition = EntityCondition.makeCondition(conds);
			//增加排序字段，优先取最晚出仓数据
			List<String> orders = new ArrayList<String>();
			orders.add("outBizDate DESC");
			actualMaterialList = delegator.findList("ProductInwarehouseEntryDetailHis", condition, null, orders, null, false);
			
			/* 3. 实际耗料表存在耗料信息 */
			if (actualMaterialList != null && actualMaterialList.size() > 0) {
				String entryId = "";
				for (GenericValue v : actualMaterialList) {
					if(entryId.isEmpty()){
						entryId = v.getString("outParentId");
					}
					if(entryId.equals(v.getString("outParentId"))){
						/*新增耗料明细*/
					     GenericValue entryDetailValue=delegator.makeValue("ProductInwarehouseEntryDetail");
					     entryDetailValue.set("id", UUID.randomUUID().toString());
					     entryDetailValue.set("inBizDate", bizDate);
					     entryDetailValue.set("inParentParentId", parentParentId);
					     entryDetailValue.set("inParentId", parentId);
					     entryDetailValue.set("barcode1", v.getString("barcode1"));
					     entryDetailValue.set("barcode2", v.getString("barcode2"));
					     /* 设置物料信息, 规格型号、计量单位*/
					     entryDetailValue.set("materialId", v.getString("materialId"));
					     
					     entryDetailValue.set("model", v.getString("model"));
					     entryDetailValue.set("quantity",v.getString("quantity"));//保存总耗料
					     entryDetailValue.set("unitUnitId", v.getString("unitUnitId"));
					     
					     entryDetailValue.set("price", v.getString("price"));
					     entryDetailValue.set("amount", v.getString("amount"));
					     entryDetailValue.set("isIn", 1);
					     entryDetailValue.set("isOut", 0);
					     
					     delegator.create(entryDetailValue);
					}
				}
			}
		}
	}
}
