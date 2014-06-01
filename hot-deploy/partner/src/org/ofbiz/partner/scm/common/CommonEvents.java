package org.ofbiz.partner.scm.common;

import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import javolution.util.FastList;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilProperties;
import org.ofbiz.entity.GenericDelegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.condition.EntityConditionList;
import org.ofbiz.entity.util.EntityFindOptions;

/**
 * 公共事件类
 * @author Jeff-liu 
 *
 */
public class CommonEvents {
	private static final String module = CommonEvents.class.getName();
//	private static final String usernameCookieName = "OFBiz.Username";
	private static GenericDelegator delegator = null;
	private static SerialNumberHelper serialNumberHelper = new SerialNumberHelper();
	
	private static final int MAX_AGE =-1; //24 * 60 * 60;   //一天
	
	//private static String loginSaveType = "cookie";
	
	public static GenericDelegator getDelegator(HttpServletRequest request){
		if(delegator == null){
			delegator = (GenericDelegator)request.getAttribute("delegator");
		}
		return delegator;
	}
	
	/**
	 * 从Cookies中取出username
	 * @throws UnsupportedEncodingException 
	 * 
	 * */
	public static String getUsername(HttpServletRequest request) throws UnsupportedEncodingException {
		System.out.println("sessionId = "+request.getSession().getId());
		if(request.getSession().getAttribute("USERNAME") == null){
    		String attributeValue = "";
    		Cookie[] cookies = ((HttpServletRequest) request).getCookies();
    		if (cookies != null) {  
                for (Cookie c : cookies) {  
                    if (c.getName().equals("username")) {
                    	attributeValue = URLDecoder.decode(c.getValue(),"UTF-8");  
                    }
                }  
            }
			return attributeValue;
		}else{
			return request.getSession().getAttribute("USERNAME").toString();
		}
    }
	
	/**
	 * 设置username到session和Cookies中
	 * @throws UnsupportedEncodingException 
	 * 
	 * */
    public static void setUsername(HttpServletRequest request, HttpServletResponse response) throws UnsupportedEncodingException {
    	HttpSession session = request.getSession();
        System.out.println("sessionId = "+session.getId());
        setAttributeToSession(request,response, "USERNAME", request.getParameter("USERNAME"));
				Cookie usernameCookie = new Cookie("username",URLEncoder.encode( request.getParameter("USERNAME").toString(),"utf-8"));
        Cookie passwordCookie = new Cookie("password", URLEncoder.encode( request.getParameter("PASSWORD").toString(),"utf-8"));  
        
        usernameCookie.setPath("/");
        usernameCookie.setMaxAge(MAX_AGE);  
        passwordCookie.setPath("/");  
        passwordCookie.setMaxAge(MAX_AGE);
        response.addCookie(usernameCookie);  
        response.addCookie(passwordCookie);
    }
    
    /**
	 * 设置属性到Session中
     * @throws UnsupportedEncodingException 
	 * 
	 * */
    public static void setAttributeToSession(HttpServletRequest request,HttpServletResponse response,String attributeName,Object attributeValue) throws UnsupportedEncodingException{
    	if(!"".equals(attributeName) && attributeValue != null){
    		request.getSession().setAttribute(attributeName, attributeValue);
        	Cookie tempCookie = new Cookie(attributeName, URLEncoder.encode(attributeValue.toString(),"utf-8"));
        	tempCookie.setPath("/");
        	tempCookie.setMaxAge(MAX_AGE);  
            response.addCookie(tempCookie);  
    	}
    }
    
    /**
	 * 清理Session和cookie中属性
	 * 
	 * */
    public static void removeAttributeFromSession(HttpServletRequest request,HttpServletResponse response,String attributeName){
        Cookie usernameCookie = new Cookie("username", "");
        Cookie passwordCookie = new Cookie("password", "");
        Cookie currentUserCookie = new Cookie("currentUser", "");
        
        usernameCookie.setMaxAge(0); // 使cookie失效  
        passwordCookie.setMaxAge(0);
        currentUserCookie.setMaxAge(0);
        usernameCookie.setPath("/"); // 这个不能少  
        passwordCookie.setPath("/");
        currentUserCookie.setPath("/");
        response.addCookie(usernameCookie);
        response.addCookie(passwordCookie);
        response.addCookie(currentUserCookie);
    }
    
    /**
	 * 从session中获取属性值
     * @throws UnsupportedEncodingException 
	 * 
	 * */
    public static String getAttributeFormSession(HttpServletRequest request,String attributeName) throws UnsupportedEncodingException{
    	if(!"".equals(attributeName)){
    		String attributeValue = "";
    		Cookie[] cookies = ((HttpServletRequest) request).getCookies();
    		if (cookies != null) {  
                for (Cookie c : cookies) {  
                    if (c.getName().equals(attributeName)) {  
                    	attributeValue = URLDecoder.decode(c.getValue(),"UTF-8");
                    }
                }  
            }
    		if(attributeValue != ""){
    			return attributeValue;
    		}else {
    			if(request.getSession().getAttribute(attributeName) != null){
    				return request.getSession().getAttribute(attributeName).toString();
    			}else{
    				return "";
    			}
    		}
    	}else{
    		return "";
    	}
    }
    
