package org.ofbiz.partner.scm.stock;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.ofbiz.base.util.Debug;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.common.Utils;

/**
 * 综合成品账表维护类，提供该表操作接口
 * 
 * @author jeff 2012-8-23
 * 
 */
public class ProductInOutStockMgr {
	private static final String module = org.ofbiz.partner.scm.stock.ProductInOutStockMgr.class.getName();

	private ProductInOutStockMgr() {
	}

	private static ProductInOutStockMgr instance;

	public static ProductInOutStockMgr getInstance() {
		if (instance == null) {
			instance = new ProductInOutStockMgr();
		}
		return instance;
	}

	/**
	 * 更新综合成品账
	 * 
	 * @param materialId
	 *            物料id
	 * @param date
	 *            日期
	 * @param type
	 *            业务类型 ，进仓，出仓
	 * @param qty
	 *            板数量（每板有多少件产品）
	 * @param isCancel
	 *            是否为撤销操作
	 * @throws Exception
	 * @author jeff 2012-8-23
	 */
	public synchronized void updateStock(String materialId, ProductStockType type, Long qantity, BigDecimal volume, boolean isCancel) throws Exception {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		Date date = new Date();	//记录实际入库出库日期
		if (materialId == null || date == null || qantity == null) {
			Debug.logError("物料id或者日期或者数量 为空！", module);
			throw new IllegalArgumentException("物料id或者日期或者数量 为空！");
		}
		
		Delegator delegator = Utils.getDefaultDelegator();

		/* 1. 查询是否存在该物料的记录 */
		GenericValue record = delegator.findOne("ProInOutDateDetail", false, "materialId", materialId, "tradDate", sdf.format(date), "qantity", qantity);
		
		BigDecimal curPreMonthVolume = BigDecimal.ZERO;
		BigDecimal curTodayInVolume = BigDecimal.ZERO;
		BigDecimal curTodayOutVolume = BigDecimal.ZERO;
		BigDecimal curTodayVolume = BigDecimal.ZERO;
		BigDecimal curThisMonthInVolume = BigDecimal.ZERO;
		BigDecimal curThisMonthOutVolume = BigDecimal.ZERO;
		
		if (record == null) {
			record = delegator.makeValue("ProInOutDateDetail");
			record.setString("tradDate", sdf.format(date));
			record.setString("materialId", materialId);
			record.set("qantity", qantity);
			record.set("preMonthVolume", curPreMonthVolume);
		} else {
			if(record.getBigDecimal("todayInVolume") != null)curTodayInVolume = record.getBigDecimal("todayInVolume");
			if(record.getBigDecimal("todayOutVolume") != null)curTodayOutVolume = record.getBigDecimal("todayOutVolume");
			if(record.getBigDecimal("todayVolume") != null)curTodayVolume = record.getBigDecimal("todayVolume");
			if(record.getBigDecimal("thisMonthInVolume") != null)curThisMonthInVolume = record.getBigDecimal("thisMonthInVolume");
			if(record.getBigDecimal("thisMonthOutVolume") != null)curThisMonthOutVolume = record.getBigDecimal("thisMonthOutVolume");
		}
		
		/* 2. 如果是反操作需要减数量 */
		if (isCancel)
			volume = volume.negate();

		// added by jeff 2012-8-24
		switch (type) {
		case IN:
			record.set("todayInVolume", curTodayInVolume.add(volume));
			record.set("todayVolume", curTodayVolume.add(volume));
			record.set("thisMonthInVolume", curThisMonthInVolume.add(volume));
			break;
		case OUT:
			record.set("todayOutVolume", curTodayOutVolume.add(volume));
			record.set("todayVolume", curTodayVolume.add(volume).negate());
			record.set("thisMonthOutVolume", curThisMonthOutVolume.add(volume));
			break;
		default:
			break;
		}

		/* 4. 新增或者更新 */
		delegator.createOrStore(record);
	}
}
