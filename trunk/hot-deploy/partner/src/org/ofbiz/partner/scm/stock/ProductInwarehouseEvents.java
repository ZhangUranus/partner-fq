package org.ofbiz.partner.scm.stock;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.transaction.GenericTransactionException;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.partner.scm.common.BarCode;
import org.ofbiz.partner.scm.common.BillBaseEvent;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.common.SerialNumberHelper;
import org.ofbiz.partner.scm.dao.TMaterial;
import org.ofbiz.partner.scm.pricemgr.BillType;
import org.ofbiz.partner.scm.pricemgr.BizStockImpFactory;
import org.ofbiz.partner.scm.pricemgr.Utils;

/**
 * 成品进仓 业务处理事件
 * @author mark
 *
 */
public class ProductInwarehouseEvents {
	private static final String module = org.ofbiz.partner.scm.stock.ProductInwarehouseEvents.class.getName();
	
	/**
	 * 成品进仓单提交 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String submitBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();

			Delegator delegator = (Delegator) request.getAttribute("delegator");
			String billId = request.getParameter("billId");// 单据id
			Date bizDate =null;
			if (delegator != null && billId != null) {
				Debug.log("成品入库单提交:" + billId, module);
				GenericValue billHead = delegator.findOne("ProductInwarehouse", UtilMisc.toMap("id", billId), false);

				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ProductInwarehouse bill or bizdate is null");
				}
				//注意不能使用billHead.getDate方法，出产生castException异常
				bizDate= (Date) billHead.get("bizDate");
				
				BizStockImpFactory.getBizStockImp(BillType.ProductWarehouse).updateStock(billHead, false, false);
			}
			
			//更新周汇总表
			// 获取单据分录条目
			List<GenericValue> entryList = delegator.findByAnd("ProductInwarehouseEntry", UtilMisc.toMap("parentId", billId));
			 
			for (GenericValue v : entryList) {
				BarCode barcode = new BarCode(v.getString("barcode1"),v.getString("barcode2"));
				String testMaterialId = Utils.getMaterialIdByIkea(barcode.getCodeForIkea(), barcode.getQuantity());
				if(testMaterialId == null || "".equals(testMaterialId)){
					throw new Exception("通过条码获取产品错误，请检查产品资料表是否已经存在该产品。");
				}
				String materialId = v.getString("materialMaterialId");// 打板物料id
				if(!testMaterialId.equals(materialId)){
					throw new Exception("选择的产品和产品条码核对错误，请重新检查！");
				}
				BigDecimal volume = v.getBigDecimal("volume");//入库数量（板）
				Long qantity = Long.parseLong(barcode.getQuantity());//板数量（一板有多少产品）
				//成品进仓 
				WeeklyStockMgr.getInstance().updateStock(materialId, bizDate, ProductStockType.IN, volume, false);
				ProductInOutStockMgr.getInstance().updateStock(materialId, ProductStockType.IN, qantity, volume, false);
				v.set("productWeek", Utils.getYearWeekStr(bizDate));
				v.set("qantity", qantity);
				v.store();
			}

			BillBaseEvent.submitBill(request, response);// 更新单据状态
			TransactionUtil.commit(beganTransaction);
		} catch (Exception e) {
			Debug.logError(e, module);
			try {
				TransactionUtil.rollback(beganTransaction, e.getMessage(), e);
			} catch (GenericTransactionException e2) {
				Debug.logError(e2, "Unable to rollback transaction", module);
			}
			throw e;
		}
		return "success";
	}
	
	/**
	 * 成品入库单撤销
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String rollbackBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();

			Delegator delegator = (Delegator) request.getAttribute("delegator");
			String billId = request.getParameter("billId");// 单据id
			Date bizDate =null;
			if (delegator != null && billId != null) {
				Debug.log("入库单撤销:" + billId, module);
				GenericValue billHead = delegator.findOne("ProductInwarehouse", UtilMisc.toMap("id", billId), false);

				if (billHead == null ||billHead.get("bizDate") == null) {
					throw new Exception("can`t find ProductInwarehouse bill or bizdate is null");
				}


				//注意不能使用billHead.getDate方法，出产生castException异常
				bizDate= (Date) billHead.get("bizDate");
				
				
				BizStockImpFactory.getBizStockImp(BillType.ProductWarehouse).updateStock(billHead, true, true);
			}
			

			//更新周汇总表
			// 获取单据分录条目
			List<GenericValue> entryList = delegator.findByAnd("ProductInwarehouseEntry", UtilMisc.toMap("parentId", billId));
			 
			for (GenericValue v : entryList) {
				String materialId = v.getString("materialMaterialId");// 打板物料id
				BigDecimal volume = v.getBigDecimal("volume");//入库数量（板）
				Long qantity = v.getLong("qantity");//板数量（一板有多少产品）
				
				//成品进仓撤销，负数
				WeeklyStockMgr.getInstance().updateStock(materialId, bizDate, ProductStockType.IN, volume, true);
				ProductInOutStockMgr.getInstance().updateStock(materialId, ProductStockType.IN, qantity, volume, true);
			}
			
			BillBaseEvent.rollbackBill(request, response);// 撤销单据
			TransactionUtil.commit(beganTransaction);
		} catch (Exception e) {
			Debug.logError(e, module);
			try {
				TransactionUtil.rollback(beganTransaction, e.getMessage(), e);
			} catch (GenericTransactionException e2) {
				Debug.logError(e2, "Unable to rollback transaction", module);
			}
			throw e;
		}return "success";
	}
	
	/**
	 * 扫描提交
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String scanSubmit(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();
			/*1. 校验数据合法性*/
			