    /**
	 * 将Json字符串返回给前端Ext
     * @throws Exception 
	 * 
	 * */
    public static void writeJsonDataToExt(HttpServletResponse response,String jsonStr) throws Exception {
    	Writer out;
    	response.resetBuffer();
    	response.setContentType("application/x-json");
    	try {
			response.setContentLength(jsonStr.getBytes("UTF8").length);
			Debug.logInfo(jsonStr, module);
	        out = response.getWriter();
	        out.write(jsonStr);
	        out.flush();
	        if (out != null) {
	        	out.close();
			}
		} catch (Exception e) {
			Debug.logError(e, module);
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "WriteJsonToWebException"));
		}
        
    }
    
    /**
	 * 根据传入父节点Id获取树形菜单数据（json字符串格式）
	 * 
	 * flag : true ->遍历所有子节点
	 *        false ->只查找该节点下层节点
     * @throws Exception 
	 * */
    public static String getTreeDataByParentId(HttpServletRequest request,GenericDelegator delegator,String parentId,boolean flag) throws Exception{
    	EntityConditionList<EntityCondition> condition = null;
    	List<EntityCondition> conds = FastList.newInstance();
    	conds.add(EntityCondition.makeCondition("parentId",parentId));
    	conds.add(EntityCondition.makeCondition("display","1"));
    	conds.add(EntityCondition.makeCondition("userId",getUsername(request)));
    	condition = EntityCondition.makeCondition(conds);
    	
		List<GenericValue> menuList = FastList.newInstance();
		List<String> orders = new ArrayList<String>();
		orders.add("sort");		//增加排序字段
		
		EntityFindOptions findOptions = new EntityFindOptions();
		findOptions.setDistinct(true);
		
		//根据parentId从数据库中获取子节点列表
		try {
			menuList =  delegator.findList("VSystemMenu", condition, null, orders, findOptions, true);
		} catch (Exception e) {
			Debug.logError(e, module);
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "GetEntityListException"));
		}
		if (menuList == null || menuList.size() < 1) {
			return "[]";
		}
		//将list对象转换为json格式字符串
		StringBuffer jsonStr = new StringBuffer();
		boolean isFirstValue = true;
		jsonStr.append("[");
		JSONObject tempObject = null;
		for (GenericValue node: menuList) {
			if (isFirstValue) {
				isFirstValue = false;
			} else {
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
			}else if(flag){	//当节点有下级节点，而且flag值为true，遍历节点
				tempObject.put("children", getTreeDataByParentId(request,delegator,node.getString("menuId"),true));
			}
			jsonStr.append(tempObject.toString());
        }
		jsonStr.append("]");
		Debug.logInfo(jsonStr.toString(), module);
    	return jsonStr.toString();
    }
    /**
     * 根据request返回记录list
     * @param request
     * @return
     */
	public static List getRecordsFromRequest(HttpServletRequest request) {
		StringBuffer jsonStr = new StringBuffer();
		jsonStr.append("{records:");
		jsonStr.append(request.getParameter("records").toString());
		jsonStr.append("}");

		// 获取新增记录，转换为json对象
		JSONObject recordsObject = JSONObject.fromObject(jsonStr.toString());

		Object rcsObj = recordsObject.get("records");

		List records = null;
		if (rcsObj instanceof JSONArray) {// 多记录
			records = recordsObject.getJSONArray("records");// 获取records对象的数组
		} else if (rcsObj instanceof JSONObject) {// 单记录
			records = new ArrayList();
			records.add(recordsObject.get("records"));
		}
		return records;
	}
	
	/**
	 * 获得SerialNumberHelper对象
	 * @return
	 */
	public static SerialNumberHelper getSerialNumberHelper() {
		return serialNumberHelper;
	}	
	
	
    public static void writeJsonDataToExt(HttpServletResponse response,String jsonStr,String contentType) throws Exception {
    	Writer out;
    	response.resetBuffer();
    	response.setContentType(contentType);
    	try {
			response.setContentLength(jsonStr.getBytes("UTF8").length);
			Debug.logInfo(jsonStr, module);
	        out = response.getWriter();
	        out.write(jsonStr);
	        out.flush();
	        if (out != null) {
	        	out.close();
			}
		} catch (Exception e) {
			Debug.logError(e, module);
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "WriteJsonToWebException"));
		}
        
    }
}
