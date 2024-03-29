package org.ofbiz.partner.scm.pricemgr;

import java.math.BigDecimal;

public class ConsumeMaterial{
	private String materialId;
	private BigDecimal consumeQty;
	private BigDecimal price; //单价
	private String detailId;//辅助字段，该字段有值时表示耗料是手工定义的
	public ConsumeMaterial( String materialId,BigDecimal consumeQty,BigDecimal price,String detailId) {
		super();
		this.consumeQty = consumeQty;
		this.materialId = materialId;
		this.price=price;
		this.detailId=detailId;
	}
	public String getMaterialId() {
		return materialId;
	}
	public void setMaterialId(String materialId) {
		this.materialId = materialId;
	}
	public BigDecimal getConsumeQty() {
		return consumeQty;
	}
	public void setConsumeQty(BigDecimal consumeQty) {
		this.consumeQty = consumeQty;
	}
	public String getDetailId() {
		return detailId;
	}
	public void setDetailId(String detailId) {
		this.detailId = detailId;
	}
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal price) {
		this.price = price;
	}
	
	
}
