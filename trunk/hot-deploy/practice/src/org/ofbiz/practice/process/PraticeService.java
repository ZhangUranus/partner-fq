package org.ofbiz.practice.process;

import java.util.Map;
import java.util.UUID;

import org.ofbiz.practice.NewBillCache;
import org.ofbiz.service.DispatchContext;
import org.ofbiz.service.ServiceUtil;

public class PraticeService {

	/**
	 * 新建单据时获取新单据id
	 * @param dctx
	 * @param context
	 * @return
	 */
	 public static Map<String, Object> getNewBillId(DispatchContext dctx, Map<String, Object> context) {
		 UUID billId=UUID.randomUUID();
		 Map<String,Object> result=ServiceUtil.returnSuccess();
		 result.put("newBillId", billId.toString());
		 //缓存添加新单据
		 
		 
		 return result;
	 }
	 
	 /**
	  * 获取缓存中的单据信息
	  * @param dctx
	  * @param context
	  * @return
	  */
	 public static Map<String,Object> getBillValueFromCache(DispatchContext dctx, Map<String, Object> context){
		
		 return null;
	 }
	 
}
