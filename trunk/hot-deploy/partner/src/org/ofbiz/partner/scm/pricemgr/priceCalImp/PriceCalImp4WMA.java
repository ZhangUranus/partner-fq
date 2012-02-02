package org.ofbiz.partner.scm.pricemgr.priceCalImp;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.DelegatorFactory;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.sql.EntityViewPlan;
import org.ofbiz.partner.scm.pricemgr.IPriceCal;
import org.ofbiz.partner.scm.pricemgr.PriceCalItem;
import org.ofbiz.partner.scm.pricemgr.Utils;

/**
 * 移动加权平均法实现类
 * @author Mark
 *
 */
public class PriceCalImp4WMA implements IPriceCal{
	private static final String module=org.ofbiz.partner.scm.pricemgr.priceCalImp.PriceCalImp4WMA.class.getName();
	
	Delegator delegator=null;
	public PriceCalImp4WMA(){
		delegator=org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
		if(delegator==null){
			Debug.logError("Delegator init error!!!", module);
		}
	}
	/**
	 * 根据移动加权平均法计算单价
	 */
	public BigDecimal calPrice(PriceCalItem item) throws Exception {
		Debug.logInfo("开始更新库存余额表:", module);
		String mpk=item.getMaterialId();//获取物料id
		if(mpk==null||mpk.length()<1){
			throw new Exception("物料id为空");
		}
		
		//记录计算的信息
		StringBuffer strbuf=new StringBuffer();
		strbuf.append("物料id:").append(item.getMaterialId());
		strbuf.append(";数量：").append(item.getAmount()); 
		strbuf.append(";金额：").append(item.getSum());
		Debug.logInfo(strbuf.toString(),module);
		
		
		//取库存余额表
		List<GenericValue> curValueList=delegator.findByAnd("CurMaterialBalance", UtilMisc.toMap("warehouseId",item.getWarehouseId(),"materialId", item.getMaterialId()));
		GenericValue curValue=null;
		if(curValueList!=null&&curValueList.size()>0){
			//取第一条匹配记录
			curValue=curValueList.get(0);
			Debug.logInfo("计算前物料数量单价"+curValue.getString("volume")+";"+curValue.getString("sum"),module);
			BigDecimal amount=item.getAmount()==null?BigDecimal.ZERO:item.getAmount();//数量
			BigDecimal sum=item.getSum()==null?BigDecimal.ZERO:item.getSum();//金额
			
			BigDecimal curAmount=curValue.getBigDecimal("volume");//当前数量
			BigDecimal curSum=curValue.getBigDecimal("sum");//当前金额
			
			curValue.set("volume", curAmount.add(amount));
			curValue.set("sum", curSum.add(sum));
			
			delegator.store(curValue);//更新当前库存表
			
			BigDecimal result=curValue.getBigDecimal("sum").divide(curValue.getBigDecimal("volume"), 4, BigDecimal.ROUND_HALF_UP); 
			return result;
		}else{
			Debug.logInfo("库存余额表不存在物料"+item.getMaterialId()+"，添加该物料记录！", module);
			//如果库存余额表没有改物料，则新增
			curValue=delegator.makeValue("CurMaterialBalance");
			//获取当前系统操作年月
			Date curDate=Utils.getCurDate();
			curValue.set("year", curDate.getYear());
			curValue.set("month",curDate.getMonth());
			curValue.set("warehouseId", item.getWarehouseId());
			curValue.set("materialId", item.getMaterialId());
			curValue.set("beginvolume", BigDecimal.ZERO);
			curValue.set("beginsum", BigDecimal.ZERO);
			curValue.set("volume", item.getAmount());
			curValue.set("sum", item.getSum());
			return item.getSum().divide(item.getAmount(), 4, BigDecimal.ROUND_HALF_UP);
		}
	}
	
}
