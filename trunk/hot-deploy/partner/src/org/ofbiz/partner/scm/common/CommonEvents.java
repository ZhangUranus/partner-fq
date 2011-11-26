package org.ofbiz.partner.scm.common;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
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


public class CommonEvents {
	public static final String module = CommonEvents.class.getName();
	public static final String usernameCookieName = "OFBiz.Username";
	
	/*
	 * get username form cookie
	 * 
	 * */
	public static String getUsername(HttpServletRequest request) {
        String cookieUsername = null;
        Cookie[] cookies = request.getCookies();
        if (Debug.verboseOn()) Debug.logVerbose("Cookies:" + cookies, module);
        if (cookies != null) {
            for (Cookie cookie: cookies) {
                if (cookie.getName().equals(usernameCookieName)) {
                    cookieUsername = cookie.getValue();
                    break;
                }
            }
        }
        return cookieUsername;
    }
	
	/*
	 * set username to cookie
	 * 
	 * */
    public static void setUsername(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession();
        String domain = UtilProperties.getPropertyValue("url.properties", "cookie.domain");
        synchronized (session) {
            if (UtilValidate.isEmpty(getUsername(request))) {
                Cookie cookie = new Cookie(usernameCookieName, request.getParameter("USERNAME"));
                cookie.setMaxAge(60 * 60 * 24 * 365);
                cookie.setPath("/");
                cookie.setDomain(domain);
                response.addCookie(cookie);
            }
        }
    }
	
    /*
	 * return the json data to ext
	 * 
	 * */
    public static void writeJsonDataToExt(HttpServletResponse response,String jsonStr){
    	Writer out;
    	response.setContentType("application/x-json");
        try {
            response.setContentLength(jsonStr.getBytes("UTF8").length);
            Debug.logInfo(jsonStr, module);
            out = response.getWriter();
            out.write(jsonStr);
            out.flush();
        } catch (UnsupportedEncodingException e) {
            Debug.logError("Problems with Json encoding: " + e, module);
        } catch (IOException e) {
            Debug.logError(e, module);
        }
    }
    
    /*
	 * get tree data by parent_id
	 * 
	 * flag : true ->find children
	 *        false ->do not find children
	 * */
    public static String getTreeDataByParentId(GenericDelegator delegator,String parentId,boolean flag){
		EntityCondition condition = EntityCondition.makeCondition("parentId",parentId);
		List<GenericValue> menuList = FastList.newInstance();
		List<String> orders = new ArrayList<String>();
		orders.add("sort");
		try {
			menuList =  delegator.findList("TSystemMenu", condition, null, orders, null, true);
		} catch (GenericEntityException e) {
			Debug.logError("Problems with findList "+e, module);
		}
		
		StringBuffer jsonStr = new StringBuffer();
		jsonStr.append("[");
		int count = 0;
		JSONObject tempObject = null;
		for (GenericValue node: menuList) {
			if(count!=0){
				jsonStr.append(",");
			}
			tempObject = new JSONObject();
			tempObject.put("id", node.getString("menuId"));
			tempObject.put("text", node.getString("menuName"));
			tempObject.put("iconCls", node.getString("styleName"));
			tempObject.put("sort", node.getString("sort"));
			if(node.getString("menuType").equals("1")){
				tempObject.put("hyperlink", node.getString("hyperlink"));
				tempObject.put("leaf", true);
			}else if(flag){
				tempObject.put("children", getTreeDataByParentId(delegator,node.getString("menuId"),true));
			}
			jsonStr.append(tempObject.toString());
			count ++;
        }
		jsonStr.append("]");
		Debug.logInfo(jsonStr.toString(), module);
    	return jsonStr.toString();
    }
    
}
