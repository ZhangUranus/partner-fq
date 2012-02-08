package org.ofbiz.partner.scm.pricemgr;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 每次单价计算信息类，保存需要计算的物料数量、金额
 * @author Mark
 *
 */
public class PriceCalItem {
	private Date bizTime=null;//业务日期
	private String warehouseId=null;//仓库id
	private String materialId=null;//物料id
	private BigDecimal amount=null;//数量
	private BigDecimal sum=null;//金额
	private BillType billType=null;//单据类型
	private String billId=null;
	private boolean isOut=false;//是否出库操作
	public PriceCalItem(Date biz,String warehouseId,String materialId, BigDecimal amount, BigDecimal sum,
			BillType billType,String billId,boolean isOut) {
		super();
		this.bizTime=biz;
		this.warehouseId = warehouseId;
		this.materialId = materialId;
		this.amount = amount;
		this.sum = sum;
		this.billType = billType;
		this.billId=billId;
		this.isOut=isOut;
	}
	public Date getBizTime() {
		return bizTime;
	}
	public String getMaterialId() {
		return materialId;
	}
	public BigDecimal getAmount() {
		return amount;
	}
	public BigDecimal getSum() {
		return sum;
	}
	public BillType getBillType() {
		return billType;
	}
	public String getBillId() {
		return billId;
	}
	public String getWarehouseId() {
		return warehouseId;
	}
	public boolean isOut() {
		return isOut;
	}
	public void setBizTime(Date bizTime) {
		this.bizTime = bizTime;
	}
	public void setWarehouseId(String warehouseId) {
		this.warehouseId = warehouseId;
	}
	public void setMaterialId(String materialId) {
		this.materialId = materialId;
	}
	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
	public void setSum(BigDecimal sum) {
		this.sum = sum;
	}
	public void setBillType(BillType billType) {
		this.billType = billType;
	}
	public void setBillId(String billId) {
		this.billId = billId;
	}
	public void setOut(boolean isOut) {
		this.isOut = isOut;
	}
	
	
}
