package org.ofbiz.partner.scm.stock;

import java.math.BigDecimal;
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
import org.ofbiz.partner.scm.pricemgr.BillType;
import org.ofbiz.partner.scm.pricemgr.BizStockImpFactory;
import org.ofbiz.partner.scm.pricemgr.Utils;
import org.ofbiz.service.LocalDispatcher;

/**
 * 验收单业务事件类
 * 
 * @author Mark
 * 
 */
public class WorkshopReturnProductEvents {
	private static final String module = org.ofbiz.partner.scm.stock.WorkshopReturnProductEvents.class.getName();

	/**
	 * 制造退货提交
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
		try {
			beganTransaction = TransactionUtil.begin();

			Delegator delegator = (Delegator) request.getAttribute("delegator");
			String billId = request.getParameter("billId");// 单据id
			if (delegator != null && billId != null) {
				Debug.log("出库单提交:" + billId, module);
				GenericValue billHead = delegator.findOne("WorkshopReturnProduct", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find WorkshopReturnProduct bill or bizdate is null");
				}

				if (billHead.getInteger("status")==0) {
					BizStockImpFactory.getBizStockImp(BillType.WorkshopReturnProduct).updateStock(billHead, true, false);
					BillBaseEvent.submitBill(request, response);// 更新单据状态
				} else {
					// 获取单据id分录条目
					List<GenericValue> entryList = delegator.findByAnd("WorkshopReturnProductEntry", UtilMisc.toMap("parentId", billHead.getString("id")));
					boolean isFinish = true;
					for(GenericValue entryValue : entryList){
						BigDecimal checkedVolume = entryValue.getBigDecimal("checkedVolume");
						BigDecimal currentCheckVolume = entryValue.getBigDecimal("currentCheckVolume");
						BigDecimal volume = entryValue.getBigDecimal("volume");
						BigDecimal checkedV = checkedVolume.add(currentCheckVolume);
						if(volume.compareTo(checkedV)==-1){
							throw new Exception("验收数量不能大于退货数量，请重新输入！");
						}
						entryValue.set("checkedVolume", checkedV);
						entryValue.set("currentCheckVolume", BigDecimal.ZERO);
						if(volume.compareTo(entryValue.getBigDecimal("checkedVolume"))!=0){
							isFinish = false;
						}
						entryValue.store();
					}
					
					//当状态为未验收时，创建进货单，并置状态为验收中
					if(billHead.getInteger("checkStatus")==0){
						billHead.set("checkStatus", 1);// 设置验收状态为验收中
					}
					
					//当所有物料都完成验收时，将状态改为完成验收，并提交进货单
					if (isFinish) {
						Utils.createReturnProductWarehousingBill(billHead,request);	//创建进货单
						Utils.submitReturnProductWarehousing(billHead,request);	//提交
						billHead.set("checkStatus", 2);
						
						/* 开始 增加单据处理任务 */
						billInfoMap.put("number", billHead.get("number").toString());
						billInfoMap.put("billType", "WorkshopReturnProduct");
						billInfoMap.put("operationType", "3");
						dispatcher.runAsync("addBillHandleJobService", billInfoMap);
						/* 结束 增加单据处理任务 */
					}
					billHead.set("checkerSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
					billHead.store();
					BillBaseEvent.writeSuccessMessageToExt(response, "验收成功");
				}
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
		}
		return "success";
	}

	/**
	 * 制造退货单撤销
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
		try {
			beganTransaction = TransactionUtil.begin();

			Delegator delegator = (Delegator) request.getAttribute("delegator");
			String billId = request.getParameter("billId");// 单据id
			if (delegator != null && billId != null) {
				Debug.log("出库单撤销:" + billId, module);
				GenericValue billHead = delegator.findOne("WorkshopReturnProduct", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find WorkshopReturnProduct bill or bizdate is null");
				}

				BizStockImpFactory.getBizStockImp(BillType.WorkshopReturnProduct).updateStock(billHead, false, true);

				BillBaseEvent.rollbackBill(request, response);// 撤销单据
				
				/* 开始 增加单据处理任务 */
				billInfoMap.put("number", billHead.get("number").toString());
				billInfoMap.put("billType", "WorkshopReturnProduct");
				billInfoMap.put("operationType", "4");
				dispatcher.runAsync("addBillHandleJobService", billInfoMap);
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
		}
		return "success";
	}
}
