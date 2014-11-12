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
public class WorkshopReturnMaterialEvents {
	private static final String module = org.ofbiz.partner.scm.stock.WorkshopReturnMaterialEvents.class.getName();

	/**
	 * 制造退料提交
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
		
		String billId = request.getParameter("billId");// 单据id
		
		// 增加单据运行任务到运行表中
		BillCurrentJobMgr.getInstance().update(billId, false, false, false);
		try {
			beganTransaction = TransactionUtil.begin();

			Delegator delegator = (Delegator) request.getAttribute("delegator");
			if (delegator != null && billId != null) {
				Debug.log("入库单提交:" + billId, module);
				GenericValue billHead = delegator.findOne("WorkshopReturnMaterial", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find WorkshopReturnMaterial bill or bizdate is null");
				}
				if(billHead.getString("status").equals("4")){
					throw new Exception("单据已提交，请刷新数据！");
				}

				BizStockImpFactory.getBizStockImp(BillType.WorkshopReturnMaterial).updateStock(billHead, false, false);

				BillBaseEvent.submitBill(request, response);// 更新单据状态
				
				/* 开始 增加单据处理任务 */
				billInfoMap.put("number", billHead.get("number").toString());
				billInfoMap.put("billType", "WorkshopReturnMaterial");
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
		} finally {
			// 删除单据运行任务到运行表中
			BillCurrentJobMgr.getInstance().update(billId, false, false, true);
		}
		return "success";
	}

	/**
	 * 制造退料单撤销
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
		String billId = request.getParameter("billId");// 单据id
		
		// 增加单据运行任务到运行表中
		BillCurrentJobMgr.getInstance().update(billId, true, true, false);
		try {
			beganTransaction = TransactionUtil.begin();

			Delegator delegator = (Delegator) request.getAttribute("delegator");
			if (delegator != null && billId != null) {
				Debug.log("入库单撤销:" + billId, module);
				GenericValue billHead = delegator.findOne("WorkshopReturnMaterial", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find WorkshopReturnMaterial bill or bizdate is null");
				}
				if(billHead.getString("status").equals("0")){
					throw new Exception("单据已撤销，请刷新数据！");
				}

				BizStockImpFactory.getBizStockImp(BillType.WorkshopReturnMaterial).updateStock(billHead, true, true);

				BillBaseEvent.rollbackBill(request, response);// 撤销单据
				
				/* 开始 增加单据处理任务 */
				billInfoMap.put("number", billHead.get("number").toString());
				billInfoMap.put("billType", "WorkshopReturnMaterial");
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
		} finally {
			// 删除单据运行任务到运行表中
			BillCurrentJobMgr.getInstance().update(billId, true, true, true);
		}
		return "success";
	}
}
