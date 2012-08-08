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
import org.ofbiz.partner.scm.pricemgr.BizStockImpFactory;
import org.ofbiz.partner.scm.pricemgr.Utils;
import org.ofbiz.partner.scm.purplan.PurPlanBalance;
/**
 * 出货通知单业务事件类
 * 
 * @author Mark
 * 
 */
public class ProductOutNotificationEvents {
	private static final String module = org.ofbiz.partner.scm.stock.ProductOutNotificationEvents.class.getName();

	/**
	 * 出货通知单提交
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
			if ( delegator != null && billId != null ) {
				GenericValue billHead = delegator.findOne("ProductOutNotification", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ProductOutNotification bill or bizdate is null");
				}
				Date bizDate = (Date) billHead.get("bizDate");
				if (bizDate == null || !Utils.isCurPeriod(bizDate)) {
					throw new Exception("单据业务日期不在当前系统期间");
				}
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
	 * 出货通知单撤销
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
			if ( delegator != null && billId != null ) {
				GenericValue billHead = delegator.findOne("ProductOutNotification", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ProductOutNotification bill or bizdate is null");
				}
				Date bizDate = (Date) billHead.get("bizDate");
				if (bizDate == null || !Utils.isCurPeriod(bizDate)) {
					throw new Exception("单据业务日期不在当前系统期间");
				}
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
	 * 根据宜家编码获取产品编码
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String getMaterialIdByIkea(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		String ikeaId = request.getParameter("ikeaId");
		String qantity = request.getParameter("qantity");
		List<GenericValue> entryList = delegator.findByAnd("ProductMap", UtilMisc.toMap("ikeaId", ikeaId, "boardCount", qantity));
		if(entryList.size() > 0){
			JSONObject jsonStr = new JSONObject();
			jsonStr.put("success", true);
			if (!"".equals(entryList.get(0).getString("materialId")) && entryList.get(0).getString("materialId") != null) {
				jsonStr.put("materialId", entryList.get(0).getString("materialId"));
			}
			CommonEvents.writeJsonDataToExt(response, jsonStr.toString());
		} else {
			throw new Exception("未找到产品条码对应的产品编码，请检查“产品资料表”！");
		}
		return "success";
	}
}
