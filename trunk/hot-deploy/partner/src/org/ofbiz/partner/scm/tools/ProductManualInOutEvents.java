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
import org.ofbiz.partner.scm.pricemgr.PriceCalItem;
import org.ofbiz.partner.scm.pricemgr.PriceMgr;
import org.ofbiz.partner.scm.pricemgr.Utils;
import org.ofbiz.partner.scm.pricemgr.WorkshopPriceMgr;
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
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String manualInOutRun(HttpServletRequest request, HttpServletResponse response) throws Exception {
		boolean needReRun = false;
		boolean beganTransaction = false;
		try {

			Delegator delegator = (Delegator) request.getAttribute("delegator");

			// 1.删除已经完成处理的记录
			delegator.removeByAnd("ProductInOutBarcodeTemp", UtilMisc.toMap("valid", "Y"));

			// 2.处理未完成的记录

			// 2.1 获取所有未处理的单据
			List<GenericValue> entryList = delegator.findByAnd("ProductInOutBarcodeTemp", UtilMisc.toMap("valid", "N"));

			// 2.2 创建进仓单据
			Date currentDate = new Date();

//			// 2.2.1 进仓单时间减一个月，保证本月结算不涉及
//			Calendar calendar = Calendar.getInstance();
//			calendar.setTime(currentDate);
//			calendar.set(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH) - 1, calendar.get(Calendar.DATE));
//			Date billDate = calendar.getTime();
			
			// 事务开始
			beganTransaction = TransactionUtil.begin();
			
			//Debug.log("开始创建进仓单", module);
			
			GenericValue billHead = delegator.makeValue("ProductInwarehouse");
			String billId = UUID.randomUUID().toString();
			billHead.setString("id", billId);
			billHead.setString("number", new SerialNumberHelper().getSerialNumber(request, "ProductInwarehouse"));
			billHead.set("bizDate", new Timestamp(currentDate.getTime()));
			billHead.set("inspectorSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
			billHead.set("submitterSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
			billHead.set("status", 0); // 提交状态
			billHead.set("billType", 2); // 扫描类型，只能进行提交操作，不能删除
			billHead.set("note", "通过产品条码、序列号列表自动生成单据。"); // 备注
			billHead.set("submitStamp", new Timestamp(currentDate.getTime()));
			// 2.2.2 创建主单
			delegator.create(billHead);
			//Debug.log("完成创建进仓单", module);
			
			// 2.3 创建进仓单分录，并进行分录的业务处理
			
			// 2.3.1 初始化分录序号和每条单据处理条码数量
			int sort = 1;
			int number = 500;
			TMaterial material = null;
			BarCode barcode = null;
			for (GenericValue v : entryList) {
				int type = v.getInteger("type");
				if (type == 0) {
					// 2.3.2 进仓操作
					// 2.3.2.1 初始化分录数据
					String entryId = UUID.randomUUID().toString();
					String inWarehouseType = "1"; // 默认都为正常进仓

					if (!v.containsKey("warehouseWarehouseId") || v.getString("warehouseWarehouseId").trim().length() < 1) {
						throw new Exception("装货仓库不能为空，请选择装货仓库！");
					}
					String warehouseId = v.getString("warehouseWarehouseId");

					if (!v.containsKey("workshopWorkshopId") || v.getString("workshopWorkshopId").trim().length() < 1) {
						throw new Exception("包装车间不能为空，请选择包装车间！");
					}
					String workshopId = v.getString("workshopWorkshopId");

					String barcode1 = v.getString("barcode1");

					String barcode2 = v.getString("barcode2");
					
					Debug.log("产品条码" + barcode1 + ";序列号" + barcode2 + "。" , module);

					barcode = new BarCode(barcode1, barcode2);
					String materialId = Utils.getMaterialIdByIkea(barcode.getCodeForIkea(), barcode.getQuantity());
					material = new TMaterial(materialId);

					BigDecimal volume = new BigDecimal(1);
					
					//Debug.log("开始创建进仓单分录", module);
					// 2.3.2.2 新成品进仓单分录
					GenericValue entryValue = delegator.makeValue("ProductInwarehouseEntry");
					entryValue.setString("id", entryId);
					entryValue.setString("parentId", billId);
					entryValue.setString("workshopWorkshopId", workshopId);
					entryValue.setString("warehouseWarehouseId", warehouseId);
					entryValue.setString("materialMaterialId", materialId);
					entryValue.setString("productWeek", Utils.getYearWeekStr(currentDate));
					entryValue.setString("unitUnitId", material.getUnitId());
					entryValue.set("volume", volume);
					entryValue.setString("barcode1", barcode1);
					entryValue.setString("barcode2", barcode2);
					entryValue.setString("inwarehouseType", inWarehouseType);
					entryValue.set("qantity", Long.parseLong(barcode.getQuantity()));
					entryValue.set("sort", sort);
					
					// 2.3.2.3 确定条码、序列号可以进仓
					ProductBarcodeBoxMgr.getInstance().update(barcode1, barcode2, false);

					// 2.3.2.4 创建分录
					delegator.create(entryValue);
					//Debug.log("完成创建进仓单分录", module);

//					// 2.3.2.5 获取实际耗料列表 ， 支持10层的bom物料查找
//					List<ConsumeMaterial> materialList = getMaterialList(entryId, materialId, delegator);
//
//					BigDecimal cost = BigDecimal.ZERO;// 打板成品单一板的成本
//
//					// 2.3.2.6 更新耗料明细表,如果没有明细则新增明细信息
//					for (ConsumeMaterial element : materialList) {
//						/* 2.3.2.6.1 取每个耗料物料id和耗料金额 */
//						String bomMaterialId = element.getMaterialId();
//						// 手工定义是总耗料
//						BigDecimal bomAmount = element.getDetailId() == null ? volume.multiply(element.getConsumeQty()) : element.getConsumeQty();
//						/* 2.3.2.6.2 从车间库存表查找耗料单价 */
//						BigDecimal curPrice = WorkshopPriceMgr.getInstance().getPrice(workshopId, bomMaterialId);
//						/* 2.3.2.6.3 计算成本 并汇总总成本 */
//						BigDecimal curCost = bomAmount.multiply(curPrice);
//						/* 2.3.2.6.4 计算成本 并汇总总成本 */
//						cost = cost.add(curCost);
//						
//						//Debug.log("开始创建进仓单耗料明细", module);
//						/* 2.3.2.6.4.1 进仓操作更新耗料明细单价和金额 */
//						if (element.getDetailId() == null) {
//							/* 新增耗料明细 */
//							GenericValue entryDetailValue = delegator.makeValue("ProductInwarehouseEntryDetail");
//							entryDetailValue.set("id", UUID.randomUUID().toString());
//							entryDetailValue.set("parentId", entryId);
//						    entryDetailValue.set("barcode1", barcode1);
//						    entryDetailValue.set("barcode2", barcode2);
//							/* 设置物料信息, 规格型号、计量单位 */
//							entryDetailValue.set("materialId", bomMaterialId);
//
//							GenericValue mv = delegator.findOne("TMaterial", false, "id", bomMaterialId);
//							entryDetailValue.set("model", mv.getString("model"));
//							entryDetailValue.set("quantity", volume.multiply(element.getConsumeQty()));// 保存总耗料
//							entryDetailValue.set("unitUnitId", mv.getString("defaultUnitId"));
//
//							entryDetailValue.set("price", curPrice);
//							entryDetailValue.set("amount", curCost);
//							delegator.create(entryDetailValue);
//						}
//						//Debug.log("完成创建进仓单耗料明细", module);
//					}
//
//					/* 2.3.2.7. 计算分录成品单价和成本 */
//					BigDecimal entryCost = cost.multiply(volume);// 计算分录总成本
//
//					Debug.log("成品入库单价计算:物料id" + materialId + ";数量" + volume + ";金额" + entryCost, module);
//
//					// 构建计算条目
//					PriceCalItem item = new PriceCalItem(currentDate, warehouseId, materialId, volume, entryCost, BillType.ProductWarehouse, entryId, false, false, null);
//
//					// 计算板成品单价
//					PriceMgr.getInstance().calPrice(item);
					
					//Debug.log("完成库存更新", module);
				}

				v.setString("valid", "Y");
				v.store();

				if (sort == number) {
					needReRun = true;
					break;
				}
				sort++;
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
		if (needReRun) {
			Thread.sleep(500);
			manualInOutRun(request, response);
		}
		CommonEvents.writeJsonDataToExt(response, "{success:true}");
		return "success";
	}
	
	/**
	 * 手工进仓出仓操作
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String manualOutRun(HttpServletRequest request, HttpServletResponse response) throws Exception {
		boolean needReRun = false;
		boolean beganTransaction = false;
		try {

			Delegator delegator = (Delegator) request.getAttribute("delegator");

			// 1.删除已经完成处理的记录
			delegator.removeByAnd("ProductInOutBarcodeTemp", UtilMisc.toMap("valid", "Y"));

			// 2.处理未完成的记录

			// 2.1 获取所有未处理的单据
			List<GenericValue> entryList = delegator.findByAnd("ProductInOutBarcodeTemp", UtilMisc.toMap("valid", "N"));

			// 2.2 创建进仓单据
			Date currentDate = new Date();
			
			// 事务开始
			beganTransaction = TransactionUtil.begin();
			
			//Debug.log("开始创建进仓单", module);
			
			GenericValue billHead = delegator.makeValue("ProductOutwarehouse");
			String billId = UUID.randomUUID().toString();
			billHead.setString("id", billId);
			billHead.setString("number", new SerialNumberHelper().getSerialNumber(request, "ProductOutwarehouse"));
			billHead.set("bizDate", new Timestamp(currentDate.getTime()));
			billHead.set("submitterSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
			billHead.set("status", 0); // 提交状态
			billHead.set("billType", 1); // 非扫描类型，
			billHead.set("note", "通过产品条码、序列号列表自动生成单据。"); // 备注
			billHead.set("submitStamp", new Timestamp(currentDate.getTime()));
			
			// 2.2.2 创建主单
			delegator.create(billHead);
			//Debug.log("完成创建进仓单", module);
			
			// 2.3 创建进仓单分录，并进行分录的业务处理
			
			// 2.3.1 初始化分录序号和每条单据处理条码数量
			int sort = 1;
			int number = 500;
			TMaterial material = null;
			BarCode barcode = null;
			for (GenericValue v : entryList) {
				int type = v.getInteger("type");
				if (type == 1) {
					// 2.3.2 进仓操作
					// 2.3.2.1 初始化分录数据
					String entryId = UUID.randomUUID().toString();
					String outWarehouseType = "1"; // 默认都为正常进仓

					if (!v.containsKey("warehouseWarehouseId") || v.getString("warehouseWarehouseId").trim().length() < 1) {
						throw new Exception("装货仓库不能为空，请选择装货仓库！");
					}
					String warehouseId = v.getString("warehouseWarehouseId");

					if (!v.containsKey("workshopWorkshopId") || v.getString("workshopWorkshopId").trim().length() < 1) {
						throw new Exception("包装车间不能为空，请选择包装车间！");
					}
					String workshopId = v.getString("workshopWorkshopId");

					String barcode1 = v.getString("barcode1");

					String barcode2 = v.getString("barcode2");
					
					Debug.log("产品条码" + barcode1 + ";序列号" + barcode2 + "。" , module);

					barcode = new BarCode(barcode1, barcode2);
					String materialId = Utils.getMaterialIdByIkea(barcode.getCodeForIkea(), barcode.getQuantity());
					material = new TMaterial(materialId);

					BigDecimal volume = new BigDecimal(1);
					
					//Debug.log("开始创建进仓单分录", module);
					// 2.3.2.2 新成品进仓单分录
					GenericValue entryValue = delegator.makeValue("ProductOutwarehouseEntry");
					entryValue.setString("id", entryId);
					entryValue.setString("parentId", billId);
					entryValue.setString("workshopWorkshopId", workshopId);
					entryValue.setString("warehouseWarehouseId", warehouseId);
					entryValue.setString("materialMaterialId", materialId);
					entryValue.setString("prdWeek", Utils.getYearWeekStr(currentDate));
					entryValue.setString("unitUnitId", material.getUnitId());
					entryValue.set("volume", volume);
					entryValue.setString("barcode1", barcode1);
					entryValue.setString("barcode2", barcode2);
					entryValue.setString("outwarehouseType", outWarehouseType);
					entryValue.set("qantity", Long.parseLong(barcode.getQuantity()));
					entryValue.set("sort", sort);
					
					// 2.3.2.3 确定条码、序列号可以进仓
//					ProductBarcodeBoxMgr.getInstance().update(barcode1, barcode2, true);

					// 2.3.2.4 创建分录
					delegator.create(entryValue);
					//Debug.log("完成创建进仓单分录", module);

//					// 2.3.2.5 获取实际耗料列表 ， 支持10层的bom物料查找
//					List<ConsumeMaterial> materialList = getMaterialList(entryId, materialId, delegator);
//
//					BigDecimal cost = BigDecimal.ZERO;// 打板成品单一板的成本
//
//					// 2.3.2.6 更新耗料明细表,如果没有明细则新增明细信息
//					for (ConsumeMaterial element : materialList) {
//						/* 2.3.2.6.1 取每个耗料物料id和耗料金额 */
//						String bomMaterialId = element.getMaterialId();
//						// 手工定义是总耗料
//						BigDecimal bomAmount = element.getDetailId() == null ? volume.multiply(element.getConsumeQty()) : element.getConsumeQty();
//						/* 2.3.2.6.2 从车间库存表查找耗料单价 */
//						BigDecimal curPrice = WorkshopPriceMgr.getInstance().getPrice(workshopId, bomMaterialId);
//						/* 2.3.2.6.3 计算成本 并汇总总成本 */
//						BigDecimal curCost = bomAmount.multiply(curPrice);
//						/* 2.3.2.6.4 计算成本 并汇总总成本 */
//						cost = cost.add(curCost);
//						
//						//Debug.log("开始创建进仓单耗料明细", module);
//						/* 2.3.2.6.4.1 进仓操作更新耗料明细单价和金额 */
//						if (element.getDetailId() == null) {
//							/* 新增耗料明细 */
//							GenericValue entryDetailValue = delegator.makeValue("ProductInwarehouseEntryDetail");
//							entryDetailValue.set("id", UUID.randomUUID().toString());
//							entryDetailValue.set("parentId", entryId);
//						    entryDetailValue.set("barcode1", barcode1);
//						    entryDetailValue.set("barcode2", barcode2);
//							/* 设置物料信息, 规格型号、计量单位 */
//							entryDetailValue.set("materialId", bomMaterialId);
//
//							GenericValue mv = delegator.findOne("TMaterial", false, "id", bomMaterialId);
//							entryDetailValue.set("model", mv.getString("model"));
//							entryDetailValue.set("quantity", volume.multiply(element.getConsumeQty()));// 保存总耗料
//							entryDetailValue.set("unitUnitId", mv.getString("defaultUnitId"));
//
//							entryDetailValue.set("price", curPrice);
//							entryDetailValue.set("amount", curCost);
//							delegator.create(entryDetailValue);
//						}
//						//Debug.log("完成创建进仓单耗料明细", module);
//					}
//
//					/* 2.3.2.7. 计算分录成品单价和成本 */
//					BigDecimal entryCost = cost.multiply(volume);// 计算分录总成本
//
//					Debug.log("成品入库单价计算:物料id" + materialId + ";数量" + volume + ";金额" + entryCost, module);
//
//					// 构建计算条目
//					PriceCalItem item = new PriceCalItem(currentDate, warehouseId, materialId, volume, entryCost, BillType.ProductWarehouse, entryId, false, false, null);
//
//					// 计算板成品单价
//					PriceMgr.getInstance().calPrice(item);
					
					//Debug.log("完成库存更新", module);
				}

				v.setString("valid", "Y");
				v.store();

				if (sort == number) {
					needReRun = true;
					break;
				}
				sort++;
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
		if (needReRun) {
			Thread.sleep(500);
			manualOutRun(request, response);
		}
		CommonEvents.writeJsonDataToExt(response, "{success:true}");
		return "success";
	}

	/**
	 * 手工进仓出仓操作(不影响库存)
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String manualInOutWithoutStockRun(HttpServletRequest request, HttpServletResponse response) throws Exception {
		boolean needReRun = false;
		boolean beganTransaction = false;
		try {

			Delegator delegator = (Delegator) request.getAttribute("delegator");

			// 1.删除已经完成处理的记录
			delegator.removeByAnd("ProductInOutBarcodeTemp", UtilMisc.toMap("valid", "Y"));

			// 2.处理未完成的记录

			// 2.1 获取所有未处理的单据
			List<GenericValue> entryList = delegator.findByAnd("ProductInOutBarcodeTemp", UtilMisc.toMap("valid", "N"));

			// 2.2 创建进仓单据
			Date currentDate = new Date();

			// 2.2.1 进仓单时间减一个月，保证本月结算不涉及
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(currentDate);
			calendar.set(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH) - 1, calendar.get(Calendar.DATE));
			Date billDate = calendar.getTime();
			
			// 事务开始
			beganTransaction = TransactionUtil.begin();
			
			//Debug.log("开始创建进仓单", module);
			
			GenericValue billHead = delegator.makeValue("ProductInwarehouse");
			String billId = UUID.randomUUID().toString();
			billHead.setString("id", billId);
			billHead.setString("number", new SerialNumberHelper().getSerialNumber(request, "ProductInwarehouse"));
			billHead.set("bizDate", new Timestamp(billDate.getTime()));
			billHead.set("inspectorSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
			billHead.set("submitterSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
			billHead.set("status", 4); // 提交状态
			billHead.set("billType", 2); // 扫描类型，只能进行提交操作，不能删除
			billHead.set("note", "通过产品条码、序列号列表自动生成单据。"); // 备注
			billHead.set("submitStamp", new Timestamp(billDate.getTime()));
			// 2.2.2 创建主单
			delegator.create(billHead);
			//Debug.log("完成创建进仓单", module);
			
			// 2.3 创建进仓单分录，并进行分录的业务处理
			
			// 2.3.1 初始化分录序号和每条单据处理条码数量
			int sort = 1;
			int number = 50;
			TMaterial material = null;
			BarCode barcode = null;
			for (GenericValue v : entryList) {
				int type = v.getInteger("type");
				if (type == 0) {
					// 2.3.2 进仓操作
					// 2.3.2.1 初始化分录数据
					String entryId = UUID.randomUUID().toString();
					String inWarehouseType = "1"; // 默认都为正常进仓

					if (!v.containsKey("warehouseWarehouseId") || v.getString("warehouseWarehouseId").trim().length() < 1) {
						throw new Exception("装货仓库不能为空，请选择装货仓库！");
					}
					String warehouseId = v.getString("warehouseWarehouseId");

					if (!v.containsKey("workshopWorkshopId") || v.getString("workshopWorkshopId").trim().length() < 1) {
						throw new Exception("包装车间不能为空，请选择包装车间！");
					}
					String workshopId = v.getString("workshopWorkshopId");

					String barcode1 = v.getString("barcode1");

					String barcode2 = v.getString("barcode2");

					barcode = new BarCode(barcode1, barcode2);
					String materialId = Utils.getMaterialIdByIkea(barcode.getCodeForIkea(), barcode.getQuantity());
					material = new TMaterial(materialId);

					BigDecimal volume = new BigDecimal(1);
					
					//Debug.log("开始创建进仓单分录", module);
					// 2.3.2.2 新成品进仓单分录
					GenericValue entryValue = delegator.makeValue("ProductInwarehouseEntry");
					entryValue.setString("id", entryId);
					entryValue.setString("parentId", billId);
					entryValue.setString("workshopWorkshopId", workshopId);
					entryValue.setString("warehouseWarehouseId", warehouseId);
					entryValue.setString("materialMaterialId", materialId);
					entryValue.setString("productWeek", Utils.getYearWeekStr(billDate));
					entryValue.setString("unitUnitId", material.getUnitId());
					entryValue.set("volume", volume);
					entryValue.setString("barcode1", barcode1);
					entryValue.setString("barcode2", barcode2);
					entryValue.setString("inwarehouseType", inWarehouseType);
					entryValue.set("qantity", Long.parseLong(barcode.getQuantity()));
					entryValue.set("sort", sort);

					// 2.3.2.3 确定条码、序列号可以进仓
					ProductBarcodeBoxMgr.getInstance().update(barcode1, barcode2, false);

					// 2.3.2.4 创建分录
					delegator.create(entryValue);
					//Debug.log("完成创建进仓单分录", module);

					// 2.3.2.5 获取实际耗料列表 ， 支持10层的bom物料查找
					List<ConsumeMaterial> materialList = getMaterialList(entryId, materialId, delegator);

					BigDecimal cost = BigDecimal.ZERO;// 打板成品单一板的成本

					// 2.3.2.6 更新耗料明细表,如果没有明细则新增明细信息
					for (ConsumeMaterial element : materialList) {
						/* 2.3.2.6.1 取每个耗料物料id和耗料金额 */
						String bomMaterialId = element.getMaterialId();
						// 手工定义是总耗料
						BigDecimal bomAmount = element.getDetailId() == null ? volume.multiply(element.getConsumeQty()) : element.getConsumeQty();
						/* 2.3.2.6.2 从车间库存表查找耗料单价 */
						BigDecimal curPrice = WorkshopPriceMgr.getInstance().getPrice(workshopId, bomMaterialId);
						/* 2.3.2.6.3 计算成本 并汇总总成本 */
						BigDecimal curCost = bomAmount.multiply(curPrice);
						/* 2.3.2.6.4 计算成本 并汇总总成本 */
						cost = cost.add(curCost);
						
						//Debug.log("开始创建进仓单耗料明细", module);
						/* 2.3.2.6.4.1 进仓操作更新耗料明细单价和金额 */
						if (element.getDetailId() == null) {
							/* 新增耗料明细 */
							GenericValue entryDetailValue = delegator.makeValue("ProductInwarehouseEntryDetail");
							entryDetailValue.set("id", UUID.randomUUID().toString());
							entryDetailValue.set("parentId", entryId);
						    entryDetailValue.set("barcode1", barcode1);
						    entryDetailValue.set("barcode2", barcode2);
							/* 设置物料信息, 规格型号、计量单位 */
							entryDetailValue.set("materialId", bomMaterialId);

							GenericValue mv = delegator.findOne("TMaterial", false, "id", bomMaterialId);
							entryDetailValue.set("model", mv.getString("model"));
							entryDetailValue.set("quantity", volume.multiply(element.getConsumeQty()));// 保存总耗料
							entryDetailValue.set("unitUnitId", mv.getString("defaultUnitId"));

							entryDetailValue.set("price", curPrice);
							entryDetailValue.set("amount", curCost);
							delegator.create(entryDetailValue);
						}
						//Debug.log("完成创建进仓单耗料明细", module);
					}

					/* 2.3.2.7. 计算分录成品单价和成本 */
					BigDecimal entryCost = cost.multiply(volume);// 计算分录总成本

					Debug.log("成品入库单价计算:物料id" + materialId + ";数量" + volume + ";金额" + entryCost, module);

					// 构建计算条目
					PriceCalItem item = new PriceCalItem(currentDate, warehouseId, materialId, volume, entryCost, BillType.ProductWarehouse, entryId, false, false, null);

					// 计算板成品单价
					PriceMgr.getInstance().calPrice(item);
					
					//Debug.log("完成库存更新", module);
				}

				v.setString("valid", "Y");
				v.store();

				if (sort == number) {
					needReRun = true;
					break;
				}
				sort++;
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
		if (needReRun) {
			Thread.sleep(10000);
			manualInOutWithoutStockRun(request, response);
		}
		CommonEvents.writeJsonDataToExt(response, "{success:true}");
		return "success";
	}

	/**
	 * 获取物料实际耗料明细列表 如果存在实际耗料明细，则通过实际耗料表计算，不再查找bom单
	 * 如果不存在实际耗料明细，则通过bom单查找耗料明细，该明细只是理论的耗料
	 * 
	 * @author Mark 2012-7-3
	 * @param entryId
	 * @param materialId
	 * @return
	 */
	private static List<ConsumeMaterial> getMaterialList(String entryId, String materialId, Delegator delegator) throws Exception {
		List<ConsumeMaterial> consumeMaterialList = new ArrayList<ConsumeMaterial>();
		consumeMaterialList.addAll(Utils.getBomMaterialDetail(materialId, 0));

		return consumeMaterialList;
	}
}