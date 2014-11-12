package org.ofbiz.partner.scm.stock;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.transaction.GenericTransactionException;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.partner.scm.common.BillBaseEvent;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.pojo.VolumeOfProduct;
import org.ofbiz.partner.scm.pojo.WorkshopStock;
import org.ofbiz.partner.scm.pricemgr.BillType;
import org.ofbiz.partner.scm.pricemgr.BizStockImpFactory;
import org.ofbiz.partner.scm.pricemgr.Utils;
import org.ofbiz.partner.scm.pricemgr.WorkshopPriceMgr;
import org.ofbiz.service.LocalDispatcher;
/**
 * 验收单业务事件类
 * 
 * @author Mark
 * 
 */
public class WorkshopWarehousingEvents {
	private static final String module = org.ofbiz.partner.scm.stock.WorkshopWarehousingEvents.class.getName();
	public static Object updateLock = new Object();// 余额表更新锁

	
	public static String getDetailCount(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		String parentId = request.getParameter("parentId");// 单据id
		String jsonResult="{success:true,count:0}";
		if (delegator != null && parentId != null) {
			synchronized (updateLock) {
				List<GenericValue> detailList = delegator.findByAnd("WorkshopPriceDetail", UtilMisc.toMap("parentId", parentId));
				if(detailList.size()>0){
					jsonResult="{success:true,count:"+detailList.size()+"}";
				}
			}
		}
		CommonEvents.writeJsonDataToExt(response, jsonResult); // 将结果返回前端Ext
		return "success";
	}
	
