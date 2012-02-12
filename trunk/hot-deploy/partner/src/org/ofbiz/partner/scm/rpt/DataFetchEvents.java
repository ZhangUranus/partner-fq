package org.ofbiz.partner.scm.rpt;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.ofbiz.entity.jdbc.ConnectionFactory;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.common.Utils;

public class DataFetchEvents {
	public static String fetchData(HttpServletRequest request, HttpServletResponse response) throws Exception {
		//数据库连接
		Connection conn=ConnectionFactory.getConnection("localmysql");
		try {
			String sql="select a.number,a.biz_date ,b.name from Purchase_Warehousing a inner join supplier b on a.supplier_supplier_id=b.id";
			PreparedStatement ps=conn.prepareStatement(sql);
			ResultSet rs=ps.executeQuery();
			
			JSONArray ja=Utils.getJsonArr4ResultSet(rs);
			
			JSONObject result=new JSONObject();
			result.element("success", true);
			result.element("records",ja);
			CommonEvents.writeJsonDataToExt(response, result.toString());
		}finally{
			if(conn!=null){
				conn.close();
			}
		}
		
		return "sucess";
	}
}
