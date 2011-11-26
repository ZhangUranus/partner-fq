package org.ofbiz.partner.scm.common;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.model.ModelEntity;
import org.ofbiz.entity.model.ModelField;

/**
 * 实体CRUD 操作事件公共类
 * @author Mark Lam 
 *
 */
public class EntityCRUDEvent {
	public static SimpleDateFormat timeFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:SS.sss");
    /**
     * 获取实体值列表
     */
    public static String getColl2Json(HttpServletRequest request, HttpServletResponse response){
    	if(request.getParameter("entity")==null){
			 return bizError(response,"实体类型为空");
		 }
    	Delegator delegator=(Delegator) request.getAttribute("delegator");
		String entityName=request.getParameter("entity").toString();
    	try {
			List<GenericValue> valueList=delegator.findList(entityName, null,null,null,null, false);
			 
			
			JSONObject jsonResult=getJsonFromGenValList(valueList);
			jsonResult.element("success", true);		
			 
			//设置返回参数
			  String jsonStr = jsonResult.toString();
		        if (jsonStr == null) {
		            return "success";
		        }
		        // set the X-JSON content type
		        response.setContentType("application/x-json");
		        // jsonStr.length is not reliable for unicode characters
		        try {
		            response.setContentLength(jsonStr.getBytes("UTF8").length);
		        } catch (UnsupportedEncodingException e) {
		            e.printStackTrace();
		            return "success";
		        }

		        // return the JSON String
		        Writer out;
		        try {
		            out = response.getWriter();
		            out.write(jsonStr);
		            out.flush();
		        } catch (IOException e) {
		            e.printStackTrace();
		        }

		        return "success";
			
		} catch (GenericEntityException e) {
			e.printStackTrace();
			return "success";
		} 
    }

	 
	 /**
	  * 新增记录
	  * @param request 
	  * @param response
	  * @return
	  */
	 public static String addnewFromJson(HttpServletRequest request, HttpServletResponse response){
		 if(request.getParameter("records")==null||request.getParameter("entity")==null){
			 return bizError(response,"新增记录为空或者实体类型为空");
		 }
		 
		 List records = getRecordsFromRequest(request);
		
		 //循环每个记录新增
		 Delegator delegator=(Delegator) request.getAttribute("delegator");
		 String entityName=request.getParameter("entity").toString();
			for(Object r:records){
				JSONObject record=(JSONObject) r;//单条记录
				GenericValue v=delegator.makeValue(entityName);//新建一个值对象
				ModelEntity vModel=v.getModelEntity();//获取值对象字段模型
				//
				
				//根据json对象设置对象值
				Iterator<String> i=record.keys();
				while(i.hasNext()){//更新每个字段
					String fieldName=i.next();
					//判断字段有效性，值对象中必须存在字段才能设置该对象的值
					//TODO 现在只判断相同名称的字段是否存在，以后是否要考虑字段类型等
					ModelField vModelField=vModel.getField(fieldName);
					if(vModelField!=null){
						v.set(fieldName, record.get(fieldName));
					}
				}
				try {
					delegator.create(v);
				} catch (GenericEntityException e) {
					return bizError(response,"新增记录出错");
				}
			}
		 return "success";
		 
		
	 }

		/**
		 * 更新记录
		 * @param request
		 * @param response
		 * @return
		 */
	 public static String updateFromJson(HttpServletRequest request, HttpServletResponse response){
		 if(request.getParameter("records")==null||request.getParameter("entity")==null){
			 return bizError(response,"更新记录为空或者实体类型为空");
		 }
		 
		 List records = getRecordsFromRequest(request);
		
		 //循环每个记录更新
		 Delegator delegator=(Delegator) request.getAttribute("delegator");
		 String entityName=request.getParameter("entity").toString();
			for(Object r:records){
				JSONObject record=(JSONObject) r;//单条记录
				GenericValue v=delegator.makeValue(entityName);//新建一个值对象
				ModelEntity vModel=v.getModelEntity();//获取值对象字段模型
				//
				
				//根据json对象设置对象值
				Iterator<String> i=record.keys();
				while(i.hasNext()){//更新每个字段
					String fieldName=i.next();
					//判断字段有效性，值对象中必须存在字段才能设置该对象的值
					
					ModelField vModelField=vModel.getField(fieldName);
					if(vModelField!=null){
						v.set(fieldName, record.get(fieldName));
					}
				}
				try {
					delegator.store(v);
				} catch (GenericEntityException e) {
					return bizError(response,"更新记录出错");
				}
			}
		 return "success";
		 
		 
	 }
		/**
	  * 删除记录
	  * @param request
	  * @param response
	  * @return
	  */
	 public static String deleteFromJson(HttpServletRequest request, HttpServletResponse response){
		 if(request.getParameter("records")==null||request.getParameter("entity")==null){
			 return bizError(response,"新增记录为空或者实体类型为空");
		 }
		 
		 List records = getRecordsFromRequest(request);
		
		 //循环每个记录删除
		 Delegator delegator=(Delegator) request.getAttribute("delegator");
		 String entityName=request.getParameter("entity").toString();
			for(Object r:records){
				JSONObject record=(JSONObject) r;//单条记录
				GenericValue v=delegator.makeValue(entityName);//新建一个值对象
				ModelEntity vModel=v.getModelEntity();//获取值对象字段模型
				//
				
				//根据json对象设置对象值
				Iterator<String> i=record.keys();
				
				//根据id字段删除
				while(i.hasNext()){//更新每个字段
					String fieldName=i.next();
					if(fieldName.equals("id")){
						ModelField vModelField=vModel.getField(fieldName);
						if(vModelField!=null){
							v.set(fieldName, record.get(fieldName));
						}
						try {
							delegator.removeValue(v);
						} catch (GenericEntityException e) {
							return bizError(response,"删除记录出错");
						}
						break;
					}
					
				}
				
			}
		 return "success";
	 }

