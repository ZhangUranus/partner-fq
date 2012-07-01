package org.ofbiz.partner.scm.stock;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

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
import org.ofbiz.partner.scm.pricemgr.PriceMgr;
import org.ofbiz.partner.scm.pricemgr.Utils;
import org.ofbiz.partner.scm.purplan.PurPlanBalance;

/**
 * 验收单业务事件类
 * 
 * @author Mark
 * 
 */
public class PurchaseReturnEvents {
	private static final String module = org.ofbiz.partner.scm.stock.PurchaseReturnEvents.class.getName();

	/**
	 * 获取仓库物料数量、加权平均单价
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String getCurMaterialBalanceValue(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String warehouseId = request.getParameter("warehouseId");
		String materialId = request.getParameter("materialId");
		GenericValue value = PriceMgr.getInstance().getCurMaterialBalanceValue(warehouseId, materialId);
		JSONObject jsonStr = new JSONObject();
		jsonStr.put("success", true);
		BigDecimal curAmount = null;// 当前数量
		BigDecimal curSum = null;// 当前金额
		if (value == null) {
			jsonStr.put("stockVolume", 0);
			jsonStr.put("price", 0);
		} else {
			curAmount = value.getBigDecimal("volume");
			curSum = value.getBigDecimal("totalSum");
			jsonStr.put("stockVolume", curAmount);
			if (curAmount != null && curAmount.compareTo(BigDecimal.ZERO) != 0)
				jsonStr.put("price", curSum.divide(curAmount, 4, BigDecimal.ROUND_HALF_UP));
			else
				jsonStr.put("price", 0);
		}
		CommonEvents.writeJsonDataToExt(response, jsonStr.toString());
		return "success";
	}

	/**
	 * 采购退货提交
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String submitBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();

			Delegator delegator = (Delegator) request.getAttribute("delegator");
			String billId = request.getParameter("billId");// 单据id
			if (delegator != null && billId != null) {
				Debug.log("出库单审核:" + billId, module);
				GenericValue billHead = delegator.findOne("PurchaseReturn", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find PurchaseReturn bill or bizdate is null");
				}
				// 注意不能使用billHead.getDate方法，出产生castException异常
				Date bizDate = (Date) billHead.get("bizDate");
				if (bizDate == null || !Utils.isCurPeriod(bizDate)) {
					throw new Exception("单据业务日期不在当前系统期间");
				}
				
				// 供应商id
				int type = billHead.getInteger("type");
				
				if(type == 1){	//采购单，需要检查供应商，并更新供应商可入库数量
					// 供应商id
					String supplierId = billHead.getString("supplierSupplierId");
					if (supplierId == null || supplierId.length() < 1) {
						throw new Exception("采购退货单供应商为空！！！");
					}
					// 获取单据id分录条目
					List<GenericValue> entryList = delegator.findByAnd("PurchaseReturnEntry", UtilMisc.toMap("parentId", billId));
	
					for (GenericValue v : entryList) {
						String materialId = v.getString("materialMaterialId");// 物料id
						BigDecimal volume = v.getBigDecimal("volume");// 数量
	
						// 更新供应商可入库数量
						PurPlanBalance.getInstance().updateInWarehouse(supplierId, materialId, volume);
					}
				}

				BizStockImpFactory.getBizStockImp(BillType.PurchaseReturn).updateStock(billHead, true, false);

				BillBaseEvent.submitBill(request, response);// 更新单据状态

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
	 * 采购退货单撤销
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String rollbackBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();

			Delegator delegator = (Delegator) request.getAttribute("delegator");
			String billId = request.getParameter("billId");// 单据id
			if (delegator != null && billId != null) {
				Debug.log("出库单撤销:" + billId, module);
				GenericValue billHead = delegator.findOne("PurchaseReturn", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find PurchaseReturn bill or bizdate is null");
				}
				// 注意不能使用billHead.getDate方法，出产生castException异常
				Date bizDate = (Date) billHead.get("bizDate");
				if (bizDate == null || !Utils.isCurPeriod(bizDate)) {
					throw new Exception("单据业务日期不在当前系统期间");
				}
				
				// 供应商id
				int type = billHead.getInteger("type");
				
				if(type == 1){	//采购单，需要检查供应商，并更新供应商可入库数量
					// 供应商id
					String supplierId = billHead.getString("supplierSupplierId");
					if (supplierId == null || supplierId.length() < 1) {
						throw new Exception("采购退货单供应商为空！！！");
					}
	
					// 获取单据id分录条目
					List<GenericValue> entryList = delegator.findByAnd("PurchaseReturnEntry", UtilMisc.toMap("parentId", billId));
	
					for (GenericValue v : entryList) {
						String materialId = v.getString("materialMaterialId");// 物料id
						BigDecimal volume = v.getBigDecimal("volume");// 数量
	
						// 更新供应商可入库数量
						PurPlanBalance.getInstance().updateInWarehouse(supplierId, materialId, volume.negate());
					}
				}

				BizStockImpFactory.getBizStockImp(BillType.PurchaseReturn).updateStock(billHead, false, true);
				
				BillBaseEvent.rollbackBill(request, response);// 撤销单据
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
