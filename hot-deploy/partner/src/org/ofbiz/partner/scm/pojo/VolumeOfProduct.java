package org.ofbiz.partner.scm.pojo;

import java.math.BigDecimal;

/**
 * 该类用于保存加工件入库数量
 * @author Jeff
 *
 */
public class VolumeOfProduct{
	private String workshopId;		//物料编码
	private String materialId;		//物料编码
	private BigDecimal volume;	//数量
	public VolumeOfProduct(String workshopId, String materialId,BigDecimal volume) {
		super();
		this.workshopId = workshopId;
		this.materialId = materialId;
		this.volume=volume;
	}
	public String getWorkshopId() {
		return workshopId;
	}
	public void setWorkshopId(String workshopId) {
		this.workshopId = workshopId;
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
}
