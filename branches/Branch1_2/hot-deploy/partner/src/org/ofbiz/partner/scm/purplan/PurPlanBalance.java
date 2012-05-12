package org.ofbiz.partner.scm.purplan;

import java.math.BigDecimal;

import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;


/**
 * 提供采购申请单查询供应商物料可入库余额
 * 提供余额表更新
 * 
 * 
 * @author Mark
 *
 */
public class PurPlanBalance {
	public static final String module = PurPlanBalance.class.getName();
	
	private Object updateLock=new Object();//余额表更新锁
	
	private static PurPlanBalance instance=null;
	private PurPlanBalance(){
		
	}
	public static PurPlanBalance getInstance(){
		if(instance==null){
			instance=new PurPlanBalance();
		}
		return instance;
	}
	
	/**
	 * 获取可以入库余额
	 * @param supplierId
	 * @param materialId
	 * @return
	 */
	public BigDecimal  getBalance(String supplierId,String materialId) throws Exception{
		if(supplierId==null||materialId==null){
			throw new Exception("supplierId or materialId is null");
		}
		//查找供应商可入库余额表
		Delegator delegator=org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
		GenericValue gv=delegator.findOne("PurPlanBalance", UtilMisc.toMap("supplierId", supplierId, "materialId", materialId), false);
		if(gv!=null){
			return gv.getBigDecimal("balance");
		}
		return null;
	}
	/**
	 * 更新供应商可入库余额表
	 * @param supplierId
	 * @param materialId
	 * @param volume
	 * @throws Exception
	 */
	public void updateInWarehouse(String supplierId,String materialId,BigDecimal volume) throws Exception{
		synchronized (updateLock) {
			if(supplierId==null||materialId==null||volume==null){
				throw new Exception("supplierId or materialId or volume  is null");
			}
			//查找供应商可入库余额表
			Delegator delegator=org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
			GenericValue gv=delegator.findOne("PurPlanBalance", UtilMisc.toMap("supplierId", supplierId, "materialId", materialId), false);
			if(gv!=null){
				BigDecimal balance=gv.getBigDecimal("balance");
				BigDecimal result=balance.add(volume);
				if(result.compareTo(BigDecimal.ZERO)<0){
					throw new Exception("供应商入库数量不能大于待验收数量，请重新输入！");
				}
				gv.set("balance", result);
				delegator.store(gv);
			}else{//新增记录
				gv=delegator.makeValue("PurPlanBalance");
				gv.set("supplierId", supplierId);
				gv.set("materialId", materialId);
				if(volume.compareTo(BigDecimal.ZERO)<0){
					throw new Exception("供应商入库数量不能大于待验收数量，请重新输入！");
				}
				gv.set("balance", volume);
				delegator.create(gv);
			}
		}
		
	}
}
