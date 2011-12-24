package org.ofbiz.partner.scm.common;

import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import javolution.util.FastList;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.codehaus.jackson.map.ObjectMapper;
import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilProperties;
import org.ofbiz.base.util.UtilValidate;
import org.ofbiz.entity.GenericDelegator;
import org.ofbiz.entity.GenericEntityException;
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
	private static final String usernameCookieName = "OFBiz.Username";
	private static GenericDelegator delegator = null;
	private static ObjectMapper objectMapper = new ObjectMapper();
	
	public static GenericDelegator getDelegator(HttpServletRequest request){
		if(delegator == null){
			delegator = (GenericDelegator)request.getAttribute("delegator");
		}
		return delegator;
	}
	
	/**
	 * 从Cookies中取出username
	 * 
	 * */
	public static String getUsername(HttpServletRequest request) {
		if(request.getSession().getAttribute("username") == null){
			return "";
		}else{
			return request.getSession().getAttribute("username").toString();
		}
    }
	
	/**
	 * 设置username到Cookies中
	 * 
	 * */
    public static void setUsername(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession();
        setAttributeToSession(request, "username", request.getParameter("username"));
        String domain = UtilProperties.getPropertyValue("url.properties", "cookie.domain");
        synchronized (session) {
            if (UtilValidate.isEmpty(getUsername(request))) {
                Cookie cookie = new Cookie(usernameCookieName, request.getParameter("username"));
                cookie.setMaxAge(60 * 60 * 24 * 365);
                cookie.setPath("/");
                cookie.setDomain(domain);
                response.addCookie(cookie);
            }
        }
    }
    
    /**
	 * 设置属性到Session中
	 * 
	 * */
    public static void setAttributeToSession(HttpServletRequest request,String attributeName,String attributeValue){
    	if(!"".equals(attributeName) && !"".equals(attributeValue)){
    		request.getSession().setAttribute(attributeName, attributeValue);
    	}
    }
    
    /**
	 * 清理Session中属性
	 * 
	 * */
    public static void removeAttributeFromSession(HttpServletRequest request,String attributeName){
    	if(!"".equals(attributeName)){
    		request.getSession().removeAttribute(attributeName);
    	}
    }
    
    /**
	 * 从session中获取属性值
	 * 
	 * */
    public static String getAttributeToSession(HttpServletRequest request,String attributeName){
    	if(!"".equals(attributeName)){
    		return request.getSession().getAttribute(attributeName).toString();
    	}else{
    		return "";
    	}
    }
	
    /**
	 * 将Json字符串返回给前端Ext
     * @throws IOException 
	 * 
	 * */
    public static void writeJsonDataToExt(HttpServletResponse response,String jsonStr) throws IOException{
    	Writer out;
    	response.setContentType("application/x-json");
    	response.setContentLength(jsonStr.getBytes("UTF8").length);
        Debug.logInfo(jsonStr, module);
        out = response.getWriter();
        out.write(jsonStr);
        out.flush();
    }
    
    /**
	 * 根据传入父节点Id获取树形菜单数据（json字符串格式）
	 * 
	 * flag : true ->遍历所有子节点
	 *        false ->只查找该节点下层节点
	 * */
    public static String getTreeDataByParentId(HttpServletRequest request,GenericDelegator delegator,String parentId,boolean flag){
    	EntityConditionList<EntityCondition> condition = null;
    	List<EntityCondition> conds = FastList.newInstance();
    	conds.add(EntityCondition.makeCondition("parentId",parentId));
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
		} catch (GenericEntityException e) {
			Debug.logError("Problems with findList "+e, module);
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
}
