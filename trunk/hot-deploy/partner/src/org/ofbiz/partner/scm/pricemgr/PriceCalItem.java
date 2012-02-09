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
	private String billEntryId=null;
	private boolean isOut=false;//是否出库操作
	private String extendParam = null;//扩展参数，不需要用到可以传null值
	public PriceCalItem(Date biz,String warehouseId,String materialId, BigDecimal amount, BigDecimal sum,
			BillType billType,String billEntryId,boolean isOut,String extendParam) {
		super();
		this.bizTime=biz;
		this.warehouseId = warehouseId;
		this.materialId = materialId;
		this.amount = amount;
		this.sum = sum;
		this.billType = billType;
		this.billEntryId=billEntryId;
		this.isOut=isOut;
		this.extendParam = extendParam;
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
	public String getBillEntryId() {
		return billEntryId;
	}
	public String getWarehouseId() {
		return warehouseId;
	}
	public boolean isOut() {
		return isOut;
	}
	public String getExtendParam() {
		return extendParam;
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
	public void setBillEntryId(String billEntryId) {
		this.billEntryId = billEntryId;
	}
	public void setOut(boolean isOut) {
		this.isOut = isOut;
	}
	public void setExtendParam(String extendParam) {
		this.extendParam = extendParam;
	}
	
	
}
