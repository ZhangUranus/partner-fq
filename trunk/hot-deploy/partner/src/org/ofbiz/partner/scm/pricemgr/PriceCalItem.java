package org.ofbiz.partner.scm.pricemgr;

import java.math.BigDecimal;

/**
 * 每次单价计算信息类，保存需要计算的物料数量、金额
 * @author Mark
 *
 */
public class PriceCalItem {
	private String materialId=null;//物料id
	private BigDecimal amount=null;//数量
	private BigDecimal sum=null;//金额
	private BillType billType=null;//单据类型
	
	public PriceCalItem(String materialId, BigDecimal amount, BigDecimal sum,
			BillType billType) {
		super();
		this.materialId = materialId;
		this.amount = amount;
		this.sum = sum;
		this.billType = billType;
	}
	
}
