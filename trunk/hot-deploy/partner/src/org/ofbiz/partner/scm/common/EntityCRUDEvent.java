package org.ofbiz.partner.scm.common;

import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javolution.util.FastList;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.ofbiz.base.crypto.HashCrypt;
import org.ofbiz.base.util.Debug;
import org.ofbiz.common.login.LoginServices;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.condition.EntityConditionList;
import org.ofbiz.entity.model.ModelEntity;
import org.ofbiz.entity.model.ModelField;

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
		try {
			List<GenericValue> valueList =getValueList(request);
			String jsonStr = getJsonFromGenValList(valueList); // 将查询结果转换为json字符串
			CommonEvents.writeJsonDataToExt(response, jsonStr); // 将结果返回前端Ext
		} catch (GenericEntityException e) {
			Debug.logError(e, module);
			throw e;
		} catch (JsonGenerationException e) {
			Debug.logError(e, module);
			throw e;
		} catch (JsonMappingException e) {
			Debug.logError(e, module);
			throw e;
		} catch (IOException e) {
			Debug.logError(e, module);
			throw e;
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
		} catch (GenericEntityException e) {
			Debug.logError(e, module);
			throw e;
		} catch (JsonGenerationException e) {
			Debug.logError(e, module);
			throw e;
		} catch (JsonMappingException e) {
			Debug.logError(e, module);
			throw e;
		} catch (IOException e) {
			Debug.logError(e, module);
			throw e;
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
		} catch (GenericEntityException e) {
			Debug.logError(e, module);
			throw e;
		} catch (JsonGenerationException e) {
			Debug.logError(e, module);
			throw e;
		} catch (JsonMappingException e) {
			Debug.logError(e, module);
			throw e;
		} catch (IOException e) {
			Debug.logError(e, module);
			throw e;
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
	public static String addnewFromJson(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		if (request.getParameter("records") == null || request.getParameter("entity") == null) {
			throw new Exception("更新记录为空或者实体类型为空");
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
					if(fieldName.equals("password") && !record.get(fieldName).toString().startsWith("{SHA}")){
						v.set(fieldName, HashCrypt.getDigestHash(record.get(fieldName).toString(), LoginServices.getHashType()));
					}else{
						v.set(fieldName, record.get(fieldName));
					}
				}
			}
			try {
				delegator.create(v);
			} catch (GenericEntityException e) {
				throw e;
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
	public static String updateFromJson(HttpServletRequest request,
			HttpServletResponse response) throws Exception{
		if (request.getParameter("records") == null || request.getParameter("entity") == null) {
			throw new Exception("更新记录为空或者实体类型为空");
		}

		List records = CommonEvents.getRecordsFromRequest(request);

		// 循环每个记录更新
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		String entityName = request.getParameter("entity").toString();
		for (Object r : records) {
			JSONObject record = (JSONObject) r;// 单条记录
			GenericValue v = delegator.makeValue(entityName);// 新建一个值对象
			ModelEntity vModel = v.getModelEntity();// 获取值对象字段模型
			//

			// 根据json对象设置对象值
			Iterator<String> i = record.keys();
			while (i.hasNext()) {// 更新每个字段
				String fieldName = i.next();
				// 判断字段有效性，值对象中必须存在字段才能设置该对象的值

				ModelField vModelField = vModel.getField(fieldName);
				if (vModelField != null) {//如果是密码，需要做加密保存处理
					if(fieldName.equals("password") && !record.get(fieldName).toString().startsWith("{SHA}")){
						v.set(fieldName, HashCrypt.getDigestHash(record.get(fieldName).toString(), LoginServices.getHashType()));
					}else{
						v.set(fieldName, record.get(fieldName));
					}
				}
			}
			try {
				delegator.store(v);
			} catch (GenericEntityException e) {
				throw e;
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
	public static String deleteFromJson(HttpServletRequest request,
			HttpServletResponse response)throws Exception {
		if (request.getParameter("records") == null || request.getParameter("entity") == null) {
			throw new Exception("新增记录为空或者实体类型为空");
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
			//

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
						throw e;
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
	 */
	private static String bizError(HttpServletResponse response, String errStr) {
		// 设置返回参数
		String jResult = "{success=false,msg='" + errStr + "'}";
		try {
			CommonEvents.writeJsonDataToExt(response, jResult); // 将结果返回前端Ext
		} catch (IOException e) {
			Debug.logError(e, module);
		}

		return "success";
	}

	/**
	 * 根据genericValue生成json对象
	 * 
	 * @param valueList
	 * @return
	 * @throws IOException
	 * @throws JsonMappingException
	 * @throws JsonGenerationException
	 */
	private static String getJsonFromGenValList(List<GenericValue> valueList)
			throws JsonGenerationException, JsonMappingException, IOException {
		if (valueList == null || valueList.size() < 1) {
			return "{'success':true,'records':[]}";
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
			jsonStr.append(objectMapper.writeValueAsString(v));
		}
		jsonStr.append("]}");
		return jsonStr.toString();
	}
	
	/**
	 * 根据genericValue生成json对象
	 * 
	 * @param valueList
	 * @return
	 * @throws IOException
	 * @throws JsonMappingException
	 * @throws JsonGenerationException
	 */
	private static String getJsonFromGenVal(GenericValue value) throws JsonGenerationException, JsonMappingException, IOException {
		if (value == null ) {
			return "{'success':true,'records':{}}";
		}
		// 封装实体数据，构建json字符串
		StringBuffer jsonStr = new StringBuffer();
		jsonStr.append("{'success':true,'records':");
		jsonStr.append(objectMapper.writeValueAsString(value));
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
		if (request.getParameter("entity") == null) {
			return null;
		}
		String entityName = request.getParameter("entity").toString();
		try {
			//过滤字段，对字段做与方式过滤，obectMapper是静态变量，线程不安全
			if(request.getParameter("filter") != null){
				ObjectMapper objMapper = new ObjectMapper();//新建局部变量
				List<EntityCondition> conds = FastList.newInstance();
				List<LinkedHashMap<String, Object>> list = objMapper.readValue(request.getParameter("filter").toString(), List.class);
				for (int i = 0; i < list.size(); i++){
					conds.add(EntityCondition.makeCondition(list.get(i).get("property").toString(),list.get(i).get("value").toString()));
				}
				condition = EntityCondition.makeCondition(conds);
			}
			//处理whereStr过滤，覆盖filter条件
			if(request.getParameter("whereStr")!=null){
				EntityCondition whrCond=EntityCondition.makeConditionWhere(request.getParameter("whereStr"));
				List<EntityCondition> conds = FastList.newInstance();
				conds.add(whrCond);
				condition=EntityCondition.makeCondition(conds);
			}
			List<GenericValue> valueList = CommonEvents.getDelegator(request).findList(entityName, condition, null, null, null, false);
			return valueList;
		} catch (GenericEntityException e) {
			Debug.logError(e, module);
			throw e;
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

}
