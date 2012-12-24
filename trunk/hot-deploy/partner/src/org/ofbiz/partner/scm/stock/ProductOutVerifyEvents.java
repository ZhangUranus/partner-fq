package org.ofbiz.partner.scm.stock;

import java.io.File;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javolution.util.FastList;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.codehaus.jackson.map.ObjectMapper;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.condition.EntityConditionList;
import org.ofbiz.entity.condition.EntityOperator;
import org.ofbiz.entity.jdbc.ConnectionFactory;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.partner.scm.common.BillBaseEvent;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.common.MultiEntryCRUDEvent;
import org.ofbiz.partner.scm.pojo.OrderPojo;
import org.ofbiz.partner.scm.pricemgr.Utils;

/**
 * 出货对数单业务事件类
 * 
 * @author Mark
 * 
 */
public class ProductOutVerifyEvents {
	private static final String module = ProductOutVerifyEvents.class.getName();

	/**
	 * 获取单号，汇总发货通知单
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String getDeliverNumber(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String filterDeliverNum = request.getParameter("query");
		// 构建汇总单号查询语句
		StringBuffer sql = new StringBuffer();
		sql.append("SELECT deliver_number FROM product_out_notification where status=4 group by deliver_number having deliver_number is not null ");
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
	 * 获取对数单头
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 * 
	 *             select notification.deliverNumber deliverNumber,
	 *             notification.bizdate bizDate, notification.materialId
	 *             materialId, notification.sumVolume sumVolume,
	 *             notification.sumGrossWeight sumGrossWeight,
	 *             notification.sumGrossSize sumGrossSize,
	 *             verify.sum_board_volume sumBoardVolume,
	 *             verify.paper_box_volume paperBoxVolume, verify.status status
	 *             from (SELECT t1.deliver_number deliverNumber, t2.material_id
	 *             materialId, min(t1.biz_date) bizdate, sum(t2.volume)
	 *             sumVolume, sum(t2.gross_weight) sumGrossWeight,
	 *             sum(t2.gross_size) sumGrossSize
	 * 
	 *             FROM product_out_notification t1 inner join
	 *             product_out_notification_entry t2 on t1.id=t2.parent_id where
	 *             date_format(t1.biz_date,'%Y-%m-%d')='2012-10-24' group by
	 *             t1.deliver_number,t2.material_id having deliverNumber is not
	 *             null) notification left outer join product_out_verify_head
	 *             verify on (notification.deliverNumber=verify.deliver_number
	 *             and notification.materialId=verify.material_id) left outer
	 *             join t_material material on
	 *             notification.materialId=material.id
	 */

