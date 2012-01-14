package org.ofbiz.partner.scm.common;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import javolution.util.FastList;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilProperties;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;

public class SerialNumberHelper {
	private static final String module = SerialNumberHelper.class.getName();
	
	/**
	 * 获取系统流水号
	 * 
	 * */
    public synchronized String getSerialNumber(HttpServletRequest request,String entityName) throws Exception{
    	StringBuffer serialNumber = new StringBuffer();
    	String today = new java.text.SimpleDateFormat("yyyyMMdd").format(new java.util.Date());
    	String prefix = "";
    	long serial = 0;
    	List<GenericValue> list = FastList.newInstance();
    	EntityCondition condition = EntityCondition.makeCondition("entityName",entityName);
    	try {
    		list = CommonEvents.getDelegator(request).findList("TSystemSerialNumber", condition, null, null, null, true);
    		if(list.isEmpty()){
        		return "";
        	}
    		GenericValue value = list.get(0);
    		serial = value.getLong("initNumber");
    		prefix = value.getString("prefix");
    		if("0".equals(value.getString("hasDate"))){
    			serial = value.getLong("serialNumber");
        		value.set("serialNumber", serial+1);
        		today = "";
        	}else{
        		if(!value.getString("serialDate").equals(today)){
            		value.set("serialDate", today);
            		value.set("serialNumber", serial);
            	}else{
            		serial = value.getLong("serialNumber");
            		value.set("serialNumber", serial+1);
            	}
        	}        	
        	value.store();
        	serialNumber.append(prefix);
        	serialNumber.append(today);
        	serialNumber.append(serial);
		} catch (Exception e) {
			Debug.logError(e, module);
			throw new Exception(UtilProperties.getPropertyValue("ErrorCode_zh_CN", "GetSerialNumberExcetion"));
		}
    	return serialNumber.toString();
    }
}
