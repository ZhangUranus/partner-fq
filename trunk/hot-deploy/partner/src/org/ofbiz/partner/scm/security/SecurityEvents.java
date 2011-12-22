package org.ofbiz.partner.scm.security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javolution.util.FastList;

import net.sf.json.JSONObject;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.ofbiz.base.crypto.HashCrypt;
import org.ofbiz.base.util.Debug;
import org.ofbiz.common.login.LoginServices;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.condition.EntityConditionList;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.common.TreeNode;
import org.ofbiz.partner.scm.common.TreeOprCommon;

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
	
	public static String isLogin(HttpServletRequest request, HttpServletResponse response) {
		JSONObject jsonStr = new JSONObject();
		if("".equals(CommonEvents.getUsername(request))){
			
			jsonStr.put("success", false);
		}else{
			jsonStr.put("success", true);
		}
		try {
			CommonEvents.writeJsonDataToExt(response, jsonStr.toString());
		} catch (IOException e) {
			e.printStackTrace();
		}
		return "success";
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
			CommonEvents.writeJsonDataToExt(response, CommonEvents.getTreeDataByParentId(request,CommonEvents.getDelegator(request), parentId, isRoot));
		} catch (IOException e) {
			e.printStackTrace();
		}
		return "success";
	}
	
	public static String getUserTreeToJson(HttpServletRequest request, HttpServletResponse response){
		try {
			List<GenericValue> valueList = CommonEvents.getDelegator(request).findList("Department",null, null, null, null, true);
			List<GenericValue> userList = CommonEvents.getDelegator(request).findList("VSystemUserTree",null, null, null, null, true);
			valueList.addAll(userList);			//将用户数据添加到list中
			List<TreeNode> treeNodes = TreeOprCommon.buildTree(valueList); // 构建数节点
			
			JSONObject jsonResult=new JSONObject();
			jsonResult.element("success", true);//成功标记
			if(treeNodes!=null){
				List<JSONObject> rootList=new ArrayList<JSONObject>();//根节点json对象列表
				for(TreeNode node:treeNodes){//构建每个根节点列表
					JSONObject rootObj=getTreeJsonObject(node);
					if(rootObj!=null){
						rootList.add(rootObj);
					}
				}
				jsonResult.element("children", rootList);
			}
			
			CommonEvents.writeJsonDataToExt(response, jsonResult.toString()); // 将结果返回前端Ext
		} catch (GenericEntityException e) {
			Debug.logError(e, module);
		} catch (JsonGenerationException e) {
			Debug.logError(e, module);
		} catch (JsonMappingException e) {
			Debug.logError(e, module);
		} catch (IOException e) {
			Debug.logError(e, module);
		}
		return "success";
	}
	
	public static String getUserInfo(HttpServletRequest request, HttpServletResponse response) {
		
		return "success";
	}
	
	public static JSONObject getTreeJsonObject(TreeNode treeNode){
		if(treeNode!=null){
			JSONObject nodeJson=new JSONObject();
			GenericValue value=treeNode.getValue();
			Collection<String> keys =  value.getAllKeys();
			boolean valid = true;
			boolean department = true;
			for(String field : keys){
				if("name".equals(field)){
					nodeJson.element("text", value.getString("name"));
				} else if("valid".equals(field)){
					if(value.getString(field).equals("N")){
						valid = false;
					}
					department = false;
				}
				nodeJson.element(field, value.getString(field));
			}
			if(department){
				nodeJson.element("iconCls", "tree-department");
				nodeJson.element("isUser", false);
			}else{
				nodeJson.element("isUser", true);
				if(valid){
					nodeJson.element("iconCls", "tree-user");
				}else{
					nodeJson.element("iconCls", "tree-user-invalid");
				}
			}
			boolean isLeaf=true;//是否叶子节点
			//递归构建children
			List<TreeNode> childrenList=treeNode.getChildren();
			if(childrenList!=null&&childrenList.size()>0){
				List<JSONObject> childrenJson=new ArrayList<JSONObject>();
				for(TreeNode child:childrenList){
					JSONObject childJson=getTreeJsonObject(child);
					if(childJson!=null){
						childrenJson.add(childJson);
					}
				}
				nodeJson.element("children", childrenJson);
				isLeaf=false;
			}
			
			nodeJson.element("leaf", isLeaf);
			return nodeJson;
		}
		return null;
	}
	
}
