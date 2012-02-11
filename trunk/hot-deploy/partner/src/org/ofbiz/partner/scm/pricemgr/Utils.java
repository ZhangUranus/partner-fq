package org.ofbiz.partner.scm.pricemgr;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.DelegatorFactory;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.common.CommonEvents;

/**
 * 
 * @author Mark
 * 
 */
public class Utils {
	/**
	 * 获取当期操作年月
	 * 
	 * @return
	 */
	public static Date getCurDate() {
		Delegator delegator = DelegatorFactory.getDelegator("default");
		try {
			GenericValue value = delegator.findByPrimaryKey("PriceMgrParamters", UtilMisc.toMap("id", "001"));
			String dateStr = value.getString("value");
			SimpleDateFormat timeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:SS.sss");
			return timeFormat.parse(dateStr);
		} catch (GenericEntityException e) {
			Debug.logError("-----------获取当期年月出错", "common");
			return null;
		} catch (ParseException e) {
			Debug.logError("-----------获取当期年月出错，日期格式出错", "common");
			return null;
		}
	}

	/**
	 * 判断是否是当前期间
	 * 
	 * @return
	 */
	public static boolean isCurPeriod(Date date) {
		if (date == null)
			return false;
		Calendar cal = Calendar.getInstance();

		Date curDate = getCurDate();// 获取当前系统期间
		cal.setTime(curDate);
		int curYear = cal.get(Calendar.YEAR);
		int curMonth = cal.get(Calendar.MONTH) + 1;

		cal.setTime(date);
		int year = cal.get(Calendar.YEAR);
		int month = cal.get(Calendar.MONTH) + 1;

		if (curYear == year && curMonth == month) {
			return true;
		}
		return false;

	}

	/**
	 * 创建进库单
	 * 
	 * @param billValue
	 * @throws Exception
	 */
	public static void createReturnProductWarehousingBill(GenericValue billValue, HttpServletRequest request) throws Exception {
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		GenericValue billHead = delegator.findOne("ReturnProductWarehousing", UtilMisc.toMap("id", billValue.getString("id")), false);
		if (billHead != null) {
			billHead.remove();
		}
		billHead = delegator.makeValue("ReturnProductWarehousing");
		billHead.set("id", billValue.getString("id"));
		billHead.set("number", billValue.getString("number"));
		billHead.set("bizDate", billValue.getTimestamp("bizDate"));
		billHead.set("submitterSystemUserId", billValue.getString("submitterSystemUserId"));
		billHead.set("totalsum", billValue.getBigDecimal("totalsum"));
		billHead.set("note", billValue.getString("note"));
		billHead.set("status", new Long(0));
		billHead.set("createdStamp", billValue.getTimestamp("createdStamp"));
		billHead.set("submitStamp", billValue.getTimestamp("submitStamp"));
		billHead.create();
		List<GenericValue> entryList = delegator.findByAnd("ReturnProductWarehousingEntry", UtilMisc.toMap("parentId", billValue.getString("id")));
		if (entryList != null && entryList.size() > 0) {
			delegator.removeByAnd("ReturnProductWarehousingEntry", UtilMisc.toMap("parentId", billValue.getString("id")));
		}
		entryList = delegator.findByAnd(billValue.getEntityName() + "Entry", UtilMisc.toMap("parentId", billValue.getString("id")));
		for (GenericValue entryValue : entryList) {
			GenericValue tempEntry = delegator.makeValue("ReturnProductWarehousingEntry");
			tempEntry.set("id", entryValue.getString("id"));
			tempEntry.set("parentId", entryValue.getString("parentId"));
			tempEntry.set("warehouseWarehouseId", entryValue.getString("warehouseWarehouseId"));
			tempEntry.set("materialMaterialId", entryValue.getString("materialMaterialId"));
			tempEntry.set("volume", entryValue.getBigDecimal("volume"));
			tempEntry.set("price", entryValue.getBigDecimal("price"));
			tempEntry.set("entrysum", entryValue.getBigDecimal("entrysum"));
			tempEntry.create();
		}
	}

	public static void submitReturnProductWarehousing(GenericValue billValue, HttpServletRequest request) throws Exception {
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		GenericValue billHead = delegator.findOne("ReturnProductWarehousing", UtilMisc.toMap("id", billValue.getString("id")), false);

		BizStockImpFactory.getBizStockImp(BillType.ReturnProductWarehousing).updateStock(billHead, false);

		if (billHead != null) {
			billHead.set("status", new Long(4));
			billHead.set("submitterSystemUserId", CommonEvents.getAttributeToSession(request, "uid"));
			billHead.set("submitStamp", new Timestamp(System.currentTimeMillis()));
			billHead.store();
		}
	}
}
