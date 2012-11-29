package org.ofbiz.partner.scm.pojo;

import java.math.BigDecimal;

/**
 * 该类用于耗料库存情况
 * @author Jeff
 *
 */
public class WorkshopStock{
	private String workshopId;	//物料ID
	private String number;		//物料编码
	private String materialId;	//物料ID
	private BigDecimal volume;	//车间库存数量
	private BigDecimal needVolume;	//需要耗料
	private boolean isEnough;		//物料是否足够 
	public WorkshopStock(String workshopId, String number,String materialId,BigDecimal volume,BigDecimal needVolume,Boolean isEnough) {
		super();
		this.workshopId = workshopId;
		this.number = number;
		this.materialId = materialId;
		this.volume=volume;
		this.needVolume=needVolume;
		this.isEnough=isEnough;
	}
	
	public String getWorkshopId() {
		return workshopId;
	}
	public void setWorkshopId(String workshopId) {
		this.workshopId = workshopId;
	}
	public String getNumber() {
		return number;
	}
	public void setNumber(String number) {
		this.number = number;
	}
	public String getMaterialId() {
		return materialId;
	}
	public void setMaterialId(String materialId) {
		this.materialId = materialId;
	}
	public BigDecimal getVolume() {
		return volume;
	}
	public void setVolume(BigDecimal volume) {
		this.volume = volume;
	}
	public BigDecimal getNeedVolume() {
		return needVolume;
	}
	public void setNeedVolume(BigDecimal needVolume) {
		this.needVolume = needVolume;
	}
	public boolean getIsEnough() {
		return isEnough;
	}
	public void setIsEnough(boolean isEnough) {
		this.isEnough = isEnough;
	}
	public String toJsonString(){
		return "{'workshopId':'"+workshopId+"','number':'"+number+"','materialId':'"+materialId+"','volume':"+volume+",'needVolume':"+needVolume+",'isEnough':"+isEnough+"}";
	}
}
