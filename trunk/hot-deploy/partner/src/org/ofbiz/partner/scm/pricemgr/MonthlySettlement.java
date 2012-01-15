package org.ofbiz.partner.scm.pricemgr;

import org.ofbiz.entity.Delegator;

/**
 * 月结类
 * 提供系统月度结算功能，根据业务发生日期时间顺序，计算物料单价
 * 物料有两大类：独立需求物料、关联物料;关联物料的单价是根据bom单计算，通过得到其它物料的单价相加
 * @author Mark
 *
 */
public class MonthlySettlement {
	private static final String module=org.ofbiz.partner.scm.pricemgr.MonthlySettlement.class.getName();
	private int year;//结算年度
	private int month;//结算月份
	//单实例模式
	private static MonthlySettlement instance=null;
	public static MonthlySettlement getInstance(){
		if(instance==null){
			instance=new MonthlySettlement();
		}
		return instance;
	}
	private MonthlySettlement(){
		//获取当前系统操作年月，设置为结算年月
	}
	
	/**
	 * 判断是否能够进行月度结算操作
	 * @return
	 */
	private boolean canRun() {
		return false ;
	}
	
	/**
	 * 锁住系统，用户不能进行编辑系统单据
	 * @return
	 */
	public boolean lockSystem() throws Exception{
		//TODO 锁住系统
		return false; 
	}
	
	/**
	 * 结算当月，计算所有物料出库单价
	 * 当月操作年月设置为一下月
	 * @return
	 * @throws Exception
	 */
	public boolean runCalculate() throws Exception{
		//TODO 结算当期
		return false;
	}
	
	/**
	 * 反结算当期，如果当期有审核的单据，则不能反结算
	 * 当月操作年月设置为前一个月
	 * @return
	 * @throws Exception
	 */
	public boolean rollBack() throws Exception{
		//TODO 反结算当期
		return false;
	}
	public int getYear() {
		return year;
	}
	public void setYear(int year) {
		this.year = year;
	}
	
	public int getMonth() {
		return month;
	}
	public void setMonth(int month) {
		this.month = month;
	}
	
	
}
