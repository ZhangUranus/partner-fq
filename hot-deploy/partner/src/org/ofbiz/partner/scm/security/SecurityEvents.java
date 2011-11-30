package org.ofbiz.partner.scm.security;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

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
		
		//登录成功，将权限信息写入session
		//String permissionJsonString = getUserPermissions(request.getParameter("USERNAME"))
		//CommonEvents.setAttributeToSession(request, "UserPermissions", permissionJsonString);
		/*permissionJsonString: 
		 * {permissions : {
		 * 		basepermission : true,
		 * 		purchaseBillManagement : [//采购单
		 * 		{
		 * 			view : true,
		 * 			edit : true
		 * 		},
		 * 		purchaseWarehousing : {
		 * 			delete : true,
		 * 			audit : true
		 * 		}
		 * }}
		 * 
		 */
		JSONObject jsonStr = new JSONObject();
		if (!"success".equals(responseString)) {
			jsonStr.put("success", false);
        }else{
        	CommonEvents.setUsername(request, response);
			jsonStr.put("success", true);
        }
		try {
			CommonEvents.writeJsonDataToExt(response, jsonStr.toString());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return responseString;
	}
	
	/**
     * 获取用户权限字符串(Json字符串格式)
     */
	private static String getUserPermissions(String username) {
		return "";
	}
	
	/**
     * 获取用户功能菜单数据
     */
	public static String getTreeDataByParentId(HttpServletRequest request, HttpServletResponse response) {
		String parentId = request.getParameter("parentId");
		String jsonStr = CommonEvents.getTreeDataByParentId(CommonEvents.getDelegator(request), parentId,true);
		try {
			CommonEvents.writeJsonDataToExt(response, jsonStr);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return "success";
	}
	
	/**
     * 获取用户功能模块数据
     */
	public static String getTreeRootData(HttpServletRequest request, HttpServletResponse response) {
		String parentId = request.getParameter("parentId");
		String jsonStr = CommonEvents.getTreeDataByParentId(CommonEvents.getDelegator(request), parentId,false);
		try {
			CommonEvents.writeJsonDataToExt(response, jsonStr);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return "success";
	}
	
	public static String getUserList(HttpServletRequest request, HttpServletResponse response){
		String jsonStr = CommonEvents.getUserList(request);
		try {
			CommonEvents.writeJsonDataToExt(response, jsonStr);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return "success";
	}
}
