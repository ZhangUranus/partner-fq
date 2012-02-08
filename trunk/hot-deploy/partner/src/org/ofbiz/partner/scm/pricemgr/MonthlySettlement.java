package org.ofbiz.partner.scm.pricemgr;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.base.util.Debug;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.transaction.GenericTransactionException;
import org.ofbiz.entity.transaction.TransactionUtil;

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
		//获取当前系统操作年月
		//获取当前系统操作年月
		Date curDate=Utils.getCurDate();
		Calendar   cal   =   Calendar.getInstance();
		cal.setTime(curDate);
		year=cal.get(Calendar.YEAR);
		month=cal.get(Calendar.MONTH)+1;
	}
	
	/**
	 * 判断是否满足月结前所有条件，能够进行月度结算操作
	 * @return
	 */
	private void checkCanSettle() throws Exception{
		//TODO 判断是否
	}
	
	/**
	 * 锁住系统，用户不能进行编辑系统单据
	 * @return
	 */
	private void lockSystem() throws Exception{
		//TODO 锁住系统
		
		throw new Exception("not supported");
		 
	}
	/**
	 * 释放系统，用户可以进行编辑系统单据
	 * @return
	 */
	private void unlockSystem() throws Exception{
		//TODO 释放系统
		throw new Exception("not supported");
	}
	/**
	 * 结算当月，计算所有物料出库单价
	 * 当月操作年月设置为一下月
	 * @param response 
	 * @param request 
	 * @return
	 * @throws Exception
	 */
	public synchronized boolean monthlySettle(HttpServletRequest request, HttpServletResponse response) throws Exception{
		//TODO 结算当期
		boolean beganTransaction = false;
		try {
	            beganTransaction = TransactionUtil.begin();
	            
	            //锁住系统
	            lockSystem();
	            
	            
	            //获取系统本期所有业务单据，按提交时间升序排序
//	            List<PriceCalItem> seqCalItem=getSeqCalItem();
	            
	            
	            //按业务日期
//	            processCalItem(seqCalItem);
	            
	            
	            
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
		
		
		//获取业务单据分录信息
		
		//采购入库单
		
		//采购退货
		
		//委外领料
		
		//委外退料
		
		//委外入库  合并加工费
		
		//委外退库
		
		//车间领料
		
		//车间退料
		
		//车间入库 
		
		//车间退库
		
		
		
		/*对分录根据时间排序 ，对分录安装时间顺序进行单价计算处理*/
		
		//计算成功后，更新当前操作期间为下一个月份
		
		return false;
	}
	
	/**
	 * 反结算当期，如果当期有审核的单据，则不能反结算
	 * 当月操作年月设置为前一个月
	 * @param response 
	 * @param request 
	 * @return
	 * @throws Exception
	 */
	public synchronized boolean rollbackSettle(HttpServletRequest request, HttpServletResponse response) throws Exception{
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