	public static String getProductOutVerifyHead(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String bizBeginDate = request.getParameter("bizBeginDate");
		String bizEndDate = request.getParameter("bizEndDate");
		String filterDeliverNum = request.getParameter("deliverNum");
		String searchMaterialId = request.getParameter("searchMaterialId");
		String status = request.getParameter("status");
		StringBuffer orderStr = new StringBuffer();
		if (request.getParameter("sort") != null) {
			ObjectMapper objMapper = new ObjectMapper();// 新建局部变量
			JSONArray array = JSONArray.fromObject(request.getParameter("sort").toString());
			for (int i = 0; i < array.size(); i++) {
				if (i != 0) {
					orderStr.append(",");
				} else {
					orderStr.append(" ORDER BY ");
				}
				OrderPojo order = objMapper.readValue(array.getString(i), OrderPojo.class);
				String field = order.getProperty() + " " + order.getDirection();
				orderStr.append(field); // 增加排序字段
			}
		}

		// 构建汇总单号查询语句
		StringBuffer sql = new StringBuffer();
		sql.append("select ");
		sql.append("notification.deliverNumber deliverNumber, ");
		sql.append("notification.bizdate bizDate, ");
		sql.append("notification.materialId materialId, ");
		sql.append("material.name materialName, ");
		sql.append("notification.sumVolume sumVolume, ");
		sql.append("notification.sumGrossWeight sumGrossWeight, ");
		sql.append("notification.sumGrossSize sumGrossSize, ");
		sql.append("verify.sum_board_volume sumBoardVolume, ");
		sql.append("verify.packaged_volume packagedVolume, ");
		sql.append("verify.paper_box_volume paperBoxVolume, ");
		sql.append("IFNULL(verify.status,-1) status, ");
		sql.append("IFNULL(verify.is_finished,'N') isFinished ");
		sql.append("from ");
		sql.append("(SELECT ");
		sql.append("t1.deliver_number deliverNumber, ");
		sql.append("t2.material_id materialId, ");
		sql.append("min(t1.plan_delivery_date) bizdate, ");
		sql.append("sum(t2.volume) sumVolume, ");
		sql.append("sum(t2.gross_weight) sumGrossWeight, ");
		sql.append("sum(t2.gross_size) sumGrossSize ");
		sql.append("FROM product_out_notification t1 ");
		sql.append("inner join product_out_notification_entry t2 on t1.id=t2.parent_id ");
		// 过滤日期
		sql.append("where status=4 ");

		if (bizBeginDate != null && bizBeginDate.trim().length() > 0) {
			sql.append("and date_format(t1.plan_delivery_date,'%Y-%m-%d')>='").append(bizBeginDate).append("' ");
		}
		if (bizEndDate != null && bizEndDate.trim().length() > 0) {
			sql.append("and date_format(t1.plan_delivery_date,'%Y-%m-%d')<='").append(bizEndDate).append("' ");
		}

		// 过滤物料
		if (searchMaterialId != null && searchMaterialId.trim().length() > 0) {
			sql.append(" and t2.material_id='").append(searchMaterialId).append("'");
		}

		sql.append("group by t1.deliver_number,t2.material_id having deliverNumber is not null   ");
		// 过滤单号
		if (filterDeliverNum != null && filterDeliverNum.trim().length() > 0) {
			sql.append(" and deliverNumber='").append(filterDeliverNum).append("'");
		}
		sql.append(" ) notification left outer join product_out_verify_head  verify on (notification.deliverNumber=verify.deliver_number and notification.materialId=verify.material_id) ");
		sql.append("left outer join t_material  material on notification.materialId=material.id");

		// 过滤物料
		if (status != null && status.trim().length() > 0) {
			sql.append(" where verify.status='").append(status).append("'");
		}

		sql.append(orderStr.toString());

		Connection conn = ConnectionFactory.getConnection(org.ofbiz.partner.scm.common.Utils.getConnectionHelperName());

		// 结果json字符串
		JSONObject json = null;
		try {
			ResultSet rs = conn.createStatement().executeQuery(sql.toString());
			json = org.ofbiz.partner.scm.common.Utils.getJsonArr4ResultSet(rs, request);
		} catch (Exception e) {
			throw e;
		} finally {
			if (conn != null) {
				conn.close();
			}
		}
		CommonEvents.writeJsonDataToExt(response, json.toString()); // 将结果返回前端Ext
		return "success";
	}

