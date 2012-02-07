package org.ofbiz.partner.scm.pricemgr;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.DelegatorFactory;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;

/**
 * 
 * @author Mark
 *
 */
public class Utils {
	/**
	 * 获取当期操作年月
	 * @return
	 */
	public static Date getCurDate() {
		Delegator delegator=DelegatorFactory.getDelegator("default");
		try {
			GenericValue value=delegator.findByPrimaryKey("PriceMgrParamters", UtilMisc.toMap("id","001"));
			String dateStr=value.getString("value");
			SimpleDateFormat timeFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:SS.sss");
			return timeFormat.parse(dateStr);
		} catch (GenericEntityException e) {
			Debug.logError("-----------获取当期年月出错", "common");
			return null;
		} catch (ParseException e) {
			Debug.logError("-----------获取当期年月出错，日期格式出错", "common");
			return null;
		}
	}
	
	/**
	 * 判断是否是当前期间
	 * @return
	 */
	public static boolean isCurPeriod(Date date){
		if(date==null)return false;
		Calendar cal=Calendar.getInstance();
		
		Date curDate=getCurDate();//获取当前系统期间
		cal.setTime(curDate);
		int curYear=cal.get(Calendar.YEAR);
		int curMonth=cal.get(Calendar.MONTH)+1;
		
		cal.setTime(date);
		int year=cal.get(Calendar.YEAR);
		int month=cal.get(Calendar.MONTH)+1;
		
		if(curYear==year&&curMonth==month){
			return true;
		}
		return false;

	}
}
