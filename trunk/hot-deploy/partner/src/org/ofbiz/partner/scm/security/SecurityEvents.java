package org.ofbiz.partner.scm.security;

import java.sql.Connection;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import javolution.util.FastList;

import net.sf.json.JSONObject;

import org.ofbiz.base.crypto.HashCrypt;
import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilProperties;
import org.ofbiz.common.login.LoginServices;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.condition.EntityConditionList;
import org.ofbiz.entity.jdbc.ConnectionFactory;
import org.ofbiz.entity.model.ModelEntity;
import org.ofbiz.entity.model.ModelField;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.entity.util.EntityFindOptions;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.common.EntityCRUDEvent;
import org.ofbiz.partner.scm.common.TreeNode;
import org.ofbiz.partner.scm.common.TreeOprCommon;
import org.ofbiz.partner.scm.pricemgr.Utils;
import org.ofbiz.service.LocalDispatcher;
import org.ofbiz.webapp.control.LoginWorker;

/**
 * 用户安全事件类
 * @author Jeff-liu 
 *
 */

public class SecurityEvents {
	public static final String module = SecurityEvents.class.getName();
    
	public static String createUserLogin(HttpServletRequest request, HttpServletResponse response) throws Exception {
		LocalDispatcher dispatcher = (LocalDispatcher) request.getAttribute("dispatcher");
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		Map<String, String> userMap = new HashMap<String, String>();			//用户信息
		
		if(request.getParameter("records") == null){
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "RecordsEmpty"));
		}
		List records = CommonEvents.getRecordsFromRequest(request);

		// 循环每个记录新增
		String entityName = "TSystemUser";
		String roleEntityName = "TSystemUserOfRole";
		for (Object r : records) {
			JSONObject record = (JSONObject) r;// 单条记录
			GenericValue v = delegator.makeValue(entityName);// 新建一个值对象
			if(EntityCRUDEvent.checkFieldUnique(request,entityName,"userId",record.get("userId").toString())){
				v.set("userId", record.get("userId"));
				userMap.put("userLoginId", record.get("userId").toString());
			}else{
				throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "UserIdIsExist"));
			}
			if(EntityCRUDEvent.checkFieldUnique(request,entityName,"userName",record.get("userName").toString())){
				v.set("userName", record.get("userName").toString());
			}else{
				throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "NameIsExist"));
			}
			
			v.set("password", HashCrypt.getDigestHash(record.get("password").toString(), LoginServices.getHashType()));
			v.set("id",record.get("id"));
			v.set("sex",record.get("sex"));
			v.set("departmentId",record.get("departmentId"));
			v.set("position",record.get("position"));
			v.set("phoneNumber",record.get("phoneNumber"));
			v.set("email",record.get("email"));
			v.set("valid",record.get("valid"));
			
			userMap.put("currentPassword", record.get("password").toString());
			userMap.put("currentPasswordVerify", record.get("password").toString());		//由于前端已经判断了确认密码信息，此处保证不会出错
			userMap.put("enabled", record.get("valid").toString());
			boolean beganTransaction = false;		//增加事务控制
			try {
				beganTransaction = TransactionUtil.begin();
				delegator.removeByCondition(roleEntityName, EntityCondition.makeCondition("userId", record.getString("userId")));
				if(!"".equals(record.getString("roles"))){
					String[] roles = record.getString("roles").split(";");
					for(String role : roles){
						String[] roleArr = role.split("#");
						GenericValue rv = delegator.makeValue(roleEntityName);// 新建一个值对象
						rv.set("id", roleArr[0]);
						rv.set("roleId", roleArr[1]);
						rv.set("userId", record.getString("userId"));
						delegator.create(rv);
					}
				}
				dispatcher.runSync("createUserLogin", userMap);	//增加系统用户
				delegator.create(v);		//增加项目用户
				TransactionUtil.commit(beganTransaction);
			} catch (GenericEntityException e) {
				try {
					TransactionUtil.rollback(beganTransaction, UtilProperties.getPropertyValue("ErrorCode_zh_CN", "AddUserFromDBEntityException"), e);
	            } catch (GenericEntityException e2) {
	            	throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "RollbackAddUserTransactionException"));
	            }
				throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "AddUserFromDBEntityException"));
			}
		}
		return "success";
	}
	
	public static String updateUserLogin(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		
		if(request.getParameter("records") == null){
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "RecordsEmpty"));
		}
		List records = CommonEvents.getRecordsFromRequest(request);

		// 循环每个记录新增
		String entityName = "TSystemUser";
		String systemEntityName = "UserLogin";
		String roleEntityName = "TSystemUserOfRole";
		for (Object r : records) {
			JSONObject record = (JSONObject) r;// 单条记录
			GenericValue v = delegator.makeValue(entityName);// 新建一个值对象
			GenericValue sv = delegator.makeValue(systemEntityName);// 新建一个值对象
			ModelEntity vModel = v.getModelEntity();// 获取值对象字段模型
			Iterator<String> i = record.keys();
			String[] roles = null;
			boolean roleUpdate = true;
			while (i.hasNext()) {
				String fieldName = i.next();
				ModelField vModelField = vModel.getField(fieldName);
				if (vModelField != null) {
					if(fieldName.equals("userId")){
						if(EntityCRUDEvent.checkFieldUnique(request,entityName,"userId",record.get("userId").toString(),"id",record.get("id").toString())){
							v.set("userId", record.get("userId"));
							sv.set("userLoginId", record.get("userId"));
						}else{
							throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "UserIdIsExist"));
						}
					} else if(fieldName.equals("userName")){
						if(EntityCRUDEvent.checkFieldUnique(request,entityName,"userName",record.get("userName").toString(),"id",record.get("id").toString())){
							v.set("userName", record.get("userName").toString());
						}else{
							throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "NameIsExist"));
						}
					} else if(fieldName.equals("password")){
						if(!record.get("password").toString().startsWith("{SHA}")){
							v.set("password", HashCrypt.getDigestHash(record.get("password").toString(), LoginServices.getHashType()));
							sv.set("currentPassword", HashCrypt.getDigestHash(record.get("password").toString(), LoginServices.getHashType()));
						}else{
							v.set("password",record.get("password"));
							sv.set("currentPassword",record.get("password"));
						}
					} else if(fieldName.equals("valid")){
						v.set("valid",record.get("valid"));
						sv.set("enabled",record.get("valid"));
					} else {
						v.set(fieldName, record.get(fieldName));
					}
				}
				
				if(fieldName.equals("roles")){
					if(!"".equals(record.getString("roles"))){
						if("noUpdate".equals(record.getString("roles"))){
							roleUpdate = false;
						}
						roles = record.getString("roles").split(";");
					}
				}
			}
			boolean beganTransaction = false;		//增加事务控制
			try {
				beganTransaction = TransactionUtil.begin();
				if(roleUpdate){
					delegator.removeByCondition(roleEntityName, EntityCondition.makeCondition("userId", record.getString("userId")));
					if(roles != null){
						for(String role : roles){
							String[] roleArr = role.split("#");
							GenericValue rv = delegator.makeValue(roleEntityName);// 新建一个值对象
							rv.set("id", roleArr[0]);
							rv.set("roleId", roleArr[1]);
							rv.set("userId", record.getString("userId"));
							delegator.create(rv);
						}
					}
				}
				delegator.store(v);		//修改项目用户
				delegator.store(sv);	//修改系统用户
				
				List<GenericValue> valueList = new ArrayList<GenericValue>();
				valueList.add(v);
				String jsonStr = EntityCRUDEvent.getJsonFromGenValList(valueList,1); // 将查询结果转换为json字符串
				CommonEvents.writeJsonDataToExt(response, jsonStr); // 将结果返回前端Ext
				
				TransactionUtil.commit(beganTransaction);
			} catch (GenericEntityException e) {
				try {
					TransactionUtil.rollback(beganTransaction, UtilProperties.getPropertyValue("ErrorCode_zh_CN", "UpdateUserFromDBEntityException"), e);
	            } catch (GenericEntityException e2) {
	            	throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "RollbackUpdateUserTransactionException"));
	            }
				throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "UpdateUserFromDBEntityException"));
			}
		}
		return "success";
	}
	
	public static String deleteUserLogin(HttpServletRequest request, HttpServletResponse response)throws Exception {
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		if(request.getParameter("records") == null){
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "RecordsEmpty"));
		}
		List records = CommonEvents.getRecordsFromRequest(request);
		
		// 循环每个记录删除
		String entityName = "TSystemUser";
		String systemEntityName = "UserLogin";
		String roleEntityName = "TSystemUserOfRole";
		for (Object r : records) {
			JSONObject record = (JSONObject) r;// 单条记录
			GenericValue v = delegator.makeValue(entityName);// 新建一个值对象
			GenericValue sv = delegator.makeValue(systemEntityName);// 新建一个值对象
			
			v.set("id", record.get("id"));
			sv.set("userLoginId", record.get("userId"));
			boolean beganTransaction = false;		//增加事务控制
			try {
				beganTransaction = TransactionUtil.begin();
				delegator.removeByCondition(roleEntityName, EntityCondition.makeCondition("userId", record.getString("userId")));
				delegator.removeValue(v);
				//delegator.removeValue(sv);
				deleteUserLoginById(record.getString("userId"));
				TransactionUtil.commit(beganTransaction);
			} catch (GenericEntityException e) {
				try {
					TransactionUtil.rollback(beganTransaction, UtilProperties.getPropertyValue("ErrorCode_zh_CN", "DeleteUserFromDBEntityException"), e);
	            } catch (GenericEntityException e2) {
	            	throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "RollbackDeleteUserTransactionException"));
	            }
				throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "DeleteUserFromDBEntityException"));
			}
		}
		return "success";
	}
	
	public static void deleteUserLoginById(String userId) throws Exception {
		Connection conn = null;
		try {
			conn = ConnectionFactory.getConnection(org.ofbiz.partner.scm.common.Utils.getConnectionHelperName());
			String sql = "DELETE FROM USER_LOGIN WHERE USER_LOGIN_ID = '" + userId +"'";
			Statement ps = conn.createStatement();
			ps.executeUpdate(sql);
		} catch(Exception e){
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "cannotDeleteTheUserException"));
		} finally {
			if (conn != null) {
				conn.close();
			}
		}
	}
	
    /**
     * 检查用户名密码
     * @throws Exception 
     */
	public static String checkLogin(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String responseString = LoginWorker.checkLogin(request, response);
		Map<String,String> userObj = new HashMap<String, String>();
    	String username = request.getParameter("USERNAME");
    	List<GenericValue> recordList =  CommonEvents.getDelegator(request).findList("TSystemUser", EntityCondition.makeCondition("userId",username), null, null, null, true);
    	GenericValue systemUser = recordList.get(0);
		JSONObject jsonStr = new JSONObject();
		if (!"success".equals(responseString)) {
			GenericValue userLogin = CommonEvents.getDelegator(request).findOne("UserLogin", true, "userLoginId", username);
			Long currentFailedLogins = userLogin.getLong("successiveFailedLogins");
			String mflStr = UtilProperties.getPropertyValue("security.properties", "max.failed.logins");
            long maxFailedLogins = 3;
            try {
                maxFailedLogins = Long.parseLong(mflStr);
            } catch (Exception e) {
                maxFailedLogins = 3;
                Debug.logWarning("Could not parse max.failed.logins from security.properties, using default of 3", module);
            }
            if (maxFailedLogins > 0 && currentFailedLogins.longValue() >= maxFailedLogins) {
            	systemUser.set("valid", "N");
                systemUser.store();
            }
			throw new Exception("用户名、密码不正确或用户已失效，请确认后重新输入！");
        }else{
        	Calendar calendar = Calendar.getInstance();
			calendar.setTime(Utils.getCurDate());
        	CommonEvents.setUsername(request, response);
        	String uid = systemUser.getString("id");
        	CommonEvents.setAttributeToSession(request, "uid", uid);
        	userObj.put("id", uid);
        	userObj.put("userId", username);
        	userObj.put("userName", systemUser.getString("userName"));
        	userObj.put("departmentId", systemUser.getString("departmentId"));
        	JSONObject userObject = JSONObject.fromObject(userObj);
        	//String aaa = "{'id':"+uid+",'userId':"+username+",'userName':"+systemUser.getString("userName")+",'departmentId':"+systemUser.getString("departmentId")+"}";

        	//JSONObject userObject = JSONObject.fromObject(systemUser.getAllFields());
        	CommonEvents.setAttributeToSession(request, "currentUser", userObject);
			jsonStr.put("currentUser", userObject);
			jsonStr.put("currentYear", calendar.get(Calendar.YEAR));
			jsonStr.put("currentMonth", calendar.get(Calendar.MONTH)+1);
			jsonStr.put("success", true);
        }
		CommonEvents.writeJsonDataToExt(response, jsonStr.toString());
		return responseString;
	}
	
	public static String isLogin(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HttpSession session = request.getSession();
        GenericValue userLogin = (GenericValue) session.getAttribute("userLogin");
        
		JSONObject jsonStr = new JSONObject();
//		String username = CommonEvents.getUsername(request);
		if(userLogin != null && !"".equals(userLogin.getString("userLoginId"))){
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(Utils.getCurDate());
			jsonStr.put("currentUser", CommonEvents.getAttributeFormSession(request, "currentUser"));
			jsonStr.put("currentYear", calendar.get(Calendar.YEAR));
			jsonStr.put("currentMonth", calendar.get(Calendar.MONTH)+1);
			jsonStr.put("success", true);
		}else{
			jsonStr.put("success", false);
		}
		CommonEvents.writeJsonDataToExt(response, jsonStr.toString());
		return "success";
	}
	
	public static String logout(HttpServletRequest request, HttpServletResponse response) throws Exception {
		CommonEvents.removeAttributeFromSession(request, "USERNAME");
		LoginWorker.logout(request, response);
		CommonEvents.writeJsonDataToExt(response, "{'success': true}");
		return "success";
	}
	
	/**
     * 获取用户权限字符串(Json字符串格式)
	 * @throws Exception 
     */
	public static String getUserPermissions(HttpServletRequest request, HttpServletResponse response) throws Exception {
		EntityConditionList<EntityCondition> condition = null;
    	List<EntityCondition> conds = FastList.newInstance();
    	conds.add(EntityCondition.makeCondition("menuId",request.getParameter("menuId")));
    	conds.add(EntityCondition.makeCondition("userId",CommonEvents.getUsername(request)));
    	condition = EntityCondition.makeCondition(conds);
    	List<GenericValue> permissionList = FastList.newInstance();
    	
    	EntityFindOptions findOptions = new EntityFindOptions();
		findOptions.setDistinct(true);
		
		try {
			permissionList =  CommonEvents.getDelegator(request).findList("VSystemUserOfMenu", condition, null, null, findOptions, false);
		} catch (Exception e) {
			Debug.logError(e, module);
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "GetEntityListException"));
		}
		
		JSONObject tempObject = new JSONObject();
		tempObject.put("edit", false);
		tempObject.put("add", false);
		tempObject.put("view", false);
		tempObject.put("remove", false);
		tempObject.put("audit", false);
		tempObject.put("submit", false);
		for (GenericValue node: permissionList) {
			if("V".equals(node.get("operateType"))){//view权限只在取菜单时使用，所以不需要列入考虑
				tempObject.put("view", true);
			} 
			if("E".equals(node.get("operateType"))){
				tempObject.put("edit", true);
			}else if("N".equals(node.get("operateType"))){
				tempObject.put("add", true);
			}else if("D".equals(node.get("operateType"))){
				tempObject.put("remove", true);
			}else if("A".equals(node.get("operateType"))){
				tempObject.put("audit", true);
			}else if("S".equals(node.get("operateType"))){
				tempObject.put("submit", true);
			}
		}
		CommonEvents.writeJsonDataToExt(response, tempObject.toString());
		return "success";
	}
	
	/**
     * 获取用户功能菜单数据
	 * @throws Exception 
     */
	public static String getTreeDataByParentId(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String parentId = request.getParameter("parentId");
		String flag = request.getParameter("flag");
		boolean isRoot = false;
		if(flag.equals("true")){
			isRoot = true;
		}
		CommonEvents.writeJsonDataToExt(response, CommonEvents.getTreeDataByParentId(request,CommonEvents.getDelegator(request), parentId, isRoot));
		return "success";
	}
	
	public static String getUserTreeToJson(HttpServletRequest request, HttpServletResponse response) throws Exception{
		try {
			List<GenericValue> valueList = CommonEvents.getDelegator(request).findList("Department",null, null, null, null, false);
			List<GenericValue> userList = CommonEvents.getDelegator(request).findList("VSystemUserTree",null, null, null, null, false);
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
		} catch (Exception e) {
			Debug.logError(e, module);
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "GetEntityListException"));
		}
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
