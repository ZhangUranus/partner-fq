package org.ofbiz.partner.scm.stock;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.common.CommonEvents;
/**
 * 获取参数表参数值
 * 
 * @author Jeff
 * 
 */
public class ParamtmersGetterEvents {
	private static final String module = org.ofbiz.partner.scm.stock.ParamtmersGetterEvents.class.getName();

	/**
	 * 获取多个参数表参数值
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String getParamtmers(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		String numbers = request.getParameter("numbers");// 单据id
		String[] numberArr = numbers.split(",");
		String jsonResult;
		StringBuffer paramString = new StringBuffer();
		int count = 0;
		for(String number : numberArr){
			List<GenericValue> valueList = delegator.findByAnd("PriceMgrParamters", UtilMisc.toMap("number", number));
			GenericValue value = null;
			if(valueList != null){
				value = valueList.get(0);
			}
			if(value != null){
				count++;
				paramString.append(",'");
				paramString.append(number);
				paramString.append("':'");
				paramString.append(value.getString("value"));
				paramString.append("'");
			} else {
				Debug.log("未找到相应的参数值：" + number, module);
			}
		}
		if(count != 0){
			jsonResult="{success:true,isExist:true"+ paramString +"}";
		}else{
			jsonResult="{success:true,isExist:false}";
		}
		CommonEvents.writeJsonDataToExt(response, jsonResult); // 将结果返回前端Ext
		return "success";
	}

}
