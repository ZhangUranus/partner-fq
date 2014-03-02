package org.ofbiz.partner.scm.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.transaction.GenericTransactionException;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.partner.scm.pricemgr.ConsignPriceMgr;
import org.ofbiz.partner.scm.pricemgr.ConsumeMaterial;
import org.ofbiz.partner.scm.pricemgr.MaterialBomMgr;
import org.ofbiz.partner.scm.pricemgr.PriceMgr;
import org.ofbiz.partner.scm.pricemgr.WorkshopPriceMgr;
import org.ofbiz.partner.scm.pricemgr.bizStockImp.ProductWarehouseBizImp;
import org.ofbiz.partner.scm.stock.WorkshopWarehousingEvents;
import org.ofbiz.service.DispatchContext;
import org.ofbiz.service.ServiceUtil;

public class CurrentStockHandleServices {
	public static final String module = CurrentStockHandleServices.class.getName();

	/**
	 * 增加单据操作处理任务
	 * 
	 * @param dctx
	 * @param context
	 * @return
	 */
	public static Map<String, Object> addBillHandleJobService(DispatchContext dctx, Map<String, ? extends Object> context) {
		Delegator delegator = dctx.getDelegator();

		Debug.log("增加单据操作处理任务！", module);

		GenericValue billJob = delegator.makeValue("BillJobList");
		String number = (String) context.get("number");
		String billType = (String) context.get("billType");
		String operationType = (String) context.get("operationType");
		String parameter = (String) context.get("parameter");

		billJob.set("id", UUID.randomUUID().toString());
		billJob.set("number", number);
		billJob.set("billType", billType);
		billJob.set("operationType", operationType);
		if (parameter != null && !parameter.isEmpty()) {
			billJob.set("parameter", parameter);
		} else {
			billJob.set("parameter", "N");
		}
		billJob.set("status", "0");
		try {
			delegator.create(billJob);
		} catch (GenericEntityException e) {
			e.printStackTrace();
			return ServiceUtil.returnError(e.getMessage());
		}

		Debug.log("完成增加单据操作处理任务！", module);
		return ServiceUtil.returnSuccess();
	}

