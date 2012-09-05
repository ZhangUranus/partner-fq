package org.ofbiz.partner.scm.pricemgr;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Calendar;

import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.dao.TMaterial;

/**
 * 成品单价管理类
 * @author Mark
 *
 */
public class ProductPriceMgr {
public static final String module = ProductPriceMgr.class.getName();
	
	private Object updateLock=new Object();//余额表更新锁
	private int year, month;// 当期年月
	private static ProductPriceMgr instance=null;
	private ProductPriceMgr(){
		refreshPeriod();
	}
	public void refreshPeriod(){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(Utils.getCurDate());
		year = calendar.get(Calendar.YEAR);
		month = calendar.get(Calendar.MONTH)+1;
	}
	
	public static ProductPriceMgr getInstance(){
		if(instance==null){
			instance=new ProductPriceMgr();
		}
		return instance;
	}
	
	/**
	 * 获取当前单价
	 * @param workshopId 车间id
	 * @param materialId 物料id
	 * @return
	 * 说明：出库时，单价计算时使用舍弃法取小数点六位（防止出库后，金额为负数情况）
	 */
	public BigDecimal  getPrice(String workshopId,String materialId) throws Exception{
		if(workshopId==null||materialId==null){
			throw new Exception("workshopId or materialId is null");
		}
		
		Delegator delegator=org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
		GenericValue gv=delegator.findOne("CurProductPrice", UtilMisc.toMap("workshopId", workshopId, "materialId", materialId), false);
		if(gv!=null){
			if(gv.getBigDecimal("volume").compareTo(BigDecimal.ZERO) == 0){
				return BigDecimal.ZERO;
			}else{
				return gv.getBigDecimal("totalsum").divide(gv.getBigDecimal("volume"), 6, RoundingMode.DOWN);
			}
		}
		return BigDecimal.ZERO;
	}
	/**
	 * 更新累计金额数量
	 * @param workshopId
	 * @param materialId
	 * @param volume
	 * @param totalsum
	 * @throws Exception
	 */
	public void update(String customerId,String materialId,BigDecimal volume,BigDecimal totalsum) throws Exception{
		synchronized (updateLock) {
			if(customerId==null||materialId==null||volume==null||totalsum==null){
				throw new Exception("customerId or materialId or volume or totalsum  is null");
			}
			Delegator delegator=org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
			GenericValue gv=delegator.findOne("CurProductPrice", UtilMisc.toMap("customerId", customerId, "materialId", materialId), false);
			if(gv!=null){
				BigDecimal oldVolume = BigDecimal.ZERO;
				if(gv.getBigDecimal("volume") != null){
					oldVolume = gv.getBigDecimal("volume");
				}
				BigDecimal oldSum = BigDecimal.ZERO;
				if(gv.getBigDecimal("totalsum") != null){
					oldSum = gv.getBigDecimal("totalsum");
				}
				BigDecimal curAmount = oldVolume.add(volume);
				gv.set("volume", curAmount);
				BigDecimal curSum = oldSum.add(totalsum);
				gv.set("totalsum", curSum);
				if (curAmount.compareTo(BigDecimal.ZERO) < 0 || curSum.compareTo(BigDecimal.ZERO) < 0) {
					throwExceptionOfMaterialNotEnough(materialId);
				}
				delegator.store(gv);
			}else{//新增记录
				if (volume.compareTo(BigDecimal.ZERO) < 0 || totalsum.compareTo(BigDecimal.ZERO) < 0) {
					throwExceptionOfMaterialNotEnough(materialId);
				}
				BigDecimal beginVolume=BigDecimal.ZERO;//月初数量
				BigDecimal beginSum=BigDecimal.ZERO;//月初金额
				gv=delegator.makeValue("CurProductPrice");
				gv.set("customerId", customerId);
				gv.set("materialId", materialId);
				gv.set("beginvolume", beginVolume);
				gv.set("beginsum", beginSum);
				gv.set("volume", volume);
				gv.set("totalsum",totalsum);
				delegator.create(gv);
			}
		}
	}
	
	/**
	 * 库存不足，抛出异常
	 * @param materialId
	 * @throws Exception
	 */
	private void throwExceptionOfMaterialNotEnough(String materialId) throws Exception {
		TMaterial material = new TMaterial(materialId);
		throw new Exception("仓库库存成品（名称："+material.getName()+"，编码："+material.getNumber()+"）数量小于出库数量/金额，请检查并调整出库数量/单价！");
	}
}
