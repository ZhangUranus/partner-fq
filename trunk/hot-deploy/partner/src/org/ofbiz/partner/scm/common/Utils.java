package org.ofbiz.partner.scm.common;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.DelegatorFactory;

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
		config.registerJsonValueProcessor(java.util.Date.class, new DateJsonProcessor());
		config.registerJsonValueProcessor(java.sql.Date.class, new DateJsonProcessor());
		config.registerJsonValueProcessor(java.sql.Timestamp.class,new DateJsonProcessor());
		
		
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
	 * 返回系统数据库配置名称 例如 localmysql
	 * @return
	 */
	public static String getConnectionHelperName(){
		return  "localmysql";
	}
}
