package org.ofbiz.partner.scm.stock;

import java.util.List;
import java.util.UUID;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.common.Utils;

/**
 * 维护成品库存板的编码，提供该表操作接口
 * 
 * @author jeff 2012-9-17
 * 
 */
public class BillCurrentJobMgr {
	private static final String module = org.ofbiz.partner.scm.stock.BillCurrentJobMgr.class.getName();

	private BillCurrentJobMgr() {
	}

	private static BillCurrentJobMgr instance;

	public static BillCurrentJobMgr getInstance() {
		if (instance == null) {
			instance = new BillCurrentJobMgr();
		}
		return instance;
	}

	/**
	 * 更新当前运行单据任务列表
	 * 保证同一时间同一单据只有一条任务存在
	 * 
	 * @param number
	 *            单据编码
	 * @param isOut
	 *            是否为出库 
	 * @param isCancel
	 *            是否是撤销单据
	 * @param isFinish
	 * 			任务是否已经完成，如果完成，删除记录
	 * @throws Exception
	 * @author jeff 2014-11-08
	 * 
	 * 
	 */
	public synchronized boolean update(String number,boolean isOut ,boolean isCancel, boolean isFinish) throws Exception {
		
		Delegator delegator = Utils.getDefaultDelegator();

		/* 1. 查询当前单据是否存在运行中的任务 */
		List<GenericValue> currentJobList = delegator.findByAnd("TBillCurrentJob", UtilMisc.toMap("number", number));
		if(currentJobList!=null && currentJobList.size()>0){
			if(isFinish){
				delegator.removeValue(currentJobList.get(0));
				Debug.log("删除运行单据任务：" + number + "。", module);
				return true;
			} else {
				throw new Exception("当前单据存在运行中的任务，请确认是否有其他用户正在进行相同的操作！");
			}
		} else {
			if(isFinish){
				throw new Exception("当前单据未找到运行中的任务，请联系管理员！");
			} else {
				
				GenericValue record = delegator.makeValue("TBillCurrentJob");
				record.set("id", UUID.randomUUID().toString());
				record.set("number", number);
				record.set("isOut", isOut?"1":"0");
				
				record.set("isCancel", isCancel?"1":"0");
				delegator.create(record);
				Debug.log("增加运行单据任务：" + number + "。", module);
				return true;
			}
		}
	}
}
