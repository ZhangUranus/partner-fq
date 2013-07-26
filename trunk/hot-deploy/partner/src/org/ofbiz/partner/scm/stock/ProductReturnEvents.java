package org.ofbiz.partner.scm.stock;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.transaction.GenericTransactionException;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.partner.scm.common.BarCode;
import org.ofbiz.partner.scm.common.BillBaseEvent;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.common.SerialNumberHelper;
import org.ofbiz.partner.scm.dao.TMaterial;
import org.ofbiz.partner.scm.pojo.VolumeOfProduct;
import org.ofbiz.partner.scm.pojo.WorkshopStock;
import org.ofbiz.partner.scm.pricemgr.BillType;
import org.ofbiz.partner.scm.pricemgr.BizStockImpFactory;
import org.ofbiz.partner.scm.pricemgr.ConsumeMaterial;
import org.ofbiz.partner.scm.pricemgr.Utils;

/**
 * 成品退货业务处理事件
 * 
 * @author mark
 * 
 */
public class ProductReturnEvents {
	private static final String module = org.ofbiz.partner.scm.stock.ProductReturnEvents.class.getName();

	/**
	 * 成品退货单提交
	 * 
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
			Date bizDate = null;
			if (delegator != null && billId != null) {
				Debug.log("成品退货单提交:" + billId, module);
				GenericValue billHead = delegator.findOne("ProductReturn", UtilMisc.toMap("id", billId), false);

				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ProductReturn bill or bizdate is null");
				}
				// 注意不能使用billHead.getDate方法，出产生castException异常
				bizDate = (Date) billHead.get("bizDate");
				
				//确定该单据为扫描单据还是手工单据。
				boolean isScanBill = false;
				int billType= billHead.getInteger("billType");
				if(billType == 2){
					isScanBill = true;
				}
				
				// 获取单据分录条目
				List<GenericValue> entryList = delegator.findByAnd("ProductReturnEntry", UtilMisc.toMap("parentId", billId));

				for (GenericValue v : entryList) {
					String barcode1 = v.getString("barcode1");
					String barcode2 = v.getString("barcode2");
					
					BarCode barcode = new BarCode(barcode1, barcode2);
					String testMaterialId = Utils.getMaterialIdByIkea(barcode.getCodeForIkea(), barcode.getQuantity());
					if (testMaterialId == null || "".equals(testMaterialId)) {
						throw new Exception("通过条码获取产品错误，请检查产品资料表是否已经存在该产品。");
					}
					String materialId = v.getString("materialMaterialId");// 打板物料id
					if (!testMaterialId.equals(materialId)) {
						throw new Exception("选择的产品和产品条码核对错误，请重新检查！");
					}
					BigDecimal volume = v.getBigDecimal("volume");// 入库数量（板）
					Long qantity = Long.parseLong(barcode.getQuantity());// 板数量（一板有多少产品）
					
					// 如果是扫描单据，在扫描时已经更新了周汇总和综合成品账报表数据，提交时不需要重复处理
					if(!isScanBill){
						
						// 确定条码、序列号可以进仓
						ProductBarcodeBoxMgr.getInstance().update(barcode.getCodeForIkea(),barcode.getProductWeek(),materialId,v.getString("warehouseWarehouseId"),barcode1, barcode2,new BigDecimal(barcode.getQuantity()), false);
						
						// 成品汇总表
						WeeklyStockMgr.getInstance().updateStock(materialId, bizDate, ProductStockType.IN, volume, false);
						
						//综合成品账
						ProductInOutStockMgr.getInstance().updateStock(materialId, ProductStockType.IN, qantity, volume, false);
					}
					
					
					v.set("productWeek", barcode.getProductWeek());
					v.set("qantity", qantity);
					v.store();
					
				}
				//进仓业务处理
				BizStockImpFactory.getBizStockImp(BillType.ProductReturn).updateStock(billHead, false, false);

				BillBaseEvent.submitBill(request, response);// 更新单据状态
			}
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
	 * 成品退货单撤销
	 * 
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
			Date bizDate = null;
			if (delegator != null && billId != null) {
				Debug.log("入库单撤销:" + billId, module);
				GenericValue billHead = delegator.findOne("ProductReturn", UtilMisc.toMap("id", billId), false);

				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ProductReturn bill or bizdate is null");
				}

				// 注意不能使用billHead.getDate方法，出产生castException异常
				bizDate = (Date) billHead.get("bizDate");
				
				//确定该单据为扫描单据还是手工单据。
				boolean isScanBill = false;
				int billType= billHead.getInteger("billType");
				if(billType == 2){
					isScanBill = true;
				}
				
				// 获取单据分录条目
				List<GenericValue> entryList = delegator.findByAnd("ProductReturnEntry", UtilMisc.toMap("parentId", billId));

				for (GenericValue v : entryList) {
					String barcode1 = v.getString("barcode1");
					String barcode2 = v.getString("barcode2");
					
					String materialId = v.getString("materialMaterialId");// 打板物料id
					BigDecimal volume = v.getBigDecimal("volume");// 入库数量（板）
					Long qantity = v.getLong("qantity");// 板数量（一板有多少产品）
					
					// 如果是扫描单据，在扫描时已经更新了周汇总和综合成品账报表数据，撤销不需要重复处理
					if(!isScanBill){
						// 确定条码、序列号可以出仓 
						ProductBarcodeBoxMgr.getInstance().update(null,null,null,null,barcode1, barcode2,null, true);
						
						// 成品周汇总表
						WeeklyStockMgr.getInstance().updateStock(materialId, bizDate, ProductStockType.IN, volume, true);
						
						// 综合成品账
						ProductInOutStockMgr.getInstance().updateStock(materialId, ProductStockType.IN, qantity, volume, true);
					}
				}
				// 成品进仓撤销业务操作
				BizStockImpFactory.getBizStockImp(BillType.ProductReturn).updateStock(billHead, true, true);

				BillBaseEvent.rollbackBill(request, response);// 撤销单据
			}

			
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
	 * 成品退货扫描提交
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static synchronized String scanSubmit(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();
			/* 1. 校验数据合法性 */

