package org.ofbiz.practice.process;

import java.util.Map;
import java.util.UUID;

import org.ofbiz.practice.NewBillCache;
import org.ofbiz.service.DispatchContext;
import org.ofbiz.service.ServiceUtil;

public class PraticeService {

	/**
	 * �½�����ʱ��ȡ�µ���id
	 * @param dctx
	 * @param context
	 * @return
	 */
	 public static Map<String, Object> getNewBillId(DispatchContext dctx, Map<String, Object> context) {
		 UUID billId=UUID.randomUUID();
		 Map<String,Object> result=ServiceUtil.returnSuccess();
		 result.put("newBillId", billId.toString());
		 //��������µ���
		 
		 
		 return result;
	 }
	 
	 /**
	  * ��ȡ�����еĵ�����Ϣ
	  * @param dctx
	  * @param context
	  * @return
	  */
	 public static Map<String,Object> getBillValueFromCache(DispatchContext dctx, Map<String, Object> context){
		
		 return null;
	 }
	 
}
