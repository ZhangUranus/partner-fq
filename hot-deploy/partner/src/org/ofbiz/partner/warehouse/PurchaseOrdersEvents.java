package org.ofbiz.partner.warehouse;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilHttp;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.common.CommonEvents;
import org.ofbiz.entity.GenericDelegator;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.service.DispatchContext;
import org.ofbiz.service.ServiceUtil;

public class PurchaseOrdersEvents {
	public static final String module = PurchaseOrdersEvents.class.getName();
	
	public static String addPurchaseOrders(HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> attrMap = UtilHttp.getJSONAttributeMap(request);
		System.out.println("jsonString: "+request.getParameter("jsonString"));
		JSONObject json = JSONObject.fromObject(attrMap);
        String jsonStr = json.toString();
        json.put("success", true);
		json.put("msg", "welcome!");
		
		jsonStr = json.toString();
        response.setContentType("application/x-json");
        try {
            response.setContentLength(jsonStr.getBytes("UTF8").length);
        } catch (UnsupportedEncodingException e) {
            Debug.logError("Problems with Json encoding: " + e, module);
        }
        Writer out;
        try {
            out = response.getWriter();
            out.write(jsonStr);
            out.flush();
        } catch (IOException e) {
            Debug.logError(e, module);
        }
		
		return "success";
	}
}
