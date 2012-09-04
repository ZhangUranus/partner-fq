package org.ofbiz.partner.scm.stock;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.transaction.GenericTransactionException;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.partner.scm.common.BillBaseEvent;
import org.ofbiz.partner.scm.pricemgr.BillType;
import org.ofbiz.partner.scm.pricemgr.BizStockImpFactory;
import org.ofbiz.partner.scm.pricemgr.Utils;
/**
 * 成品出仓单业务事件类
 * 
 * @author Mark
 * 
 */
public class ProductOutwarehouseEvents {
	private static final String module = org.ofbiz.partner.scm.stock.ProductOutwarehouseEvents.class.getName();

	/**
	 * 成品出仓提交
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
			Date bizDate =null;
			if (delegator != null && billId != null) {
				Debug.log("成品出仓单提交:" + billId, module);
				GenericValue billHead = delegator.findOne("ProductOutwarehouse", UtilMisc.toMap("id", billId), false);

				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ProductOutwarehouse bill or bizdate is null");
				}
				//注意不能使用billHead.getDate方法，出产生castException异常
				bizDate= (Date) billHead.get("bizDate");

				BizStockImpFactory.getBizStockImp(BillType.ProductOutwarehouse).updateStock(billHead, true, false);
			}
			
			//更新周汇总表
			// 获取单据分录条目
			List<GenericValue> entryList = delegator.findByAnd("ProductOutwarehouseEntry", UtilMisc.toMap("parentId", billId));
			 
			for (GenericValue v : entryList) {
				String materialId = v.getString("materialMaterialId");// 打板物料id
				BigDecimal volume = v.getBigDecimal("volume");//出库数量（板）
				Long qantity = v.getLong("qantity");//板数量（一板有多少产品）

				
				WeeklyStockMgr.getInstance().updateStock(materialId, bizDate, ProductStockType.OUT, volume, false);
				ProductInOutStockMgr.getInstance().updateStock(materialId, ProductStockType.OUT, qantity, volume, false);
				updateNotification(v,delegator,materialId,volume,v.getString("goodNumber"),v.getString("destinhouseNumber"));
				v.set("prdWeek", Utils.getYearWeekStr(bizDate));
				v.store();
			}
			
			BillBaseEvent.submitBill(request, response);// 更新单据状态
			
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
	 * 成品出仓单撤销
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
			Date bizDate =null;
			if (delegator != null && billId != null) {
				Debug.log("成品出仓单撤销:" + billId, module);
				GenericValue billHead = delegator.findOne("ProductOutwarehouse", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ProductOutwarehouse bill or bizdate is null");
				}
				//注意不能使用billHead.getDate方法，出产生castException异常
				bizDate= (Date) billHead.get("bizDate");

				BizStockImpFactory.getBizStockImp(BillType.ProductOutwarehouse).updateStock(billHead, false, true);
			}
			
			//更新周汇总表
			// 获取单据分录条目
			List<GenericValue> entryList = delegator.findByAnd("ProductOutwarehouseEntry", UtilMisc.toMap("parentId", billId));
			 
			for (GenericValue v : entryList) {
				String materialId = v.getString("materialMaterialId");// 打板物料id
				BigDecimal volume = v.getBigDecimal("volume");//出库数量（板）
				Long qantity = v.getLong("qantity");//板数量（一板有多少产品）
				
				WeeklyStockMgr.getInstance().updateStock(materialId, bizDate, ProductStockType.OUT, volume, true);
				ProductInOutStockMgr.getInstance().updateStock(materialId, ProductStockType.OUT, qantity, volume, true);
				updateNotification(v,delegator,materialId,volume.negate(),v.getString("goodNumber"),v.getString("destinhouseNumber"));
			}
			
			BillBaseEvent.rollbackBill(request, response);// 撤销单据
			
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
	
	public static void updateNotification(GenericValue headValue,Delegator delegator,String materialId,BigDecimal volume,String goodNumber,String destinhouseNumber) throws Exception {
		List<GenericValue> mainList = delegator.findByAnd("ProductOutNotification", UtilMisc.toMap("goodNumber", goodNumber, "finalHouseNumber", destinhouseNumber, "status", "4"));
		boolean isUpdate = false;
		if(mainList.size()>0){
			GenericValue v = mainList.get(0);	//只取第一条，默认一个货号、订舱号只能唯一对应一条通知单
			headValue.set("containerNumber", v.getString("finalContainerNumber"));
			headValue.set("sealNumber", v.getString("sealNumber"));
			List<GenericValue> entryList = delegator.findByAnd("ProductOutNotificationEntry", UtilMisc.toMap("parentId", v.getString("id")));
			for (GenericValue entry : entryList) {
				List<GenericValue> detailList = delegator.findByAnd("ProductOutNotificationEntryDetail", UtilMisc.toMap("parentId", entry.getString("id")));
				for (GenericValue detail : detailList) {
					//更新未完成入柜的记录
					if(materialId.equals(detail.getString("materialId")) && "N".equals(detail.getString("isFinished"))){
						detail.set("sentQty", detail.getBigDecimal("sentQty").add(volume));
						if(detail.getBigDecimal("sentQty").compareTo(detail.getBigDecimal("orderQty")) == 0){
							detail.set("isFinished", "Y");
						}
						detail.store();
						isUpdate = true;
						break;
					}
				}
				if(isUpdate){
					break;
				}
			}
			if(!isUpdate){
				throw new Exception("未找到产品对应的出货通知单，请检查货号、订舱号是否填写正确。如果无相应出货通知单，请先提交通知单！");
			}
			headValue.store();
		} else {
			throw new Exception("未找到产品对应的出货通知单，请检查货号、订舱号是否填写正确。如果无相应出货通知单，请先提交通知单！");
		}
	}
}
