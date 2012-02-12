package org.ofbiz.partner.scm.pricemgr;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Calendar;

import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;

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
				return gv.getBigDecimal("totalsum").divide(gv.getBigDecimal("volume"), 4, RoundingMode.HALF_UP);
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
				BigDecimal oldVolume=gv.getBigDecimal("volume");
				BigDecimal oldSum=gv.getBigDecimal("totalsum");
				gv.set("volume", oldVolume.add(volume));
				gv.set("totalsum", oldSum.add(totalsum));
				delegator.store(gv);
			}else{//新增记录
				//取上一个月库存信息
				GenericValue preMonthValue=delegator.findOne("HisProductPrice", UtilMisc.toMap("year", Utils.getYearOfPreMonth(year, month), "month", Utils.getMonthOfPreMonth(year, month), "customerId", customerId, "materialId", materialId), false);
				BigDecimal beginVolume=BigDecimal.ZERO;//月初数量
				BigDecimal beginSum=BigDecimal.ZERO;//月初金额
				if(preMonthValue!=null){
					beginVolume=preMonthValue.getBigDecimal("beginVolume").add(preMonthValue.getBigDecimal("volume"));
					beginSum=preMonthValue.getBigDecimal("beginsum").add(preMonthValue.getBigDecimal("totalSum"));
				}
				gv=delegator.makeValue("CurProductPrice");
				gv.set("customerId", customerId);
				gv.set("materialId", materialId);
				gv.set("beginvolume", beginVolume);
				gv.set("beginsum", beginSum);
				gv.set("volume", volume);
				gv.set("totalsum", totalsum);
				delegator.create(gv);
			}
		}
		
	}
}
