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
	public static String getColl2Json(HttpServletRequest request,HttpServletResponse response) {
		EntityConditionList<EntityCondition> condition = null;
		if (request.getParameter("entity") == null) {
			return bizError(response, "实体类型为空");
		}
		String entityName = request.getParameter("entity").toString();
		try {
			if(request.getParameter("filters") != null){
				String testStr = "[{'name': 'userId','value': 'admin'},{'name': 'valid','value': 'Y'}]";
				/* [
				 * 		{'name': 'userId','value': 'admin'},
				 * 		{'name': 'valid','value': 'Y'}
				 * ]
				 */
				List<EntityCondition> conds = FastList.newInstance();
				List<LinkedHashMap<String, Object>> list = objectMapper.readValue(testStr, List.class);
				for (int i = 0; i < list.size(); i++){
					conds.add(EntityCondition.makeCondition(list.get(i).get("name").toString(),list.get(i).get("value").toString()));
				}
				condition = EntityCondition.makeCondition(conds);
			}
			List<GenericValue> valueList = CommonEvents.getDelegator(request).findList(entityName, condition, null, null, null, false);
			String jsonStr = getJsonFromGenValList(valueList); // 将查询结果转换为json字符串
			CommonEvents.writeJsonDataToExt(response, jsonStr); // 将结果返回前端Ext
		} catch (GenericEntityException e) {
			Debug.logError(e, module);
		} catch (JsonGenerationException e) {
			Debug.logError(e, module);
		} catch (JsonMappingException e) {
			Debug.logError(e, module);
		} catch (IOException e) {
			Debug.logError(e, module);
		} finally {
			return "success";
		}
	}

	/**
	 * 新增记录
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	public static String addnewFromJson(HttpServletRequest request,
			HttpServletResponse response) {
		if (request.getParameter("records") == null || request.getParameter("entity") == null) {
			return bizError(response, "新增记录为空或者实体类型为空");
		}

		List records = getRecordsFromRequest(request);

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
				if (vModelField != null) {
					if(fieldName.equals("password")){
						v.set(fieldName, HashCrypt.getDigestHash(record.get(fieldName).toString(), LoginServices.getHashType()));
					}else{
						v.set(fieldName, record.get(fieldName));
					}
				}
			}
			try {
				delegator.create(v);
			} catch (GenericEntityException e) {
				return bizError(response, "新增记录出错");
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
			HttpServletResponse response) {
		if (request.getParameter("records") == null || request.getParameter("entity") == null) {
			return bizError(response, "更新记录为空或者实体类型为空");
		}

		List records = getRecordsFromRequest(request);

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
				if (vModelField != null) {
					if(fieldName.equals("password")){
						v.set(fieldName, HashCrypt.getDigestHash(record.get(fieldName).toString(), LoginServices.getHashType()));
					}else{
						v.set(fieldName, record.get(fieldName));
					}
				}
			}
			try {
				delegator.store(v);
			} catch (GenericEntityException e) {
				return bizError(response, "更新记录出错");
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
			HttpServletResponse response) {
		if (request.getParameter("records") == null || request.getParameter("entity") == null) {
			return bizError(response, "新增记录为空或者实体类型为空");
		}

		List records = getRecordsFromRequest(request);

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
						return bizError(response, "删除记录出错");
					}
					break;
				}

			}

		}
		return "success";
	}

	private static List getRecordsFromRequest(HttpServletRequest request) {
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

}
