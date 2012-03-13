package org.ofbiz.partner.scm.pricemgr;

import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;

public class MaterialBomMgr {
	public static final String module = MaterialBomMgr.class.getName();
	
	private static MaterialBomMgr instance=null;
	
	public static MaterialBomMgr getInstance(){
		if(instance==null){
			instance=new MaterialBomMgr();
		}
		return instance;
	}
	
	/**
	 * 获取物料id
	 * @param bomId BOM单id
	 * @return
	 */
	public String getMaterialIdByBomId(String bomId) throws Exception{
		if( bomId == null ){
			throw new Exception("bomId is null");
		}
		
		Delegator delegator=org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
		GenericValue gv = delegator.findOne("MaterialBom", UtilMisc.toMap("id", bomId), false);
		if(gv == null){
			throw new Exception("无法找到编码为"+bomId+"的BOM单！");
		}
		return gv.getString("materialId");
	}
}
