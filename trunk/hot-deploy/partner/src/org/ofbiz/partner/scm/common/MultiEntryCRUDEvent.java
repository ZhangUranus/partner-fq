package org.ofbiz.partner.scm.common;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javolution.util.FastList;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
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
			
			if(v.getString("number")==null || "".equals(v.getString("number"))){
			String entityNumber = CommonEvents.getSerialNumberHelper().getSerialNumber(request, headEntityName);
				if(!"".equals(entityNumber)){//判断系统编码是否存在，存在的使用系统编码
					if (v.getModelEntity().getField("number") != null) {
						v.set("number", entityNumber);
					}
				}
			}
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
			if(vModelField!=null){
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
					
				}else if(headRecord.get(fieldName)!=null && vModelField.getType().equals("fixed-point")){
					BigDecimal bd = new BigDecimal(headRecord.get(fieldName).toString());
					v.set(fieldName, bd);
				}else{
					v.set(fieldName, headRecord.get(fieldName));
				}
			}
			
		}
	}
	/**
	 * 更新主从实体
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 * 
	 * 修改记录：
	 * 2012-7-8  @author mark ，添加分录级联删除功能，关联字段固定为id,和parentId 。需要请求传递需要级联删除的实体名 ,多个实体时格式 cascadeDelete=entity1|entity2|....
	 * 
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
		  //删除分录以及级联的实体
		    String cascadeDelete=request.getParameter("cascadeDelete");//获取级联删除实体参数
		    String[] casDelArr=cascadeDelete==null?null:cascadeDelete.split("\\|");//实体列表
		    for(Object o:deleteEntryRecords){
		    	JSONObject jo=(JSONObject) o;
		    	GenericValue ev = delegator.makeValue(entryEntityName);
				setGenValFromJsonObj(jo, ev);
				delegator.removeValue(ev);
				/**
				 * @author mark 2012-7-8 级联删除
				 */
				if(casDelArr!=null&&casDelArr.length>0&&ev.getString("id")!=null){
					for(int i=0;i<casDelArr.length;i++){
						delegator.removeByAnd(casDelArr[i], "parentId",ev.getString("id"));
					}
				}
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
	 * 
	 * 修改记录：
	 * 2012-7-8  @author mark ，添加分录级联删除功能，关联字段固定为id,和parentId 。需要请求传递需要级联删除的实体名 ,多个实体时格式 cascadeDelete=entity1|entity2|....
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

			/**
			 * @author mark 2012-7-8 级联删除
			 */
			String cascadeDelete=request.getParameter("cascadeDelete");//获取级联删除实体参数
		    String[] casDelArr=cascadeDelete==null?null:cascadeDelete.split("\\|");//实体列表
		    Set<String> selFields=new HashSet<String>();//查询的字段，只查id
		    selFields.add("id");
		    
			for(Object o:records){
				JSONObject jo=(JSONObject) o;
				String headId=jo.getString("id");
				delegator.removeByAnd(headEntityName, UtilMisc.toMap("id", headId));//删除表头记录
				
				if(casDelArr!=null&&casDelArr.length>0){
					//查询所有分录id
					List<GenericValue> entryIds=delegator.findList(entryEntityName, EntityCondition.makeCondition("parentId", headId), selFields, null, null, false);
					//删除级联实体记录
					if(entryIds!=null&&entryIds.size()>0){
						for(GenericValue v:entryIds){
							for(int i=0;i<casDelArr.length;i++){
								delegator.removeByAnd(casDelArr[i], "parentId",v.getString("id"));
							}
						}
					}
				}
				
				delegator.removeByAnd(entryEntityName, UtilMisc.toMap("parentId", headId));//删除分录
				
			}
			TransactionUtil.commit();
		} catch (Exception e) {
			TransactionUtil.rollback();
		}
		return "success";
	}
	
}
