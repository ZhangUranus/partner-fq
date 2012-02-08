package org.ofbiz.partner.scm.stock;

import java.math.BigDecimal;
import java.math.RoundingMode;
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
import org.ofbiz.partner.scm.pricemgr.ConsignPriceMgr;
import org.ofbiz.partner.scm.pricemgr.PriceCalItem;
import org.ofbiz.partner.scm.pricemgr.PriceMgr;
import org.ofbiz.partner.scm.pricemgr.Utils;
import org.ofbiz.partner.scm.purplan.PurPlanBalance;

/**
 * 验收单业务事件类
 * @author Mark
 *
 */
public class ConsignDrawMaterialEvents {
	private static final String module=org.ofbiz.partner.scm.stock.ConsignDrawMaterialEvents.class.getName();
	
	/**
	 * 委外领料提交
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
					Debug.log("出库单审核:"+billId, module);
					GenericValue  billHead=delegator.findOne("ConsignDrawMaterial", UtilMisc.toMap("id", billId), false);
					if(billHead==null&&billHead.get("bizDate")==null){
						throw new Exception("can`t find PurchaseWarehousing bill or bizdate is null");
					}
					
					//注意不能使用billHead.getDate方法，出产生castException异常
					Date bizDate=(Date) billHead.get("bizDate");
					if(bizDate==null||!Utils.isCurPeriod(bizDate)){
						throw new Exception("单据业务日期不在当前系统期间");
					}
					//供应商id
					String processorId=billHead.getString("processorSupplierId");
					if(processorId==null&&processorId.length()<1){
						throw new Exception("委外领料单加工商为空！！！");
					}
					
					//获取单据id分录条目
					List<GenericValue> entryList=delegator.findByAnd("ConsignDrawMaterialEntry", UtilMisc.toMap("parentId", billId));
					
					BigDecimal totalSum = BigDecimal.ZERO;
					for(GenericValue v:entryList){
						String warehouseId=v.getString("warehouseWarehouseId");//仓库id
						String materialId=v.getString("materialMaterialId");//物料id
						BigDecimal volume=v.getBigDecimal("volume").negate();//数量
						BigDecimal price = null;	//物料单价
						BigDecimal sum = null;	//物料金额
						Debug.log("采购退货单价计算:物料id"+materialId+";数量"+volume+";", module);
						
						GenericValue value = PriceMgr.getInstance().getCurMaterialBalanceValue(warehouseId, materialId);
						if(value==null){
							price = BigDecimal.ZERO;
						}else{
							price = value.getBigDecimal("totalSum").divide(value.getBigDecimal("volume"),4,RoundingMode.HALF_UP);
						}
						sum = price.multiply(volume);
						
						//构建计算条目
						PriceCalItem item=new PriceCalItem(bizDate,warehouseId,materialId,volume,sum,BillType.ConsignDrawMaterial,billId,true);
						price = PriceMgr.getInstance().calPrice(item);
						
						v.set("price", price);
						
						//更新加工商库存表
						ConsignPriceMgr.getInstance().update(processorId, materialId, volume.negate(), sum.negate());
						
						totalSum = totalSum.add(sum.negate());
						v.set("entrysum", sum.negate());
						v.store();
					}
					billHead.set("totalsum", totalSum);
					billHead.store();
					
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
	 * 委外领料单撤销
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
					Debug.log("出库单撤销:"+billId, module);
					GenericValue  billHead=delegator.findOne("ConsignDrawMaterial", UtilMisc.toMap("id", billId), false);
					if(billHead==null&&billHead.get("bizDate")==null){
						throw new Exception("can`t find PurchaseWarehousing bill or bizdate is null");
					}
					
					//注意不能使用billHead.getDate方法，出产生castException异常
					Date bizDate=(Date) billHead.get("bizDate");
					if(bizDate==null||!Utils.isCurPeriod(bizDate)){
						throw new Exception("单据业务日期不在当前系统期间");
					}
					//供应商id
					String processorId=billHead.getString("processorSupplierId");
					if(processorId==null&&processorId.length()<1){
						throw new Exception("委外领料单加工商为空！！！");
					}
					//获取单据id分录条目
					List<GenericValue> entryList=delegator.findByAnd("ConsignDrawMaterialEntry", UtilMisc.toMap("parentId", billId));
					
					for(GenericValue v:entryList){
						String warehouseId=v.getString("warehouseWarehouseId");//仓库id
						String materialId=v.getString("materialMaterialId");//物料id
						BigDecimal  volume=v.getBigDecimal("volume");//数量
						BigDecimal  sum =v.getBigDecimal("entrysum");//金额
						Debug.log("撤销采购退货单价计算:物料id"+materialId+";数量"+volume+";金额"+sum, module);
						
						
						//构建计算条目
						PriceCalItem item=new PriceCalItem(bizDate,warehouseId,materialId,volume,sum,BillType.ConsignDrawMaterial,billId,false);
						PriceMgr.getInstance().calPrice(item);
						
						//更新加工商库存表
						ConsignPriceMgr.getInstance().update(processorId, materialId, volume.negate(), sum.negate());
						
						v.set("price", BigDecimal.ZERO);
						v.set("entrysum", BigDecimal.ZERO);
						v.store();
					}
					billHead.set("totalsum", BigDecimal.ZERO);
					billHead.store();
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