	/**
	 * 增加单据操作处理任务
	 * 
	 * @param dctx
	 * @param context
	 * @return
	 */
	public static Map<String, Object> doBillHandleJobService(DispatchContext dctx, Map<String, ? extends Object> context) {
		Delegator delegator = dctx.getDelegator();
		boolean beganTransaction = false;

		List<String> orders = new ArrayList<String>();

		orders.add("createdStamp ASC");
		orders.add("operationType ASC");
		List<GenericValue> jobList;
		try {
			jobList = delegator.findList("BillJobList", EntityCondition.makeCondition("status", "0"), null, orders, null, false);

			if (jobList != null && jobList.size() > 0) {
				for (GenericValue job : jobList) {
					try {
						beganTransaction = TransactionUtil.begin();
						Debug.log("处理单据操作任务！", module);
						if ("PurchaseWarehousing".equals(job.getString("billType"))) {
							/* 1 采购入仓单据处理 */
							Debug.log("1 采购入仓单据处理", module);
							if ("0".equals(job.getString("operationType")) || "1".equals(job.getString("operationType")) || "4".equals(job.getString("operationType"))) {
								/* 1.1 保存，修改，撤销 */
								Debug.log("1.1 采购入仓单据保存，修改，撤销", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));

								// 增加保存单据数据到当前库存表中
								List<GenericValue> pwList = delegator.findList("PurchaseWarehousingStock", EntityCondition.makeCondition("number", job.getString("number")), null, null, null, false);
								if (pwList != null && pwList.size() > 0) {
									for (GenericValue bill : pwList) {
										if (bill.getString("warehouseWarehouseId") != null && !bill.getString("warehouseWarehouseId").isEmpty() && bill.getString("materialMaterialId") != null && !bill.getString("materialMaterialId").isEmpty()) {
											GenericValue billStock = delegator.makeValue("CurSaveMaterialBalance");
											billStock.set("id", UUID.randomUUID().toString());
											billStock.set("warehouseId", bill.getString("warehouseWarehouseId"));
											billStock.set("materialId", bill.getString("materialMaterialId"));
											billStock.set("number", bill.getString("number"));
											billStock.set("volume", bill.getBigDecimal("volume"));
											billStock.set("totalSum", bill.getBigDecimal("entrysum"));
											billStock.create();
										}
									}
								}
							} else if ("2".equals(job.getString("operationType")) || "3".equals(job.getString("operationType"))) {
								/* 1.2 删除，提交 */
								Debug.log("1.2 采购入仓单据删除，提交", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
							}
						} else if ("PurchaseReturn".equals(job.getString("billType"))) {
							/* 2 采购退货单据处理 */
							Debug.log("2 采购退货单据处理", module);
							if ("0".equals(job.getString("operationType")) || "1".equals(job.getString("operationType")) || "4".equals(job.getString("operationType"))) {
								/* 2.1 保存，修改，撤销 */
								Debug.log("2.1 采购退货单据保存，修改，撤销", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));

								// 增加保存单据数据到当前库存表中
								List<GenericValue> pwList = delegator.findList("PurchaseReturnStock", EntityCondition.makeCondition("number", job.getString("number")), null, null, null, false);
								if (pwList != null && pwList.size() > 0) {
									for (GenericValue bill : pwList) {
										if (bill.getString("warehouseWarehouseId") != null && !bill.getString("warehouseWarehouseId").isEmpty() && bill.getString("materialMaterialId") != null && !bill.getString("materialMaterialId").isEmpty()) {
											GenericValue billStock = delegator.makeValue("CurSaveMaterialBalance");
											billStock.set("id", UUID.randomUUID().toString());
											billStock.set("warehouseId", bill.getString("warehouseWarehouseId"));
											billStock.set("materialId", bill.getString("materialMaterialId"));
											billStock.set("number", bill.getString("number"));
											billStock.set("volume", bill.getBigDecimal("volume").negate());
											billStock.set("totalSum", bill.getBigDecimal("volume").negate().multiply(PriceMgr.getInstance().getPrice(bill.getString("warehouseWarehouseId"), bill.getString("materialMaterialId"))));
											billStock.create();
										}
									}
								}
							} else if ("2".equals(job.getString("operationType")) || "3".equals(job.getString("operationType"))) {
								/* 2.2 删除，提交 */
								Debug.log("2.2 采购退货单据删除，提交", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
							}
						} else if ("ConsignDrawMaterial".equals(job.getString("billType"))) {
							/* 3 委外领料单据处理 */
							Debug.log("3 委外领料单据处理", module);
							if ("0".equals(job.getString("operationType")) || "1".equals(job.getString("operationType")) || "4".equals(job.getString("operationType"))) {
								/* 3.1 保存，修改，撤销 */
								Debug.log("3.1 委外领料单据保存，修改，撤销", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
								clearConsignByNumber(delegator, job.getString("number"));

								// 增加保存单据数据到当前库存表中
								List<GenericValue> pwList = delegator.findList("ConsignDrawMaterialStock", EntityCondition.makeCondition("number", job.getString("number")), null, null, null, false);
								if (pwList != null && pwList.size() > 0) {
									GenericValue head = pwList.get(0);
									BigDecimal totalSum = BigDecimal.ZERO;

									for (GenericValue bill : pwList) {
										if (bill.getString("warehouseWarehouseId") != null && !bill.getString("warehouseWarehouseId").isEmpty() && bill.getString("materialMaterialId") != null && !bill.getString("materialMaterialId").isEmpty()) {
											// 在仓库中扣除领料
											BigDecimal sum = bill.getBigDecimal("volume").multiply(PriceMgr.getInstance().getPrice(bill.getString("warehouseWarehouseId"), bill.getString("materialMaterialId")));
											totalSum = totalSum.add(sum);

											GenericValue billStock = delegator.makeValue("CurSaveMaterialBalance");
											billStock.set("id", UUID.randomUUID().toString());
											billStock.set("warehouseId", bill.getString("warehouseWarehouseId"));
											billStock.set("materialId", bill.getString("materialMaterialId"));
											billStock.set("number", bill.getString("number"));
											billStock.set("volume", bill.getBigDecimal("volume").negate());
											billStock.set("totalSum", sum.negate());
											billStock.create();
										}
									}
									if (head.getString("processorSupplierId") != null && !head.getString("processorSupplierId").isEmpty() && head.getString("processedBomId") != null && !head.getString("processedBomId").isEmpty()) {
										// 在加工商中增加加工件
										GenericValue consignStock = delegator.makeValue("CurSaveConsignBalance");
										consignStock.set("id", UUID.randomUUID().toString());
										consignStock.set("supplierId", head.getString("processorSupplierId"));
										consignStock.set("materialId", MaterialBomMgr.getInstance().getMaterialIdByBomId(head.getString("processedBomId")));
										consignStock.set("number", head.getString("number"));
										consignStock.set("volume", head.getBigDecimal("materialVolume"));
										consignStock.set("totalSum", totalSum);
										consignStock.create();
									}
								}
							} else if ("2".equals(job.getString("operationType")) || "3".equals(job.getString("operationType"))) {
								/* 3.2 删除，提交 */
								Debug.log("3.2 委外领料单据删除，提交", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
								clearConsignByNumber(delegator, job.getString("number"));
							}
						} else if ("ConsignReturnMaterial".equals(job.getString("billType"))) {
							/* 4 委外退料单据处理 */
							Debug.log("4 委外退料单据处理", module);
							if ("0".equals(job.getString("operationType")) || "1".equals(job.getString("operationType")) || "4".equals(job.getString("operationType"))) {
								/* 4.1 保存，修改，撤销 */
								Debug.log("4.1 委外退料单据保存，修改，撤销", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
								clearConsignByNumber(delegator, job.getString("number"));

								// 增加保存单据数据到当前库存表中
								List<GenericValue> pwList = delegator.findList("ConsignReturnMaterialStock", EntityCondition.makeCondition("number", job.getString("number")), null, null, null, false);
								if (pwList != null && pwList.size() > 0) {
									GenericValue head = pwList.get(0);
									BigDecimal totalSum = BigDecimal.ZERO;

									for (GenericValue bill : pwList) {
										if (bill.getString("warehouseWarehouseId") != null && !bill.getString("warehouseWarehouseId").isEmpty() && bill.getString("materialMaterialId") != null && !bill.getString("materialMaterialId").isEmpty()) {
											// 在仓库中增加物料
											BigDecimal sum = bill.getBigDecimal("volume").multiply(ConsignPriceMgr.getInstance().getPrice(bill.getString("processorSupplierId"), bill.getString("materialMaterialId")));
											totalSum = totalSum.add(sum);

											GenericValue billStock = delegator.makeValue("CurSaveMaterialBalance");
											billStock.set("id", UUID.randomUUID().toString());
											billStock.set("warehouseId", bill.getString("warehouseWarehouseId"));
											billStock.set("materialId", bill.getString("materialMaterialId"));
											billStock.set("number", bill.getString("number"));
											billStock.set("volume", bill.getBigDecimal("volume"));
											billStock.set("totalSum", sum);
											billStock.create();
										}
									}
									if (head.getString("processorSupplierId") != null && !head.getString("processorSupplierId").isEmpty() && head.getString("processedBomId") != null && !head.getString("processedBomId").isEmpty()) {
										// 在加工商中减少加工件
										GenericValue consignStock = delegator.makeValue("CurSaveConsignBalance");
										consignStock.set("id", UUID.randomUUID().toString());
										consignStock.set("supplierId", head.getString("processorSupplierId"));
										consignStock.set("materialId", MaterialBomMgr.getInstance().getMaterialIdByBomId(head.getString("processedBomId")));
										consignStock.set("number", head.getString("number"));
										consignStock.set("volume", head.getBigDecimal("materialVolume").negate());
										consignStock.set("totalSum", totalSum.negate());
										consignStock.create();
									}
								}
							} else if ("2".equals(job.getString("operationType")) || "3".equals(job.getString("operationType"))) {
								/* 4.2 删除，提交 */
								Debug.log("4.2 委外退料单据删除，提交", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
								clearConsignByNumber(delegator, job.getString("number"));
							}
						} else if ("ConsignWarehousing".equals(job.getString("billType"))) {
							/* 5 委外入库单据处理 */
							Debug.log("5 委外入库单据处理", module);
							if ("0".equals(job.getString("operationType")) || "1".equals(job.getString("operationType")) || "4".equals(job.getString("operationType"))) {
								/* 5.1 保存，修改，撤销 */
								Debug.log("5.1 委外入库单据保存，修改，撤销", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
								clearConsignByNumber(delegator, job.getString("number"));

								// 增加保存单据数据到当前库存表中
								List<GenericValue> pwList = delegator.findList("ConsignWarehousingStock", EntityCondition.makeCondition("number", job.getString("number")), null, null, null, false);
								if (pwList != null && pwList.size() > 0) {
									for (GenericValue bill : pwList) {
										if (bill.getString("warehouseWarehouseId") != null && !bill.getString("warehouseWarehouseId").isEmpty() && bill.getString("processorSupplierId") != null && !bill.getString("processorSupplierId").isEmpty() && bill.getString("bomId") != null && !bill.getString("bomId").isEmpty()) {
											// 在仓库中增加加工件
											GenericValue billStock = delegator.makeValue("CurSaveMaterialBalance");
											billStock.set("id", UUID.randomUUID().toString());
											billStock.set("warehouseId", bill.getString("warehouseWarehouseId"));
											billStock.set("materialId", MaterialBomMgr.getInstance().getMaterialIdByBomId(bill.getString("bomId")));
											billStock.set("number", bill.getString("number"));
											billStock.set("volume", bill.getBigDecimal("volume"));
											billStock.set("totalSum", BigDecimal.ZERO);
											billStock.create();

											// 在加工商中减少加工件(暂时无法计算金额)
											GenericValue consignStock = delegator.makeValue("CurSaveConsignBalance");
											consignStock.set("id", UUID.randomUUID().toString());
											consignStock.set("supplierId", bill.getString("processorSupplierId"));
											consignStock.set("materialId", MaterialBomMgr.getInstance().getMaterialIdByBomId(bill.getString("bomId")));
											consignStock.set("number", bill.getString("number"));
											consignStock.set("volume", bill.getBigDecimal("volume").negate());
											consignStock.set("totalSum", BigDecimal.ZERO);
											consignStock.create();
										}
									}
								}
							} else if ("2".equals(job.getString("operationType")) || "3".equals(job.getString("operationType"))) {
								/* 5.2 删除，提交 */
								Debug.log("5.2 委外入库单据删除，提交", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
								clearConsignByNumber(delegator, job.getString("number"));
							}

						} else if ("ConsignReturnProduct".equals(job.getString("billType"))) {
							/* 6 委外退货单据处理 */
							Debug.log("6 委外退货单据处理", module);
							if ("0".equals(job.getString("operationType")) || "1".equals(job.getString("operationType")) || "4".equals(job.getString("operationType"))) {
								/* 6.1 保存，修改，撤销 */
								Debug.log("6.1 委外退货单据保存，修改，撤销", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
								clearConsignByNumber(delegator, job.getString("number"));

								// 增加保存单据数据到当前库存表中
								List<GenericValue> pwList = delegator.findList("ConsignReturnProductStock", EntityCondition.makeCondition("number", job.getString("number")), null, null, null, false);
								if (pwList != null && pwList.size() > 0) {
									for (GenericValue bill : pwList) {
										if (bill.getString("warehouseWarehouseId") != null && !bill.getString("warehouseWarehouseId").isEmpty() && bill.getString("bomId") != null && !bill.getString("bomId").isEmpty()) {
											// 在仓库中减少加工件
											GenericValue billStock = delegator.makeValue("CurSaveMaterialBalance");
											billStock.set("id", UUID.randomUUID().toString());
											billStock.set("warehouseId", bill.getString("warehouseWarehouseId"));
											billStock.set("materialId", MaterialBomMgr.getInstance().getMaterialIdByBomId(bill.getString("bomId")));
											billStock.set("number", bill.getString("number"));
											billStock.set("volume", bill.getBigDecimal("volume").negate());
											billStock.set("totalSum", BigDecimal.ZERO);
											billStock.create();

											// 在加工商中增加加工件(暂时无法计算金额)
											/*
											 * 和客户确认，退货不需要增加加工商的加工件 GenericValue consignStock = delegator.makeValue("CurSaveConsignBalance"); consignStock.set("id", UUID.randomUUID().toString()); consignStock.set("supplierId", bill.getString("processorSupplierId")); consignStock.set("materialId", MaterialBomMgr.getInstance().getMaterialIdByBomId(bill.getString("bomId"))); consignStock.set("number", bill.getString("number")); consignStock.set("volume", bill.getBigDecimal("volume")); consignStock.set("totalSum", BigDecimal.ZERO); consignStock.create();
											 */
										}
									}
								}
							} else if ("2".equals(job.getString("operationType")) || "3".equals(job.getString("operationType"))) {
								/* 6.2 删除，提交 */
								Debug.log("6.2 委外退货单据删除，提交", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
								clearConsignByNumber(delegator, job.getString("number"));
							}

						} else if ("WorkshopDrawMaterial".equals(job.getString("billType"))) {
							/* 7 制造领料单据处理 */
							Debug.log("7 制造领料单据处理", module);
							if ("0".equals(job.getString("operationType")) || "1".equals(job.getString("operationType")) || "4".equals(job.getString("operationType"))) {
								/* 6.1 保存，修改，撤销 */
								Debug.log("7.1 制造领料单据保存，修改，撤销", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
								clearWorkshopByNumber(delegator, job.getString("number"));

								// 增加保存单据数据到当前库存表中
								List<GenericValue> pwList = delegator.findList("WorkshopDrawMaterialStock", EntityCondition.makeCondition("number", job.getString("number")), null, null, null, false);
								if (pwList != null && pwList.size() > 0) {
									for (GenericValue bill : pwList) {
										if (bill.getString("warehouseWarehouseId") != null && !bill.getString("warehouseWarehouseId").isEmpty() && bill.getString("workshopWorkshopId") != null && !bill.getString("workshopWorkshopId").isEmpty() && bill.getString("materialMaterialId") != null && !bill.getString("materialMaterialId").isEmpty()) {
											// 在仓库中扣除领料
											BigDecimal sum = bill.getBigDecimal("volume").multiply(PriceMgr.getInstance().getPrice(bill.getString("warehouseWarehouseId"), bill.getString("materialMaterialId")));

											GenericValue billStock = delegator.makeValue("CurSaveMaterialBalance");
											billStock.set("id", UUID.randomUUID().toString());
											billStock.set("warehouseId", bill.getString("warehouseWarehouseId"));
											billStock.set("materialId", bill.getString("materialMaterialId"));
											billStock.set("number", bill.getString("number"));
											billStock.set("volume", bill.getBigDecimal("volume").negate());
											billStock.set("totalSum", sum.negate());
											billStock.create();

											// 在车间中增加物料
											GenericValue workshopStock = delegator.makeValue("CurSaveWorkshopBalance");
											workshopStock.set("id", UUID.randomUUID().toString());
											workshopStock.set("workshopId", bill.getString("workshopWorkshopId"));
											workshopStock.set("materialId", bill.getString("materialMaterialId"));
											workshopStock.set("number", bill.getString("number"));
											workshopStock.set("volume", bill.getBigDecimal("volume"));
											workshopStock.set("totalSum", sum);
											workshopStock.create();
										}
									}
								}
							} else if ("2".equals(job.getString("operationType")) || "3".equals(job.getString("operationType"))) {
								/* 7.2 删除，提交 */
								Debug.log("7.2 制造领料单据删除，提交", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
								clearWorkshopByNumber(delegator, job.getString("number"));
							}

						} else if ("WorkshopReturnMaterial".equals(job.getString("billType"))) {
							/* 8 制造退料单据处理 */
							Debug.log("8 制造退料单据处理", module);
							if ("0".equals(job.getString("operationType")) || "1".equals(job.getString("operationType")) || "4".equals(job.getString("operationType"))) {
								/* 8.1 保存，修改，撤销 */
								Debug.log("8.1 制造退料单据保存，修改，撤销", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
								clearWorkshopByNumber(delegator, job.getString("number"));

								// 增加保存单据数据到当前库存表中
								List<GenericValue> pwList = delegator.findList("WorkshopReturnMaterialStock", EntityCondition.makeCondition("number", job.getString("number")), null, null, null, false);
								if (pwList != null && pwList.size() > 0) {
									for (GenericValue bill : pwList) {
										if (bill.getString("warehouseWarehouseId") != null && !bill.getString("warehouseWarehouseId").isEmpty() && bill.getString("workshopWorkshopId") != null && !bill.getString("workshopWorkshopId").isEmpty() && bill.getString("materialMaterialId") != null && !bill.getString("materialMaterialId").isEmpty()) {
											// 在仓库中增加物料
											BigDecimal sum = bill.getBigDecimal("volume").multiply(WorkshopPriceMgr.getInstance().getPrice(bill.getString("workshopWorkshopId"), bill.getString("materialMaterialId")));

											GenericValue billStock = delegator.makeValue("CurSaveMaterialBalance");
											billStock.set("id", UUID.randomUUID().toString());
											billStock.set("warehouseId", bill.getString("warehouseWarehouseId"));
											billStock.set("materialId", bill.getString("materialMaterialId"));
											billStock.set("number", bill.getString("number"));
											billStock.set("volume", bill.getBigDecimal("volume"));
											billStock.set("totalSum", sum);
											billStock.create();

											// 在车间中减少物料
											GenericValue workshopStock = delegator.makeValue("CurSaveWorkshopBalance");
											workshopStock.set("id", UUID.randomUUID().toString());
											workshopStock.set("workshopId", bill.getString("workshopWorkshopId"));
											workshopStock.set("materialId", bill.getString("materialMaterialId"));
											workshopStock.set("number", bill.getString("number"));
											workshopStock.set("volume", bill.getBigDecimal("volume").negate());
											workshopStock.set("totalSum", sum.negate());
											workshopStock.create();
										}
									}
								}
							} else if ("2".equals(job.getString("operationType")) || "3".equals(job.getString("operationType"))) {
								/* 8.2 删除，提交 */
								Debug.log("8.2 制造退料单据删除，提交", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
								clearWorkshopByNumber(delegator, job.getString("number"));
							}

						} else if ("WorkshopWarehousing".equals(job.getString("billType"))) {
							/* 9 制造入库单据处理 */
							Debug.log("9 制造入库单据处理", module);
							if ("0".equals(job.getString("operationType")) || "1".equals(job.getString("operationType")) || "4".equals(job.getString("operationType"))) {
								/* 9.1 保存，修改，撤销 */
								Debug.log("9.1 制造入库单据保存，修改，撤销", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
								clearWorkshopByNumber(delegator, job.getString("number"));

								// 增加保存单据数据到当前库存表中
								List<GenericValue> pwList = delegator.findList("WorkshopWarehousingStock", EntityCondition.makeCondition("number", job.getString("number")), null, null, null, false);
								if (pwList != null && pwList.size() > 0) {
									for (GenericValue bill : pwList) {
										if (bill.getString("warehouseWarehouseId") != null && !bill.getString("warehouseWarehouseId").isEmpty() && bill.getString("workshopWorkshopId") != null && !bill.getString("workshopWorkshopId").isEmpty() && bill.getString("bomId") != null && !bill.getString("bomId").isEmpty()) {
											// 在仓库中增加加工件
											GenericValue billStock = delegator.makeValue("CurSaveMaterialBalance");
											billStock.set("id", UUID.randomUUID().toString());
											billStock.set("warehouseId", bill.getString("warehouseWarehouseId"));
											billStock.set("materialId", MaterialBomMgr.getInstance().getMaterialIdByBomId(bill.getString("bomId")));
											billStock.set("number", bill.getString("number"));
											billStock.set("volume", bill.getBigDecimal("volume"));
											billStock.set("totalSum", BigDecimal.ZERO);
											billStock.create();

											// 在车间中减少加工件(暂时无法计算金额)
											// 如果是已经提交单据，不需要执行
											if (bill.getInteger("status").intValue() != 4) {
												synchronized (WorkshopWarehousingEvents.updateLock) {
													Debug.log("3.开始入库单处理!", module);
													WorkshopPriceMgr.getInstance().CreateWorkshopPriceDetailList(bill.getString("workshopWorkshopId"), bill.getString("bomId"), bill.getString("entryId"), bill.getBigDecimal("volume"));

													Debug.log("4.完成入库单处理!", module);
												}
											}
											List<List<Object>> materialList = WorkshopPriceMgr.getInstance().getMaterialList(bill.getString("entryId"));
											for (List<Object> element : materialList) {
												GenericValue workshopStock = delegator.makeValue("CurSaveWorkshopBalance");
												workshopStock.set("id", UUID.randomUUID().toString());
												workshopStock.set("workshopId", bill.getString("workshopWorkshopId"));
												workshopStock.set("materialId", (String) element.get(0));
												workshopStock.set("number", bill.getString("number"));
												workshopStock.set("volume", ((BigDecimal) element.get(1)).negate());
												workshopStock.set("totalSum", ((BigDecimal) element.get(2)).negate());
												workshopStock.create();
											}
										}
									}
								}
							} else if ("2".equals(job.getString("operationType")) || "3".equals(job.getString("operationType"))) {
								/* 9.2 删除，提交 */
								Debug.log("9.2 制造入库单据删除，提交", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
								clearWorkshopByNumber(delegator, job.getString("number"));
							}

						} else if ("WorkshopReturnProduct".equals(job.getString("billType"))) {
							/* 10 制造退货单据处理 */
							Debug.log("10 制造退货单据处理", module);
							if ("0".equals(job.getString("operationType")) || "1".equals(job.getString("operationType")) || "4".equals(job.getString("operationType"))) {
								/* 10.1 保存，修改，撤销 */
								Debug.log("10.1 制造退货单据保存，修改，撤销", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
								clearWorkshopByNumber(delegator, job.getString("number"));

								// 增加保存单据数据到当前库存表中
								List<GenericValue> pwList = delegator.findList("WorkshopReturnProductStock", EntityCondition.makeCondition("number", job.getString("number")), null, null, null, false);
								if (pwList != null && pwList.size() > 0) {
									for (GenericValue bill : pwList) {
										if (bill.getString("warehouseWarehouseId") != null && !bill.getString("warehouseWarehouseId").isEmpty() && bill.getString("bomId") != null && !bill.getString("bomId").isEmpty()) {
											// 在仓库中减少加工件
											GenericValue billStock = delegator.makeValue("CurSaveMaterialBalance");
											billStock.set("id", UUID.randomUUID().toString());
											billStock.set("warehouseId", bill.getString("warehouseWarehouseId"));
											billStock.set("materialId", MaterialBomMgr.getInstance().getMaterialIdByBomId(bill.getString("bomId")));
											billStock.set("number", bill.getString("number"));
											billStock.set("volume", bill.getBigDecimal("volume").negate());
											billStock.set("totalSum", BigDecimal.ZERO);
											billStock.create();
										}
									}
								}
							} else if ("2".equals(job.getString("operationType")) || "3".equals(job.getString("operationType"))) {
								/* 10.2 删除，提交 */
								Debug.log("10.2 制造退货单据删除，提交", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
								clearWorkshopByNumber(delegator, job.getString("number"));
							}

						} else if ("WorkshopOtherDrawBill".equals(job.getString("billType"))) {
							/* 11 制造其它领料单据处理 */
							Debug.log("11 制造其它领料单据处理", module);
							if ("0".equals(job.getString("operationType")) || "1".equals(job.getString("operationType")) || "4".equals(job.getString("operationType"))) {
								/* 11.1 保存，修改，撤销 */
								Debug.log("11.1 制造其它领料单据保存，修改，撤销", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
								clearWorkshopByNumber(delegator, job.getString("number"));

								// 增加保存单据数据到当前库存表中
								List<GenericValue> pwList = delegator.findList("WorkshopOtherDrawBillStock", EntityCondition.makeCondition("number", job.getString("number")), null, null, null, false);
								if (pwList != null && pwList.size() > 0) {
									for (GenericValue bill : pwList) {
										if (bill.getString("warehouseWarehouseId") != null && !bill.getString("warehouseWarehouseId").isEmpty() && bill.getString("workshopWorkshopId") != null && !bill.getString("workshopWorkshopId").isEmpty() && bill.getString("materialMaterialId") != null && !bill.getString("materialMaterialId").isEmpty()) {
											// 在仓库中扣除领料
											BigDecimal sum = bill.getBigDecimal("volume").multiply(PriceMgr.getInstance().getPrice(bill.getString("warehouseWarehouseId"), bill.getString("materialMaterialId")));

											GenericValue billStock = delegator.makeValue("CurSaveMaterialBalance");
											billStock.set("id", UUID.randomUUID().toString());
											billStock.set("warehouseId", bill.getString("warehouseWarehouseId"));
											billStock.set("materialId", bill.getString("materialMaterialId"));
											billStock.set("number", bill.getString("number"));
											billStock.set("volume", bill.getBigDecimal("volume").negate());
											billStock.set("totalSum", sum.negate());
											billStock.create();

											// 在车间中增加物料
											GenericValue workshopStock = delegator.makeValue("CurSaveWorkshopBalance");
											workshopStock.set("id", UUID.randomUUID().toString());
											workshopStock.set("workshopId", bill.getString("workshopWorkshopId"));
											workshopStock.set("materialId", bill.getString("materialMaterialId"));
											workshopStock.set("number", bill.getString("number"));
											workshopStock.set("volume", bill.getBigDecimal("volume"));
											workshopStock.set("totalSum", sum);
											workshopStock.create();
										}
									}
								}
							} else if ("2".equals(job.getString("operationType")) || "3".equals(job.getString("operationType"))) {
								/* 11.2 删除，提交 */
								Debug.log("11.2 制造其它领料单据删除，提交", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
								clearWorkshopByNumber(delegator, job.getString("number"));
							}

						} else if ("ProductInwarehouse".equals(job.getString("billType"))) {
							/* 12 成品进仓单据处理 */
							Debug.log("12 成品进仓单据处理", module);
							if ("0".equals(job.getString("operationType")) || "1".equals(job.getString("operationType")) || "4".equals(job.getString("operationType"))) {
								if (job.getString("parameter").equals("N")) {
									List<GenericValue> pwList = delegator.findList("ProductInwarehouse", EntityCondition.makeCondition("number", job.getString("number")), null, null, null, false);
									if (pwList != null && pwList.size() > 0) {
										GenericValue gValue = pwList.get(0);
										List<GenericValue> entryList = delegator.findList("ProductInwarehouseEntry", EntityCondition.makeCondition("parentId", gValue.getString("id")), null, null, null, false);
										if (entryList != null && entryList.size() > 0) {
											for (GenericValue entryValue : entryList) {
												doInwarehouseSaveJob(delegator, entryValue.getString("id"));
											}
										}
									}
								} else {
									doInwarehouseSaveJob(delegator, job.getString("parameter"));
								}

							} else if ("2".equals(job.getString("operationType")) || "3".equals(job.getString("operationType"))) {
								/* 12.2 删除，提交 */
								Debug.log("12.2 成品进仓单据删除，提交", module);
								// 将原来当前库存表中存在的单据数据删除

								if (job.getString("parameter").equals("N")) {
									List<GenericValue> pwList = delegator.findList("ProductInwarehouse", EntityCondition.makeCondition("number", job.getString("number")), null, null, null, false);
									if (pwList != null && pwList.size() > 0) {
										GenericValue gValue = pwList.get(0);
										List<GenericValue> entryList = delegator.findList("ProductInwarehouseEntry", EntityCondition.makeCondition("parentId", gValue.getString("id")), null, null, null, false);
										if (entryList != null && entryList.size() > 0) {
											for (GenericValue entryValue : entryList) {
												clearBalanceByNumber(delegator, entryValue.getString("id"));
												clearWorkshopByNumber(delegator, entryValue.getString("id"));
											}
										}
									}
								} else {
									clearBalanceByNumber(delegator, job.getString("parameter"));
									clearWorkshopByNumber(delegator, job.getString("parameter"));
								}
							}

						} else if ("ProductOutwarehouse".equals(job.getString("billType"))) {
							/* 13 成品出仓单据处理 */
							Debug.log("13 成品出仓单据处理", module);
							if ("0".equals(job.getString("operationType")) || "1".equals(job.getString("operationType")) || "4".equals(job.getString("operationType"))) {
								if (job.getString("parameter").equals("N")) {
									List<GenericValue> pwList = delegator.findList("ProductOutwarehouse", EntityCondition.makeCondition("number", job.getString("number")), null, null, null, false);
									if (pwList != null && pwList.size() > 0) {
										GenericValue gValue = pwList.get(0);
										List<GenericValue> entryList = delegator.findList("ProductOutwarehouseEntry", EntityCondition.makeCondition("parentId", gValue.getString("id")), null, null, null, false);
										if (entryList != null && entryList.size() > 0) {
											for (GenericValue entryValue : entryList) {
												doOutwarehouseSaveJob(delegator, entryValue.getString("id"));
											}
										}
									}
								} else {
									doOutwarehouseSaveJob(delegator, job.getString("parameter"));
								}

							} else if ("2".equals(job.getString("operationType")) || "3".equals(job.getString("operationType"))) {
								/* 13.2 删除，提交 */
								Debug.log("13.2 成品出仓单据删除，提交", module);
								// 将原来当前库存表中存在的单据数据删除

								if (job.getString("parameter").equals("N")) {
									List<GenericValue> pwList = delegator.findList("ProductOutwarehouse", EntityCondition.makeCondition("number", job.getString("number")), null, null, null, false);
									if (pwList != null && pwList.size() > 0) {
										GenericValue gValue = pwList.get(0);
										List<GenericValue> entryList = delegator.findList("ProductOutwarehouseEntry", EntityCondition.makeCondition("parentId", gValue.getString("id")), null, null, null, false);
										if (entryList != null && entryList.size() > 0) {
											for (GenericValue entryValue : entryList) {
												clearBalanceByNumber(delegator, entryValue.getString("id"));
											}
										}
									}
								} else {
									clearBalanceByNumber(delegator, job.getString("parameter"));
								}
							}

						} else if ("ProductManualOutwarehouse".equals(job.getString("billType"))) {
							/* 14 成品手工出仓单据处理 */
							Debug.log("14 成品手工出仓单据处理", module);
							if ("0".equals(job.getString("operationType")) || "1".equals(job.getString("operationType")) || "4".equals(job.getString("operationType"))) {
								/* 14.1 保存，修改，撤销 */
								Debug.log("14.1 成品手工出仓单据保存，修改，撤销", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));

								// 增加保存单据数据到当前库存表中
								List<GenericValue> pwList = delegator.findList("ProductManualOutwarehouseStock", EntityCondition.makeCondition("number", job.getString("number")), null, null, null, false);
								if (pwList != null && pwList.size() > 0) {
									for (GenericValue bill : pwList) {
										if (bill.getString("warehouseWarehouseId") != null && !bill.getString("warehouseWarehouseId").isEmpty() && bill.getString("materialMaterialId") != null && !bill.getString("materialMaterialId").isEmpty()) {
											GenericValue billStock = delegator.makeValue("CurSaveMaterialBalance");
											billStock.set("id", UUID.randomUUID().toString());
											billStock.set("warehouseId", bill.getString("warehouseWarehouseId"));
											billStock.set("materialId", bill.getString("materialMaterialId"));
											billStock.set("number", bill.getString("number"));
											billStock.set("volume", bill.getBigDecimal("volume").negate());
											billStock.set("totalSum", bill.getBigDecimal("volume").multiply(PriceMgr.getInstance().getPrice(bill.getString("warehouseWarehouseId"), bill.getString("materialMaterialId"))).negate());
											billStock.create();
										}
									}
								}
							} else if ("2".equals(job.getString("operationType")) || "3".equals(job.getString("operationType"))) {
								/* 14.2 删除，提交 */
								Debug.log("14.2 成品手工出仓单据删除，提交", module);
								// 将原来当前库存表中存在的单据数据删除
								clearBalanceByNumber(delegator, job.getString("number"));
							}

						} else if ("ProductReturn".equals(job.getString("billType"))) {
							/* 15 成品退货单据处理 */
							Debug.log("15 成品退货单据处理", module);

						}
						job.set("status", "1");
						job.store();
						Debug.log("完成单据操作任务！", module);
						TransactionUtil.commit(beganTransaction);
					} catch (Exception e) {
						Debug.logError(e, module);
						try {
							TransactionUtil.rollback(beganTransaction, e.getMessage(), e);
						} catch (GenericTransactionException e2) {
							e.printStackTrace();
							return ServiceUtil.returnError(e.getMessage());
						}
						e.printStackTrace();
						return ServiceUtil.returnError(e.getMessage());
					}
				}

			}
		} catch (GenericEntityException e1) {
			e1.printStackTrace();
			return ServiceUtil.returnError(e1.getMessage());
		}
		return ServiceUtil.returnSuccess();
	}

	public static int clearBalanceByNumber(Delegator delegator, String number) throws Exception {
		return delegator.removeByCondition("CurSaveMaterialBalance", EntityCondition.makeCondition("number", number));
	}

	public static int clearConsignByNumber(Delegator delegator, String number) throws Exception {
		return delegator.removeByCondition("CurSaveConsignBalance", EntityCondition.makeCondition("number", number));
	}

	public static int clearWorkshopByNumber(Delegator delegator, String number) throws Exception {
		return delegator.removeByCondition("CurSaveWorkshopBalance", EntityCondition.makeCondition("number", number));
	}

	public static void doInwarehouseSaveJob(Delegator delegator, String entryId) throws Exception {
		/* 12.1 保存，修改，撤销 */
		Debug.log("12.1 成品进仓单据保存，修改，撤销", module);
		// 将原来当前库存表中存在的单据数据删除
		clearBalanceByNumber(delegator, entryId);
		clearWorkshopByNumber(delegator, entryId);

		// 增加保存单据数据到当前库存表中
		GenericValue gValue = delegator.findOne("ProductInwarehouseEntry", UtilMisc.toMap("id", entryId), false);
		if (gValue != null) {
			if (gValue.getString("warehouseWarehouseId") != null && !gValue.getString("warehouseWarehouseId").isEmpty() && gValue.getString("workshopWorkshopId") != null && !gValue.getString("workshopWorkshopId").isEmpty() && gValue.getString("materialMaterialId") != null && !gValue.getString("materialMaterialId").isEmpty()) {
				GenericValue billStock = delegator.makeValue("CurSaveMaterialBalance");
				billStock.set("id", UUID.randomUUID().toString());
				billStock.set("warehouseId", gValue.getString("warehouseWarehouseId"));
				billStock.set("materialId", gValue.getString("materialMaterialId"));
				billStock.set("number", entryId);
				billStock.set("volume", gValue.getBigDecimal("volume"));
				billStock.set("totalSum", BigDecimal.ZERO);
				billStock.create();
			}

			List<ConsumeMaterial> materialList = ProductWarehouseBizImp.getMaterialList(entryId, gValue.getString("materialMaterialId"));
			for (ConsumeMaterial element : materialList) {
				if (element.getMaterialId() != null && !element.getMaterialId().isEmpty()) {
					// 在车间中减少物料
					BigDecimal bomAmount =element.getDetailId()==null? gValue.getBigDecimal("volume").multiply(element.getConsumeQty()):element.getConsumeQty();
					
					GenericValue workshopStock = delegator.makeValue("CurSaveWorkshopBalance");
					workshopStock.set("id", UUID.randomUUID().toString());
					workshopStock.set("workshopId", gValue.getString("workshopWorkshopId"));
					workshopStock.set("materialId", element.getMaterialId());
					workshopStock.set("number", entryId);
					workshopStock.set("volume", bomAmount.negate());
					workshopStock.set("totalSum", BigDecimal.ZERO);
					workshopStock.create();
				}
			}
		}
	}

	public static void doOutwarehouseSaveJob(Delegator delegator, String entryId) throws Exception {
		/* 13.1 保存，修改，撤销 */
		Debug.log("13.1 成品出仓单据保存，修改，撤销", module);
		// 将原来当前库存表中存在的单据数据删除
		clearBalanceByNumber(delegator, entryId);

		// 增加保存单据数据到当前库存表中
		GenericValue gValue = delegator.findOne("ProductOutwarehouseEntry", UtilMisc.toMap("id", entryId), false);
		if (gValue != null) {
			if (gValue.getString("warehouseWarehouseId") != null && !gValue.getString("warehouseWarehouseId").isEmpty() && gValue.getString("materialMaterialId") != null && !gValue.getString("materialMaterialId").isEmpty()) {
				GenericValue billStock = delegator.makeValue("CurSaveMaterialBalance");
				billStock.set("id", UUID.randomUUID().toString());
				billStock.set("warehouseId", gValue.getString("warehouseWarehouseId"));
				billStock.set("materialId", gValue.getString("materialMaterialId"));
				billStock.set("number", entryId);
				billStock.set("volume", gValue.getBigDecimal("volume").negate());
				billStock.set("totalSum", BigDecimal.ZERO);
				billStock.create();
			}
		}
	}
}
