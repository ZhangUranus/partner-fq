package org.ofbiz.partner.scm.stock;

import java.io.File;
import java.io.FileInputStream;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.sf.json.JSONObject;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.HttpRequestFileUpload;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.jdbc.ConnectionFactory;
import org.ofbiz.entity.transaction.GenericTransactionException;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.partner.scm.common.BillBaseEvent;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.common.SerialNumberHelper;
import org.ofbiz.partner.scm.pricemgr.Utils;

/**
 * 出货通知单业务事件类
 * 
 * @author Mark
 * 
 */
public class ProductOutNotificationEvents {
	private static final String module = org.ofbiz.partner.scm.stock.ProductOutNotificationEvents.class.getName();

	/**
	 * 出货通知单提交
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
				GenericValue billHead = delegator.findOne("ProductOutNotification", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ProductOutNotification bill or bizdate is null");
				}
				Date bizDate = (Date) billHead.get("bizDate");
				if (bizDate == null || !Utils.isCurPeriod(bizDate)) {
					throw new Exception("单据业务日期不在当前系统期间");
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

	/**
	 * 出货通知单撤销
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
			if (delegator != null && billId != null) {
				GenericValue billHead = delegator.findOne("ProductOutNotification", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ProductOutNotification bill or bizdate is null");
				}
//				Date bizDate = (Date) billHead.get("bizDate");
				/**
				 * 出货通知单不需要判断是否当前系统期间
				 */
//				if (bizDate == null || !Utils.isCurPeriod(bizDate)) {
//					throw new Exception("单据业务日期不在当前系统期间");
//				}
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
	 * 根据宜家编码获取产品编码
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String getMaterialIdByIkea(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String ikeaId = request.getParameter("ikeaId");
		String qantity = request.getParameter("qantity");
		String materialId = Utils.getMaterialIdByIkea(ikeaId, qantity);
		JSONObject jsonStr = new JSONObject();
		jsonStr.put("success", true);
		jsonStr.put("materialId", materialId);
		CommonEvents.writeJsonDataToExt(response, jsonStr.toString());
		return "success";
	}

	/**
	 * 该出货通知单是否存在已保存的出货对数单
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String hasVerifyBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String deliverNumber = request.getParameter("deliver_number");
		if (deliverNumber == null || deliverNumber.trim().length() == 0) {
			throw new Exception("未找到单号！");
		}
		// 构建汇总单号查询语句
		StringBuffer sql = new StringBuffer();
		sql.append("SELECT deliver_number FROM product_out_verify_head  where  deliver_number = '" + deliverNumber + "'");

		// 获取数据库连接
		Connection conn = ConnectionFactory.getConnection(org.ofbiz.partner.scm.common.Utils.getConnectionHelperName());
		
		// 避免查到的数据不是最新的，先做提交
		conn.setAutoCommit(false);
		conn.commit();
		conn.setAutoCommit(true);

		// 结果json字符串
		StringBuffer jsonRs = new StringBuffer();
		try {
			ResultSet rs = conn.createStatement().executeQuery(sql.toString());
			int rowCount = 0;
			while (rs.next()) {
				rowCount++;
			}
			if (rowCount == 0) {
				jsonRs.append("{'success':false}");
			} else {
				jsonRs.append("{'success':true}");
			}

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
	 * 将单据提交欠数表分析
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String submitToReport(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String billId = request.getParameter("billId");
		if (billId == null || billId.trim().length() == 0) {
			throw new Exception("未找到单据编码！");
		}
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		Map<String, Object> fieldSet = new HashMap<String, Object>();
		fieldSet.put("status", 5);// 设置为审核状态
		int count = delegator.storeByCondition("ProductOutNotification", fieldSet, EntityCondition.makeConditionWhere("id='" + billId + "'"));
		
		// 结果json字符串
		StringBuffer jsonRs = new StringBuffer();
		if(count!=0){
			jsonRs.append("{'success':true}");
		}else{
			jsonRs.append("{'success':false}");
		}
		
		CommonEvents.writeJsonDataToExt(response, jsonRs.toString()); // 将结果返回前端Ext
		return "success";
	}

	/**
	 * 导入发货通知单
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String impOutNotificationBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		/**
		 * 1. 保存上传文件到临时目录
		 */
		String tmpPath = request.getSession().getServletContext().getRealPath("/tmp/");
		String tmpFileName = "/" + String.valueOf(System.currentTimeMillis()) + ".xls";
		HttpRequestFileUpload fu = new HttpRequestFileUpload();
		fu.setSavePath(tmpPath);
		fu.setOverrideFilename(tmpFileName);
		fu.doUpload(request);
		File tmpFile = new File(tmpPath + tmpFileName);

