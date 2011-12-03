package org.ofbiz.partner.scm.security;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javolution.util.FastList;

import net.sf.json.JSONObject;

import org.ofbiz.base.crypto.HashCrypt;
import org.ofbiz.base.util.Debug;
import org.ofbiz.common.login.LoginServices;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.condition.EntityConditionList;
import org.ofbiz.partner.scm.common.CommonEvents;

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
		//String responseString = LoginWorker.checkLogin(request, response);
		String responseString = "success";
		List<GenericValue> recordList = FastList.newInstance();
		String password = request.getParameter("password");
		String username = request.getParameter("username");
		
		EntityConditionList<EntityCondition> condition = null;
		List<EntityCondition> conds = FastList.newInstance();
		conds.add(EntityCondition.makeCondition("password",HashCrypt.getDigestHash(password, LoginServices.getHashType())));
		conds.add(EntityCondition.makeCondition("userId",username));
		condition = EntityCondition.makeCondition(conds);
		try {
			recordList =  CommonEvents.getDelegator(request).findList("TSystemUser", condition, null, null, null, true);
		} catch (GenericEntityException e) {
			Debug.logError("Problems with findList "+e, module);
		}
		if (recordList == null || recordList.size() < 1) {
			responseString = "fail";
		}
		
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
		String flag = request.getParameter("flag");
		boolean isRoot = false;
		if(flag.equals("true")){
			isRoot = true;
		}
		try {
			CommonEvents.writeJsonDataToExt(response, CommonEvents.getTreeDataByParentId(CommonEvents.getDelegator(request), parentId, isRoot));
		} catch (IOException e) {
			e.printStackTrace();
		}
		return "success";
	}
}
