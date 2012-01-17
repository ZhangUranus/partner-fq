package org.ofbiz.partner.scm.pricemgr;

import java.util.Date;

/**
 * 单价管理类
 * @author Mark
 *
 */
public class PriceMgr {
	private static final String module=org.ofbiz.partner.scm.pricemgr.PriceMgr.class.getName();
	private int year ,month ;//当期年月
	//单实例模式
	private static PriceMgr instance=null;
	public static PriceMgr getInstance(){
		if(instance==null){
			instance=new PriceMgr();
		}
		return instance;
	}
	private PriceMgr(){
		//获取当前系统操作年月
		Date curDate=Utils.getCurDate();
		year=curDate.getYear();
		month=curDate.getMonth();
	}
	/**
	 * 计算单价 更新存货余额表
	 * @throws Exception
	 */
	public synchronized void calPrice(PriceCalItem item) throws Exception{
		
	}
}
