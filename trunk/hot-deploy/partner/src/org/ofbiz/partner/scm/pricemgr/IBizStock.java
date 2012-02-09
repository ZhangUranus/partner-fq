package org.ofbiz.partner.scm.pricemgr;

import org.ofbiz.entity.GenericValue;

/**
 * 业务单据提交、撤销业务处理接口
 * 例如一些单价反写、加工费用分摊处理、物料单价明细记录
 * 月结重算回调用该接口进行重算
 * 
 * @author mark
 *
 */
public interface IBizStock {
	/**
	 * 
	 * @param calItem
	 * @throws Exception
	 */
	public void updateStock(GenericValue billValue, boolean isOut) throws Exception;
}
