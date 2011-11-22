package org.ofbiz.partner.scm.security;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import javolution.util.FastList;

import net.sf.json.JSONObject;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilProperties;
import org.ofbiz.base.util.UtilValidate;
import org.ofbiz.entity.GenericDelegator;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.webapp.control.LoginWorker;


public class SecurityEvents {
	public static final String module = SecurityEvents.class.getName();
    
    /*
     * check user login.
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
	
	/*
     * get tree's data by parentId
     */
	public static String getTreeDataByParentId(HttpServletRequest request, HttpServletResponse response) {
		GenericDelegator delegator = (GenericDelegator) request.getAttribute("delegator");
		String parentId = request.getParameter("parentId");
		String jsonStr = CommonEvents.getTreeDataByParentId(delegator, parentId,true);
		CommonEvents.writeJsonDataToExt(response, jsonStr);
		return "success";
	}
	
	/*
     * get tree's root data
     */
	public static String getTreeRootData(HttpServletRequest request, HttpServletResponse response) {
		GenericDelegator delegator = (GenericDelegator) request.getAttribute("delegator");
		String parentId = request.getParameter("parentId");
		String jsonStr = CommonEvents.getTreeDataByParentId(delegator, parentId,false);
		CommonEvents.writeJsonDataToExt(response, jsonStr);
		return "success";
	}
}
