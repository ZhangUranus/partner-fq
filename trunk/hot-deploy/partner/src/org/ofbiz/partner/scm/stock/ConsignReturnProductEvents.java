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
import org.ofbiz.partner.scm.pricemgr.ConsignProcessedPriceMgr;
import org.ofbiz.partner.scm.pricemgr.MaterialBomMgr;
import org.ofbiz.partner.scm.pricemgr.Utils;
import org.ofbiz.service.LocalDispatcher;

/**
 * 验收单业务事件类
 * 
 * @author Mark
 * 
 */
public class ConsignReturnProductEvents {
	private static final String module = org.ofbiz.partner.scm.stock.ConsignReturnProductEvents.class.getName();
	
	/**
	 * 委外退货提交
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
		BillCurrentJobMgr.getInstance().update(billId, true, false, false);
		
		try {
			beganTransaction = TransactionUtil.begin();

			Delegator delegator = (Delegator) request.getAttribute("delegator");
			if (delegator != null && billId != null) {
				Debug.log("出库单提交:" + billId, module);
				GenericValue billHead = delegator.findOne("ConsignReturnProduct", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ConsignReturnProduct bill or bizdate is null");
				}
				
				/*
				 *  处理：
				 *  1.保存状态时，执行委外退货业务类，并更新单据状态
				 *  2.非保存状态时，进行退货验收
				 */
				if (billHead.getInteger("status") == 0) {
					BizStockImpFactory.getBizStockImp(BillType.ConsignReturnProduct).updateStock(billHead, true, false);
					BillBaseEvent.submitBill(request, response);// 更新单据状态
					
					/* 开始 增加单据处理任务 */
					billInfoMap.put("number", billHead.get("number").toString());
					billInfoMap.put("billType", "ConsignReturnProduct");
					billInfoMap.put("operationType", "3");
					dispatcher.runSync("addBillHandleJobService", billInfoMap);
					/* 结束 增加单据处理任务 */
				} else {
					// 获取单据id分录条目
					List<GenericValue> entryList = delegator.findByAnd("ConsignReturnProductEntry", UtilMisc.toMap("parentId", billHead.getString("id")));
					boolean isFinish = true;
					for(GenericValue entryValue : entryList){
						
						// 每次验收增加新单据
						String headId = Utils.createReturnProductWarehousingBill(billHead,request,entryValue);	//创建进货单
						Utils.submitReturnProductWarehousing(headId,request);	//提交
						
						
						BigDecimal checkedVolume = entryValue.getBigDecimal("checkedVolume");
						BigDecimal currentCheckVolume = entryValue.getBigDecimal("currentCheckVolume");
						BigDecimal volume = entryValue.getBigDecimal("volume");
						BigDecimal checkedV = checkedVolume.add(currentCheckVolume);
						if(volume.compareTo(checkedV)==-1){
							throw new Exception("验收数量不能大于退货数量，请重新输入！");
						}
						entryValue.set("checkedVolume", checkedVolume.add(currentCheckVolume));
						entryValue.set("currentCheckVolume", BigDecimal.ZERO);
						if(volume.compareTo(entryValue.getBigDecimal("checkedVolume"))!=0){
							isFinish = false;
						}
						entryValue.store();
						
					}
					
					
					//当状态为未验收时，创建进货单，并置状态为验收中
					if(billHead.getInteger("checkStatus")==0){
						billHead.set("checkStatus", 1);// 设置验收状态为验收中，验收中状态不允许撤销操作
					}
					
					//当所有物料都完成验收时，将状态改为完成验收，并提交进货单
					if (isFinish) {
						billHead.set("checkStatus", 2);
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
		} finally {
			// 删除单据运行任务到运行表中
			BillCurrentJobMgr.getInstance().update(billId, true, false, true);
		}
		return "success";
	}

	/**
	 * 委外退货单撤销
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
		BillCurrentJobMgr.getInstance().update(billId, false, true, false);
		
		try {
			beganTransaction = TransactionUtil.begin();

			Delegator delegator = (Delegator) request.getAttribute("delegator");
			if (delegator != null && billId != null) {
				Debug.log("出库单撤销:" + billId, module);
				GenericValue billHead = delegator.findOne("ConsignReturnProduct", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ConsignReturnProduct bill or bizdate is null");
				}

				BizStockImpFactory.getBizStockImp(BillType.ConsignReturnProduct).updateStock(billHead, false, true);

				BillBaseEvent.rollbackBill(request, response);// 撤销单据
				
				/* 开始 增加单据处理任务 */
				billInfoMap.put("number", billHead.get("number").toString());
				billInfoMap.put("billType", "ConsignReturnProduct");
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
			BillCurrentJobMgr.getInstance().update(billId, false, true, true);
		}
		return "success";
	}
	
	/**
	 * 完成验收操作
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String finishCheckBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();

			Delegator delegator = (Delegator) request.getAttribute("delegator");
			String billId = request.getParameter("billId");// 单据id
			if (delegator != null && billId != null) {
				Debug.log("出库单完成验收:" + billId, module);
				GenericValue billHead = delegator.findOne("ConsignReturnProduct", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ConsignReturnProduct bill or bizdate is null");
				}
				
				// 获取单据id分录条目
				List<GenericValue> entryList = delegator.findByAnd("ConsignReturnProductEntry", UtilMisc.toMap("parentId", billHead.getString("id")));
				String processorSupplierId = billHead.getString("processorSupplierId");
				for(GenericValue entryValue : entryList){
					if(entryValue.getBigDecimal("checkedVolume").compareTo(entryValue.getBigDecimal("volume"))!=0){
						String materialId = MaterialBomMgr.getInstance().getMaterialIdByBomId(entryValue.getString("bomId"));
						ConsignProcessedPriceMgr.getInstance().changeTypeOfFinishBill(processorSupplierId, materialId, entryValue.getBigDecimal("volume").add(entryValue.getBigDecimal("checkedVolume").negate()));
					}
				}
				
				billHead.set("checkStatus", 2);
				billHead.set("checkerSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
				billHead.store();
				BillBaseEvent.writeSuccessMessageToExt(response, "已完成验收");
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
