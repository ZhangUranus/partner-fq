package org.ofbiz.partner.scm.stock;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
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
import org.ofbiz.partner.scm.pricemgr.ConsignPriceMgr;
import org.ofbiz.partner.scm.pricemgr.MaterialBomMgr;
import org.ofbiz.partner.scm.pricemgr.Utils;
import org.ofbiz.service.LocalDispatcher;
/**
 * 验收单业务事件类
 * 
 * @author Mark
 * 
 */
public class ConsignWarehousingEvents {
	private static final String module = org.ofbiz.partner.scm.stock.ConsignWarehousingEvents.class.getName();

	/**
	 * 委外入库提交
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
				Debug.log("入库单提交:" + billId, module);
				GenericValue billHead = delegator.findOne("ConsignWarehousing", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ConsignWarehousing bill or bizdate is null");
				}
				// 注意不能使用billHead.getDate方法，出产生castException异常
				Date bizDate = (Date) billHead.get("bizDate");
				if (bizDate == null || !Utils.isCurPeriod(bizDate)) {
					throw new Exception("单据业务日期不在当前系统期间");
				}
				// 供应商id
				String processorId = billHead.getString("processorSupplierId");
				if (processorId == null || processorId.length() < 1) {
					throw new Exception("委外入库单加工商为空！！！");
				}
				// 获取单据id分录条目
				List<GenericValue> entryList = delegator.findByAnd("ConsignWarehousingEntry", UtilMisc.toMap("parentId", billHead.getString("id")));
				for (GenericValue v : entryList) {
					String materialId = MaterialBomMgr.getInstance().getMaterialIdByBomId(v.getString("bomId"));// 物料id
					
					if(!ConsignPriceMgr.getInstance().checkReturnProductWarehousingStatus(processorId, materialId)){
						throw new Exception("供应商存在未验收加工件，不允许进行入库操作，请访问“委外退货”页面进行验收！");
					}
				}
				
				BizStockImpFactory.getBizStockImp(BillType.ConsignWarehousing).updateStock(billHead, false, false);

				BillBaseEvent.submitBill(request, response);// 更新单据状态
				
				/* 开始 增加单据处理任务 */
				billInfoMap.put("number", billHead.get("number").toString());
				billInfoMap.put("billType", "ConsignWarehousing");
				billInfoMap.put("operationType", "3");
				dispatcher.runAsync("addBillHandleJobService", billInfoMap);
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
	 * 委外入库单撤销
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
				Debug.log("入库单撤销:" + billId, module);
				GenericValue billHead = delegator.findOne("ConsignWarehousing", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ConsignWarehousing bill or bizdate is null");
				}

				BizStockImpFactory.getBizStockImp(BillType.ConsignWarehousing).updateStock(billHead, true, true);

				BillBaseEvent.rollbackBill(request, response);// 撤销单据
				
				/* 开始 增加单据处理任务 */
				billInfoMap.put("number", billHead.get("number").toString());
				billInfoMap.put("billType", "ConsignWarehousing");
				billInfoMap.put("operationType", "4");
				dispatcher.runAsync("addBillHandleJobService", billInfoMap);
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
