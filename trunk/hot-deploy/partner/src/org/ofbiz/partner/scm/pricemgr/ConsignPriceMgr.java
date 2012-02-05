package org.ofbiz.partner.scm.pricemgr;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;

/**
 * 委外单价管理类
 * @author Mark
 *
 */
public class ConsignPriceMgr {
public static final String module = ConsignPriceMgr.class.getName();
	
	private Object updateLock=new Object();//余额表更新锁
	
	private static ConsignPriceMgr instance=null;
	private ConsignPriceMgr(){
		
	}
	public static ConsignPriceMgr getInstance(){
		if(instance==null){
			instance=new ConsignPriceMgr();
		}
		return instance;
	}
	
	/**
	 * 获取当前单价
	 * @param supplierId 加工商id
	 * @param materialId 物料id
	 * @return
	 */
	public BigDecimal  getPrice(String supplierId,String materialId) throws Exception{
		if(supplierId==null||materialId==null){
			throw new Exception("supplierId or materialId is null");
		}
		//查找加工商物料入库单价
		Delegator delegator=org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
		GenericValue gv=delegator.findOne("ConsignPrice", UtilMisc.toMap("supplierId", supplierId, "materialId", materialId), false);
		if(gv!=null){
			return gv.getBigDecimal("totalsum").divide(gv.getBigDecimal("volume"), 4, RoundingMode.HALF_UP);
		}
		return null;
	}
	/**
	 * 更新累计金额数量
	 * @param supplierId
	 * @param materialId
	 * @param volume
	 * @param totalsum
	 * @throws Exception
	 */
	public void update(String supplierId,String materialId,BigDecimal volume,BigDecimal totalsum) throws Exception{
		synchronized (updateLock) {
			if(supplierId==null||materialId==null||volume==null||totalsum==null){
				throw new Exception("supplierId or materialId or volume or totalsum  is null");
			}
			//查找供应商可入库余额表
			Delegator delegator=org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
			GenericValue gv=delegator.findOne("ConsignPrice", UtilMisc.toMap("supplierId", supplierId, "materialId", materialId), false);
			if(gv!=null){
				BigDecimal oldVolume=gv.getBigDecimal("volume");
				BigDecimal oldSum=gv.getBigDecimal("totalsum");
				gv.set("volume", oldVolume.add(volume));
				gv.set("totalsum", oldSum.add(totalsum));
				delegator.store(gv);
			}else{//新增记录
				gv=delegator.makeValue("ConsignPrice");
				gv.set("supplierId", supplierId);
				gv.set("materialId", materialId);
				gv.set("volume", volume);
				gv.set("totalsum", totalsum);
				delegator.create(gv);
			}
		}
		
	}
}
