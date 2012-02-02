package org.ofbiz.partner.scm.stock;

import java.math.BigDecimal;
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
import org.ofbiz.partner.scm.pricemgr.PriceCalItem;
import org.ofbiz.partner.scm.pricemgr.PriceMgr;

/**
 * 验收单业务事件类
 * @author Mark
 *
 */
public class InspectiveBizEvents {
	private static final String module=org.ofbiz.partner.scm.stock.InspectiveBizEvents.class.getName();
	/**
	 * 采购入库审核
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String auditBill(HttpServletRequest request,HttpServletResponse response) throws Exception{
		boolean beganTransaction = false;
		try {
	            beganTransaction = TransactionUtil.begin();

				BillBaseEvent.auditBill(request, response);//更新单据状态
				
				Delegator delegator=(Delegator)request.getAttribute("delegator");
				String billId=request.getParameter("billId");//单据id
				if(delegator!=null&&billId!=null){
					Debug.log("入库单审核:"+billId, module);
					//获取单据id分录条目
					List<GenericValue> entryList=delegator.findByAnd("PurchaseWarehousingEntry", UtilMisc.toMap("parentId", billId));
					
					for(GenericValue v:entryList){
						String warehouseId=v.getString("warehouseWarehouseId");//仓库id
						String materialId=v.getString("materialMaterialId");//物料id
						BigDecimal  volume=v.getBigDecimal("volume");//数量
						BigDecimal  sum =v.getBigDecimal("entrysum");//金额
						Debug.log("采购入库单价计算:物料id"+materialId+";数量"+volume+";金额"+sum, module);
						//构建计算条目
						PriceCalItem item=new PriceCalItem(null,warehouseId,materialId,volume,sum,BillType.PurchaseWarehouse,billId);
						PriceMgr.getInstance().calPrice(item);
					}
		}} catch (GenericTransactionException e) {
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
	 * 验收单反审核
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String unauditBill(HttpServletRequest request,HttpServletResponse response) throws Exception{
		return BillBaseEvent.unauditBill(request, response);
	}
}
