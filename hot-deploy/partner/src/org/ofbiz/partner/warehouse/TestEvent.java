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

public class TestEvent {
	public static final String module = TestEvent.class.getName();
	public static String TestStoreEvent(HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> attrMap = UtilHttp.getJSONAttributeMap(request);
        JSONObject json = JSONObject.fromObject(attrMap);
        String jsonStr = json.toString();
        if (jsonStr == null) {
            Debug.logError("JSON Object was empty; fatal error!", module);
            return "success";
        }
		String testId = request.getParameter("testId");
        String testName = request.getParameter("testName");
        GenericDelegator delegator =  (GenericDelegator)request.getAttribute("delegator");
        Map planetValues = UtilMisc.toMap("testId", testId, "testName", testName);

        GenericValue TestEntity = delegator.makeValue("TestEntity", planetValues);
        
        try {
			TestEntity.create();
			json.put("success", true);
			json.put("msg", "welcome!");
		} catch (GenericEntityException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "error";
		}
        
        jsonStr = json.toString();
        response.setContentType("application/x-json");
        try {
            response.setContentLength(jsonStr.getBytes("UTF8").length);
        } catch (UnsupportedEncodingException e) {
            Debug.logError("Problems with Json encoding: " + e, module);
        }

        // return the JSON String
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