		try {

			/**
			 * 2. 解析数据文件，生成对应的数据实体记录，保存实体记录到数据库
			 */
			SerialNumberHelper snh = new SerialNumberHelper();
			boolean isHas = false;			//是否存在出货通知单
			GenericValue tempRecord = null;

			HSSFWorkbook wb = new HSSFWorkbook(new FileInputStream(tmpFile));
			Delegator delegator = (Delegator) request.getAttribute("delegator");
			HSSFSheet sheet = wb.getSheetAt(0);
			// 表头实体
			Map<String, GenericValue> headEntityMap = new HashMap<String, GenericValue>();
			List<GenericValue> headEntityList = new ArrayList<GenericValue>();
			// 分录实体
			List<GenericValue> entryEntityList = new ArrayList<GenericValue>();
			Iterator<Row> ir = sheet.iterator();
			while (ir.hasNext()) {
				Row curRow = ir.next();
				int rowNum = curRow.getRowNum();
				if (rowNum < 1 || curRow.getCell(0) == null)
					continue;
				String cargoNum = curRow.getCell(0).getStringCellValue();
				if (cargoNum == null)
					throw new Exception(rowNum + "行货号为空");
				// 处理表头
				GenericValue headEntity;
				if (headEntityMap.containsKey(cargoNum)) {// 存在表头记录
					headEntity = headEntityMap.get(cargoNum);
				} else {
					List<GenericValue> tempList = delegator.findByAnd("ProductOutNotification", UtilMisc.toMap("goodNumber", cargoNum));
					// 存在货号
					if(tempList.size()==1){
						isHas = true;
						tempRecord = tempList.get(0); // 只取第一条，默认一个货号只能唯一对应一条通知单
						if(tempRecord.getInteger("status")!=null && tempRecord.getInteger("status")==4){
							throw new Exception("出货通知单已存在并提交，导入数据无法替换存在的出货通知单！");
						}
					} else if(tempList.size()>1){
						throw new Exception("一个货号对应多个出货通知单，请检查并重新导入！");
					} else {
						isHas = false;
					}
					
					if(isHas){
						//删除已经存在的出货通知单
						delegator.removeByAnd("ProductOutNotificationEntry", UtilMisc.toMap("parentId", tempRecord.getString("id")));
						tempRecord.remove();
					}
					
					// 生成新表头实体
					headEntity = delegator.makeValue("ProductOutNotification");
					// 设置表头字段值
					String billId = UUID.randomUUID().toString();// id
					headEntity.set("id", billId);
					headEntity.set("goodNumber", cargoNum);// 货号
					// 编号
					String billNumber = snh.getSerialNumber(request, "ProductOutNotification");
					headEntity.set("number", billNumber);
					// 业务日期
					Timestamp nowStmp = new Timestamp(System.currentTimeMillis());
					headEntity.put("bizDate", nowStmp);
					// 计划出货时间
					headEntity.put("planDeliveryDate", nowStmp);
					// 到厂时间
					headEntity.put("arrivedTime", nowStmp);
					// 离厂时间
					headEntity.put("leaveTime", nowStmp);

					headEntityMap.put(cargoNum, headEntity);
					headEntityList.add(headEntity);
				}
				// 处理表体
				GenericValue entryEntity = delegator.makeValue("ProductOutNotificationEntry");
				// 设置分录字段
				entryEntity.set("id", UUID.randomUUID().toString());
				entryEntity.set("parentId", headEntity.getString("id"));

				entryEntity.set("orderNumber", curRow.getCell(1).getStringCellValue());// 订单号
				entryEntity.set("orderType", curRow.getCell(2).getStringCellValue());// 订单类型
				entryEntity.set("destinationId", curRow.getCell(3).getStringCellValue());// 目的地编码

				entryEntity.set("requireReceiveDate", new Timestamp(curRow.getCell(4).getDateCellValue().getTime()));// 客户要求收货日期
				entryEntity.set("orderGetDate", new Timestamp(curRow.getCell(5).getDateCellValue().getTime()));// 订单收单日

				// 宜家编码，转化为富桥产品id
				String ikeaNum = curRow.getCell(6).getStringCellValue();
				String materialId = isExist(delegator, "ProductMap", "entryMaterialId", "ikeaId", ikeaNum);
				if (materialId == null) {
					throw new Exception("第" + rowNum + "行产品资料表没找到对应的物料");
				}
				entryEntity.set("materialId", materialId);// 产品编码

				entryEntity.set("volume", new BigDecimal(curRow.getCell(7).getNumericCellValue()));// 订单数量
				entryEntity.set("grossWeight", new BigDecimal(curRow.getCell(8).getNumericCellValue()));// 订单毛重
				entryEntity.set("grossSize", new BigDecimal(curRow.getCell(9).getNumericCellValue()));// 订单毛体积
				entryEntity.set("sumBoardVolume", new BigDecimal(curRow.getCell(10).getNumericCellValue()));// 总托盘数量
				entryEntity.set("paperBoxVolume", new BigDecimal(curRow.getCell(11).getNumericCellValue()));// 纸箱数量

				// 目的地
				// String regionNum=curRow.getCell(12).getStringCellValue();
				// String regionId=isExist(delegator,"Region","id","number",
				// regionNum);
				// if(regionId==null){
				// throw new Exception("第"+rowNum+"行没找到对应的目的地");
				// }
				// entryEntity.set("regionId", regionId);//目的地
				entryEntity.set("regionId", curRow.getCell(12).getStringCellValue());
				entryEntityList.add(entryEntity);
			}

			boolean beganTransaction = false;
			try {
				beganTransaction = TransactionUtil.begin();
				delegator.storeAll(headEntityList);
				delegator.storeAll(entryEntityList);
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
		} catch (Exception e) {
			throw e;
		} finally {
			/**
			 * 3. 删除临时目录的数据文件
			 */
			tmpFile.delete();
		}

		JSONObject jsonStr = new JSONObject();
		jsonStr.put("success", true);
		CommonEvents.writeJsonDataToExt(response, jsonStr.toString(), "text/html");
		return "success";
	}

	private static String isExist(Delegator delegator, String entityName, String rtField, Object... cond) throws GenericEntityException {

		List<GenericValue> rs = delegator.findByAnd(entityName, cond);

		if (rs != null && rs.size() > 0) {
			return rs.get(0).getString(rtField);
		} else {
			return null;
		}

	}

}
