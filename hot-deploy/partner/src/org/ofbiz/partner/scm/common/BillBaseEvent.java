package org.ofbiz.partner.scm.common;

import java.util.HashMap;
import java.util.Map;

import javax.print.attribute.HashAttributeSet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.condition.EntityCondition;

/**
 * 基础单据业务操作
 * @author Mark
 *
 */
public class BillBaseEvent {
	/**
	 * 单据审核
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String auditBill(HttpServletRequest request,HttpServletResponse response) throws Exception{
		String billId=request.getParameter("billId");
		String entity=request.getParameter("entity");
		if(entity!=null&&billId!=null){
			Delegator delegator = (Delegator) request.getAttribute("delegator");
			//更新状态字段
			Map<String,Object> fieldSet=new HashMap<String, Object>();
			fieldSet.put("status", 1);//设置为审核状态
			fieldSet.put("approverSystemUserId", CommonEvents.getAttributeToSession(request, "uid"));
			delegator.storeByCondition(entity, fieldSet, EntityCondition.makeConditionWhere("id='"+billId+"'"));
			return "sucess";
		}else{
			throw new Exception("empty billId or null entity");
		}
	}
	/**
	 * 审核不通过
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String auditBillNotPass(HttpServletRequest request,HttpServletResponse response) throws Exception{
		String billId=request.getParameter("billId");
		String entity=request.getParameter("entity");
		if(entity!=null&&billId!=null){
			Delegator delegator = (Delegator) request.getAttribute("delegator");
			//更新状态字段
			Map<String,Object> fieldSet=new HashMap<String, Object>();
			fieldSet.put("status", 2);//设置为审核不通过状态
			fieldSet.put("approverSystemUserId", CommonEvents.getAttributeToSession(request, "uid"));
			delegator.storeByCondition(entity, fieldSet, EntityCondition.makeConditionWhere("id='"+billId+"'"));
			return "sucess";
		}else{
			throw new Exception("empty billId or null entity");
		}
	}
	/**
	 * 反审核单据
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String unauditBill(HttpServletRequest request,HttpServletResponse response) throws Exception{
		String billId=request.getParameter("billId");
		String entity=request.getParameter("entity");
		if(entity!=null&&billId!=null){
			Delegator delegator = (Delegator) request.getAttribute("delegator");
			//更新状态字段
			Map<String,Object> fieldSet=new HashMap<String, Object>();
			fieldSet.put("status", 0);//设置为保存状态
			fieldSet.put("approverSystemUserId", CommonEvents.getAttributeToSession(request, "uid"));
			delegator.storeByCondition(entity, fieldSet, EntityCondition.makeConditionWhere("id='"+billId+"'"));
			return "sucess";
		}else{
			throw new Exception("empty billId or null entity");
		}
	}
	
	/**
	 * 提交单据
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String commitBill(HttpServletRequest request,HttpServletResponse response) throws Exception{
		String billId=request.getParameter("billId");
		String entity=request.getParameter("entity");
		if(entity!=null&&billId!=null){
			Delegator delegator = (Delegator) request.getAttribute("delegator");
			//更新状态字段
			Map<String,Object> fieldSet=new HashMap<String, Object>();
			fieldSet.put("status", 4);//设置为已提交状态
			fieldSet.put("submitterSystemUserId", CommonEvents.getAttributeToSession(request, "uid"));
			delegator.storeByCondition(entity, fieldSet, EntityCondition.makeConditionWhere("id='"+billId+"'"));
			return "sucess";
		}else{
			throw new Exception("empty billId or null entity");
		}
	}
	
	/**
	 * 撤销单据
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String uncommitBill(HttpServletRequest request,HttpServletResponse response) throws Exception{
		String billId=request.getParameter("billId");
		String entity=request.getParameter("entity");
		if(entity!=null&&billId!=null){
			Delegator delegator = (Delegator) request.getAttribute("delegator");
			//更新状态字段
			Map<String,Object> fieldSet=new HashMap<String, Object>();
			fieldSet.put("status", 0);//设置为保存状态
			fieldSet.put("submitterSystemUserId", CommonEvents.getAttributeToSession(request, "uid"));
			delegator.storeByCondition(entity, fieldSet, EntityCondition.makeConditionWhere("id='"+billId+"'"));
			return "sucess";
		}else{
			throw new Exception("empty billId or null entity");
		}
	}
}