			/*2. 生成成品进仓单*/
			
			/*2.1 新建成品进仓单据头*/
			GenericValue billHead=delegator.makeValue("ProductInwarehouse");
			String billId=UUID.randomUUID().toString();
			billHead.setString("id", billId);
			billHead.setString("number", new SerialNumberHelper().getSerialNumber(request, "ProductInwarehouse"));
			billHead.set("bizDate", new Timestamp(new Date().getTime()));
			billHead.set("inspectorSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
			billHead.set("status", "0");//保存状态
			
			JSONArray entrys=JSONArray.fromObject(request.getParameter("records"));
			
			/*2.2 构建成品进仓单据分录 更新相关联的成品进仓扫描单 */
			if(entrys==null||entrys.size()<1)throw new Exception("误操作，未找到扫描数据！");
			
			int sort = 1;
			for (Object obj : entrys) {
				JSONObject entry=(JSONObject) obj;
				
				String entryId=UUID.randomUUID().toString();
				
				if(!entry.containsKey("inWarehouseType") || entry.getString("inWarehouseType").trim().length()<1){
					throw new Exception("进仓类型不能为空，请选择进仓类型！");
				}
				String inWarehouseType = entry.getString("inWarehouseType");
				
				if(!entry.containsKey("warehouseId") || entry.getString("warehouseId").trim().length()<1){
					throw new Exception("装货仓库不能为空，请选择装货仓库！");
				}
				String warehouseId=entry.getString("warehouseId");
				
				if(!entry.containsKey("workshopId") || entry.getString("workshopId").trim().length()<1){
					throw new Exception("包装车间不能为空，请选择包装车间！");
				}
				String workshopId=entry.getString("workshopId");
				
				String barcode1=entry.getString("barcode1");

				String barcode2=entry.getString("barcode2");

				BarCode barcode = new BarCode(barcode1,barcode2);
				String materialId = Utils.getMaterialIdByIkea(barcode.getCodeForIkea(), barcode.getQuantity());
				TMaterial material = new TMaterial(materialId);
				
				//新成品进仓单分录
				GenericValue ev=delegator.makeValue("ProductInwarehouseEntry");
				ev.setString("id", entryId);
				ev.setString("parentId", billId);
				ev.setString("workshopWorkshopId", workshopId);
				ev.setString("warehouseWarehouseId", warehouseId);
				ev.setString("materialMaterialId", materialId);
				ev.setString("productWeek", Utils.getYearWeekStr(new Date()));
				ev.setString("unitUnitId", material.getUnitId());
				ev.set("volume", 1);
				ev.setString("barcode1", barcode1);
				ev.setString("barcode2", barcode2);
				ev.setString("inwarehouseType", inWarehouseType);
				ev.set("qantity", Long.parseLong(barcode.getQuantity()));
				ev.set("sort", sort);
				delegator.create(ev);
				sort ++;
				
				// 确定条码、序列号可以进仓
				ProductBarcodeBoxMgr.getInstance().update(barcode1, barcode2, false);
			}
			
			delegator.create(billHead);
			
			/*3. 提交成品进仓单 , 逻辑与ProductInwarehouseEvents submit 方法一致*/
			Date bizDate =null;
			if (delegator != null && billId != null) {
				Debug.log("成品入库单提交:" + billId, module);
				GenericValue productBillHead = delegator.findOne("ProductInwarehouse", UtilMisc.toMap("id", billId), false);

				if (productBillHead == null || productBillHead.get("bizDate") == null) {
					throw new Exception("can`t find ProductInwarehouse bill or bizdate is null");
				}
				//注意不能使用billHead.getDate方法，出产生castException异常
				bizDate= (Date) productBillHead.get("bizDate");
				
				BizStockImpFactory.getBizStockImp(BillType.ProductWarehouse).updateStock(productBillHead, false, false);

				// 更新状态字段
				Map<String, Object> fieldSet = new HashMap<String, Object>();
				fieldSet.put("status", 4);// 设置为已提交状态
				fieldSet.put("submitterSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
				fieldSet.put("submitStamp", new Timestamp(System.currentTimeMillis()));
				delegator.storeByCondition("ProductInwarehouse", fieldSet, EntityCondition.makeConditionWhere("id='" + billId + "'"));
			}
			
			// 获取单据分录条目
			List<GenericValue> entryList = delegator.findByAnd("ProductInwarehouseEntry", UtilMisc.toMap("parentId", billId));
			
			Long qantity = new Long(0);
			for (GenericValue v : entryList) {
				String materialId = v.getString("materialMaterialId");// 打板物料id
				BigDecimal volume = v.getBigDecimal("volume");//入库数量（板）
				qantity = v.getLong("qantity");//板数量（一板有多少产品）
				//成品进仓 
				WeeklyStockMgr.getInstance().updateStock(materialId, bizDate, ProductStockType.IN, volume, false);
				ProductInOutStockMgr.getInstance().updateStock(materialId, ProductStockType.IN, qantity, volume, false);
			}
			StringBuffer jsonStr = new StringBuffer();
			jsonStr.append("{'success':true,'qantity':" + qantity + "}");
			BillBaseEvent.writeSuccessMessageToExt(response, jsonStr.toString());
			TransactionUtil.commit(beganTransaction);
		} catch (Exception e) {
			Debug.logError(e, module);
			try {
				TransactionUtil.rollback(beganTransaction, e.getMessage(), e);
			} catch (GenericTransactionException e2) {
				Debug.logError(e2, "Unable to rollback transaction", module);
			}
			throw e;
		}
		return "success";
	}
	