	/**
	 * 保存对数单
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String saveProductOutVerify(HttpServletRequest request, HttpServletResponse response) throws Exception {
		if (request.getParameter("record") == null) {
			throw new Exception("新建带分录实体时参数(record)无效");
		}
		// 构建总实体json
		JSONObject record = JSONObject.fromObject(request.getParameter("record").toString());
		JSONObject headRecord = record.getJSONObject("head");// 取表头信息
		JSONArray newEntryRecords = record.getJSONArray("createEntrys");// 取新增单据体信息
		JSONArray deleteEntryRecords = record.getJSONArray("deleteEntrys");// 取刪除单据体信息
		JSONArray updateEntryRecords = record.getJSONArray("updateEntrys");// 取修改单据体信息
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		String headEntityName = "ProductOutVerifyHead";
		String entryEntityName = "ProductOutVerifyEntry";
		String jsonResult = "";
		try {
			TransactionUtil.begin();
			// 更新表头
			GenericValue v = delegator.makeValue(headEntityName);// 新建一个值对象
			MultiEntryCRUDEvent.setGenValFromJsonObj(headRecord, v);
			GenericValue originValue = delegator.findByPrimaryKey(headEntityName, UtilMisc.toMap("deliverNumber", v.get("deliverNumber"), "materialId", v.get("materialId")));
			if (originValue != null && originValue.getInteger("status").equals(Integer.valueOf(4))) {
				throw new Exception("单据已经提交，不能修改！");
			}
			v.set("status", Integer.valueOf(0));

			// 新增分录
			for (Object o : newEntryRecords) {
				JSONObject jo = (JSONObject) o;
				GenericValue ev = delegator.makeValue(entryEntityName);
				MultiEntryCRUDEvent.setGenValFromJsonObj(jo, ev);
				delegator.create(ev);
			}
			// 更新分录
			List<GenericValue> updateList = FastList.newInstance();
			for (Object o : updateEntryRecords) {
				JSONObject jo = (JSONObject) o;
				GenericValue ev = delegator.makeValue(entryEntityName);
				MultiEntryCRUDEvent.setGenValFromJsonObj(jo, ev);
				updateList.add(ev);
			}
			delegator.storeAll(updateList);
			// 删除分录以及级联的实体
			for (Object o : deleteEntryRecords) {
				JSONObject jo = (JSONObject) o;
				GenericValue ev = delegator.makeValue(entryEntityName);
				MultiEntryCRUDEvent.setGenValFromJsonObj(jo, ev);
				delegator.removeValue(ev);
			}

			// 返填主单据的总托盘数、已打板总数量
			List<GenericValue> entryList = delegator.findByAnd(entryEntityName, "deliverNumber", v.getString("deliverNumber"), "parentMaterialId", v.getString("materialId"));
			BigDecimal sumBoardVolume = BigDecimal.ZERO;
			BigDecimal packagedVolume = BigDecimal.ZERO;
			for (GenericValue entryValue : entryList) {
				BigDecimal orderQty = entryValue.getBigDecimal("orderQty");
				sumBoardVolume = sumBoardVolume.add(orderQty); // 总托盘数
				packagedVolume = packagedVolume.add(orderQty.multiply(new BigDecimal(Utils.getValueByMaterialId(entryValue.getString("materialId")).getInteger("boardCount")))); // 已打板总数量
			}
			// 构建汇总单号查询语句
			StringBuffer sql = new StringBuffer();
			sql.append("select sum(volume) as volume ");
			sql.append("FROM product_out_notification t1 ");
			sql.append("inner join product_out_notification_entry t2 on t1.id=t2.parent_id ");
			sql.append("where deliver_number = '" + v.getString("deliverNumber")+"'");
			sql.append("and material_id = '" + v.getString("materialId") +"'");
			Connection conn = ConnectionFactory.getConnection(org.ofbiz.partner.scm.common.Utils.getConnectionHelperName());

			BigDecimal realVolume = BigDecimal.ZERO;
			try {
				ResultSet rs = conn.createStatement().executeQuery(sql.toString());
				if (rs.next()) {
					realVolume = rs.getBigDecimal("volume");
				}
			} catch (Exception e) {
				throw e;
			} finally {
				if (conn != null) {
					conn.close();
				}
			}

			v.set("sumBoardVolume", sumBoardVolume);
			v.set("packagedVolume", packagedVolume);

			if (realVolume.compareTo(packagedVolume) == -1) {
				jsonResult = "{success:true,result:-1}";
			} else if (realVolume.compareTo(packagedVolume) == 1) {
				jsonResult = "{success:true,result:1}";
			} else {
				jsonResult = "{success:true,result:0}";
			}

			delegator.createOrStore(v);
			TransactionUtil.commit();
		} catch (Exception e) {
			TransactionUtil.rollback();
			throw e;
		}
		CommonEvents.writeJsonDataToExt(response, jsonResult); // 将结果返回前端Ext
		return "success";
	}

	/**
	 * 删除出货对数单
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String removeVerifyHead(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String deliverNum = request.getParameter("deliverNumber");
		String materialId = request.getParameter("materialId");
		if (deliverNum == null || materialId == null) {
			throw new Exception("单号或者产品id为空");
		}
		EntityConditionList<EntityCondition> condition = null;
		List<EntityCondition> conds = FastList.newInstance();
		conds.add(EntityCondition.makeCondition("deliverNumber", deliverNum));
		conds.add(EntityCondition.makeCondition("parentMaterialId", materialId));
		conds.add(EntityCondition.makeCondition("sentQty", EntityOperator.GREATER_THAN, 0));
		condition = EntityCondition.makeCondition(conds);

		Delegator delegator = (Delegator) request.getAttribute("delegator");

		List<GenericValue> valueList = delegator.findList("ProductOutVerifyEntry", condition, null, null, null, false);
		if (valueList.size() > 0) {
			throw new Exception("该对数单已存在扫描出库的板，不允许删除，请撤销相应扫描后再进行删除！");
		}

		delegator.removeByAnd("ProductOutVerifyHead", "deliverNumber", deliverNum, "materialId", materialId);

		delegator.removeByAnd("ProductOutVerifyEntry", "deliverNumber", deliverNum, "parentMaterialId", materialId);

		BillBaseEvent.writeSuccessMessageToExt(response, "提交成功");
		return "success";
	}

	/**
	 * 导出相同单号对数单
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String export(HttpServletRequest request, HttpServletResponse response) throws Exception {

		String fromDate = request.getParameter("fromDate");
		String endDate = request.getParameter("endDate");
		// 过滤单号
		if (fromDate == null || fromDate.trim().length() < 1 || endDate == null || endDate.trim().length() < 1) {
			throw new Exception("过滤日期范围为空");
		}
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		Connection conn = ConnectionFactory.getConnection(org.ofbiz.partner.scm.common.Utils.getConnectionHelperName());

		// 构建汇总单号查询语句
		StringBuffer sql = new StringBuffer();
		sql.append("select ");
		sql.append("notification.deliverNumber deliverNumber, ");
		sql.append("Date_Format(notification.bizdate,'%Y-%m-%d') bizDate, ");
		sql.append("notification.materialId materialId, ");
		sql.append("material.name materialName, ");
		sql.append("notification.sumVolume sumVolume, ");
		sql.append("notification.sumGrossWeight sumGrossWeight, ");
		sql.append("notification.sumGrossSize sumGrossSize, ");
		sql.append("verify.sum_board_volume sumBoardVolume, ");
		sql.append("verify.paper_box_volume paperBoxVolume, ");
		sql.append("IFNULL(verify.status,-1) status ");
		sql.append("from ");
		sql.append("(SELECT ");
		sql.append("t1.deliver_number deliverNumber, ");
		sql.append("t2.material_id materialId, ");
		sql.append("min(t1.plan_delivery_date) bizdate, ");
		sql.append("sum(t2.volume) sumVolume, ");
		sql.append("sum(t2.gross_weight) sumGrossWeight, ");
		sql.append("sum(t2.gross_size) sumGrossSize ");
		sql.append("FROM product_out_notification t1 ");
		sql.append("inner join product_out_notification_entry t2 on t1.id=t2.parent_id ");
		sql.append("where (t1.deliver_number is not null and t1.deliver_number<>'') and UNIX_TIMESTAMP(t1.plan_delivery_date)>=UNIX_TIMESTAMP('").append(fromDate)
				.append(" 00:00:00') and UNIX_TIMESTAMP(t1.plan_delivery_date)<=UNIX_TIMESTAMP('").append(endDate).append(" 23:59:59') ");
		sql.append("group by t1.deliver_number,t2.material_id  ");
		sql.append(" ) notification left outer join product_out_verify_head  verify on (notification.deliverNumber=verify.deliver_number and notification.materialId=verify.material_id) ");
		sql.append("left outer join t_material  material on notification.materialId=material.id order by notification.deliverNumber desc");

		try {
			ResultSet rs = conn.createStatement().executeQuery(sql.toString());

			// 声明一个工作薄
			HSSFWorkbook workbook = new HSSFWorkbook();
			// 生成一个表格
			HSSFSheet sheet = workbook.createSheet("sheet1");
			// 表头行
			HSSFRow headRow = sheet.createRow(0);
			headRow.createCell(0).setCellValue("计划出货日期");
			headRow.createCell(1).setCellValue("单号");
			headRow.createCell(2).setCellValue("产品");
			headRow.createCell(3).setCellValue("订单总数量");
			headRow.createCell(4).setCellValue("订单总重量");
			headRow.createCell(5).setCellValue("订单总体积");
			headRow.createCell(6).setCellValue("打板方式");
			headRow.createCell(7).setCellValue("打板数量");
			headRow.createCell(8).setCellValue("已出仓数量");
			headRow.createCell(9).setCellValue("出仓仓库");
			headRow.createCell(10).setCellValue("是否完成");
			int curRow = 1;
			while (rs.next()) {
				HSSFRow tmpRow = sheet.createRow(curRow);
				String materialId = rs.getString("materialId");
				tmpRow.createCell(0).setCellValue(rs.getString("bizDate"));
				tmpRow.createCell(1).setCellValue(rs.getString("deliverNumber"));
				tmpRow.createCell(2).setCellValue(rs.getString("materialName"));
				tmpRow.createCell(3).setCellValue(rs.getBigDecimal("sumVolume").doubleValue());
				tmpRow.createCell(4).setCellValue(rs.getBigDecimal("sumGrossWeight").doubleValue());
				tmpRow.createCell(5).setCellValue(rs.getBigDecimal("sumGrossSize").doubleValue());

				// 查询分录
				List<GenericValue> entrys = delegator.findByAnd("ProductOutVerifyEntryView", UtilMisc.toMap("deliverNumber", rs.getString("deliverNumber"), "parentMaterialId", materialId));
				if (entrys != null && entrys.size() > 0) {
					for (int i = 0; i < entrys.size(); i++) {
						GenericValue ev = entrys.get(i);
						HSSFRow entryRow = null;
						if (0 == i) {
							entryRow = tmpRow;
						} else {
							entryRow = sheet.createRow(++curRow);
						}
						entryRow.createCell(6).setCellValue(ev.getString("materialName"));
						entryRow.createCell(7).setCellValue(ev.getBigDecimal("orderQty").doubleValue());
						entryRow.createCell(8).setCellValue(ev.getBigDecimal("sentQty").doubleValue());
						entryRow.createCell(9).setCellValue(ev.getString("warehouseName"));
						if (ev.getBoolean("isFinished")) {
							entryRow.createCell(10).setCellValue("是");
						} else {
							entryRow.createCell(10).setCellValue("否");
						}

					}

				}

				++curRow;
			}

			response.reset();
			response.setContentType("application/vnd.ms-excel");
			response.setHeader("Content-Disposition", "attachment; filename=VerifyBill.xls");
			OutputStream bos = response.getOutputStream();
			workbook.write(bos);
			response.setStatus(HttpServletResponse.SC_OK);
			response.flushBuffer();
		} catch (Exception e) {
			throw e;
		} finally {
			if (conn != null) {
				conn.close();
			}
		}
		return "success";
	}
}
