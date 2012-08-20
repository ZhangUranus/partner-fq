package org.ofbiz.partner.scm.stock;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.transaction.GenericTransactionException;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.partner.scm.common.BillBaseEvent;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.common.SerialNumberHelper;
import org.ofbiz.partner.scm.pricemgr.BillType;
import org.ofbiz.partner.scm.pricemgr.BizStockImpFactory;
import org.ofbiz.partner.scm.services.ProductInwarehouseServices;



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
			
			/*2.2 构建成品进仓单据分录 更新相关联的成品进仓确认单 */
			if(entrys==null||entrys.size()<1)throw new Exception("进仓确认记录出错");
			
			for (Object obj : entrys) {
				JSONObject entry=(JSONObject) obj;
				/*检查单据是否可以提交*/
				GenericValue productConfirmV = delegator.findOne("ProductInwarehouseConfirm",false , "id",entry.getString("id"));
				if(productConfirmV==null)throw new Exception("数据库没找到对应的确认单，请刷新记录！");
				
				if("4".equals(productConfirmV.getString("status"))) throw new Exception("单据已经提交！");
				
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
				
				
				
				//新成品进仓单分录
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
				
				
				/* 修改成品进仓单确认单状态以及关联字段*/
				Map<String, Object> fs = new HashMap<String, Object>();
				fs.put("status", 4);// 设置为已提交状态
				fs.put("submitterSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
				fs.put("productInwarehouseId", billId);//关联的成品进仓单id
				fs.put("productInwarehouseEntryId", entryId);//关联的成品进仓单分录id
				fs.put("workshopWorkshopId", workshopId);//关联的成品进仓单车间
				fs.put("warehouseWarehouseId", warehouseId);//关联的成品进仓单仓库
				fs.put("inwarehouseType", inwarehouseType);//关联的成品进仓单进仓类型
				int rc=delegator.storeByCondition("ProductInwarehouseConfirm", fs, EntityCondition.makeConditionWhere("id='" + entry.getString("id") + "'"));
				if(1!=rc) throw new Exception("更新进仓确认单出错！");
				
				
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
			
			/*3. 提交成品进仓单 , 逻辑与ProductInwarehouseEvents submit 方法一致*/
			Date bizDate =null;
			if (delegator != null && billId != null) {
				Debug.log("成品入库单提交:" + billId, module);
				GenericValue productBillHead = delegator.findOne("ProductInwarehouse", UtilMisc.toMap("id", billId), false);

				if (productBillHead == null || productBillHead.get("bizDate") == null) {
					throw new Exception("can`t find ProductInwarehouse bill or bizdate is null");
				}
				//注意不能使用billHead.getDate方法，出产生castException异常
				bizDate= (Date) productBillHead.get("bizDate");
				
				BizStockImpFactory.getBizStockImp(BillType.ProductWarehouse).updateStock(productBillHead, false, false);

				// 更新状态字段
				Map<String, Object> fieldSet = new HashMap<String, Object>();
				fieldSet.put("status", 4);// 设置为已提交状态
				fieldSet.put("submitterSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
				fieldSet.put("submitStamp", new Timestamp(System.currentTimeMillis()));
				delegator.storeByCondition("ProductInwarehouse", fieldSet, EntityCondition.makeConditionWhere("id='" + billId + "'"));
				
			}
			
			//更新周汇总表
			// 获取单据分录条目
			List<GenericValue> entryList = delegator.findByAnd("ProductInwarehouseEntry", UtilMisc.toMap("parentId", billId));
			 
			for (GenericValue v : entryList) {
				String materialId = v.getString("materialMaterialId");// 打板物料id
				BigDecimal volume=v.getBigDecimal("volume");//入库数量（板）
				//成品进仓 
				WeeklyStockMgr.getInstance().updateStock(materialId, bizDate, ProductStockType.IN, volume, false);
			}
			
			//---------------------------------------------------------
			
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
		BillBaseEvent.writeSuccessMessageToExt(response, "提交成功");
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
		ProductInwarehouseServices.syncRecord();
		BillBaseEvent.writeSuccessMessageToExt(response, "同步完成");
		return "success";
	}
	
}