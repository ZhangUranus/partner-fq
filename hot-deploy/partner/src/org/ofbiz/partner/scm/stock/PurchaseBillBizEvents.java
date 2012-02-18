package org.ofbiz.partner.scm.stock;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.transaction.GenericTransactionException;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.partner.scm.common.BillBaseEvent;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.pricemgr.BillType;
import org.ofbiz.partner.scm.pricemgr.PriceCalItem;
import org.ofbiz.partner.scm.pricemgr.PriceMgr;
import org.ofbiz.partner.scm.pricemgr.Utils;
import org.ofbiz.partner.scm.purplan.PurPlanBalance;

/**
 * 采购申请单业务事件类
 * 
 * @author mark
 * 
 */
public class PurchaseBillBizEvents {
	private static final String module = org.ofbiz.partner.scm.stock.PurchaseBillBizEvents.class.getName();

	/**
	 * 采购申请单审核
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String auditBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();

			BillBaseEvent.auditBill(request, response);// 更新单据状态

			// 如果单据状态为不通过，不影响库存
			if (request.getParameter("isValid").equals("false")) {
				return "success";
			}

			// 根据单据每条记录更新供应商可入库总申请数量
			Delegator delegator = (Delegator) request.getAttribute("delegator");
			String billId = request.getParameter("billId");// 单据id
			if (delegator != null && billId != null) {
				Debug.log("采购申请单审核:" + billId, module);
				GenericValue billHead = delegator.findOne("PurchaseBill", UtilMisc.toMap("id", billId), false);

				Date bizDate = (Date) billHead.get("bizDate");
				if (bizDate == null || !Utils.isCurPeriod(bizDate)) {
					throw new Exception("单据业务日期不在当前系统期间");
				}

				if (billHead == null && billHead.getString("supplierSupplierId") == null) {
					throw new Exception("can`t find purchase bill or supplier is null");
				}
				String supplierId = billHead.getString("supplierSupplierId");
				// 获取单据id分录条目
				List<GenericValue> entryList = delegator.findByAnd("PurchaseBillEntry", UtilMisc.toMap("parentId", billId));

				for (GenericValue v : entryList) {
					PurPlanBalance.getInstance().updateInWarehouse(supplierId, v.getString("materialMaterialId"), v.getBigDecimal("volume"));
				}
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
	 * 采购申请单反审核
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String unauditBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();

			BillBaseEvent.unauditBill(request, response);// 更新单据状态

			// 如果单据状态为不通过，不影响库存
			if (request.getParameter("isValid").equals("false")) {
				return "success";
			}

			// 根据单据每条记录更新供应商可入库总申请数量
			Delegator delegator = (Delegator) request.getAttribute("delegator");
			String billId = request.getParameter("billId");// 单据id
			if (delegator != null && billId != null) {
				Debug.log("采购申请单审核:" + billId, module);
				GenericValue billHead = delegator.findOne("PurchaseBill", UtilMisc.toMap("id", billId), false);
				Date bizDate = (Date) billHead.get("bizDate");
				if (bizDate == null || !Utils.isCurPeriod(bizDate)) {
					throw new Exception("单据业务日期不在当前系统期间");
				}
				if (billHead == null && billHead.getString("supplierSupplierId") == null) {
					throw new Exception("can`t find purchase bill or supplier is null");
				}
				String supplierId = billHead.getString("supplierSupplierId");
				// 获取单据id分录条目
				List<GenericValue> entryList = delegator.findByAnd("PurchaseBillEntry", UtilMisc.toMap("parentId", billId));

				for (GenericValue v : entryList) {
					// 每个记录入库数量需要转换为负数
					PurPlanBalance.getInstance().updateInWarehouse(supplierId, v.getString("materialMaterialId"), BigDecimal.ZERO.subtract(v.getBigDecimal("volume")));
				}
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
	 * 获取计划采购物料数量
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String getPlanBalance(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String supplierId = request.getParameter("supplierId");
		String materialId = request.getParameter("materialId");
		BigDecimal balance = PurPlanBalance.getInstance().getBalance(supplierId, materialId);
		JSONObject jsonStr = new JSONObject();
		jsonStr.put("success", true);
		if (balance == null) {
			jsonStr.put("count", 0);
		} else {
			jsonStr.put("count", balance);
		}
		CommonEvents.writeJsonDataToExt(response, jsonStr.toString());
		return "success";
	}
}
