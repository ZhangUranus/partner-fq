package org.ofbiz.partner.scm.common;

import java.util.Date;

import net.sf.json.JsonConfig;
import net.sf.json.processors.JsonValueProcessor;

public class DateJsonProcessor implements JsonValueProcessor{

	public Object processArrayValue(Object obj, JsonConfig conf) {
		return process((Date) obj);
	}

	public Object processObjectValue(String str, Object obj,JsonConfig conf) {
		return process((Date) obj);
	}
	
	private Object process(Date d){
		return d.getTime();
	}
}
