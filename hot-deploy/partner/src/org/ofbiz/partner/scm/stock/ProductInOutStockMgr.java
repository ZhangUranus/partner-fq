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
		
		// 20121227：报表中的上月数量在库存表中获取cur_material_balance，字段preMonthVolume弃用。
		// BigDecimal curPreMonthVolume = BigDecimal.ZERO;
		BigDecimal curTodayInVolume = BigDecimal.ZERO;
		BigDecimal curTodayOutVolume = BigDecimal.ZERO;
		BigDecimal curTodayVolume = BigDecimal.ZERO;
		BigDecimal curThisMonthInVolume = BigDecimal.ZERO;
		BigDecimal curThisMonthOutVolume = BigDecimal.ZERO;
		
//		<field name="preMonthVolume" type="fixed-point"></field><!-- 上月数量 -->
//		<field name="todayInVolume" type="fixed-point"></field><!-- 本日入库数量 -->
//		<field name="todayOutVolume" type="fixed-point"></field><!-- 本日出库数量 -->
//		<field name="todayVolume" type="fixed-point"></field><!-- 本日结存数量 -->
//		<field name="thisMonthInVolume" type="fixed-point"></field><!-- 当月累计入库数量 -->
//		<field name="thisMonthOutVolume" type="fixed-point"></field><!-- 当月累计出库数量 -->
		
		if (record == null) {
			//List<GenericValue> balanceList = delegator.findByAnd("CurMaterialBalance", UtilMisc.toMap("materialId", materialId));
			
			// 20121227：报表中的上月数量在库存表中获取cur_material_balance，字段preMonthVolume弃用。
//			for(GenericValue bv : balanceList){
//				if(bv.getBigDecimal("volume")!=null){
//					curPreMonthVolume = curPreMonthVolume.add(bv.getBigDecimal("volume"));
//				}
//			}
			// curPreMonthVolume = curPreMonthVolume.subtract(volume);//获取时已经加了本次更新数量
//			if(curPreMonthVolume.compareTo(BigDecimal.ZERO) < 0){
//				curPreMonthVolume = BigDecimal.ZERO;
//			}
			//curTodayVolume = curPreMonthVolume;
			record = delegator.makeValue("ProInOutDateDetail");
			record.setString("tradDate", sdf.format(date));
			record.setString("materialId", materialId);
			record.set("qantity", qantity);
			// 20121227：报表中的上月数量在库存表中获取cur_material_balance，字段preMonthVolume弃用。
			// record.set("preMonthVolume", curPreMonthVolume);
			record.set("todayVolume", volume);
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
			record.set("todayVolume", curTodayVolume.subtract(volume));
			record.set("thisMonthOutVolume", curThisMonthOutVolume.add(volume));
			break;
		default:
			break;
		}

		/* 4. 新增或者更新 */
		delegator.createOrStore(record);
	}
}
