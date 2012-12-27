package org.ofbiz.partner.scm.services;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.service.DispatchContext;
import org.ofbiz.service.ServiceUtil;

public class RollProductInOutStockServices {

	public static final String module = RollProductInOutStockServices.class.getName();
	private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");

	/**
	 * 将出入库情况表滚到今天(每天凌晨执行)
	 * 
	 * @param dctx
	 * @param context
	 * @return
	 */
	public synchronized static Map<String, Object> rollService(DispatchContext dctx, Map<String, ? extends Object> context) {
		Delegator delegator = dctx.getDelegator();
		try {
			boolean isFirstDayOfMonth = false;		// 是否为当月第一天
			
			// 当天
			Calendar cal = Calendar.getInstance();
			cal.setTime(new Date());
			
			// 前一天
			Calendar preCal = Calendar.getInstance();
			preCal.setTime(new Date());
			preCal.add(Calendar.DATE, -1);
			
			// 判断前一天的月份值是否相等
			if(cal.get(Calendar.MONTH) != preCal.get(Calendar.MONTH)){
				isFirstDayOfMonth = true;
			}
			
			List<GenericValue> entryList = delegator.findByAnd("ProInOutDateDetail", UtilMisc.toMap("tradDate", sdf.format(preCal.getTime())));

			for(GenericValue v : entryList){
				GenericValue nextV = delegator.makeValue("ProInOutDateDetail");
				nextV.setString("tradDate", sdf.format(cal.getTime()));
				nextV.setString("materialId", v.getString("materialId"));
				nextV.set("qantity", v.getLong("qantity"));
				nextV.set("todayInVolume", BigDecimal.ZERO);
				nextV.set("todayOutVolume", BigDecimal.ZERO);
				nextV.set("todayVolume", BigDecimal.ZERO);
				if(isFirstDayOfMonth){
					// 上月数量 ＝上月最后一天（上月数量 + （当月累计入库数量 － 当月累计出库数量））
					// 20121227：报表中的上月数量在库存表中获取cur_material_balance，字段preMonthVolume弃用。
					// nextV.set("preMonthVolume", v.getBigDecimal("preMonthVolume").add(v.getBigDecimal("thisMonthInVolume").subtract(v.getBigDecimal("thisMonthOutVolume"))));
					nextV.set("thisMonthInVolume", BigDecimal.ZERO);
					nextV.set("thisMonthOutVolume", BigDecimal.ZERO);
				} else {
					// 20121227：报表中的上月数量在库存表中获取cur_material_balance，字段preMonthVolume弃用。
					//nextV.set("preMonthVolume", v.getBigDecimal("preMonthVolume"));
					nextV.set("thisMonthInVolume", v.getBigDecimal("thisMonthInVolume"));
					nextV.set("thisMonthOutVolume", v.getBigDecimal("thisMonthOutVolume"));
				}
				delegator.create(nextV);
			}
		} catch (Exception e) {
			e.printStackTrace();
			ServiceUtil.returnFailure();
		}
		return ServiceUtil.returnSuccess();
	}
}