	/**
	 * 制造入库提交
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String submitBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		LocalDispatcher dispatcher = (LocalDispatcher) request.getAttribute("dispatcher");
		Map<String, String> billInfoMap = new HashMap<String, String>();			//单据信息
		boolean beganTransaction = false;
		String billId = request.getParameter("billId");// 单据id
		
		// 增加单据运行任务到运行表中
		BillCurrentJobMgr.getInstance().update(billId, false, false, false);
		synchronized (updateLock) {
			try {
				beganTransaction = TransactionUtil.begin();
	
				Delegator delegator = (Delegator) request.getAttribute("delegator");
				if (delegator != null && billId != null) {
					Debug.log("入库单提交:" + billId, module);
					GenericValue billHead = delegator.findOne("WorkshopWarehousing", UtilMisc.toMap("id", billId), false);
					if (billHead == null || billHead.get("bizDate") == null) {
						throw new Exception("can`t find WorkshopWarehousing bill or bizdate is null");
					}
					if(billHead.getString("status").equals("4")){
						throw new Exception("单据已提交，请刷新数据！");
					}
	
					BizStockImpFactory.getBizStockImp(BillType.WorkshopWarehousing).updateStock(billHead, false, false);
	
					BillBaseEvent.submitBill(request, response);// 更新单据状态
					
					/* 开始 增加单据处理任务 */
					billInfoMap.put("number", billHead.get("number").toString());
					billInfoMap.put("billType", "WorkshopWarehousing");
					billInfoMap.put("operationType", "3");
					dispatcher.runSync("addBillHandleJobService", billInfoMap);
					/* 结束 增加单据处理任务 */
				}
				TransactionUtil.commit(beganTransaction);
			} catch (Exception e) {
				Debug.logError(e, module);
				try {
					TransactionUtil.rollback(beganTransaction, e.getMessage(), e);
				} catch (GenericTransactionException e2) {
					Debug.logError(e2, "Unable to rollback transaction", module);
				}
				throw e;
			} finally {
				// 删除单据运行任务到运行表中
				BillCurrentJobMgr.getInstance().update(billId, false, false, true);
			}
		}
		return "success";
	}

	/**
	 * 制造入库单撤销
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String rollbackBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		LocalDispatcher dispatcher = (LocalDispatcher) request.getAttribute("dispatcher");
		Map<String, String> billInfoMap = new HashMap<String, String>();			//单据信息
		boolean beganTransaction = false;
		String billId = request.getParameter("billId");// 单据id
		
		// 增加单据运行任务到运行表中
		BillCurrentJobMgr.getInstance().update(billId, true, true, false);
		try {
			beganTransaction = TransactionUtil.begin();

			Delegator delegator = (Delegator) request.getAttribute("delegator");
			if (delegator != null && billId != null) {
				Debug.log("入库单撤销:" + billId, module);
				GenericValue billHead = delegator.findOne("WorkshopWarehousing", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find WorkshopWarehousing bill or bizdate is null");
				}
				if(billHead.getString("status").equals("0")){
					throw new Exception("单据已撤销，请刷新数据！");
				}

				BizStockImpFactory.getBizStockImp(BillType.WorkshopWarehousing).updateStock(billHead, true, true);

				BillBaseEvent.rollbackBill(request, response);// 撤销单据
				
				/* 开始 增加单据处理任务 */
				billInfoMap.put("number", billHead.get("number").toString());
				billInfoMap.put("billType", "WorkshopWarehousing");
				billInfoMap.put("operationType", "4");
				dispatcher.runSync("addBillHandleJobService", billInfoMap);
				/* 结束 增加单据处理任务 */
			}
			TransactionUtil.commit(beganTransaction);
		} catch (Exception e) {
			Debug.logError(e, module);
			try {
				TransactionUtil.rollback(beganTransaction, e.getMessage(), e);
			} catch (GenericTransactionException e2) {
				Debug.logError(e2, "Unable to rollback transaction", module);
			}
			throw e;
		} finally {
			// 删除单据运行任务到运行表中
			BillCurrentJobMgr.getInstance().update(billId, true, true, true);
		}
		return "success";
	}
	
	/**
	 * 制造入库提交检查
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String checkSubmitBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		try {
			Delegator delegator = (Delegator) request.getAttribute("delegator");
			String billId = request.getParameter("billId");// 单据id
			if (delegator != null && billId != null) {
				Debug.log("入库单提交检查:" + billId, module);
				GenericValue billHead = delegator.findOne("WorkshopWarehousing", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find WorkshopWarehousing bill or bizdate is null");
				}
				// 供应商id
				String workshopId = billHead.getString("workshopWorkshopId");
				if (workshopId == null || workshopId.length() < 1) {
					throw new Exception("制造入库单车间为空！！！");
				}
				
				// 获取单据id分录条目
				List<GenericValue> entryList = delegator.findByAnd("WorkshopWarehousingEntry", UtilMisc.toMap("parentId", billHead.getString("id")));
				
				List<VolumeOfProduct> productList = new ArrayList<VolumeOfProduct>();
				for(GenericValue value : entryList){
					// 创建耗料列表
					WorkshopPriceMgr.getInstance().CreateWorkshopPriceDetailList(workshopId, value.getString("bomId"), value.getString("id"), value.getBigDecimal("volume"));
					
					// 更新车间库存表
					List<List<Object>> materialList = WorkshopPriceMgr.getInstance().getMaterialList(value.getString("id"));
					for (List<Object> element : materialList) {
						String bomMaterialId = (String) element.get(0);
						BigDecimal bomAmount = (BigDecimal) element.get(1);
						VolumeOfProduct vp = new VolumeOfProduct(workshopId,bomMaterialId,bomAmount);
						productList.add(vp);
					}
				}
				List<WorkshopStock> workshopStockList = Utils.checkWorkshopStock(productList);
				// 封装实体数据，构建json字符串
				StringBuffer jsonStr = new StringBuffer();
				jsonStr.append("{'success':true,'records':[");
				boolean isFirstValue = true;
				int total = workshopStockList.size();
				for(WorkshopStock ws : workshopStockList){
					if (isFirstValue) {
						isFirstValue = false;
					} else {
						jsonStr.append(",");
					}
					jsonStr.append(ws.toJsonString());
				}
				jsonStr.append("],total:"+total+"}");
				
				BillBaseEvent.writeSuccessMessageToExt(response, jsonStr.toString());
			} else {
				throw new Exception("操作异常！");
			}
		} catch (Exception e) {
			Debug.logError(e, module);
			throw e;
		}
		return "success";
	}
}
