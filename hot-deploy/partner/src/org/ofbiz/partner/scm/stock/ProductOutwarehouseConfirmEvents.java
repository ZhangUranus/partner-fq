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
import org.ofbiz.partner.scm.common.BarCode;
import org.ofbiz.partner.scm.common.BillBaseEvent;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.common.SerialNumberHelper;
import org.ofbiz.partner.scm.dao.TMaterial;
import org.ofbiz.partner.scm.pricemgr.BillType;
import org.ofbiz.partner.scm.pricemgr.BizStockImpFactory;
import org.ofbiz.partner.scm.pricemgr.Utils;
import org.ofbiz.partner.scm.services.SyncScanDataServices;



/**
 * 成品出仓确认 业务处理事件
 * @author mark
 *
 */
public class ProductOutwarehouseConfirmEvents {
	private static final String module = ProductOutwarehouseConfirmEvents.class.getName();
	
	/**
	 * 成品出仓单确认提交 ,生成成品进仓单，并提交
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
			
			/*2. 生成成品出仓单*/
			
			/*2.1 新建成品出仓单据头*/
			GenericValue billHead=delegator.makeValue("ProductOutwarehouse");
			String billId=UUID.randomUUID().toString();
			billHead.setString("id", billId);
			billHead.setString("number", new SerialNumberHelper().getSerialNumber(request, "ProductOutwarehouse"));
			billHead.set("bizDate", Utils.getCurDate());
			billHead.set("submitterSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
			billHead.set("status", "0");//保存状态
			
			
			JSONArray entrys=JSONArray.fromObject(request.getParameter("records"));
			
			/*2.2 构建成品出仓单据分录 更新相关联的成品出仓确认单 */
			if(entrys==null||entrys.size()<1)throw new Exception("出仓确认记录出错");
			
			int sort = 1;
			for (Object obj : entrys) {
				JSONObject entry=(JSONObject) obj;
				/*检查单据是否可以提交*/
				GenericValue productConfirmV = delegator.findOne("ProductOutwarehouseConfirm",false , "id",entry.getString("id"));
				if(productConfirmV==null)throw new Exception("数据库没找到对应的确认单，请刷新记录！");
				
				if("4".equals(productConfirmV.getString("status"))) throw new Exception("单据已经提交！");
				
				String entryId=UUID.randomUUID().toString();
				
				String prdWeek=entry.getString("prdWeek");
				if(prdWeek==null)throw new Exception("生产周为空！");
				
				String materialId=entry.getString("materialMaterialId");
				if(materialId==null)throw new Exception("物料为空！");
				
				String warehouseId=entry.getString("warehouseWarehouseId");
				if(warehouseId==null)throw new Exception("仓库为空！");
				
				String unitId=entry.getString("unitUnitId");
				if(unitId==null) unitId = "";
//				if(unitId==null)throw new Exception("物料计量单位为空！");
				
				BigDecimal volume=new BigDecimal(entry.getString("volume"));
				
				String barcode1=entry.getString("barcode1");
				if(barcode1==null)throw new Exception("产品条码为空！");
				
				String barcode2=entry.getString("barcode2");
				if(barcode2==null)throw new Exception("序列号为空！");
				
				String outwarehouseType=entry.getString("outwarehouseType");
				if(outwarehouseType==null)throw new Exception("出仓类型为空！");
				
				String workshopId=entry.getString("workshopWorkshopId");
				if(!"1".equals(outwarehouseType)){//正常出仓时，可以不需要车间
					if(workshopId==null)throw new Exception("车间为空！");
				} else {
					if(workshopId==null) workshopId = "";
				}
				
				BigDecimal qantity=new BigDecimal(entry.getString("qantity"));
				
				String goodNumber=entry.getString("goodNumber");
				if(goodNumber==null)throw new Exception("货号为空！");
				
				String destinhouseNumber=entry.getString("destinhouseNumber");
				if(destinhouseNumber==null)throw new Exception("订舱号为空！");
				
				//新成品出仓单分录
				GenericValue ev=delegator.makeValue("ProductOutwarehouseEntry");
				ev.setString("id", entryId);
				ev.setString("parentId", billId);
				ev.setString("prdWeek", prdWeek);
				ev.setString("workshopWorkshopId", workshopId);
				ev.setString("warehouseWarehouseId", warehouseId);
				ev.setString("materialMaterialId", materialId);
				ev.setString("unitUnitId", unitId);
				ev.set("volume", volume);
				ev.setString("barcode1", barcode1);
				ev.setString("barcode2", barcode2);
				ev.setString("outwarehouseType", outwarehouseType);
				ev.set("qantity", qantity);
				ev.setString("goodNumber", goodNumber);
				ev.setString("destinhouseNumber", destinhouseNumber);
				ev.set("sort", sort);
				delegator.create(ev);
				sort ++;
				
				/* 修改成品出仓单确认单状态以及关联字段*/
				Map<String, Object> fs = new HashMap<String, Object>();
				fs.put("status", 4);// 设置为已提交状态
				fs.put("submitterSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
				fs.put("productOutwarehouseId", billId);//关联的成品出仓单id
				fs.put("productOutwarehouseEntryId", entryId);//关联的成品出仓单分录id
				int rc=delegator.storeByCondition("ProductOutwarehouseConfirm", fs, EntityCondition.makeConditionWhere("id='" + entry.getString("id") + "'"));
				if(1!=rc) throw new Exception("更新出仓确认单出错！");
			}
			
			delegator.create(billHead);
			
			/*3. 提交成品出仓单 , 逻辑与ProductOutwarehouseEvents submit 方法一致*/
			Date bizDate =null;
			if (delegator != null && billId != null) {
				Debug.log("成品出仓单提交:" + billId, module);
				GenericValue productBillHead = delegator.findOne("ProductOutwarehouse", UtilMisc.toMap("id", billId), false);

				if (productBillHead == null || productBillHead.get("bizDate") == null) {
					throw new Exception("can`t find ProductOutwarehouse bill or bizdate is null");
				}
				//注意不能使用productBillHead.getDate方法，出产生castException异常
				bizDate= (Date) productBillHead.get("bizDate");

				BizStockImpFactory.getBizStockImp(BillType.ProductOutwarehouse).updateStock(productBillHead, true, false);
				
				// 更新状态字段
				Map<String, Object> fieldSet = new HashMap<String, Object>();
				fieldSet.put("status", 4);// 设置为已提交状态
				fieldSet.put("submitterSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
				fieldSet.put("submitStamp", new Timestamp(System.currentTimeMillis()));
				delegator.storeByCondition("ProductOutwarehouse", fieldSet, EntityCondition.makeConditionWhere("id='" + billId + "'"));
			}
			
			//更新周汇总表
			// 获取单据分录条目
			List<GenericValue> entryList = delegator.findByAnd("ProductOutwarehouseEntry", UtilMisc.toMap("parentId", billId));
			 
			for (GenericValue v : entryList) {
				String materialId = v.getString("materialMaterialId");// 打板物料id
				BigDecimal volume=v.getBigDecimal("volume");//出库数量（板）
				ProductStockType type = null;
				if("2".equals(v.getString("outwarehouseType"))){
					type=ProductStockType.CHG;
				} else {
					type=ProductStockType.OUT;
				}
				WeeklyStockMgr.getInstance().updateStock(materialId, bizDate, type, volume, false);
				ProductOutwarehouseEvents.updateNotification(v,delegator,materialId,volume,v.getString("goodNumber"),v.getString("destinhouseNumber"));
			}
			
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
	 * 成品出仓单确认撤销
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String rollbackBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		return "success";
	}
	
	/**
	 * 成品出仓，同步记录，从第三方数据库同步记录
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 * 
	 * 出仓同步过程:
	 * 1.从扫描库中同步数据
	 * 2.生成出库确认记录
	 * 
	 */
	public static String synchronizeRecords(HttpServletRequest request, HttpServletResponse response) throws Exception {
		/* 1.从扫描库中同步数据 */
		SyncScanDataServices.syncRecord();
		
		/* 2.生成出库确认记录  */
		generateConfirmBill(request, response);
		
		/* 3.返回结果给前端 */
		BillBaseEvent.writeSuccessMessageToExt(response, "同步成功！");
		return "success";
	}
	
	/**
	 * 生成出库确认记录
	 * 1.生成出库确认记录
	 * 2.更新扫描数据状态
	 */
	public static synchronized void generateConfirmBill(HttpServletRequest request, HttpServletResponse response) throws Exception{
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		List<GenericValue> entryList = delegator.findByAnd("ProductScan", UtilMisc.toMap("status", "0", "warehouseType", "2"));
		for (GenericValue v : entryList) {
			/* 1.生成出库确认记录 */
			Date bizDate = (Date) v.get("bizDate");
			String materialId = Utils.getMaterialIdByIkea(v.getString("id"), v.getString("qantityC"));
			TMaterial material = new TMaterial(materialId);
			BarCode barCode = new BarCode(v.getString("barcode1"),v.getString("barcode2"));
			
			GenericValue prdOutConf= delegator.makeValue("ProductOutwarehouseConfirm");
			prdOutConf.set("id", UUID.randomUUID().toString());//使用标签组合作为主键
			prdOutConf.set("number", v.getString("barcode1")+v.getString("barcode2"));//设置编码
			prdOutConf.set("bizDate", new Timestamp(bizDate.getTime()));//设置业务日期
			prdOutConf.set("materialMaterialId", materialId);//设置物料id
			prdOutConf.set("volume", v.getBigDecimal("volume"));//设置入库数量
			prdOutConf.set("barcode1", v.getString("barcode1"));//标签1
			prdOutConf.set("barcode2", v.getString("barcode2"));//标签2
			prdOutConf.set("unitUnitId", material.getUnitId());//设置计量单位id
			prdOutConf.set("prdWeek", barCode.getProductWeek());//设置生产周

			prdOutConf.set("submitterSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));//提交人
			prdOutConf.set("qantity", Long.parseLong(barCode.getQuantity()));//设置板数量
			prdOutConf.set("status", 0);	//状态为保存
			if("A".equals(v.getString("inOutType"))){
				prdOutConf.set("outwarehouseType", "1");//设置出库类型
			}else{
				prdOutConf.set("outwarehouseType", "2");//设置出库类型
			}
			delegator.create(prdOutConf);//保存分录
			
			/* 2.更新扫描数据状态 */
			v.set("status", 2);
			v.store();
		}
	}
}