	/**
	 * 扫描提交
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String scanRollback(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();
			/*1. 校验数据合法性*/
			JSONArray entrys=JSONArray.fromObject(request.getParameter("records"));
			if(entrys==null||entrys.size()<1)throw new Exception("误操作，未找到扫描数据！");
			
			String barcode1 = "";
			String barcode2 = "";
			
			/*1.1 确定该条码是否可以进行出仓操作，扫描入库的单据分录，只会有一条记录 */
			for (Object obj : entrys) {
				JSONObject entry=(JSONObject) obj;
				
				barcode1=entry.getString("barcode1");
				barcode2=entry.getString("barcode2");
				
				/* 1.2确定条码、序列号可以进仓 */ 
				ProductBarcodeBoxMgr.getInstance().update(barcode1, barcode2, true);
			}
			
			/* 2 获取单据分录条目 */
			List<GenericValue> entryList = delegator.findByAnd("ProductInwarehouseEntry", UtilMisc.toMap("barcode1", barcode1, "barcode2", barcode2));
			
			String billId = "";
			if(entryList!=null && entryList.size()>0){
				GenericValue entryValue = entryList.get(0);
				billId = entryValue.getString("parentId");
			}
			
			/* 3 获取单据分录条目 */
			Debug.log("进仓单撤销:" + billId, module);
			GenericValue billHead = delegator.findOne("ProductInwarehouse", UtilMisc.toMap("id", billId), false);

			if (billHead == null ||billHead.get("bizDate") == null) {
				throw new Exception("找不到相应的成品进仓单！");
			}
			//注意不能使用billHead.getDate方法，出产生castException异常
			Date bizDate= (Date) billHead.get("bizDate");
				
			BizStockImpFactory.getBizStockImp(BillType.ProductWarehouse).updateStock(billHead, true, true);
			
			for (GenericValue v : entryList) {
				String materialId = v.getString("materialMaterialId");// 打板物料id
				BigDecimal volume = v.getBigDecimal("volume");//入库数量（板）
				Long qantity = v.getLong("qantity");//板数量（一板有多少产品）
				
				/* 3.1 成品进仓撤销，负数 */
				WeeklyStockMgr.getInstance().updateStock(materialId, bizDate, ProductStockType.IN, volume, true);
				ProductInOutStockMgr.getInstance().updateStock(materialId, ProductStockType.IN, qantity, volume, true);

				v.remove();	//删除分录
			}
			
			billHead.remove();		//删除主单
			
			BillBaseEvent.writeSuccessMessageToExt(response, "出仓成功！");
			TransactionUtil.commit(beganTransaction);
		} catch (Exception e) {
			Debug.logError(e, module);
			try {
				TransactionUtil.rollback(beganTransaction, e.getMessage(), e);
			} catch (GenericTransactionException e2) {
				Debug.logError(e2, "Unable to rollback transaction", module);
			}
			throw e;
		}
		return "success";
	}
}
