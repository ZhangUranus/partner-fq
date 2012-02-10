package org.ofbiz.partner.scm.stock;

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
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.pricemgr.BillType;
import org.ofbiz.partner.scm.pricemgr.BizStockImpFactory;
import org.ofbiz.partner.scm.pricemgr.Utils;

/**
 * 验收单业务事件类
 * 
 * @author Mark
 * 
 */
public class WorkshopReturnProductEvents {
	private static final String module = org.ofbiz.partner.scm.stock.WorkshopReturnProductEvents.class.getName();

	/**
	 * 制造退货提交
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
				Debug.log("出库单提交:" + billId, module);
				GenericValue billHead = delegator.findOne("WorkshopReturnProduct", UtilMisc.toMap("id", billId), false);
				if (billHead == null && billHead.get("bizDate") == null) {
					throw new Exception("can`t find WorkshopReturnProduct bill or bizdate is null");
				}

				BizStockImpFactory.getBizStockImp(BillType.WorkshopReturnProduct).updateStock(billHead, true);

				if (billHead.getLong("status").equals(new Long(0))) {
					BillBaseEvent.submitBill(request, response);// 更新单据状态
				} else {
					// 获取单据id分录条目
					List<GenericValue> entryList = delegator.findByAnd("WorkshopReturnProductEntry", UtilMisc.toMap("parentId", billHead.getString("id")));
					if (Utils.isFinishCheck(entryList)) {
						billHead.set("checkStatus", new Long(2));
					} else {
						billHead.set("checkStatus", new Long(1));// 设置验收状态为验收中
					}
					billHead.set("checkerSystemUserId", CommonEvents.getAttributeToSession(request, "uid"));
					billHead.store();
				}
			}
		} catch (Exception e) {
			Debug.logError(e, module);
			try {
				TransactionUtil.rollback(beganTransaction, e.getMessage(), e);
			} catch (GenericTransactionException e2) {
				Debug.logError(e2, "Unable to rollback transaction", module);
			}
		} finally {
			try {
				TransactionUtil.commit(beganTransaction);
			} catch (GenericTransactionException e) {
				Debug.logError(e, "Unable to commit transaction", module);
			}
		}
		return "success";
	}

	/**
	 * 制造退货单撤销
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
				Debug.log("出库单撤销:" + billId, module);
				GenericValue billHead = delegator.findOne("WorkshopReturnProduct", UtilMisc.toMap("id", billId), false);
				if (billHead == null && billHead.get("bizDate") == null) {
					throw new Exception("can`t find WorkshopReturnProduct bill or bizdate is null");
				}

				BizStockImpFactory.getBizStockImp(BillType.WorkshopReturnProduct).updateStock(billHead, false);

				billHead.set("checkStatus", new Long(0));// 设置验收状态为未验收
				billHead.store();

				BillBaseEvent.rollbackBill(request, response);// 撤销单据

			}
		} catch (Exception e) {
			Debug.logError(e, module);
			try {
				TransactionUtil.rollback(beganTransaction, e.getMessage(), e);
			} catch (GenericTransactionException e2) {
				Debug.logError(e2, "Unable to rollback transaction", module);
			}
		} finally {
			try {
				TransactionUtil.commit(beganTransaction);
			} catch (GenericTransactionException e) {
				Debug.logError(e, "Unable to commit transaction", module);
			}
		}
		return "success";
	}
}
