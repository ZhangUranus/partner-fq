package org.ofbiz.partner.scm.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.ofbiz.entity.GenericDelegator;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.webapp.control.LoginWorker;

/**
 * 用户安全事件类
 * @author Jeff-liu 
 *
 */

public class SecurityEvents {
	public static final String module = SecurityEvents.class.getName();
    
    /**
     * 检查用户名密码
     */
	public static String checkLogin(HttpServletRequest request, HttpServletResponse response) {
		String responseString = LoginWorker.checkLogin(request, response);
		JSONObject jsonStr = new JSONObject();
		if (!"success".equals(responseString)) {
			jsonStr.put("success", false);
        }else{
        	CommonEvents.setUsername(request, response);
			jsonStr.put("success", true);
        }
		CommonEvents.writeJsonDataToExt(response, jsonStr.toString());
		return responseString;
	}
	
	/**
     * 获取用户功能菜单数据
     */
	public static String getTreeDataByParentId(HttpServletRequest request, HttpServletResponse response) {
		GenericDelegator delegator = (GenericDelegator) request.getAttribute("delegator");
		String parentId = request.getParameter("parentId");
		String jsonStr = CommonEvents.getTreeDataByParentId(delegator, parentId,true);
		CommonEvents.writeJsonDataToExt(response, jsonStr);
		return "success";
	}
	
	/**
     * 获取用户功能模块数据
     */
	public static String getTreeRootData(HttpServletRequest request, HttpServletResponse response) {
		GenericDelegator delegator = (GenericDelegator) request.getAttribute("delegator");
		String parentId = request.getParameter("parentId");
		String jsonStr = CommonEvents.getTreeDataByParentId(delegator, parentId,false);
		CommonEvents.writeJsonDataToExt(response, jsonStr);
		return "success";
	}
}
