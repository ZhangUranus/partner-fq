package org.ofbiz.partner.scm.basedata;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.base.util.UtilProperties;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericPK;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.model.ModelEntity;
import org.ofbiz.partner.scm.common.CommonEvents;

/**
 * 物料分类操作事件类
 * @author Mark
 */
public class MaterialTypeEvents {
	/**
	 * 新增物料类别，判断是否有相同的长编码
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String addNewType(HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(request.getParameter("records") == null){
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "RecordsEmpty"));
		}
		List records = CommonEvents.getRecordsFromRequest(request);
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		//获取第一条记录
		if(records!=null&&records.size()>0){
			JSONObject record = (JSONObject) records.get(0);
			GenericValue newTypeV=delegator.makeValue("TMaterialType");//新建物料类型
			newTypeV.setFields(record);
			
			//设置物料类型长编码
			String longNum=null;
			if(!"".equals(newTypeV.get("parentId")) && newTypeV.get("parentId")!=null){
				GenericValue parentV=delegator.findOne("TMaterialType", false, "id",newTypeV.get("parentId"));	
				longNum=parentV.getString("longnumber")+newTypeV.getString("number")+"$";
			}else{
				longNum=newTypeV.getString("number")+"$";
			}
			newTypeV.setString("longnumber", longNum);
			
			delegator.create(newTypeV);
		}
		CommonEvents.writeJsonDataToExt(response, "{success:true}"); // 将操作结果返回前端Ext
		return "sucess";
	}
	/**
	 * 删除物料类别，判断是否存在子分类，或者分类上来是否存在物料，以上情况不能删除
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String delType(HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(request.getParameter("id") == null){
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "RecordsEmpty"));
		}
		String delId=request.getParameter("id");
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		
		//查找是否存在子分类
		long subTypeCnt=delegator.findCountByCondition("TMaterialType", EntityCondition.makeCondition(UtilMisc.toMap("parentId", delId)), null, null);
		if(subTypeCnt>0){
			throw new Exception("存在子分类，不能删除！");
		}
		//查找是否存在该分类的物料
		long matCnt=delegator.findCountByCondition("TMaterial", EntityCondition.makeCondition(UtilMisc.toMap("materialTypeId", delId)), null, null);
		if(matCnt>0){
			throw new Exception("分类存在物料，不能删除！");
		}
		
		delegator.removeByAnd("TMaterialType", UtilMisc.toMap("id", delId));
		
		CommonEvents.writeJsonDataToExt(response, "{success:true}"); // 将操作结果返回前端Ext
		
		return "sucess";
	}
}
