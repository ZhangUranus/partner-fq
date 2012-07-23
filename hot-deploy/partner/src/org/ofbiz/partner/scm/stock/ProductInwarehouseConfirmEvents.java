package org.ofbiz.partner.scm.stock;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.ofbiz.base.util.Debug;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.transaction.GenericTransactionException;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.common.SerialNumberHelper;

import sun.net.www.content.text.Generic;


/**
 * 成品进仓确认 业务处理事件
 * @author mark
 *
 */
public class ProductInwarehouseConfirmEvents {
	private static final String module = ProductInwarehouseConfirmEvents.class.getName();
	
	/**
	 * 成品进仓单确认提交 ,生成成品进仓单，并提交
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String submitBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();
			/*1. 校验数据合法性*/
			
			
			/*2. 生成成品进仓单*/
			
			/*2.1 新建成品进仓单据头*/
			GenericValue billHead=delegator.makeValue("ProductInwarehouse");
			String billId=UUID.randomUUID().toString();
			billHead.setString("id", billId);
			billHead.setString("number", new SerialNumberHelper().getSerialNumber(request, "ProductInwarehouse"));
			billHead.set("bizDate", new Date());
			billHead.set("inspectorSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
			billHead.set("status", "0");//保存状态
			
			
			JSONArray entrys=JSONArray.fromObject(request.getParameter("records"));
			
			/*2.2 构建单据分录*/
			if(entrys==null||entrys.size()<1)throw new Exception("进仓确认记录出错");
			
			for (Object obj : entrys) {
				JSONObject entry=(JSONObject) obj;
				String entryId=UUID.randomUUID().toString();
				String materialId=entry.getString("materialMaterialId");
				if(materialId==null)throw new Exception("物料为空！");
				
				String workshopId=entry.getString("workshopWorkshopId");
				if(workshopId==null)throw new Exception("车间为空！");
				
				String warehouseId=entry.getString("warehouseWarehouseId");
				if(warehouseId==null)throw new Exception("仓库为空！");
				
				String unitId=entry.getString("unitUnitId");
				if(unitId==null)throw new Exception("物料计量单位为空！");
				
				BigDecimal volume=new BigDecimal(entry.getString("volume"));
				
				String barcode1=entry.getString("barcode1");
				if(barcode1==null)throw new Exception("条码1为空！");
				
				String barcode2=entry.getString("barcode2");
				if(barcode2==null)throw new Exception("条码2为空！");
				
				String inwarehouseType=entry.getString("inwarehouseType");
				if(inwarehouseType==null)throw new Exception("进仓类型为空！");
				
				
				//新分录
				GenericValue ev=delegator.makeValue("ProductInwarehouseEntry");
				ev.setString("id", entryId);
				ev.setString("parentId", billId);
				ev.setString("workshopWorkshopId", workshopId);
				ev.setString("warehouseWarehouseId", warehouseId);
				ev.setString("materialMaterialId", materialId);
				ev.setString("unitUnitId", unitId);
				ev.set("volume", volume);
				ev.setString("barcode1", barcode1);
				ev.setString("barcode2", barcode2);
				ev.setString("inwarehouseType", inwarehouseType);
				delegator.create(ev);
				
				
				//是否定义明细耗料
				List<GenericValue> consumeMateiralList=delegator.findByAnd("ProductInwarehouseConfirmDetail", "parentId",entry.getString("id"));
				if(consumeMateiralList!=null&&consumeMateiralList.size()>0){
					//复制明细耗料
					for(GenericValue v:consumeMateiralList){
						GenericValue cm=delegator.makeValue("ProductInwarehouseEntryDetail");
						cm.setString("id", UUID.randomUUID().toString());
						cm.setString("parentId",entryId);
						cm.setString("materialId", v.getString("materialId"));
						cm.setString("model", v.getString("model"));
						cm.set("quantity", v.get("quantity"));
						cm.setString("unitUnitId", v.getString("unitUnitId"));
						delegator.create(cm);
					}
				}
			}
			
			delegator.create(billHead);
			
			
			/*3. 提交成品进仓单*/
			
			
			/*4. 修改成品进仓单确认单状态*/
			
			
			TransactionUtil.commit(beganTransaction);
		} catch (Exception e) {
			Debug.logError(e, module);
			try {
				TransactionUtil.rollback(beganTransaction, e.getMessage(), e);
			} catch (GenericTransactionException e2) {
				Debug.logError(e2, "Unable to rollback transaction", module);
			}
			throw e;
		}
		return "success";
	}
	
	/**
	 * 成品进仓单确认撤销
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String rollbackBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		return "success";
	}
	
	/**
	 * 成品进仓，同步记录，从第三方数据库同步记录
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String synchronizeRecords(HttpServletRequest request, HttpServletResponse response) throws Exception {
		return "success";
	}
	
}
