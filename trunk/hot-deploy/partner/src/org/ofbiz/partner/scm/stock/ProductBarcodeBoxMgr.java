package org.ofbiz.partner.scm.stock;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.common.BarCode;
import org.ofbiz.partner.scm.common.Utils;

/**
 * 维护成品库存板的编码，提供该表操作接口
 * 
 * @author jeff 2012-9-17
 * 
 */
public class ProductBarcodeBoxMgr {
	private static final String module = org.ofbiz.partner.scm.stock.ProductBarcodeBoxMgr.class.getName();

	private ProductBarcodeBoxMgr() {
	}

	private static ProductBarcodeBoxMgr instance;

	public static ProductBarcodeBoxMgr getInstance() {
		if (instance == null) {
			instance = new ProductBarcodeBoxMgr();
		}
		return instance;
	}

	/**
	 * 更新库存板的条码和序列号
	 * 保证该表数据和库存板条码、序列号一致
	 * 
	 * @param barcode1
	 *            产品条码
	 * @param barcode2
	 *            序列号
	 * @param isOut
	 *            是否为出库
	 * @throws Exception
	 * @author jeff 2012-9-18
	 * 
	 * 修改备注
	 * 2012-11-29 mark 扩展表添加ikeaNumber，week，materialId，warehouseId，perBoardQty字段
	 * 
	 */
	public synchronized boolean update(String ikeaNumber,String week ,String materialId,String warehosueId,String barcode1, String barcode2,BigDecimal perBoardQty, boolean isOut) throws Exception {
		if (barcode1 == null || barcode2 == null ) {
			Debug.logError("产品条码、序列号不能为空！", module);
			throw new IllegalArgumentException("产品条码、序列号不能为空！");
		}
		
		Delegator delegator = Utils.getDefaultDelegator();

		/* 1. 查询是否存在该物料的记录 */
		List<GenericValue> barcodeList = delegator.findByAnd("ProductBarcodeBox", UtilMisc.toMap("barcode1", barcode1, "barcode2", barcode2));
		if(barcodeList!=null && barcodeList.size()>0){
			if(isOut){
				delegator.removeValue(barcodeList.get(0));
				return true;
			} else {
				throw new Exception("库存中已经存在该产品条码、序列号的板，可能由于重复进仓导致！");
			}
		} else {
			if(isOut){
				throw new Exception("库存中找不到该产品条码、序列号的板！");
			} else {
				
				GenericValue record = delegator.makeValue("ProductBarcodeBox");
				record.set("id", UUID.randomUUID().toString());
				record.set("bizDate", new Timestamp(new Date().getTime()));
				record.set("barcode1", barcode1);
				record.set("barcode2", barcode2);
				
				record.set("ikeaNumber", ikeaNumber);
				record.set("week", week);
				record.set("materialId", materialId);
				record.set("warehouseId", warehosueId);
				record.set("perBoardQty", perBoardQty);
				delegator.create(record);
				return true;
			}
		}
	}
}
