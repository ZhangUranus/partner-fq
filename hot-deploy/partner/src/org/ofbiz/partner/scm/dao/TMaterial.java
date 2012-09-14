package org.ofbiz.partner.scm.dao;

import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.DelegatorFactory;
import org.ofbiz.entity.GenericValue;

public class TMaterial {
	private GenericValue material = null;
	public TMaterial (String materialId) throws Exception{
		Delegator delegator = DelegatorFactory.getDelegator("default");
		material = delegator.findOne("TMaterial", UtilMisc.toMap("id", materialId), false);
		if(material == null){
			throw new Exception("非有效物料编码，请重新检查！");
		}
	}
	
	public String getNumber(){
		return material.getString("number");
	}
	public String getName(){
		return material.getString("name");
	}
	public String getPrice(){
		return material.getString("defaultPrice");
	}
	public String getSupplierId(){
		return material.getString("defaultSupplierId");
	}
	public String getStock(){
		return material.getString("safeStock");
	}
	public String getModel(){
		return material.getString("model");
	}
	public String getUnitId(){
		return material.getString("defaultUnitId");
	}
	public String getTypeId(){
		return material.getString("materialTypeId");
	}
}
