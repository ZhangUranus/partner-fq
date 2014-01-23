package org.ofbiz.partner.scm.stock;

import java.util.HashMap;
import java.util.Map;

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
import org.ofbiz.service.LocalDispatcher;
/**
 * 验收单业务事件类
 * 
 * @author Mark
 * 
 */
public class ConsignDrawMaterialEvents {
	private static final String module = org.ofbiz.partner.scm.stock.ConsignDrawMaterialEvents.class.getName();

	/**
	 * 委外领料提交
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String submitBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		LocalDispatcher dispatcher = (LocalDispatcher) request.getAttribute("dispatcher");
		Map<String, String> billInfoMap = new HashMap<String, String>();			//单据信息
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();

			Delegator delegator = (Delegator) request.getAttribute("delegator");
			String billId = request.getParameter("billId");// 单据id
			if (delegator != null && billId != null) {
				Debug.log("出库单提交:" + billId, module);
				GenericValue billHead = delegator.findOne("ConsignDrawMaterial", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ConsignDrawMaterial bill or bizdate is null");
				}

				BizStockImpFactory.getBizStockImp(BillType.ConsignDrawMaterial).updateStock(billHead, true, false);

				BillBaseEvent.submitBill(request, response);// 更新单据状态
				
				/* 开始 增加单据处理任务 */
				billInfoMap.put("number", billHead.get("number").toString());
				billInfoMap.put("billType", "ConsignDrawMaterial");
				billInfoMap.put("operationType", "3");
				dispatcher.runSync("addBillHandleJobService", billInfoMap);
				/* 结束 增加单据处理任务 */
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
	 * 委外领料单撤销
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String rollbackBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		LocalDispatcher dispatcher = (LocalDispatcher) request.getAttribute("dispatcher");
		Map<String, String> billInfoMap = new HashMap<String, String>();			//单据信息
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();

			Delegator delegator = (Delegator) request.getAttribute("delegator");
			String billId = request.getParameter("billId");// 单据id
			if (delegator != null && billId != null) {
				Debug.log("出库单撤销:" + billId, module);
				GenericValue billHead = delegator.findOne("ConsignDrawMaterial", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ConsignDrawMaterial bill or bizdate is null");
				}

				BizStockImpFactory.getBizStockImp(BillType.ConsignDrawMaterial).updateStock(billHead, false, true);

				BillBaseEvent.rollbackBill(request, response);// 撤销单据
				
				/* 开始 增加单据处理任务 */
				billInfoMap.put("number", billHead.get("number").toString());
				billInfoMap.put("billType", "ConsignDrawMaterial");
				billInfoMap.put("operationType", "4");
				dispatcher.runSync("addBillHandleJobService", billInfoMap);
				/* 结束 增加单据处理任务 */
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
