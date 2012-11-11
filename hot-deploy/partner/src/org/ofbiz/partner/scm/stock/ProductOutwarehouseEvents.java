package org.ofbiz.partner.scm.stock;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
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

/**
 * 成品出仓单业务事件类
 * 
 * @author Mark
 * 
 */
public class ProductOutwarehouseEvents {
	private static final String module = org.ofbiz.partner.scm.stock.ProductOutwarehouseEvents.class.getName();

	/**
	 * 成品出仓提交
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String submitBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();

			Delegator delegator = (Delegator) request.getAttribute("delegator");
			String billId = request.getParameter("billId");// 单据id
			Date bizDate = null;
			if (delegator != null && billId != null) {
				Debug.log("成品出仓单提交:" + billId, module);
				GenericValue billHead = delegator.findOne("ProductOutwarehouse", UtilMisc.toMap("id", billId), false);

				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ProductOutwarehouse bill or bizdate is null");
				}
				// 注意不能使用billHead.getDate方法，出产生castException异常
				bizDate = (Date) billHead.get("bizDate");

				// 确定该单据为扫描单据还是手工单据。
				boolean isScanBill = false;
				int billType = billHead.getInteger("billType");
				if (billType == 2) {
					isScanBill = true;
				}

				// 获取单据分录条目
				List<GenericValue> entryList = delegator.findByAnd("ProductOutwarehouseEntry", UtilMisc.toMap("parentId", billId));

				for (GenericValue v : entryList) {
					String barcode1 = v.getString("barcode1");
					String barcode2 = v.getString("barcode2");

					String materialId = v.getString("materialMaterialId");// 打板物料id
					BigDecimal volume = v.getBigDecimal("volume");// 出库数量（板）
					Long qantity = v.getLong("qantity");// 板数量（一板有多少产品）

					BigDecimal wsVolume = volume;
					ProductStockType type = ProductStockType.OUT;
					// 改版出仓时，使用改版类型，然后将改版数取负
					if ("2".equals(v.getString("outwarehouseType"))) {
						type = ProductStockType.CHG;
						wsVolume = wsVolume.negate();
					}

					// 扫描单据在扫描的时候已经处理了出货通知单，不需要重新处理
					if (!isScanBill) {
						// 确定条码、序列号可以出仓
						ProductBarcodeBoxMgr.getInstance().update(barcode1, barcode2, true);
						
						// 更新周汇总表
						WeeklyStockMgr.getInstance().updateStock(materialId, bizDate, type, wsVolume, false);
						ProductInOutStockMgr.getInstance().updateStock(materialId, ProductStockType.OUT, qantity, volume, false);

						// 出货通知单
						boolean isUpdate = updateNotification(v, delegator, materialId, volume, v.getString("goodNumber"));
						if (!isUpdate) {
							throw new Exception("未找到产品对应的出货通知单，请检查货号是否填写正确。如果无相应出货通知单，请先提交通知单！");
						}
					}

					v.set("prdWeek", Utils.getYearWeekStr(bizDate));
					v.store();
				}
				// 出仓单业务处理
				BizStockImpFactory.getBizStockImp(BillType.ProductOutwarehouse).updateStock(billHead, true, false);

				BillBaseEvent.submitBill(request, response);// 更新单据状态
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
		return "success";
	}

	/**
	 * 成品出仓单撤销
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String rollbackBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();

			Delegator delegator = (Delegator) request.getAttribute("delegator");
			String billId = request.getParameter("billId");// 单据id
			Date bizDate = null;
			if (delegator != null && billId != null) {
				Debug.log("成品出仓单撤销:" + billId, module);
				GenericValue billHead = delegator.findOne("ProductOutwarehouse", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ProductOutwarehouse bill or bizdate is null");
				}
				// 注意不能使用billHead.getDate方法，出产生castException异常
				bizDate = (Date) billHead.get("bizDate");

				// 确定该单据为扫描单据还是手工单据。
				boolean isScanBill = false;
				int billType = billHead.getInteger("billType");
				if (billType == 2) {
					isScanBill = true;
				}

				// 获取单据分录条目
				List<GenericValue> entryList = delegator.findByAnd("ProductOutwarehouseEntry", UtilMisc.toMap("parentId", billId));

				for (GenericValue v : entryList) {
					String barcode1 = v.getString("barcode1");
					String barcode2 = v.getString("barcode2");

					String materialId = v.getString("materialMaterialId");// 打板物料id
					BigDecimal volume = v.getBigDecimal("volume");// 出库数量（板）
					Long qantity = v.getLong("qantity");// 板数量（一板有多少产品）

					BigDecimal wsVolume = volume;
					ProductStockType type = ProductStockType.OUT;
					// 改版出仓时，使用改版类型，然后将改版数取负
					if ("2".equals(v.getString("outwarehouseType"))) {
						type = ProductStockType.CHG;
						wsVolume = wsVolume.negate();
					}

					// 扫描单据在扫描的时候已经处理了出货通知单，不做撤销处理
					if (!isScanBill) {
						// 确定条码、序列号可以进仓
						ProductBarcodeBoxMgr.getInstance().update(barcode1, barcode2, false);
						
						// 更新周汇总表
						WeeklyStockMgr.getInstance().updateStock(materialId, bizDate, type, wsVolume, true);
						ProductInOutStockMgr.getInstance().updateStock(materialId, ProductStockType.OUT, qantity, volume, true);

						// 出货通知单
						boolean isUpdate = updateNotification(v, delegator, materialId, volume.negate(), v.getString("goodNumber"));
						if (!isUpdate) {
							throw new Exception("未找到产品对应的出货通知单，请检查货号是否填写正确。如果无相应出货通知单，请先提交通知单！");
						}
					}
				}
				// 出仓单撤销业务处理
				BizStockImpFactory.getBizStockImp(BillType.ProductOutwarehouse).updateStock(billHead, false, true);

				BillBaseEvent.rollbackBill(request, response);// 撤销单据
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
		return "success";
	}

	/**
	 * 扫描出仓单确认提交 ,生成成品进仓单，并提交
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String scanSubmit(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");

		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();
			/* 1. 校验数据合法性 */

