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
import org.ofbiz.partner.scm.pricemgr.PriceCalItem;
import org.ofbiz.partner.scm.pricemgr.PriceMgr;
import org.ofbiz.partner.scm.pricemgr.Utils;
import org.ofbiz.partner.scm.purplan.PurPlanBalance;

/**
 * 验收单业务事件类
 * @author Mark
 *
 */
public class InspectiveBizEvents {
	private static final String module=org.ofbiz.partner.scm.stock.InspectiveBizEvents.class.getName();
	/**
	 * 采购入库提交
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String submitBill(HttpServletRequest request,HttpServletResponse response) throws Exception{
		boolean beganTransaction = false;
		try {
	            beganTransaction = TransactionUtil.begin();
				
				Delegator delegator=(Delegator)request.getAttribute("delegator");
				String billId=request.getParameter("billId");//单据id
				if(delegator!=null&&billId!=null){
					Debug.log("入库单审核:"+billId, module);
					GenericValue  billHead=delegator.findOne("PurchaseWarehousing", UtilMisc.toMap("id", billId), false);
					if(billHead==null&&billHead.get("bizDate")==null){
						throw new Exception("can`t find PurchaseWarehousing bill or bizdate is null");
					}
					
					//注意不能使用billHead.getDate方法，出产生castException异常
					Date bizDate=(Date) billHead.get("bizDate");
					if(bizDate==null||!Utils.isCurPeriod(bizDate)){
						throw new Exception("单据业务日期不在当前系统期间");
					}
					//供应商id
					String supplierId=billHead.getString("supplierSupplierId");
					if(supplierId==null&&supplierId.length()<1){
						throw new Exception("采购入库单供应商为空！！！");
					}
					
					//获取单据id分录条目
					List<GenericValue> entryList=delegator.findByAnd("PurchaseWarehousingEntry", UtilMisc.toMap("parentId", billId));
					
					
					for(GenericValue v:entryList){
						String warehouseId=v.getString("warehouseWarehouseId");//仓库id
						String materialId=v.getString("materialMaterialId");//物料id
						BigDecimal  volume=v.getBigDecimal("volume");//数量
						BigDecimal  sum =v.getBigDecimal("entrysum");//金额
						Debug.log("采购入库单价计算:物料id"+materialId+";数量"+volume+";金额"+sum, module);
						
						//更新供应商可入库数量
						PurPlanBalance.getInstance().updateInWarehouse(supplierId, materialId, volume.negate());
						
						//构建计算条目
						PriceCalItem item=new PriceCalItem(bizDate,warehouseId,materialId,volume,sum,BillType.PurchaseWarehouse,v.getString("id"),false,null);
						//调用业务处理实现
//						BizStockImpFactory.getBizStockImp(BillType.PurchaseWarehouse).updateStock(item);
					}

				BillBaseEvent.submitBill(request, response);//更新单据状态

		}} catch (Exception e) {
            Debug.logError(e, module);
            try {
                TransactionUtil.rollback(beganTransaction, e.getMessage(), e);
            } catch (GenericTransactionException e2) {
                Debug.logError(e2, "Unable to rollback transaction", module);
            }
        } finally {
            try {
                TransactionUtil.commit(beganTransaction);
            } catch (GenericTransactionException e) {
                Debug.logError(e, "Unable to commit transaction", module);
            }
        }
		return "success";
	}
	
	/**
	 * 验收单撤销
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String rollbackBill(HttpServletRequest request,HttpServletResponse response) throws Exception{
		boolean beganTransaction = false;
		try {
	            beganTransaction = TransactionUtil.begin();

				Delegator delegator=(Delegator)request.getAttribute("delegator");
				String billId=request.getParameter("billId");//单据id
				if(delegator!=null&&billId!=null){
					Debug.log("入库单撤销:"+billId, module);
					GenericValue  billHead=delegator.findOne("PurchaseWarehousing", UtilMisc.toMap("id", billId), false);
					if(billHead==null&&billHead.get("bizDate")==null){
						throw new Exception("can`t find PurchaseWarehousing bill or bizdate is null");
					}
					
					//注意不能使用billHead.getDate方法，会产生castException异常
					Date bizDate=(Date) billHead.get("bizDate");
					if(bizDate==null||!Utils.isCurPeriod(bizDate)){
						throw new Exception("单据业务日期不在当前系统期间");
					}
					//供应商id
					String supplierId=billHead.getString("supplierSupplierId");
					if(supplierId==null&&supplierId.length()<1){
						throw new Exception("采购入库单供应商为空！！！");
					}
					//获取单据id分录条目
					List<GenericValue> entryList=delegator.findByAnd("PurchaseWarehousingEntry", UtilMisc.toMap("parentId", billId));
					
					for(GenericValue v:entryList){
						String warehouseId=v.getString("warehouseWarehouseId");//仓库id
						String materialId=v.getString("materialMaterialId");//物料id
						BigDecimal  volume=v.getBigDecimal("volume");//数量
						BigDecimal  sum =v.getBigDecimal("entrysum");//金额
						Debug.log("撤销采购入库单价计算:物料id"+materialId+";数量"+volume+";金额"+sum, module);
						
						//更新供应商可入库数量
						PurPlanBalance.getInstance().updateInWarehouse(supplierId, materialId, volume);
						//构建计算条目
						PriceCalItem item=new PriceCalItem(bizDate,warehouseId,materialId,volume,sum,BillType.PurchaseWarehouse,billId,true,null);
						//调用业务处理实现
//						BizStockImpFactory.getBizStockImp(BillType.PurchaseWarehouse).updateStock(item);
						
					}
				}
				
				BillBaseEvent.rollbackBill(request, response);//撤销单据
		} catch (Exception e) {
            Debug.logError(e, module);
            try {
                TransactionUtil.rollback(beganTransaction, e.getMessage(), e);
            } catch (GenericTransactionException e2) {
                Debug.logError(e2, "Unable to rollback transaction", module);
            }
        } finally {
            try {
                TransactionUtil.commit(beganTransaction);
            } catch (GenericTransactionException e) {
                Debug.logError(e, "Unable to commit transaction", module);
            }
        }
		return "success";
	}
}
