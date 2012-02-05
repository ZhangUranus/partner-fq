package org.ofbiz.partner.scm.pricemgr;

import java.util.Calendar;
import java.util.Date;

/**
 * 单价管理类
 * @author Mark
 *
 */
public class PriceMgr {
	private static final String module=org.ofbiz.partner.scm.pricemgr.PriceMgr.class.getName();
	private int year ,month ;//当期年月
	private IPriceCal priceCal;
	//单实例模式
	private static PriceMgr instance=null;
	public static PriceMgr getInstance(){
		if(instance==null){
			instance=new PriceMgr();
		}
		return instance;
	}
	private PriceMgr(){
		refreshPeriod();
	}
	
	public void refreshPeriod(){
		//获取当前系统操作年月
		Date curDate=Utils.getCurDate();
		Calendar   cal   =   Calendar.getInstance();
		cal.setTime(curDate);
		year=cal.get(Calendar.YEAR);
		month=cal.get(Calendar.MONTH)+1;
		//初始化具体单价计算接口
		priceCal=PriceCalImpFactory.getPriceCalImp(PriceCalType.WeightedMovingAverage,year,month);
	}
	/**
	 * 计算单价 更新存货余额表
	 * @throws Exception
	 */
	public synchronized void calPrice(PriceCalItem item) throws Exception{
		if(priceCal!=null){
			priceCal.calPrice(item);
		}else{
			throw new Exception("单价计算类实现为空");
		}
	}
}
