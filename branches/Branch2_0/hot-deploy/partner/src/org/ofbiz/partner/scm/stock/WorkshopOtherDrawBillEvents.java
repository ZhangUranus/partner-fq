package org.ofbiz.partner.scm.stock;

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
 * 制造其它领料事件类
 * 
 * @author Mark 2012-5-27
 * 
 */
public class WorkshopOtherDrawBillEvents {
	private static final String module = WorkshopOtherDrawBillEvents.class.getName();

	/**
	 * 制造其它领料提交
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
			if (delegator != null && billId != null) {
				Debug.log("制造其它领料提交:" + billId, module);
				GenericValue billHead = delegator.findOne("WorkshopOtherDrawBill", UtilMisc.toMap("id", billId), false);
				if (billHead == null) {
					throw new Exception("找不到制造其它领料单");
				}
				if( billHead.get("bizDate") == null){
					throw new Exception("制造其它领料单业务日期为空");
				}

				BizStockImpFactory.getBizStockImp(BillType.WorkshopOtherDrawBill).updateStock(billHead, true, false);

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
	 * 制造其它领料单撤销
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
			if (delegator != null && billId != null) {
				Debug.log("制造其它领料单撤销:" + billId, module);
				GenericValue billHead = delegator.findOne("WorkshopOtherDrawBill", UtilMisc.toMap("id", billId), false);
				if (billHead == null) {
					throw new Exception("找不到制造其它领料单");
				}
				if( billHead.get("bizDate") == null){
					throw new Exception("制造其它领料单业务日期为空");
				}

				BizStockImpFactory.getBizStockImp(BillType.WorkshopOtherDrawBill).updateStock(billHead, false, true);

				BillBaseEvent.rollbackBill(request, response);// 更新单据状态
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