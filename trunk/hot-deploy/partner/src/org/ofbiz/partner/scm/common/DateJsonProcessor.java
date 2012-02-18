package org.ofbiz.partner.scm.common;

import java.text.SimpleDateFormat;
import java.util.Date;

import net.sf.json.JsonConfig;
import net.sf.json.processors.JsonValueProcessor;

public class DateJsonProcessor implements JsonValueProcessor{
	private String format="time";
	SimpleDateFormat dateFormat=new SimpleDateFormat();
	public DateJsonProcessor(String fm){
		if(fm!=null){
			format=fm;
		}
	}
	public Object processArrayValue(Object obj, JsonConfig conf) {
		return process((Date) obj);
	}

	public Object processObjectValue(String str, Object obj,JsonConfig conf) {
		return process((Date) obj);
	}
	
	private Object process(Date d){
		if(format.equalsIgnoreCase("time")){
			return d.getTime();
		}else{
			dateFormat.applyPattern(format);
			return dateFormat.format(d);
		}
		
	}
}
