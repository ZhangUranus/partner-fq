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
/**
 * 成品出仓单业务事件类
 * 
 * @author Mark
 * 
 */
public class ProductOutwarehouseEvents {
	private static final String module = org.ofbiz.partner.scm.stock.ProductOutwarehouseEvents.class.getName();

	/**
	 * 成品出仓提交
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
			Date bizDate =null;
			if (delegator != null && billId != null) {
				Debug.log("成品出仓单提交:" + billId, module);
				GenericValue billHead = delegator.findOne("ProductOutwarehouse", UtilMisc.toMap("id", billId), false);

				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ProductOutwarehouse bill or bizdate is null");
				}
				//注意不能使用billHead.getDate方法，出产生castException异常
				bizDate= (Date) billHead.get("bizDate");

				BizStockImpFactory.getBizStockImp(BillType.ProductOutwarehouse).updateStock(billHead, true, false);

				BillBaseEvent.submitBill(request, response);// 更新单据状态
			}
			
			//更新周汇总表
			// 获取单据分录条目
			List<GenericValue> entryList = delegator.findByAnd("ProductOutwarehouseEntry", UtilMisc.toMap("parentId", billId));
			 
			for (GenericValue v : entryList) {
				String materialId = v.getString("materialMaterialId");// 打板物料id
				BigDecimal volume=v.getBigDecimal("volume");//出库数量（板）
				ProductStockType type = null;
				if("2".equals(v.getString("outwarehouseType"))){
					type=ProductStockType.CHG;
				} else {
					type=ProductStockType.OUT;
				}
				WeeklyStockMgr.getInstance().updateStock(materialId, bizDate, type, volume, false);
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
	 * 成品出仓单撤销
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
			Date bizDate =null;
			if (delegator != null && billId != null) {
				Debug.log("成品出仓单撤销:" + billId, module);
				GenericValue billHead = delegator.findOne("ProductOutwarehouse", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ProductOutwarehouse bill or bizdate is null");
				}
				//注意不能使用billHead.getDate方法，出产生castException异常
				bizDate= (Date) billHead.get("bizDate");

				BizStockImpFactory.getBizStockImp(BillType.ProductOutwarehouse).updateStock(billHead, false, true);

				BillBaseEvent.rollbackBill(request, response);// 撤销单据
			}
			
			//更新周汇总表
			// 获取单据分录条目
			List<GenericValue> entryList = delegator.findByAnd("ProductOutwarehouseEntry", UtilMisc.toMap("parentId", billId));
			 
			for (GenericValue v : entryList) {
				String materialId = v.getString("materialMaterialId");// 打板物料id
				BigDecimal volume=v.getBigDecimal("volume");//出库数量（板）
				ProductStockType type = null;
				if("2".equals(v.getString("outwarehouseType"))){
					type=ProductStockType.CHG;
				} else {
					type=ProductStockType.OUT;
				}
				WeeklyStockMgr.getInstance().updateStock(materialId, bizDate, type, volume.negate(), false);
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
}
