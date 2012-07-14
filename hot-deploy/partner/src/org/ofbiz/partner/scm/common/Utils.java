package org.ofbiz.partner.scm.common;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javolution.util.FastList;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import org.codehaus.jackson.map.ObjectMapper;
import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilProperties;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.DelegatorFactory;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.condition.EntityConditionList;
import org.ofbiz.entity.condition.EntityOperator;
import org.ofbiz.partner.scm.pojo.FilterPojo;

public class Utils {
	public static Delegator getDefaultDelegator(){
		Delegator delegator=DelegatorFactory.getDelegator("default");
		return delegator;
	}
	
	
	public static JSONObject getJsonArr4ResultSet(ResultSet rs,HttpServletRequest request) throws Exception{
		
		ResultSetMetaData metaData= rs.getMetaData();
		/**
		 * 把resultset转换为json数组对象返回，主要ResultSet字段名不能重复
		 */
		int columnCount=metaData.getColumnCount();
		List<String> columnList=new ArrayList<String>();
		for (int i = 1; i <= columnCount; i++) {
			columnList.add(metaData.getColumnName(i));
		}
		
		JsonConfig config = new JsonConfig(); 
		config.registerJsonValueProcessor(java.util.Date.class, new DateJsonProcessor(null));
		config.registerJsonValueProcessor(java.sql.Date.class, new DateJsonProcessor(null));
		config.registerJsonValueProcessor(java.sql.Timestamp.class,new DateJsonProcessor(null));
		
		JSONArray ja=new JSONArray();
		
		//分页参数
		boolean isDividePage = false;
		int start = 0;
		int limit = 0;
		int toIndex = 0;
		int row = 0;
		if(request.getParameter("start") != null && request.getParameter("limit") != null){
			start = Integer.parseInt(request.getParameter("start"));
			limit = Integer.parseInt(request.getParameter("limit"));
			toIndex = start+limit;
			isDividePage = true;
		}
		while(rs.next()){
			if(!isDividePage || (row >= start && row < toIndex)){
				JSONObject jo=new JSONObject();
				for (String name : columnList) {
					jo.element(name, rs.getObject(name),config);
				}
				ja.add(jo,config);
			}
			row ++ ;
		}
		JSONObject result = new JSONObject();
		result.element("success", true);
		result.element("records", ja);
		result.element("total", row);
		
		return result;
	}
	
	/**
	 * 结果集转换为List
	 * @param rs
	 * @return
	 * @throws Exception
	 */
	public static List<Map<String,Object>> getList4ResultSet(ResultSet rs) throws Exception{
		List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
		ResultSetMetaData md = rs.getMetaData();
		int columnCount = md.getColumnCount(); //Map rowData;
		while (rs.next()) { //rowData = new HashMap(columnCount);
			Map<String,Object> rowData = new HashMap<String,Object>();
			for (int i = 1; i <= columnCount; i++ ) {
				rowData.put(md.getColumnName(i), rs.getObject(i));
			}
			list.add(rowData);
		} 
		return list;
	}
	
	/**
	 * 结果集转换为List
	 * @param rs
	 * @return
	 * @throws Exception
	 */
	public static List<Map<String,Object>> changeListFormGenericValue(List<GenericValue> valueList) throws Exception{
		List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
		for(GenericValue v : valueList){
			list.add(v.getAllFields());
		} 
		return list;
	}
	
	
	/**
	 * 返回系统数据库配置名称 例如 localmysql
	 * @return
	 */
	public static String getConnectionHelperName(){
		return  "localmysql";
	}
	
	/**
	 * 检查是否存在某实体
	 * @author Mark 2012-7-7
	 */
	public static String isExist(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		if (request.getParameter("entity") == null ){
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "EntityNameEmpty"));
		}
		String entityName = request.getParameter("entity").toString();//实体名称
		EntityConditionList<EntityCondition> condition=getConditionFromRequest(request);//查询条件
		
		Delegator delegator=getDefaultDelegator();
		long cnt=delegator.findCountByCondition(entityName, condition, null, null);
		String jsonResult;
		if(cnt>0){
			jsonResult="{success:true,isExist:true}";
		}else{
			jsonResult="{success:true,isExist:false}";
		}
		CommonEvents.writeJsonDataToExt(response, jsonResult); // 将结果返回前端Ext
		return "success";
	}
	
	/**
	 * 通过request获取查询条件
	 * @author Mark 2012-7-7
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public static EntityConditionList<EntityCondition> getConditionFromRequest(HttpServletRequest request) throws Exception{
	    ObjectMapper objectMapper = new ObjectMapper();
		EntityConditionList<EntityCondition> condition = null;
		List<EntityCondition> conds = FastList.newInstance();
		
		
		//处理id字段查找
		if(request.getParameter("id") != null){
			conds.add(EntityCondition.makeCondition("id",request.getParameter("id")));
		}
		
		//过滤字段，对字段做与方式过滤
		if(request.getParameter("filter") != null){
			JSONArray array = JSONArray.fromObject(request.getParameter("filter").toString());
			for(int i = 0; i < array.size(); i++) {
				FilterPojo filter = objectMapper.readValue(array.getString(i), FilterPojo.class); 
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
				EntityCondition oldCondition = null;
				EntityCondition curCondition = null;
				for(String field: fieldArray){
					if(oldCondition != null){
						curCondition = EntityCondition.makeCondition(oldCondition,EntityOperator.OR,EntityCondition.makeCondition(field, EntityOperator.LIKE, "%"+request.getParameter("query")+"%"));
					}else{
						curCondition = EntityCondition.makeCondition(field, EntityOperator.LIKE, "%"+request.getParameter("query")+"%");
					}
					oldCondition = curCondition;
				}
				if(curCondition != null){
					conds.add(curCondition);
				}
			}else{
				conds.add(EntityCondition.makeCondition("name", EntityOperator.LIKE, "%"+request.getParameter("query")+"%"));
			}
	   }
		condition = EntityCondition.makeCondition(conds);
		return condition;
	}
	
}
