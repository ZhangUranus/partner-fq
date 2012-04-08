package org.ofbiz.partner.scm.common;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.sf.json.JSONObject;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.condition.EntityCondition;

/**
 * 基础单据业务操作
 * 
 * @author Mark
 * 
 */
public class BillBaseEvent {
	/**
	 * 单据审核
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String auditBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String billId = request.getParameter("billId");
		String entity = request.getParameter("entity");
		String status = request.getParameter("status");
		String approverNote = request.getParameter("approverNote");
		if (entity != null && billId != null) {
			Delegator delegator = (Delegator) request.getAttribute("delegator");
			// 更新状态字段
			Map<String, Object> fieldSet = new HashMap<String, Object>();
			fieldSet.put("status", status != null ? Integer.parseInt(status) : 1);// 设置为审核状态
			fieldSet.put("approverNote", approverNote != null ? approverNote : "");// 设置审核意见
			fieldSet.put("approverSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
			delegator.storeByCondition(entity, fieldSet, EntityCondition.makeConditionWhere("id='" + billId + "'"));
			writeSuccessMessageToExt(response, "审核成功");
			return "sucess";
		} else {
			throw new Exception("empty billId or null entity");
		}
	}

	/**
	 * 反审核单据
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String unauditBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String billId = request.getParameter("billId");
		String entity = request.getParameter("entity");
		if (entity != null && billId != null) {
			Delegator delegator = (Delegator) request.getAttribute("delegator");
			// 更新状态字段
			Map<String, Object> fieldSet = new HashMap<String, Object>();
			fieldSet.put("status", 0);// 设置为保存状态
			fieldSet.put("approverNote", "");// 设置审核意见
			fieldSet.put("approverSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
			delegator.storeByCondition(entity, fieldSet, EntityCondition.makeConditionWhere("id='" + billId + "'"));
			writeSuccessMessageToExt(response, "反审核成功");
			return "sucess";
		} else {
			throw new Exception("empty billId or null entity");
		}
	}

	/**
	 * 提交单据
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String submitBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		if (SystemLock.isLock())
			throw new Exception("系统已经被锁定，不能进行提交");

		String billId = request.getParameter("billId");
		String entity = request.getParameter("entity");
		if (entity != null && billId != null) {
			Delegator delegator = (Delegator) request.getAttribute("delegator");
			// 更新状态字段
			Map<String, Object> fieldSet = new HashMap<String, Object>();
			fieldSet.put("status", 4);// 设置为已提交状态
			fieldSet.put("submitterSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
			fieldSet.put("submitStamp", new Timestamp(System.currentTimeMillis()));
			delegator.storeByCondition(entity, fieldSet, EntityCondition.makeConditionWhere("id='" + billId + "'"));
			writeSuccessMessageToExt(response, "提交成功");
			return "sucess";
		} else {
			throw new Exception("empty billId or null entity");
		}
	}

	/**
	 * 撤销单据
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String rollbackBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String billId = request.getParameter("billId");
		String entity = request.getParameter("entity");
		if (entity != null && billId != null) {
			Delegator delegator = (Delegator) request.getAttribute("delegator");
			// 更新状态字段
			Map<String, Object> fieldSet = new HashMap<String, Object>();
			fieldSet.put("status", 0);// 设置为保存状态
			fieldSet.put("submitterSystemUserId", null);
			fieldSet.put("submitStamp", null);
			delegator.storeByCondition(entity, fieldSet, EntityCondition.makeConditionWhere("id='" + billId + "'"));
			writeSuccessMessageToExt(response, "撤销成功");
			return "sucess";
		} else {
			throw new Exception("empty billId or null entity");
		}
	}

	/**
	 * 核准BOM单
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String auditBOMBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String bomId = request.getParameter("bomId");
		if (bomId != null) {
			Delegator delegator = (Delegator) request.getAttribute("delegator");
			Map<String, Object> fieldSet = new HashMap<String, Object>();
			fieldSet.put("status", 1);// 设置为已核准状态
			delegator.storeByCondition("MaterialBom", fieldSet, EntityCondition.makeConditionWhere("id='" + bomId + "'"));
			writeSuccessMessageToExt(response, "核准成功");
			return "sucess";
		} else {
			throw new Exception("bomId is not allow null ");
		}
	}

	public static void writeSuccessMessageToExt(HttpServletResponse response, String message) throws Exception {
		JSONObject jsonResult = new JSONObject();
		jsonResult.element("success", true);// 成功标记
		jsonResult.element("message", message);// 成功信息
		CommonEvents.writeJsonDataToExt(response, jsonResult.toString());
	}
}
