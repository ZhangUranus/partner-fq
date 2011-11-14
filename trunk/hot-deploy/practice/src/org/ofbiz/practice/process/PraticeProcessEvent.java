package org.ofbiz.practice.process;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.order.OrderManagerEvents;
import org.ofbiz.practice.NewBillCache;

public class PraticeProcessEvent {
	public static final String module = OrderManagerEvents.class.getName();
	
	/**
	 * �½������¼�������һ��uuid��,��ʼ�����ݵ�
	 * @return
	 */
	public static String createNewBill(HttpServletRequest request, HttpServletResponse response){
		UUID billId=UUID.randomUUID();
		request.setAttribute("newBillId", billId.toString());
		//���õ���Ĭ��ֵ
		setDefaultFields(request);
		
		//�����µ���
		NewBillCache billCache=(NewBillCache) request.getSession().getAttribute("billCache");
		if(billCache==null){
			billCache=new NewBillCache();
			request.getSession().setAttribute("billCache",billCache);
		}
		//�����µ���id������ͷ�����ֶ���Ϣ�����л���
		billCache.put(billId.toString(), new HashMap<String, Object>());
		return "success";
	}
	
	private static void setDefaultFields(HttpServletRequest request) {
		// ��������ʱ�����õ��ݱ�ͷ�ֶ�Ĭ��ֵ,����
		request.setAttribute("number", "1111111111");
		
		
	}
	/**
	 * ���ص��ݷ�¼��Ϣ
	 * @param request
	 * @param response
	 * @return
	 */
	public static String getBillEntry1(HttpServletRequest request, HttpServletResponse response){
		NewBillCache billCache=(NewBillCache) request.getSession().getAttribute("billCache");
		if(request.getAttribute("parentId")==null){
			request.setAttribute("_ERROR_MESSAGE_", "��������idΪ�գ�");
			return "error";
		}
		if(billCache==null||billCache.getBillValue(request.getAttribute("parentId").toString())==null){
			request.setAttribute("_ERROR_MESSAGE_", "���治���ڷ�¼��ϵ�ĵ��ݣ�");
			return "error";
		}
		//�ӻ��浥���в��ҷ�¼��Ϣ
		Map<String, Object> bill=(Map<String, Object>)billCache.getBillValue(request.getAttribute("parentId").toString());
		request.setAttribute("entry1", bill.get("entry1"));
		return "success";
	}
	/**
	 * ���һ����¼�����ݻ���
	 * @param request
	 * @param response
	 * @return
	 */
	public static String addEntry1(HttpServletRequest request, HttpServletResponse response){
		String parentId=(String) request.getAttribute("parentId");//������id
		
		//���÷�¼Ĭ��ֵ
		setEntry1DefaultFields(request);
		
		//�жϷ�¼��Ӧ�ĵ���ʱ�����
		NewBillCache billCache=(NewBillCache) request.getSession().getAttribute("billCache");
		if(billCache==null&&billCache.getBillValue(parentId)==null){//���ݻ��治����
			request.setAttribute("_ERROR_MESSAGE_", "��¼��Ӧ�ĵ��ݲ�����");
			return "error";
		}
		//��ӷ�¼������
		Map<String, Object> bill=(Map<String, Object>)billCache.getBillValue(parentId);
		Map<String, Object> entry1Info=getNewEntry1FromRequest(request);//�½���¼
		Map<String, Object> entry1Coll=getBillEntryColl(bill,"entry1"); //��ȡ���ݷ�¼����
		entry1Coll.put(entry1Info.get("id").toString(), entry1Info);//����·�¼����¼����
		
		
		return "success";
	}
	
	/**
	 * ���ݷ�¼�������ص��ݷ�¼���
	 * @param bill
	 * @param string
	 * @return
	 */
	private static Map<String, Object> getBillEntryColl( Map<String, Object> bill,String string) {
		if(bill.get("entry1")==null){
			Map<String, Object> entry1Coll=new HashMap<String, Object>();
			bill.put("entry1", entry1Coll);
			return entry1Coll;
		}else{
			return (Map<String, Object>) bill.get("entry1");
		}
	}

	private static Map<String, Object> getNewEntry1FromRequest(
			HttpServletRequest request) {
		// TODO ����request�����µķ�¼
		String id=UUID.randomUUID().toString();//���ɷ�¼ id
		Map<String, Object> entry1=new HashMap<String, Object>();
		entry1.put("id",id);//��¼id
		entry1.put("seq", request.getAttribute("seq"));
		entry1.put("note", request.getAttribute("note"));
		//����������Ϣ
		
		return entry1;
	}

	private static void setEntry1DefaultFields(HttpServletRequest request) {
		// TODO ������¼ʱ���÷�¼Ĭ��ֵ
		
	}

	/**
	 * ���»����¼
	 * @param request
	 * @param response
	 * @return
	 */
	public static String updateEntry1FromCache(HttpServletRequest request, HttpServletResponse response){
		return "success";
	}
	/**
	 * ɾ�������¼
	 * @param request
	 * @param response
	 * @return
	 */
    public static String removeEntry1FromCache(HttpServletRequest request, HttpServletResponse response){
    	return "success";
	}
}
