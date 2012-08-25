package org.ofbiz.partner.scm.stock;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.transaction.GenericTransactionException;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.partner.scm.common.BillBaseEvent;
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

				
				BillBaseEvent.submitBill(request, response);// 更新单据状态
			}
			
			//更新周汇总表
			// 获取单据分录条目
			List<GenericValue> entryList = delegator.findByAnd("ProductInwarehouseEntry", UtilMisc.toMap("parentId", billId));
			 
			for (GenericValue v : entryList) {
				String materialId = v.getString("materialMaterialId");// 打板物料id
				BigDecimal volume = v.getBigDecimal("volume");//入库数量（板）
				Long qantity = v.getLong("qantity");//板数量（一板有多少产品）
				//成品进仓 
				WeeklyStockMgr.getInstance().updateStock(materialId, bizDate, ProductStockType.IN, volume, false);
				ProductInOutStockMgr.getInstance().updateStock(materialId, ProductStockType.IN, qantity, volume, false);
				v.set("productWeek", Utils.getYearWeekStr(bizDate));
				v.store();
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

				BillBaseEvent.rollbackBill(request, response);// 撤销单据
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
			
			
			
//			/*
//			 *撤销关联的进仓确认单
//			 * */
//			List<GenericValue> prdtCfmEntrys=delegator.findByAnd("ProductInwarehouseConfirm", "productInwarehouseId",billId);
//			
//			if(prdtCfmEntrys!=null&&prdtCfmEntrys.size()>0){
//				for(GenericValue v:prdtCfmEntrys){
//					v.put("status", 0);// 设置为已提交状态
//					v.put("submitterSystemUserId", null);
//				}
//				delegator.storeAll(prdtCfmEntrys);
//			}
			
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
}
