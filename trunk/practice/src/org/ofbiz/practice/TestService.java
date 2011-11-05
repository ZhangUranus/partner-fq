package org.ofbiz.practice;

import java.util.Map;

import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericDelegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.service.DispatchContext;
import org.ofbiz.service.ServiceUtil;

public class TestService {
	public static Map  test(DispatchContext dctx,Map  context){
		Map result =ServiceUtil.returnSuccess();
		Delegator delegator=dctx.getDelegator();
		
		
		return result;
	}
}