	private static List getRecordsFromRequest(HttpServletRequest request) {
		StringBuffer jsonStr=new StringBuffer();
		 jsonStr.append("{records:");
		 jsonStr.append(request.getParameter("records").toString());
		 jsonStr.append("}");
		 
		 //获取新增记录，转换为json对象
		 JSONObject recordsObject=JSONObject.fromObject(jsonStr.toString());
		 
		 Object rcsObj=recordsObject.get("records");
		 
		 List records=null;
		 if(rcsObj instanceof JSONArray){//多记录
			 records=recordsObject.getJSONArray("records");//获取records对象的数组
		 }else if(rcsObj instanceof JSONObject){//单记录
			 records=new ArrayList();
			 records.add(recordsObject.get("records"));
		 }
		return records;
	}
	 
	 /**
	  * 返回统一的json错误信息
	  * @param response
	  * @param string
	  * @return
	  */
	 private static String bizError(HttpServletResponse response,String errStr) {
		 	//设置返回参数
		 	String jResult="{success=false,msg='"+errStr+"'}";
	        // set the X-JSON content type
	        response.setContentType("application/x-json");
	        // jsonStr.length is not reliable for unicode characters
	        try {
	            response.setContentLength(jResult.getBytes("UTF8").length);
	        } catch (UnsupportedEncodingException e) {
	        	e.printStackTrace();
	        	return "success";
	        }
	        // return the JSON String
	        Writer out;
	        try {
	            out = response.getWriter();
	            out.write(jResult);
	            out.flush();
	        } catch (IOException e) {
	        	e.printStackTrace();
	            return "success";
	        }

	        return "success";
	}


	    /**
	     * 根据genericValue生成json对象
	     * @param valueList
	     * @return
	     */
		private static JSONObject getJsonFromGenValList(List<GenericValue> valueList) {
			if(valueList==null||valueList.size()<1){
				return JSONObject.fromObject("{records:[]}");
			}
			//封装实体数据，构建json字符串
			StringBuffer jsonStr=new StringBuffer();
			boolean isFirstValue=true;
			jsonStr.append("{records:[");
			for(GenericValue v:valueList){
				Map<String, Object> fieldsMap=v.getAllFields();//获取全部字段值
				if(isFirstValue){
					isFirstValue=false; 
				}else{
					jsonStr.append(",");
				}
				
//				jsonStr.append(fieldsMap.toString());
				
				jsonStr.append("{");
				
				Set<String> fieldsNameSet=fieldsMap.keySet();
				boolean isFirstField=true;
				for(String field:fieldsNameSet){
					if(isFirstField){
						isFirstField=false;
					}else{
						jsonStr.append(",");
					}
					
					jsonStr.append(field).append(":").append(getValueStr(fieldsMap.get(field)));
					
				}
				jsonStr.append("}");
				
			}
			jsonStr.append("]}");
			return JSONObject.fromObject(jsonStr.toString());
		}
		
		/**
		 * 根据对象类型返回合适的值表示，例如数字是12；字符串是'12'；日期是'2011-9-2 23:45:11.112' ；布尔：ture/false
		 * @param object
		 * @return
		 */
		private static String getValueStr(Object object) {
			if(object==null){
				return "null";
			}else if(object instanceof Date){
				return "'"+timeFormat.format((Date)object)+"'";
			}else if(object instanceof Timestamp
					||object instanceof String
					){
				return "'"+object.toString()+"'";
			}else{
				return object.toString();
			}
		}

}
