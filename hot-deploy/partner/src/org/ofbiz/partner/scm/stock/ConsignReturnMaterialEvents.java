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
 * 验收单业务事件类
 * 
 * @author Mark
 * 
 */
public class ConsignReturnMaterialEvents {
	private static final String module = org.ofbiz.partner.scm.stock.ConsignReturnMaterialEvents.class.getName();

	/**
	 * 委外退料提交
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
				Debug.log("入库单提交:" + billId, module);
				GenericValue billHead = delegator.findOne("ConsignReturnMaterial", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ConsignReturnMaterial bill or bizdate is null");
				}

				BizStockImpFactory.getBizStockImp(BillType.ConsignReturnMaterial).updateStock(billHead, false, false);

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
	 * 委外退料单撤销
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
				Debug.log("入库单撤销:" + billId, module);
				GenericValue billHead = delegator.findOne("ConsignReturnMaterial", UtilMisc.toMap("id", billId), false);
				if (billHead == null && billHead.get("bizDate") == null) {
					throw new Exception("can`t find ConsignReturnMaterial bill or bizdate is null");
				}

				BizStockImpFactory.getBizStockImp(BillType.ConsignReturnMaterial).updateStock(billHead, true, true);

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
}
