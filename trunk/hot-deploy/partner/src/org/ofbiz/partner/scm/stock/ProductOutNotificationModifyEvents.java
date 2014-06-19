package org.ofbiz.partner.scm.stock;

import java.sql.Connection;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.jdbc.ConnectionFactory;
import org.ofbiz.entity.transaction.GenericTransactionException;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.partner.scm.common.BillBaseEvent;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.pricemgr.Utils;

/**
 * 出货对数单业务事件类
 * 
 * @author Mark
 * 
 */
public class ProductOutNotificationModifyEvents {
	private static final String module = ProductOutNotificationModifyEvents.class.getName();

	/**
	 * 获取单号，汇总发货通知单
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String getCurDeliverNumber(HttpServletRequest request, HttpServletResponse response) throws Exception {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		Date curDate = Utils.getCurDate();
		String filterDeliverNum = request.getParameter("query");
		// 构建汇总单号查询语句
		StringBuffer sql = new StringBuffer();
		sql.append("SELECT DELIVER_NUMBER FROM PRODUCT_OUT_NOTIFICATION WHERE BIZ_DATE >'"+dateFormat.format(curDate)+"' AND STATUS=4 GROUP BY DELIVER_NUMBER HAVING DELIVER_NUMBER IS NOT null ");
		if (filterDeliverNum != null && filterDeliverNum.trim().length() > 0) {
			sql.append(" and deliver_number like '%").append(filterDeliverNum).append("%' ");
		}

		Connection conn = ConnectionFactory.getConnection(org.ofbiz.partner.scm.common.Utils.getConnectionHelperName());

		// 结果json字符串
		StringBuffer jsonRs = new StringBuffer();
		try {
			ResultSet rs = conn.createStatement().executeQuery(sql.toString());

			// 构建json结果
			jsonRs.append("{'success':true,'records':[");
			boolean isFirst = true;
			while (rs.next()) {

				if (!isFirst) {
					jsonRs.append(",");
				} else {
					isFirst = false;
				}
				jsonRs.append("{number:'").append(rs.getString(1)).append("'}");
			}
			jsonRs.append("]}");
		} catch (Exception e) {
			throw e;
		} finally {
			if (conn != null) {
				conn.close();
			}
		}
		CommonEvents.writeJsonDataToExt(response, jsonRs.toString()); // 将结果返回前端Ext
		return "success";
	}
	
	/**
	 * 获取货号
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String getCurGoodNumber(HttpServletRequest request, HttpServletResponse response) throws Exception {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		Date curDate = Utils.getCurDate();
		String filterDeliverNum = request.getParameter("deliverNumber");
		String filterGoodNum = request.getParameter("query");
		// 构建汇总单号查询语句
		StringBuffer sql = new StringBuffer();
		sql.append("SELECT good_number FROM product_out_notification where BIZ_DATE >'"+dateFormat.format(curDate)+"' AND status=4 ");
		if (filterDeliverNum != null && filterDeliverNum.trim().length() > 0) {
			sql.append(" and deliver_number = '").append(filterDeliverNum).append("' ");
		}
		if (filterGoodNum != null && filterGoodNum.trim().length() > 0) {
			sql.append(" and good_number like '%").append(filterGoodNum).append("%' ");
		}
		sql.append(" group by good_number having good_number is not null ");

		Connection conn = ConnectionFactory.getConnection(org.ofbiz.partner.scm.common.Utils.getConnectionHelperName());

		// 结果json字符串
		StringBuffer jsonRs = new StringBuffer();
		try {
			ResultSet rs = conn.createStatement().executeQuery(sql.toString());

			// 构建json结果
			jsonRs.append("{'success':true,'records':[");
			boolean isFirst = true;
			while (rs.next()) {

				if (!isFirst) {
					jsonRs.append(",");
				} else {
					isFirst = false;
				}
				jsonRs.append("{number:'").append(rs.getString(1)).append("'}");
			}
			jsonRs.append("]}");
		} catch (Exception e) {
			throw e;
		} finally {
			if (conn != null) {
				conn.close();
			}
		}
		CommonEvents.writeJsonDataToExt(response, jsonRs.toString()); // 将结果返回前端Ext
		return "success";
	}
	
	/**
	 * 根据货号获取通知单产品列表
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String getMaterialByGoodNumber(HttpServletRequest request, HttpServletResponse response) throws Exception {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		Date curDate = Utils.getCurDate();
		String filterGoodNum = request.getParameter("goodNumber");
		String queryKey = request.getParameter("query");
		// 构建汇总单号查询语句
		StringBuffer sql = new StringBuffer();
		sql.append("SELECT PON.ID AS ID,ORDER_NUMBER,MATERIAL_ID,TM.NAME AS MATERIAL_NAME,VOLUME FROM PRODUCT_OUT_NOTIFICATION PO LEFT JOIN PRODUCT_OUT_NOTIFICATION_ENTRY PON ON PO.ID = PON.PARENT_ID LEFT JOIN T_MATERIAL TM ON PON.MATERIAL_ID = TM.ID ");
		if (queryKey != null && queryKey.trim().length() > 0) {
			sql.append(" WHERE PO.STATUS=4 AND PO.BIZ_DATE >'"+dateFormat.format(curDate)+"' AND (TM.NAME LIKE '%").append(queryKey).append("%' OR  TM.NUMBER LIKE '%").append(queryKey).append("%') ");
		} else {
			sql.append(" WHERE PO.STATUS=4 AND PO.BIZ_DATE >'"+dateFormat.format(curDate)+"' AND (TM.NAME LIKE '%' OR TM.NUMBER LIKE '%') ");
		}
		if (filterGoodNum != null && filterGoodNum.trim().length() > 0) {
			sql.append(" AND PARENT_ID = (SELECT ID FROM OFBIZ.PRODUCT_OUT_NOTIFICATION WHERE GOOD_NUMBER ='"+filterGoodNum+"') ");
		}
		
		Connection conn = ConnectionFactory.getConnection(org.ofbiz.partner.scm.common.Utils.getConnectionHelperName());

		// 结果json字符串
		StringBuffer jsonRs = new StringBuffer();
		try {
			ResultSet rs = conn.createStatement().executeQuery(sql.toString());

			// 构建json结果
			jsonRs.append("{'success':true,'records':[");
			boolean isFirst = true;
			while (rs.next()) {

				if (!isFirst) {
					jsonRs.append(",");
				} else {
					isFirst = false;
				}
				jsonRs.append("{'notificationEntryId':'"+rs.getString(1)+"',");
				jsonRs.append("'orderNumber':'"+rs.getString(2)+"',");
				jsonRs.append("'materialId':'"+rs.getString(3)+"',");
				jsonRs.append("'materialName':'"+rs.getString(4)+"',");
				jsonRs.append("'volume':'"+rs.getString(5)+"'}");
			}
			jsonRs.append("]}");
		} catch (Exception e) {
			throw e;
		} finally {
			if (conn != null) {
				conn.close();
			}
		}
		CommonEvents.writeJsonDataToExt(response, jsonRs.toString()); // 将结果返回前端Ext
		return "success";
	}
	
	/**
	 * 根据产品名称和单号获取列表
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String getMaterialByDeliverNumber(HttpServletRequest request, HttpServletResponse response) throws Exception {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		Date curDate = Utils.getCurDate();
		String filterDeliverNum = request.getParameter("deliverNumber");
		String filterNotificationEntryId = request.getParameter("notificationEntryId");
		String queryKey = request.getParameter("query");
		// 构建汇总单号查询语句

		StringBuffer sql = new StringBuffer();
		sql.append("SELECT POVE.ID,POVE.MATERIAL_ID,TM.NAME AS MATERIAL_NAME,POVE.ORDER_QTY AS VERIFY_ENTRY_VOLUME FROM (SELECT DISTINCT DELIVER_NUMBER FROM PRODUCT_OUT_NOTIFICATION WHERE STATUS=4 AND BIZ_DATE >'"+dateFormat.format(curDate)+"') PO LEFT JOIN PRODUCT_OUT_VERIFY_ENTRY POVE ON PO.DELIVER_NUMBER = POVE.DELIVER_NUMBER LEFT JOIN T_MATERIAL TM ON POVE.MATERIAL_ID = TM.ID ");
		if (queryKey != null && queryKey.trim().length() > 0) {
			sql.append(" WHERE (TM.NAME LIKE '%").append(queryKey).append("%' OR  TM.NUMBER LIKE '%").append(queryKey).append("%') ");
		} else {
			sql.append(" WHERE (TM.NAME LIKE '%' OR TM.NUMBER LIKE '%') ");
		}
		if (filterDeliverNum != null && filterDeliverNum.trim().length() > 0) {
			sql.append("AND POVE.DELIVER_NUMBER ='"+filterDeliverNum+"' ");
		}
		if (filterNotificationEntryId != null && filterNotificationEntryId.trim().length() > 0) {
			sql.append(" AND POVE.PARENT_MATERIAL_ID = (SELECT MATERIAL_ID FROM PRODUCT_OUT_NOTIFICATION_ENTRY WHERE ID = '").append(filterNotificationEntryId).append("') ");
		}
		
		Connection conn = ConnectionFactory.getConnection(org.ofbiz.partner.scm.common.Utils.getConnectionHelperName());

		// 结果json字符串
		StringBuffer jsonRs = new StringBuffer();
		try {
			ResultSet rs = conn.createStatement().executeQuery(sql.toString());

			// 构建json结果
			jsonRs.append("{'success':true,'records':[");
			boolean isFirst = true;
			while (rs.next()) {

				if (!isFirst) {
					jsonRs.append(",");
				} else {
					isFirst = false;
				}
				jsonRs.append("{'verifyEntryId':'"+rs.getString(1)+"',");
				jsonRs.append("'materialId':'"+rs.getString(2)+"',");
				jsonRs.append("'materialName':'"+rs.getString(3)+"',");
				jsonRs.append("'verifyEntryVolume':'"+rs.getString(4)+"'}");
			}
			jsonRs.append("]}");
		} catch (Exception e) {
			throw e;
		} finally {
			if (conn != null) {
				conn.close();
			}
		}
		CommonEvents.writeJsonDataToExt(response, jsonRs.toString()); // 将结果返回前端Ext
		return "success";
	}
	
	/**
	 * 出货通知单变更提交
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
			if (delegator != null && billId != null) {
				GenericValue billHead = delegator.findOne("ProductOutNotificationModify", UtilMisc.toMap("id", billId), false);
				if (billHead == null) {
					throw new Exception("找不到对应的出货通知变更单，请检查后重新提交！");
				}
				if(billHead.getString("notificationEntryId")==null || billHead.getString("notificationEntryId").isEmpty()){
					throw new Exception("通知单编码为空，请检查后重新提交！");
				}
				if(billHead.getBigDecimal("volume")==null){
					throw new Exception("通知单订单数量为空，请检查后重新提交！");
				}
				if(billHead.getString("verifyEntryId")==null || billHead.getString("verifyEntryId").isEmpty()){
					throw new Exception("对数表分录编码为空，请检查后重新提交！");
				}
				if(billHead.getBigDecimal("verifyEntryVolume")==null){
					throw new Exception("对数表计划打板数量为空，请检查后重新提交！");
				}
				if(billHead.getString("deliverNumber")==null || billHead.getString("deliverNumber").isEmpty()){
					throw new Exception("单号为空，请检查后重新提交！");
				}
				
				// 更新通知单订单数量
				Map<String, Object> fieldSet = new HashMap<String, Object>();
				fieldSet.put("volume", billHead.getBigDecimal("volume"));// 设置通知单订单数量
				int modifyCount = delegator.storeByCondition("ProductOutNotificationEntry", fieldSet, EntityCondition.makeConditionWhere("id='" + billHead.getString("notificationEntryId") + "'"),true);
				if(modifyCount != 1){
					throw new Exception("找不到对应的通知单，请检查后重新提交！");
				}
				
				// 更新出货对数单计划打板数量
				GenericValue verifyEntry = delegator.findOne("ProductOutVerifyEntry", UtilMisc.toMap("id", billHead.getString("verifyEntryId")), false);
				if (verifyEntry == null) {
					throw new Exception("找不到对应的对数表分录，请检查后重新提交！");
				}
				if(verifyEntry.getBigDecimal("sentQty").compareTo(billHead.getBigDecimal("verifyEntryVolume")) == 1){
					throw new Exception("已出仓数量大于要修改的计划打板数量，请检查后重新提交！");
				}else if(verifyEntry.getBigDecimal("sentQty").compareTo(billHead.getBigDecimal("verifyEntryVolume")) == -1){
					verifyEntry.set("isFinished", "N");
				}else if(verifyEntry.getBigDecimal("sentQty").compareTo(billHead.getBigDecimal("verifyEntryVolume")) == -1){
					verifyEntry.set("isFinished", "Y");
				}
				verifyEntry.set("orderQty", billHead.getBigDecimal("verifyEntryVolume"));
				verifyEntry.store();
				
				
				// 判断是否更新对数单状态和数量
				List<GenericValue> verifyHeadList = delegator.findByAnd("ProductOutVerifyHead", "deliverNumber", billHead.getString("deliverNumber"), "materialId", verifyEntry.getString("parentMaterialId"));
				if (verifyHeadList.size() > 0) {
					boolean isFinished = true;
					// 通过出货通知单的“单号”和出货通知单分录的“产品编码”，查找符合出货对数单中是否存在计划出货产品
					List<GenericValue> verifyEntryList = delegator.findByAnd("ProductOutVerifyEntry", "deliverNumber", billHead.getString("deliverNumber"), "parentMaterialId", verifyEntry.getString("parentMaterialId"));
					for (GenericValue verifyEntryTemp : verifyEntryList) {
						if(verifyEntryTemp.getString("isFinished").equals("N")){
							isFinished = false;
						}
					}
					
					GenericValue verifyHead = verifyHeadList.get(0); // 只取第一条，默认一对单号、产品编码只能唯一对应一条对数单
					verifyHead.setString("isFinished", isFinished ? "Y" : "N");
					
					verifyHead.store();
				}
				
				
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
}
