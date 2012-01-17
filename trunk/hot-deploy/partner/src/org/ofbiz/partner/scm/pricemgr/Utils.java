package org.ofbiz.partner.scm.pricemgr;

import java.util.Date;

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
	public static Date getCurDate(){
		Delegator delegator=DelegatorFactory.getDelegator("default");
		try {
			GenericValue value=delegator.findByPrimaryKey("PriceMgrParamters", UtilMisc.toMap("id",""));
			return value.getDate("curDate");
		} catch (GenericEntityException e) {
			e.printStackTrace();
			return null;
		}
	}
	
}
