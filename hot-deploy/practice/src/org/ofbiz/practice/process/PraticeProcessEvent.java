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
	 * 新建单据事件，生成一个uuid码,初始化单据等
	 * @return
	 */
	public static String createNewBill(HttpServletRequest request, HttpServletResponse response){
		UUID billId=UUID.randomUUID();
		request.setAttribute("newBillId", billId.toString());
		//设置单据默认值
		setDefaultFields(request);
		
		//缓存新单据
		NewBillCache billCache=(NewBillCache) request.getSession().getAttribute("billCache");
		if(billCache==null){
			billCache=new NewBillCache();
			request.getSession().setAttribute("billCache",billCache);
		}
		//缓存新单据id，单据头其它字段信息不进行缓存
		billCache.put(billId.toString(), new HashMap<String, Object>());
		return "success";
	}
	
	private static void setDefaultFields(HttpServletRequest request) {
		// 单据新增时，设置单据表头字段默认值,例如
		request.setAttribute("number", "1111111111");
		
		
	}
	/**
	 * 返回单据分录信息
	 * @param request
	 * @param response
	 * @return
	 */
	public static String getBillEntry1(HttpServletRequest request, HttpServletResponse response){
		NewBillCache billCache=(NewBillCache) request.getSession().getAttribute("billCache");
		if(request.getAttribute("parentId")==null){
			request.setAttribute("_ERROR_MESSAGE_", "参数单据id为空！");
			return "error";
		}
		if(billCache==null||billCache.getBillValue(request.getAttribute("parentId").toString())==null){
			request.setAttribute("_ERROR_MESSAGE_", "缓存不存在分录关系的单据！");
			return "error";
		}
		//从缓存单据中查找分录信息
		Map<String, Object> bill=(Map<String, Object>)billCache.getBillValue(request.getAttribute("parentId").toString());
		request.setAttribute("entry1", bill.get("entry1"));
		return "success";
	}
	/**
	 * 添加一个分录到单据缓存
	 * @param request
	 * @param response
	 * @return
	 */
	public static String addEntry1(HttpServletRequest request, HttpServletResponse response){
		String parentId=(String) request.getAttribute("parentId");//父单据id
		
		//设置分录默认值
		setEntry1DefaultFields(request);
		
		//判断分录对应的单据时否存在
		NewBillCache billCache=(NewBillCache) request.getSession().getAttribute("billCache");
		if(billCache==null&&billCache.getBillValue(parentId)==null){//单据缓存不存在
			request.setAttribute("_ERROR_MESSAGE_", "分录对应的单据不存在");
			return "error";
		}
		//添加分录到缓存
		Map<String, Object> bill=(Map<String, Object>)billCache.getBillValue(parentId);
		Map<String, Object> entry1Info=getNewEntry1FromRequest(request);//新建分录
		Map<String, Object> entry1Coll=getBillEntryColl(bill,"entry1"); //获取单据分录集合
		entry1Coll.put(entry1Info.get("id").toString(), entry1Info);//添加新分录到分录集合
		
		
		return "success";
	}
	
	/**
	 * 单据分录名，返回单据分录组合
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
		// TODO 根据request创建新的分录
		String id=UUID.randomUUID().toString();//生成分录 id
		Map<String, Object> entry1=new HashMap<String, Object>();
		entry1.put("id",id);//分录id
		entry1.put("seq", request.getAttribute("seq"));
		entry1.put("note", request.getAttribute("note"));
		//设置其它信息
		
		return entry1;
	}

	private static void setEntry1DefaultFields(HttpServletRequest request) {
		// TODO 新增分录时设置分录默认值
		
	}

	/**
	 * 更新缓存分录
	 * @param request
	 * @param response
	 * @return
	 */
	public static String updateEntry1FromCache(HttpServletRequest request, HttpServletResponse response){
		return "success";
	}
	/**
	 * 删除缓存分录
	 * @param request
	 * @param response
	 * @return
	 */
    public static String removeEntry1FromCache(HttpServletRequest request, HttpServletResponse response){
    	return "success";
	}
}
