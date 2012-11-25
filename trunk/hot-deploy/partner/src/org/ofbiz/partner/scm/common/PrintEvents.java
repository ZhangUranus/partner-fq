package org.ofbiz.partner.scm.common;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;

/**
 * 
 * 打印相关事件
 * @author Mark
 *
 */
public class PrintEvents {
	public static String getPrintData(HttpServletRequest request,HttpServletResponse response)  throws Exception {
		String headId=request.getParameter("headId");
		String headView=request.getParameter("headView");
		String entryView=request.getParameter("entryView");
		if(headId==null||headView==null||entryView==null){
			throw new Exception("参数headId,headView,entryView 为空！");
		}
		Delegator delegator=Utils.getDefaultDelegator();
		JsonConfig config = new JsonConfig(); 
		config.registerJsonValueProcessor(java.util.Date.class, new DateJsonProcessor("yyyy-MM-dd"));
		config.registerJsonValueProcessor(java.sql.Date.class, new DateJsonProcessor("yyyy-MM-dd"));
		config.registerJsonValueProcessor(java.sql.Timestamp.class,new DateJsonProcessor("yyyy-MM-dd"));

		//表头信息
		List<GenericValue> headValueList=delegator.findByAnd(headView, UtilMisc.toMap("id", headId));
		JSONObject result=JSONObject.fromObject("{success:false}");
		JSONObject headJson=new JSONObject();
		if(headValueList!=null&&headValueList.size()>0){
			GenericValue headValue=headValueList.get(0);
			result.element("success", true);
			headJson=JSONObject.fromObject(headValue.getAllFields(),config);
		}else{
			throw new Exception("查找结果为空");
		}
		
		//添加分录数据
		List<GenericValue> entryList=delegator.findByAnd(entryView, UtilMisc.toMap("parentId", headId));
		if(entryList!=null&&entryList.size()>0){
			JSONArray entryArr=new JSONArray();
			for(GenericValue v:entryList){
				JSONObject entryJson=JSONObject.fromObject(v.getAllFields(),config);
				entryArr.add(entryJson,config);
			}
			headJson.element("entry", entryArr,config);
		}
		result.element("printData", headJson);
		CommonEvents.writeJsonDataToExt(response, result.toString());
		
		return "success";
	}
}
