package org.ofbiz.partner.scm.tools;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.transaction.GenericTransactionException;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.partner.scm.common.BarCode;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.common.SerialNumberHelper;
import org.ofbiz.partner.scm.dao.TMaterial;
import org.ofbiz.partner.scm.pricemgr.BillType;
import org.ofbiz.partner.scm.pricemgr.BizStockImpFactory;
import org.ofbiz.partner.scm.pricemgr.ConsumeMaterial;
import org.ofbiz.partner.scm.pricemgr.Utils;
import org.ofbiz.partner.scm.stock.ProductBarcodeBoxMgr;

import com.ibm.icu.util.Calendar;

/**
 * 产品手工批量出仓、入仓操作类（操作数据表ProductInOutBarcodeTemp，只保存最后一次操作的数据）
 * 
 * @author Jeff
 * 
 */
public class ProductManualInOutEvents {
	private static final String module = org.ofbiz.partner.scm.tools.ProductManualInOutEvents.class.getName();
	/**
	 * 手工进仓出仓操作
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String manualInOutRun(HttpServletRequest request, HttpServletResponse response) throws Exception {
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();
			Delegator delegator = (Delegator) request.getAttribute("delegator");
			
			// 删除已完成的条码记录
			delegator.removeByAnd("ProductInOutBarcodeTemp", UtilMisc.toMap("valid", "Y"));
			
			// 获取未处理的条码记录
			List<GenericValue> entryList = delegator.findByAnd("ProductInOutBarcodeTemp", UtilMisc.toMap("valid", "N"));
			
			
			// 创建进仓单据
			Date currentDate = new Date();
			GenericValue billHead  = delegator.makeValue("ProductInwarehouse");
			String billId = UUID.randomUUID().toString();
			billHead.setString("id", billId);
			billHead.setString("number", new SerialNumberHelper().getSerialNumber(request, "ProductInwarehouse"));
			billHead.set("bizDate", new Timestamp(currentDate.getTime()));
			billHead.set("inspectorSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
			billHead.set("submitterSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
			billHead.set("status", 4); // 提交状态
			billHead.set("billType", 2); // 扫描类型，只能进行提交操作，不能删除
			billHead.set("note", "通过产品条码、序列号列表自动生成单据。"); // 备注
			billHead.set("submitStamp", new Timestamp(currentDate.getTime()));
			// 创建主单
			delegator.create(billHead);
			
			// 初始化耗料列表
			List<ConsumeMaterial> consumeMaterialList=new ArrayList<ConsumeMaterial>();
			int sort = 1;
			String warehouseId = "";
			String workshopId = "";
			for (GenericValue v : entryList) {
				int type = v.getInteger("type");
				if( type == 0 ){
					// 进仓操作
					String entryId = UUID.randomUUID().toString();
					String inWarehouseType = "1";		//默认都为正常进仓

					if (!v.containsKey("warehouseWarehouseId") || v.getString("warehouseWarehouseId").trim().length() < 1) {
						throw new Exception("装货仓库不能为空，请选择装货仓库！");
					}
					warehouseId = v.getString("warehouseWarehouseId");

					if (!v.containsKey("workshopWorkshopId") || v.getString("workshopWorkshopId").trim().length() < 1) {
						throw new Exception("包装车间不能为空，请选择包装车间！");
					}
					workshopId = v.getString("workshopWorkshopId");

					String barcode1 = v.getString("barcode1");

					String barcode2 = v.getString("barcode2");
					
					BarCode barcode = new BarCode(barcode1, barcode2);
					String materialId = Utils.getMaterialIdByIkea(barcode.getCodeForIkea(), barcode.getQuantity());
					TMaterial material = new TMaterial(materialId);
					
					// 新成品进仓单分录
					GenericValue entryValue = delegator.makeValue("ProductInwarehouseEntry");
					entryValue.setString("id", entryId);
					entryValue.setString("parentId", billId);
					entryValue.setString("workshopWorkshopId", workshopId);
					entryValue.setString("warehouseWarehouseId", warehouseId);
					entryValue.setString("materialMaterialId", materialId);
					entryValue.setString("productWeek", Utils.getYearWeekStr(currentDate));
					entryValue.setString("unitUnitId", material.getUnitId());
					entryValue.set("volume", new BigDecimal(1));
					entryValue.setString("barcode1", barcode1);
					entryValue.setString("barcode2", barcode2);
					entryValue.setString("inwarehouseType", inWarehouseType);
					entryValue.set("qantity", Long.parseLong(barcode.getQuantity()));
					entryValue.set("sort", sort);
					
					// 确定条码、序列号可以进仓
					ProductBarcodeBoxMgr.getInstance().update(barcode1, barcode2, false);
					
					// 创建分录
					delegator.create(entryValue);
					
					// 添加该分录耗料到耗料列表
					consumeMaterialList.addAll(Utils.getBomMaterialDetail(materialId, 0));
					
					sort ++;
				} else if( type == 1 ) {
					// 出仓操作，暂时不考虑出仓功能，为空
					
				}
				
				v.setString("valid", "Y");
				v.store();
			}
			
			// 创建进仓所需耗料调整单据，并提交（保证有充足的物料）
			// 进仓单时间减一天，保证结算时调整单在进仓到之前提交
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(currentDate);
			calendar.set(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH), calendar.get(Calendar.DATE)-1);
			Date billDate = calendar.getTime();
			
			// 生成调整单
			GenericValue adjustBillHead  = delegator.makeValue("WorkshopStockAdjust");
			String adjustBillId = UUID.randomUUID().toString();
			adjustBillHead.setString("id", adjustBillId);
			adjustBillHead.setString("number", new SerialNumberHelper().getSerialNumber(request, "WorkshopStockAdjust"));
			adjustBillHead.set("bizDate", new Timestamp(billDate.getTime()));
			adjustBillHead.set("submitterSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
			adjustBillHead.set("status", 4); // 提交状态
			adjustBillHead.set("note", "通过产品条码、序列号列表自动生成单据。"); // 备注
			adjustBillHead.set("submitStamp", new Timestamp(billDate.getTime()));
			// 创建主单
			delegator.create(adjustBillHead);
			
			int sort2 = 1;
			for(ConsumeMaterial entry : consumeMaterialList){
				String adjustEntryId = UUID.randomUUID().toString();
				
				// 新成品进仓单分录
				GenericValue adjustEntryValue = delegator.makeValue("WorkshopStockAdjustEntry");
				adjustEntryValue.setString("id", adjustEntryId);
				adjustEntryValue.setString("parentId", adjustBillId);
				adjustEntryValue.setString("workshopWorkshopId", workshopId);
				adjustEntryValue.setString("materialMaterialId", entry.getMaterialId());
				adjustEntryValue.setString("billType", "0");
				adjustEntryValue.setString("unitUnitId", "未知");		//	自动生成单据，单位为空
				adjustEntryValue.set("materialMaterialModel", "未知");		//	自动生成单据，规格型号为空
				adjustEntryValue.set("volume", entry.getConsumeQty());
				adjustEntryValue.set("sort", sort2);
				
				// 创建分录
				delegator.create(adjustEntryValue);
				
				sort2 ++;
			}

			// 处理车间调整单业务类
			BizStockImpFactory.getBizStockImp(BillType.WorkshopStockAdjust).updateStock(adjustBillHead, false, false);
			
			
			// 处理成品进仓业务类
			BizStockImpFactory.getBizStockImp(BillType.ProductWarehouse).updateStock(billHead, false, false);
		
			CommonEvents.writeJsonDataToExt(response, "{success:true}");
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
}