			/* 2. 生成成品出仓单 */

			/* 2.1 新建成品出仓单据头 */
			List<GenericValue> headList = delegator.findByAnd("ProductOutwarehouse", "status", 0, "billType", 2, "submitterSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
			GenericValue billHead = null;
			Date currentDate = new Date();
			String billId = "";
			boolean isHasHead = false;
			if (headList.size() > 0) {
				for (GenericValue headValue : headList) {
					Date bizDate = (Date) headValue.get("bizDate");
					if (sdf.format(bizDate).equals(sdf.format(currentDate))) {
						billHead = headValue;
						billId = billHead.getString("id");
						isHasHead = true;
						break;
					}
				}
			}
			if (!isHasHead) {
				billHead = delegator.makeValue("ProductOutwarehouse");
				billId = UUID.randomUUID().toString();
				billHead.setString("id", billId);
				billHead.setString("number", new SerialNumberHelper().getSerialNumber(request, "ProductOutwarehouse"));
				billHead.set("bizDate", new Timestamp(currentDate.getTime()));
				billHead.set("submitterSystemUserId", CommonEvents.getAttributeFormSession(request, "uid"));
				billHead.set("status", 0); // 保存状态
				billHead.set("billType", 2); // 扫描类型，只能进行提交操作，不能删除
				billHead.set("submitStamp", new Timestamp(currentDate.getTime()));
				// 创建主单
				delegator.create(billHead);
			}

			JSONArray entrys = JSONArray.fromObject(request.getParameter("records"));
			JSONObject entry = (JSONObject) entrys.get(0);

			/* 2.2 构建成品出仓单据分录 更新相关联的成品出仓确认单 */
			if (entrys == null || entrys.size() < 1)
				throw new Exception("误操作，未找到扫描数据！");

			String entryId = UUID.randomUUID().toString();

			if (!entry.containsKey("outWarehouseType") || entry.getString("outWarehouseType").trim().length() < 1) {
				throw new Exception("出仓类型不能为空，请选择出仓类型！");
			}
			String outWarehouseType = entry.getString("outWarehouseType");

			if (!entry.containsKey("warehouseId") || entry.getString("warehouseId").trim().length() < 1) {
				throw new Exception("装货仓库不能为空，请选择装货仓库！");
			}
			String warehouseId = entry.getString("warehouseId");

			String workshopId = "";
			if (!"1".equals(outWarehouseType)) {
				if (!entry.containsKey("workshopId") || entry.getString("workshopId").trim().length() < 1) {
					throw new Exception("包装车间不能为空，请选择包装车间！");
				}
				workshopId = entry.getString("workshopId");
			}

			if (!entry.containsKey("goodNumber") || entry.getString("goodNumber").trim().length() < 1) {
				throw new Exception("货号不能为空，请输入货号！");
			}
			String[] goodNumbers = entry.getString("goodNumber").split(",");

			String barcode1 = entry.getString("barcode1");

			String barcode2 = entry.getString("barcode2");

			List<GenericValue> entryList = delegator.findByAnd("ProductOutwarehouseEntry", UtilMisc.toMap("parentId", billId, "barcode1", barcode1, "barcode2", barcode2));
			if (entryList.size() > 0) {
				throw new Exception("该产品条码、序列号已经扫描过，不允许重复扫描！");
			}

			BarCode barcode = new BarCode(barcode1, barcode2);
			String materialId = Utils.getMaterialIdByIkea(barcode.getCodeForIkea(), barcode.getQuantity());
			TMaterial material = new TMaterial(materialId);

			// 新成品出仓单分录
			GenericValue entryValue = delegator.makeValue("ProductOutwarehouseEntry");
			entryValue.setString("id", entryId);
			entryValue.setString("parentId", billId);
			entryValue.setString("prdWeek", Utils.getYearWeekStr(new Date()));
			entryValue.setString("workshopWorkshopId", workshopId);
			entryValue.setString("warehouseWarehouseId", warehouseId);
			entryValue.setString("materialMaterialId", materialId);
			entryValue.setString("unitUnitId", material.getUnitId());
			entryValue.set("volume", new BigDecimal(1));
			entryValue.setString("barcode1", barcode1);
			entryValue.setString("barcode2", barcode2);
			entryValue.setString("outwarehouseType", outWarehouseType);
			entryValue.set("qantity", Long.parseLong(barcode.getQuantity()));
			entryValue.set("sort", 1);


			// 确定条码、序列号可以出仓
			ProductBarcodeBoxMgr.getInstance().update(barcode1, barcode2,true);

			// 创建分录
			delegator.create(entryValue);

			// 扫描时，更新报表数据
			BigDecimal wsVolume = new BigDecimal(1);
			ProductStockType type = ProductStockType.OUT;
			// 改版出仓时，使用改版类型，然后将改版数取负
			if ("2".equals(outWarehouseType)) {
				type = ProductStockType.CHG;
				wsVolume = wsVolume.negate();
			}

			// 成品进仓周表
			WeeklyStockMgr.getInstance().updateStock(materialId, currentDate, type, wsVolume, false);

			// 成品出仓综合成品账
			ProductInOutStockMgr.getInstance().updateStock(materialId, ProductStockType.OUT, Long.parseLong(barcode.getQuantity()), new BigDecimal(1), false);

			// 出货通知单
			boolean isUpdate = false;
			for (String goodNumber : goodNumbers) {// 遍历所有货号，直到找到对应的出货通知单
				isUpdate = updateNotification(entryValue, delegator, materialId, new BigDecimal(1), goodNumber);
				if (isUpdate) {
					entryValue.setString("goodNumber", goodNumber);
					entryValue.store(); // 补填货号
					break;
				}
			}
			if (!isUpdate) {
				throw new Exception("未找到产品对应的出货通知单，请检查货号是否填写正确。如果无相应出货通知单，请先提交通知单！");
			}

			/*
			 * 扫描时不进行提交操作，后面再人工提交出仓单
			 * 
			 * 
			 * // 处理成品出仓业务类
			 * BizStockImpFactory.getBizStockImp(BillType.ProductOutwarehouse
			 * ).updateStock(billHead, true, false);
			 */

			StringBuffer jsonStr = new StringBuffer();
			jsonStr.append("{'success':true,'qantity':" + barcode.getQuantity() + "}");
			BillBaseEvent.writeSuccessMessageToExt(response, jsonStr.toString());
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
	 * 撤销扫描提交
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String scanRollback(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Delegator delegator = (Delegator) request.getAttribute("delegator");

		boolean beganTransaction = false;
		try {
			beganTransaction = TransactionUtil.begin();
			/* 1. 校验数据合法性 */
			JSONArray entrys = JSONArray.fromObject(request.getParameter("records"));
			JSONObject entry = (JSONObject) entrys.get(0);

			if (entrys == null || entrys.size() < 1)
				throw new Exception("误操作，未找到扫描数据！");

			String barcode1 = "";
			String barcode2 = "";

			barcode1 = entry.getString("barcode1");
			barcode2 = entry.getString("barcode2");

			// 1.2确定条码、序列号可以进仓
			ProductBarcodeBoxMgr.getInstance().update(barcode1, barcode2,false);

			/* 2 获取单据分录条目 */
			List<GenericValue> entryList = delegator.findByAnd("ProductOutwarehouseEntry", UtilMisc.toMap("barcode1", barcode1, "barcode2", barcode2));
			GenericValue entryValue = null;
			GenericValue billHead = null;
			boolean isHasBill = false;
			if (entryList.size() > 0) {
				for (GenericValue record : entryList) {
					String billId = record.getString("parentId");
					List<GenericValue> headList = delegator.findByAnd("ProductOutwarehouse", "id", billId, "status", 0, "billType", 2, "submitterSystemUserId",
							CommonEvents.getAttributeFormSession(request, "uid"));
					if (headList.size() > 0) {
						billHead = headList.get(0);
						entryValue = record;
						isHasBill = true;
						break;
					}
				}
				if (!isHasBill) {
					throw new Exception("无法进行撤销操作,可能由于下面两张情况导致：<br>1.该产品条码、序列号的单据已经提交；<br>2.该产品条码、序列号的单据不是本人提交。");
				}
			} else {
				throw new Exception("无法找到该产品条码、序列号，请确认是否已经扫描！");
			}

			/*
			 * 扫描时不进行提交操作，后面再人工提交进仓单
			 * 
			 * 
			 * // 3 获取单据分录条目 Debug.log("出仓单撤销:" + billId, module); GenericValue
			 * billHead = delegator.findOne("ProductOutwarehouse",
			 * UtilMisc.toMap("id", billId), false);
			 * 
			 * if (billHead == null || billHead.get("bizDate") == null) { throw
			 * new Exception("找不到相应的成品出仓单！"); } //
			 * 注意不能使用billHead.getDate方法，出产生castException异常 Date bizDate = (Date)
			 * billHead.get("bizDate");
			 * 
			 * BizStockImpFactory.getBizStockImp(BillType.ProductOutwarehouse).
			 * updateStock(billHead, false, true);
			 */

			// 注意不能使用billHead.getDate方法，出产生castException异常
			Date bizDate = (Date) billHead.get("bizDate");

			String materialId = entryValue.getString("materialMaterialId");// 打板物料id
			BigDecimal volume = entryValue.getBigDecimal("volume");// 入库数量（板）
			Long qantity = entryValue.getLong("qantity");// 板数量（一板有多少产品）

			// 扫描时，更新报表数据
			BigDecimal wsVolume = volume;
			ProductStockType type = ProductStockType.OUT;
			// 改版出仓时，使用改版类型，然后将改版数取负
			if ("2".equals(entryValue.getString("outwarehouseType"))) {
				type = ProductStockType.CHG;
				wsVolume = wsVolume.negate();
			}

			// 3.1 成品进仓撤销，负数
			WeeklyStockMgr.getInstance().updateStock(materialId, bizDate, type, wsVolume, true);
			ProductInOutStockMgr.getInstance().updateStock(materialId, ProductStockType.OUT, qantity, volume, true);

			// 出货通知单
			boolean isUpdate = updateNotification(entryValue, delegator, materialId, volume.negate(), entryValue.getString("goodNumber"));
			if (!isUpdate) {
				throw new Exception("未找到产品对应的出货通知单，请检查货号是否填写正确。如果无相应出货通知单，请先提交通知单！");
			}

			entryValue.remove(); // 删除分录

			BillBaseEvent.writeSuccessMessageToExt(response, "进仓成功！");
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

	public static boolean updateNotification(GenericValue headValue, Delegator delegator, String materialId, BigDecimal volume, String goodNumber) throws Exception {
		if (!Utils.isNeedNotification()) {
			return true; // 不使用出货通知单
		}
		List<GenericValue> mainList = delegator.findByAnd("ProductOutNotification", "goodNumber", goodNumber, "status", 4);
		boolean isUpdate = false;
		boolean isFinished = true;
		boolean needSubmit = false;
		if (mainList.size() > 0) {
			GenericValue v = mainList.get(0); // 只取第一条，默认一个货号只能唯一对应一条通知单
			List<GenericValue> entryList = delegator.findByAnd("ProductOutNotificationEntry", UtilMisc.toMap("parentId", v.getString("id")));
			for (GenericValue entry : entryList) {
				// 判断是否该分录是否存在出货对数单，如果不存在，不作任何操作（正常情况不存在，避免有脏数据时出错）
				List<GenericValue> verifyHeadlList = delegator.findByAnd("ProductOutVerifyHead", "deliverNumber", v.getString("deliverNumber"), "materialId", entry.getString("materialId"));
				if (verifyHeadlList.size() > 0) {
					// 通过出货通知单的“单号”和出货通知单分录的“产品编码”，查找符合出货对数单中是否存在计划出货产品
					List<GenericValue> verifyEntrylList = delegator.findByAnd("ProductOutVerifyEntry", "deliverNumber", v.getString("deliverNumber"), "parentMaterialId", entry.getString("materialId"));
					for (GenericValue verifyEntry : verifyEntrylList) {
						if (!isUpdate) {
							// 更新未完成入柜的记录
							if (volume.compareTo(BigDecimal.ZERO) > 0) {
								// 数量大于零，属于扫描出仓
								if (materialId.equals(verifyEntry.getString("materialId")) && "N".equals(verifyEntry.getString("isFinished"))) {
									verifyEntry.set("sentQty", verifyEntry.getBigDecimal("sentQty").add(volume));
									if (verifyEntry.getBigDecimal("sentQty").compareTo(verifyEntry.getBigDecimal("orderQty")) == 0) {
										verifyEntry.set("isFinished", "Y"); // 判断该出仓对数单分录是否完成
									}
									verifyEntry.store();
									isUpdate = true;

									// 将出货通知单信息返填到出仓单
									headValue.set("containerNumber", v.getString("finalContainerNumber"));
									headValue.set("sealNumber", v.getString("sealNumber"));
									headValue.set("destinhouseNumber", v.getString("finalHouseNumber"));
								}
							} else {
								if (materialId.equals(verifyEntry.getString("materialId"))) {
									verifyEntry.set("sentQty", verifyEntry.getBigDecimal("sentQty").add(volume));
									if ("Y".equals(verifyEntry.getString("isFinished"))) {
										verifyEntry.set("isFinished", "N");
									}
									verifyEntry.store();
									isUpdate = true;

									// 更新出仓单
									headValue.set("containerNumber", "");
									headValue.set("sealNumber", "");
									headValue.set("destinhouseNumber", "");
								}
							}
						}

						// 出仓后，判断所有的第三分录是否已经完成
						if (BigDecimal.ZERO.compareTo(verifyEntry.getBigDecimal("sentQty")) != 0) {
							needSubmit = true;
						}

						// 出仓后，判断所有的第三分录是否已经完成
						if ("N".equals(verifyEntry.getString("isFinished"))) {
							isFinished = false;
						}
					}
					
					GenericValue verifyHead = verifyHeadlList.get(0); // 只取第一条，默认一对单号、产品编码只能唯一对应一条对数单
					verifyHead.setString("isFinished", isFinished ? "Y" : "N");
					
					// 判断该对数单是否为提交状态，如果未提交，将状态更新为提交
					if (needSubmit) {
						verifyHead.set("status", 4);
					} else {
						verifyHead.set("status", 0);
					}
					verifyHead.store();
				}
			}

			if (isUpdate) {
				headValue.store();

//				// 返填出货通知单状态
//				v.setString("isFinished", isFinished ? "Y" : "N");
//				v.store();
			}
		}
		return isUpdate;
	}
}
