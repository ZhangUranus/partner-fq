package org.ofbiz.partner.scm.common;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javolution.util.FastList;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.codehaus.jackson.map.ObjectMapper;
import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilProperties;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.condition.EntityConditionList;
import org.ofbiz.entity.condition.EntityOperator;
import org.ofbiz.entity.model.ModelEntity;
import org.ofbiz.entity.model.ModelField;
import org.ofbiz.entity.util.EntityFindOptions;
import org.ofbiz.partner.scm.pojo.FilterPojo;
import org.ofbiz.partner.scm.pojo.OrderPojo;

/**
 * 实体CRUD 操作事件公共类
 * 
 * @author Mark Lam
 * 
 */
public class EntityCRUDEvent {
	private static final String module = EntityCRUDEvent.class.getName();
	public static SimpleDateFormat timeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:SS.sss");
	private static ObjectMapper objectMapper = new ObjectMapper();

	/**
	 * 获取实体值列表
	 */
	public static String getColl2Json(HttpServletRequest request,HttpServletResponse response)  throws Exception {
		int start = 0;
		int limit = 0;
		int total = 0;
		try {
			List<GenericValue> valueList =getValueList(request);
			total = valueList.size();
			if(request.getParameter("start") != null){
				start = Integer.parseInt(request.getParameter("start"));
			}
			if(request.getParameter("limit") != null){
				limit = Integer.parseInt(request.getParameter("limit"));
			}
			int toIndex = start+limit;
			if(limit>0){
				if(total >toIndex){
					valueList = valueList.subList(start, start+limit);
				}else{
					valueList = valueList.subList(start, total);
				}
			}
			String jsonStr = getJsonFromGenValList(valueList,total); // 将查询结果转换为json字符串
			CommonEvents.writeJsonDataToExt(response, jsonStr); // 将结果返回前端Ext
		}catch (Exception e) {
			Debug.logError(e, module);
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "GetEntityListException"));
		}
		return "success";
		
	}
	
	/**
	 * 获取实体一条记录
	 */
	public static String getRecordJson(HttpServletRequest request,HttpServletResponse response)  throws Exception {
		try {
			List<GenericValue> valueList =getValueList(request);
			GenericValue value = valueList.get(0);
			String jsonStr = getJsonFromGenVal(value); // 将查询结果转换为json字符串
			CommonEvents.writeJsonDataToExt(response, jsonStr); // 将结果返回前端Ext
		} catch (Exception e) {
			Debug.logError(e, module);
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "GetEntityRecordException"));
		}
		return "success";
		
	}

	/**
	 * 返回tree数据类型格式为,实体必须有下面字段： id , parentId ,name 
	 * {success:true,children:[{id:'xxx',text:'xxx',leaf:false,children:[{id:'xxx',text:'xxx',leaf:true},{...}]},{...}]}
	 * @param request
	 * @param response
	 * @return
	 */
	public static String getTree2Json(HttpServletRequest request,HttpServletResponse response) throws Exception {
		try {
			List<GenericValue> valueList =getValueList(request);
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
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "GetTreeJsonException"));
		}
		return "success";
	}
	/**
	 * 新增记录
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	public static String addnewFromJson(HttpServletRequest request, HttpServletResponse response) throws Exception {
		if (request.getParameter("entity") == null ){
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "EntityNameEmpty"));
		}
		if(request.getParameter("records") == null){
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "RecordsEmpty"));
		}
		List records = CommonEvents.getRecordsFromRequest(request);

		// 循环每个记录新增
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		String entityName = request.getParameter("entity").toString();
		for (Object r : records) {
			JSONObject record = (JSONObject) r;// 单条记录
			GenericValue v = delegator.makeValue(entityName);// 新建一个值对象
			ModelEntity vModel = v.getModelEntity();// 获取值对象字段模型

			// 根据json对象设置对象值
			Iterator<String> i = record.keys();
			while (i.hasNext()) {// 更新每个字段
				String fieldName = i.next();
				// 判断字段有效性，值对象中必须存在字段才能设置该对象的值
				// TODO 现在只判断相同名称的字段是否存在，以后是否要考虑字段类型等
				ModelField vModelField = vModel.getField(fieldName);
				if (vModelField != null) {//如果是密码，需要做加密保存处理
					if(fieldName.equals("name")){
						if(checkFieldUnique(request,entityName,fieldName,record.get(fieldName).toString())){
							v.set(fieldName, record.get(fieldName));
						}else{
							throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "NameIsExist"));
						}
					}else{
						v.set(fieldName, record.get(fieldName));
					}
				}
			}
			
			String entityNumber = CommonEvents.getSerialNumberHelper().getSerialNumber(request, entityName);
			if(!"".equals(entityNumber)){//判断系统编码是否存在，存在的使用系统编码
				ModelField vModelField = vModel.getField("number");
				if (vModelField != null) {
					v.set("number", entityNumber);
				}
			}
			try {
				delegator.create(v);
			} catch (GenericEntityException e) {
				throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "AddRecordToDBEntityException"));
			}
		}
		return "success";

	}

	/**
	 * 更新记录
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	public static String updateFromJson(HttpServletRequest request, HttpServletResponse response) throws Exception{
		if (request.getParameter("entity") == null ){
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "EntityNameEmpty"));
		}
		if(request.getParameter("records") == null){
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "RecordsEmpty"));
		}

		List records = CommonEvents.getRecordsFromRequest(request);

		// 循环每个记录更新
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		String entityName = request.getParameter("entity").toString();
		for (Object r : records) {
			JSONObject record = (JSONObject) r;// 单条记录
			GenericValue v = delegator.makeValue(entityName);// 新建一个值对象
			ModelEntity vModel = v.getModelEntity();// 获取值对象字段模型
			String pkField = vModel.getOnlyPk().getName();
			String pkValue = "";
			
			// 根据json对象设置对象值
			Iterator<String> i = record.keys();
			while (i.hasNext()) {// 更新每个字段
				String fieldName = i.next();
				// 判断字段有效性，值对象中必须存在字段才能设置该对象的值
				
				if(pkField.equals(fieldName)){
					pkValue = record.getString(fieldName);
				}
				ModelField vModelField = vModel.getField(fieldName);
				
				if (vModelField != null) {//如果是密码，需要做加密保存处理
					if(fieldName.equals("name")){
						if(checkFieldUnique(request,entityName,fieldName,record.get(fieldName).toString(),pkField,pkValue)){
							v.set(fieldName, record.get(fieldName));
						}else{
							throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "NameIsExist"));
						}
					}else{
						v.set(fieldName, record.get(fieldName));
					}
				}
			}
			try {
				delegator.store(v);
			} catch (GenericEntityException e) {
				throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "UpdateRecordToDBEntityException"));
			}
		}
		return "success";

	}

	/**
	 * 删除记录
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	public static String deleteFromJson(HttpServletRequest request, HttpServletResponse response)throws Exception {
		if (request.getParameter("entity") == null ){
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "EntityNameEmpty"));
		}
		if(request.getParameter("records") == null){
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "RecordsEmpty"));
		}

		if(request.getParameter("isIgnore")!=null&&request.getParameter("isIgnore").toString().equals("true")){
			return "success";
		}
		List records = CommonEvents.getRecordsFromRequest(request);
		// 循环每个记录删除
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		String entityName = request.getParameter("entity").toString();
		for (Object r : records) {
			JSONObject record = (JSONObject) r;// 单条记录
			GenericValue v = delegator.makeValue(entityName);// 新建一个值对象
			ModelEntity vModel = v.getModelEntity();// 获取值对象字段模型

			// 根据json对象设置对象值
			Iterator<String> i = record.keys();

			// 根据id字段删除
			while (i.hasNext()) {// 更新每个字段
				String fieldName = i.next();
				if (fieldName.equals("id")) {
					ModelField vModelField = vModel.getField(fieldName);
					if (vModelField != null) {
						v.set(fieldName, record.get(fieldName));
					}
					try {
						delegator.removeValue(v);
					} catch (GenericEntityException e) {
						throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "DeleteRecordToDBEntityException"));
					}
					break;
				}

			}

		}
		return "success";
	}



	/**
	 * 返回统一的json错误信息
	 * 
	 * @param response
	 * @param string
	 * @return
	 * @throws Exception 
	 */
	private static String bizError(HttpServletResponse response, String errStr) throws Exception {
		
		// 设置返回参数
		String jResult = "{success=false,msg='" + errStr + "'}";
		CommonEvents.writeJsonDataToExt(response, jResult); // 将结果返回前端Ext
		return "success";
	}

	/**
	 * 根据genericValue生成json对象
	 * 
	 * @param valueList
	 * @return
	 * @throws Exception 
	 */
	private static String getJsonFromGenValList(List<GenericValue> valueList,int total) throws Exception {
		if (valueList == null || valueList.size() < 1) {
			return "{'success':true,total:0,'records':[]}";
		}
		// 封装实体数据，构建json字符串
		StringBuffer jsonStr = new StringBuffer();
		boolean isFirstValue = true;
		jsonStr.append("{'success':true,'records':[");
		for (GenericValue v : valueList) {
			if (isFirstValue) {
				isFirstValue = false;
			} else {
				jsonStr.append(",");
			}
			try {
				jsonStr.append(objectMapper.writeValueAsString(v));
			} catch (Exception e) {
				Debug.logError(e, module);
				throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "EntityObjectToStringException"));
			}
		}
		jsonStr.append("],total:"+total+"}");
		return jsonStr.toString();
	}
	
	/**
	 * 根据genericValue生成json对象
	 * 
	 * @param valueList
	 * @return
	 * @throws Exception 
	 */
	private static String getJsonFromGenVal(GenericValue value) throws Exception {
		if (value == null ) {
			return "{'success':true,'records':{}}";
		}
		// 封装实体数据，构建json字符串
		StringBuffer jsonStr = new StringBuffer();
		jsonStr.append("{'success':true,'records':");
		try {
			jsonStr.append(objectMapper.writeValueAsString(value));
		} catch (Exception e) {
			Debug.logError(e, module);
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "EntityObjectToStringException"));
		}
		jsonStr.append("}");
		return jsonStr.toString();
	}

	/**
	 * 根据对象类型返回合适的值表示，例如数字是12；字符串是'12'；日期是'2011-9-2 23:45:11.112' ；布尔：ture/false
	 * 
	 * @param object
	 * @return
	 */
	private static String getValueStr(Object object) {
		if (object == null) {
			return "null";
		} else if (object instanceof Date) {
			return "'" + timeFormat.format((Date) object) + "'";
		} else if (object instanceof Timestamp || object instanceof String) {
			return "'" + object.toString() + "'";
		} else {
			return object.toString();
		}
	}
	
	/**
	 * 根据请求返回查找结果
	 * @param request
	 * @return
	 */
	public static List<GenericValue> getValueList(HttpServletRequest request) throws Exception{
		EntityConditionList<EntityCondition> condition = null;
		List<EntityCondition> conds = FastList.newInstance();
		if (request.getParameter("entity") == null ){
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "EntityNameEmpty"));
		}
		String entityName = request.getParameter("entity").toString();
		try {
			//过滤字段，对字段做与方式过滤，obectMapper是静态变量，线程不安全
			if(request.getParameter("filter") != null){
				ObjectMapper objMapper = new ObjectMapper();//新建局部变量
				JSONArray array = JSONArray.fromObject(request.getParameter("filter").toString());
				for(int i = 0; i < array.size(); i++) {
					FilterPojo filter = objMapper.readValue(array.getString(i), FilterPojo.class); 
					conds.add(EntityCondition.makeCondition(filter.getProperty(),filter.getValue()));
				}
			}
			//处理whereStr过滤，覆盖filter条件
			if(request.getParameter("whereStr")!=null && !"".equals(request.getParameter("whereStr"))){
				EntityCondition whrCond=EntityCondition.makeConditionWhere(request.getParameter("whereStr"));
				conds.add(whrCond);
			}
			//处理query查询请求，默认为name字段的模糊查询
			if(request.getParameter("query")!=null && !"".equals(request.getParameter("query"))){
				if(request.getParameter("queryField")!=null && !"".equals(request.getParameter("queryField"))){
					String[] fieldArray = request.getParameter("queryField").split(",");
					for(String field: fieldArray){
						conds.add(EntityCondition.makeCondition(field, EntityOperator.LIKE, "%"+request.getParameter("query")+"%"));
					}
				}else{
					conds.add(EntityCondition.makeCondition("name", EntityOperator.LIKE, "%"+request.getParameter("query")+"%"));
				}
			}
			//处理查询字段选择，默认为全部字段
			Set<String> fields = null;
			if(request.getParameter("fields")!=null && !"".equals(request.getParameter("fields"))){
				String[] fieldArray = request.getParameter("fields").split(",");
				fields = new HashSet<String>();
				for(String field: fieldArray){
					fields.add(field);
				}
			}
			//处理是否去重，默认为不去重
			EntityFindOptions findOptions = null;
			if(request.getParameter("distinct")!=null && !"".equals(request.getParameter("distinct"))){
				findOptions = new EntityFindOptions();
				findOptions.setDistinct(true);
			}
			condition = EntityCondition.makeCondition(conds);
			
			List<String> orders = new ArrayList<String>();
			if(request.getParameter("sort")!=null){
				ObjectMapper objMapper = new ObjectMapper();//新建局部变量
				JSONArray array = JSONArray.fromObject(request.getParameter("sort").toString());
				for(int i = 0; i < array.size(); i++) {
					OrderPojo order = objMapper.readValue(array.getString(i), OrderPojo.class); 
					String field = order.getProperty() + " " + order.getDirection();
					orders.add(field);		//增加排序字段
				}
			}
			List<GenericValue> valueList = CommonEvents.getDelegator(request).findList(entityName, condition, fields, orders, findOptions, false);
			return valueList;
		} catch (Exception e) {
			Debug.logError(e, module);
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "GetDBEntityListException"));
		}
	}
	
	/**
	 * 根据节点对象递归生成json对象
	 * @param treeNode
	 * @return
	 */
	public static JSONObject getTreeJsonObject(TreeNode treeNode){
		if(treeNode!=null){
			JSONObject nodeJson=new JSONObject();
			GenericValue value=treeNode.getValue();
			nodeJson.element("id", value.getString("id"));
			nodeJson.element("text", value.getString("name"));
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
		
		//将list对象转换为json格式字符串
//				StringBuffer jsonStr = new StringBuffer();
//				boolean isFirstValue = true;
//				jsonStr.append("[");
//				JSONObject tempObject = null;
//				for (GenericValue node: treeNode) {
//					if (isFirstValue) {
//						isFirstValue = false;
//					} else {
//						jsonStr.append(",");
//					}
//					tempObject = new JSONObject();
//					tempObject.put("id", node.getString("menuId"));
//					tempObject.put("text", node.getString("menuName"));
//					tempObject.put("iconCls", node.getString("styleName"));
//					tempObject.put("sort", node.getString("sort"));
//					if(node.getString("menuType").equals("1")){
//						tempObject.put("hyperlink", node.getString("hyperlink"));
//						tempObject.put("leaf", true);
//					}else if(flag){	//当节点有下级节点，而且flag值为true，遍历节点
//						tempObject.put("children", getTreeDataByParentId(delegator,node.getString("menuId"),true));
//					}
//					jsonStr.append(tempObject.toString());
//		        }
//				jsonStr.append("]");
//				Debug.logInfo(jsonStr.toString(), module);
//		    	return tempObject;
		
		
	}
	
	public static boolean checkFieldUnique(HttpServletRequest request,String entityName,String fieldName, String fieldValue,String pkField,String pkValue) throws GenericEntityException{
		EntityCondition condition = EntityCondition.makeCondition(pkField,pkValue);
		List<GenericValue> nameList = CommonEvents.getDelegator(request).findList(entityName, condition, null, null, null, true);
		if(nameList.size()>0){//判断是否有修改name字段
			if(nameList.get(0).getString(fieldName).equals(fieldValue)){
				return true;
			}
		}
		return checkFieldUnique(request,entityName,fieldName,fieldValue);
	}
	
	public static boolean checkFieldUnique(HttpServletRequest request,String entityName,String fieldName, String fieldValue) throws GenericEntityException{
		EntityCondition condition = EntityCondition.makeCondition(fieldName,fieldValue);
		long count = CommonEvents.getDelegator(request).findCountByCondition(entityName, condition, null, null);
		if(count>0){
			return false;
		}else{
			return true;
		}
	}
}
