package org.ofbiz.partner.scm.common;

import java.sql.Timestamp;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javolution.util.FastList;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.ofbiz.base.crypto.HashCrypt;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.common.login.LoginServices;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericPK;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.model.ModelEntity;
import org.ofbiz.entity.model.ModelField;
import org.ofbiz.entity.transaction.TransactionUtil;

public class MultiEntryCRUDEvent {
	
	/**
	 * 新建主从实体
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String createEnityWithEntry(HttpServletRequest request,HttpServletResponse response)  throws Exception {
		if(request.getParameter("record")==null
				||request.getParameter("headEntity")==null
				||request.getParameter("entryEntity")==null){
			throw new Exception("新建带分录实体时参数(record、headEntity、entryEntity)无效");
		}
		//构建总实体json
		JSONObject record=JSONObject.fromObject(request.getParameter("record").toString());
		JSONObject headRecord=record.getJSONObject("head");//取表头信息
		JSONArray  entryRecords=record.getJSONArray("createEntrys");//取新增单据体信息
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		String headEntityName = request.getParameter("headEntity").toString();
		String entryEntityName = request.getParameter("entryEntity").toString();
		try {
			TransactionUtil.begin();
			//新建表头
			GenericValue v = delegator.makeValue(headEntityName);// 新建一个值对象	
			setGenValFromJsonObj(headRecord, v);
			delegator.create(v);
			
			//新建分录
		    for(Object o:entryRecords){
		    	JSONObject jo=(JSONObject) o;
		    	GenericValue ev = delegator.makeValue(entryEntityName);// 新建一个值对象	
				setGenValFromJsonObj(jo, ev);
				delegator.create(ev);
		    }
			TransactionUtil.commit();
		} catch (Exception e) {
			TransactionUtil.rollback();
			throw e;
		}
		return "success";
	}
	/**
	 * 根据json对应属性设置genericvalue的字段值
	 * @param headRecord
	 * @param v
	 */
	private static void setGenValFromJsonObj(JSONObject headRecord,
			GenericValue v) {
		ModelEntity vModel = v.getModelEntity();// 获取值对象字段模型
		// 根据json对象设置对象值
		Iterator<String> i = headRecord.keys();
		while (i.hasNext()) {// 更新每个字段
			String fieldName = i.next();
			// 判断字段有效性，值对象中必须存在字段才能设置该对象的值
			// TODO 现在只判断相同名称的字段是否存在，以后是否要考虑字段类型等
			ModelField vModelField = vModel.getField(fieldName);
			if (headRecord.get(fieldName)!=null&&vModelField.getType().equals("date-time")){//时间字段的转换
				long tsl=Long.valueOf(headRecord.get(fieldName).toString());
				Timestamp ts=new Timestamp(tsl);
				v.set(fieldName, ts);
			}else if(headRecord.get(fieldName)!=null&&vModelField.getType().equals("boolean")){ 
				//布尔值处理，客户端传来的事ture or false 转换为 整数 1 or 0
				Boolean bv=Boolean.valueOf(headRecord.get(fieldName).toString());
				if(bv){
					v.set(fieldName,Integer.valueOf(1));
				}else{
					v.set(fieldName,Integer.valueOf(0));
				}
				
			}else{
				v.set(fieldName, headRecord.get(fieldName));
			}
		}
	}
	/**
	 * 更新主从实体
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String updateEnityWithEntry(HttpServletRequest request,HttpServletResponse response)  throws Exception {
		if(request.getParameter("record")==null
				||request.getParameter("headEntity")==null
				||request.getParameter("entryEntity")==null){
			throw new Exception("新建带分录实体时参数(record、headEntity、entryEntity)无效");
		}
		//构建总实体json
		JSONObject record=JSONObject.fromObject(request.getParameter("record").toString());
		JSONObject headRecord=record.getJSONObject("head");//取表头信息
		JSONArray  newEntryRecords=record.getJSONArray("createEntrys");//取新增单据体信息
		JSONArray  deleteEntryRecords=record.getJSONArray("deleteEntrys");//取刪除单据体信息
		JSONArray  updateEntryRecords=record.getJSONArray("updateEntrys");//取修改单据体信息
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		String headEntityName = request.getParameter("headEntity").toString();
		String entryEntityName = request.getParameter("entryEntity").toString();

		try {
			TransactionUtil.begin();
			//更新表头
			GenericValue v = delegator.makeValue(headEntityName);// 新建一个值对象	
			setGenValFromJsonObj(headRecord, v);
			delegator.store(v);
			
			//新增分录
		    for(Object o:newEntryRecords){
		    	JSONObject jo=(JSONObject) o;
		    	GenericValue ev = delegator.makeValue(entryEntityName);
				setGenValFromJsonObj(jo, ev);
				delegator.create(ev);
		    }
		  //更新分录
		    List<GenericValue> updateList=FastList.newInstance();
		    for(Object o:updateEntryRecords){
		    	JSONObject jo=(JSONObject) o;
		    	GenericValue ev = delegator.makeValue(entryEntityName);
				setGenValFromJsonObj(jo, ev);
				updateList.add(ev);
		    }
		    delegator.storeAll(updateList);
		  //删除分录
		    for(Object o:deleteEntryRecords){
		    	JSONObject jo=(JSONObject) o;
		    	GenericValue ev = delegator.makeValue(entryEntityName);
				setGenValFromJsonObj(jo, ev);
				delegator.removeValue(ev);
		    }
			
			TransactionUtil.commit();
		} catch (Exception e) {
			TransactionUtil.rollback();
		}
		return "success";
	}

	/**
	 * 删除主从实体
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String deleteEnityWithEntry(HttpServletRequest request,HttpServletResponse response)  throws Exception {
		if(request.getParameter("records")==null
				||request.getParameter("headEntity")==null
				||request.getParameter("entryEntity")==null){
			throw new Exception("新建带分录实体时参数(record、headEntity、entryEntity)无效");
		}
		//
		List records = CommonEvents.getRecordsFromRequest(request);
		
		String headEntityName = request.getParameter("headEntity").toString();
		String entryEntityName = request.getParameter("entryEntity").toString();
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		try {
			TransactionUtil.begin();
			for(Object o:records){
				JSONObject jo=(JSONObject) o;
				String headId=jo.getString("id");
				delegator.removeByAnd(headEntityName, UtilMisc.toMap("id", headId));//删除表头记录
				delegator.removeByAnd(entryEntityName, UtilMisc.toMap("parentId", headId));//删除分录
			}
			TransactionUtil.commit();
		} catch (Exception e) {
			TransactionUtil.rollback();
		}
		return "success";
	}
	
}
