package org.ofbiz.partner.scm.common;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.DelegatorFactory;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.model.ModelEntity;

public class Utils {
	public static Delegator getDefaultDelegator(){
		Delegator delegator=DelegatorFactory.getDelegator("default");
		return delegator;
	}
	
	
	public static JSONArray getJsonArr4ResultSet(ResultSet rs) throws Exception{
		
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
		
		while(rs.next()){
			JSONObject jo=new JSONObject();
			
			for (String name : columnList) {
				jo.element(name, rs.getObject(name),config);
			}
			ja.add(jo,config);
			
		}
		return ja;
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
}