			/* 2. 生成成品退货单 */

			/* 2.1 新建成品退货单据头 */
			List<GenericValue> headList = delegator.findByAnd("ProductReturn", "status", 0, "billType", 2 , "submitterSystemUserId" , CommonEvents.getAttributeFormSession(request, "uid"));
			GenericValue billHead = null;
			Date currentDate = new Date();
			String billId = "";
			boolean isHasHead = false;
			if(headList.size()>0){
				for(GenericValue headValue : headList){
					Date bizDate = (Date) headValue.get("bizDate");
					if(sdf.format(bizDate).equals(sdf.format(currentDate))){
						billHead = headValue;
						billId = billHead.getString("id");
						isHasHead = true;
						break ;
					}
				}
			}
			if(!isHasHead){
				billHead = delegator.makeValue("ProductReturn");
				billId = UUID.randomUUID().toString();
				billHead.setString("id", billId);
				billHead.setString("number", new SerialNumberHelper().getSerialNumber(request, "ProductReturn"));
				billHead.set("bizDate", new Timestamp(currentDate.getTime()));
				billHead.set("inspectorSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
				billHead.set("submitterSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
				billHead.set("status", 0); // 保存状态
				billHead.set("billType", 2); // 扫描类型，只能进行提交操作，不能删除
				billHead.set("submitStamp", new Timestamp(currentDate.getTime()));
				// 创建主单
				delegator.create(billHead);
			}

			JSONArray entrys = JSONArray.fromObject(request.getParameter("records"));
			JSONObject entry = (JSONObject)entrys.get(0);

			/* 2.2 构建成品退货单据分录 更新相关联的成品进仓扫描单 */
			if (entrys == null || entrys.size() < 1)
				throw new Exception("误操作，未找到扫描数据！");

			String entryId = UUID.randomUUID().toString();

			if (!entry.containsKey("warehouseId") || entry.getString("warehouseId").trim().length() < 1) {
				throw new Exception("装货仓库不能为空，请选择装货仓库！");
			}
			String warehouseId = entry.getString("warehouseId");

			String barcode1 = entry.getString("barcode1");

			String barcode2 = entry.getString("barcode2");
			
			List<GenericValue> entryList = delegator.findByAnd("ProductReturnEntry", UtilMisc.toMap("parentId", billId, "barcode1", barcode1, "barcode2", barcode2));
			if(entryList.size()>0){
				throw new Exception("该产品条码、序列号已经扫描过，不允许重复扫描！");
			}
			
			BarCode barcode = new BarCode(barcode1, barcode2);
			String materialId = Utils.getMaterialIdByIkea(barcode.getCodeForIkea(), barcode.getQuantity());
			TMaterial material = new TMaterial(materialId);
			
			// 新成品退货单分录
			GenericValue entryValue = delegator.makeValue("ProductReturnEntry");
			entryValue.setString("id", entryId);
			entryValue.setString("parentId", billId);
			entryValue.setString("warehouseWarehouseId", warehouseId);
			entryValue.setString("materialMaterialId", materialId);
			entryValue.setString("productWeek", barcode.getProductWeek());
			entryValue.setString("unitUnitId", material.getUnitId());
			entryValue.set("volume", new BigDecimal(1));
			entryValue.setString("barcode1", barcode1);
			entryValue.setString("barcode2", barcode2);
			entryValue.set("qantity", Long.parseLong(barcode.getQuantity()));
			entryValue.set("sort", 1);
			
			// 确定条码、序列号可以进仓
			ProductBarcodeBoxMgr.getInstance().update(barcode.getCodeForIkea(),barcode.getProductWeek(),materialId,warehouseId,barcode1, barcode2,new BigDecimal(barcode.getQuantity()), false);
			
			// 创建分录
			delegator.create(entryValue);
			
			// 成品进仓周表
			WeeklyStockMgr.getInstance().updateStock(materialId, currentDate, ProductStockType.IN, new BigDecimal(1), false);
			
			// 成品进仓综合成品账
			ProductInOutStockMgr.getInstance().updateStock(materialId, ProductStockType.IN, Long.parseLong(barcode.getQuantity()), new BigDecimal(1), false);
			
			StringBuffer jsonStr = new StringBuffer();
			jsonStr.append("{'success':true,'qantity':" + barcode.getQuantity() + "}");
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
	 * 撤销扫描提交
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static synchronized String scanRollback(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Delegator delegator = (Delegator) request.getAttribute("delegator");

		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();
			/* 1. 校验数据合法性 */
			JSONArray entrys = JSONArray.fromObject(request.getParameter("records"));
			JSONObject entry = (JSONObject)entrys.get(0);
			
			if (entrys == null || entrys.size() < 1)
				throw new Exception("误操作，未找到扫描数据！");

			String barcode1 = "";
			String barcode2 = "";

			barcode1 = entry.getString("barcode1");
			barcode2 = entry.getString("barcode2");
			
			// 1.2确定条码、序列号可以出仓 
			ProductBarcodeBoxMgr.getInstance().update(null,null,null,null,barcode1, barcode2, null,true);
			
			/* 2 获取单据分录条目 */
			List<GenericValue> entryList = delegator.findByAnd("ProductReturnEntry", UtilMisc.toMap("barcode1", barcode1, "barcode2", barcode2));
			GenericValue entryValue = null;
			GenericValue billHead = null;
			boolean isHasBill = false;
			if(entryList.size()>0){
				for(GenericValue record : entryList){
					String billId = record.getString("parentId");
					List<GenericValue> headList = delegator.findByAnd("ProductReturn", "id", billId, "status", 0, "billType", 2, "inspectorSystemUserId" , CommonEvents.getAttributeFormSession(request, "uid"));
					if(headList.size()>0){
						billHead = headList.get(0);
						entryValue = record ;
						isHasBill = true;
						break;
					}
				}
				if(!isHasBill){
					throw new Exception("无法进行撤销操作,可能由于下面两种情况导致：<br>1.该产品条码、序列号的单据已经提交；<br>2.该产品条码、序列号的单据不是本人提交。");
				}
			} else {
				throw new Exception("无法找到该产品条码、序列号，请确认是否已经扫描！");
			}
			
			// 注意不能使用billHead.getDate方法，出产生castException异常
			Date bizDate = (Date) billHead.get("bizDate");
			
			String materialId = entryValue.getString("materialMaterialId");// 打板物料id
			BigDecimal volume = entryValue.getBigDecimal("volume");// 入库数量（板）
			Long qantity = entryValue.getLong("qantity");// 板数量（一板有多少产品）
			
			// 3.1 成品进仓撤销，负数 
			WeeklyStockMgr.getInstance().updateStock(materialId, bizDate, ProductStockType.IN, volume, true);
			ProductInOutStockMgr.getInstance().updateStock(materialId, ProductStockType.IN, qantity, volume, true);
			 
			entryValue.remove(); // 删除分录

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
