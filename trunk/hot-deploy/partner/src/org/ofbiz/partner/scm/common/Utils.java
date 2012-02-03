package org.ofbiz.partner.scm.common;

import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.DelegatorFactory;

public class Utils {
	public static Delegator getDefaultDelegator(){
		Delegator delegator=DelegatorFactory.getDelegator("default");
		return delegator;
	}
}
