package org.ofbiz.partner.scm.stock;

import java.io.File;
import java.io.FileInputStream;
import java.math.BigDecimal;
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
import org.ofbiz.entity.condition.EntityExpr;
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
			if ( delegator != null && billId != null ) {
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
			if ( delegator != null && billId != null ) {
				GenericValue billHead = delegator.findOne("ProductOutNotification", UtilMisc.toMap("id", billId), false);
				if (billHead == null || billHead.get("bizDate") == null) {
					throw new Exception("can`t find ProductOutNotification bill or bizdate is null");
				}
				Date bizDate = (Date) billHead.get("bizDate");
				if (bizDate == null || !Utils.isCurPeriod(bizDate)) {
					throw new Exception("单据业务日期不在当前系统期间");
				}
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
	 * 导入发货通知单
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String impOutNotificationBill(HttpServletRequest request, HttpServletResponse response) throws Exception {
		/**
		 * 1. 保存上传文件到临时目录
		 */
		String tmpPath=request.getSession().getServletContext().getRealPath("/tmp/");
		String tmpFileName="/"+String.valueOf(System.currentTimeMillis())+".xls";
		HttpRequestFileUpload fu=new HttpRequestFileUpload();
		fu.setSavePath(tmpPath);
		fu.setOverrideFilename(tmpFileName);
		fu.doUpload(request);
		File tmpFile=new File(tmpPath+tmpFileName);
		
		try {
			
			
			/**
			 * 2. 解析数据文件，生成对应的数据实体记录，保存实体记录到数据库
			 */
			SerialNumberHelper snh=new SerialNumberHelper();
			
			HSSFWorkbook wb=new HSSFWorkbook(new FileInputStream(tmpFile));
			Delegator delegator = (Delegator) request.getAttribute("delegator");
			HSSFSheet sheet= wb.getSheetAt(0);
			//表头实体
			Map<String,GenericValue> headEntityMap=new HashMap<String, GenericValue>();
			List<GenericValue> headEntityList=new ArrayList<GenericValue>();
			//分录实体
			List<GenericValue> entryEntityList=new ArrayList<GenericValue>();
			Iterator<Row> ir=sheet.iterator();
			while(ir.hasNext()){
				Row curRow=ir.next();
				int rowNum=curRow.getRowNum();
				if(rowNum<1||curRow.getCell(0)==null)continue;
				String cargoNum=curRow.getCell(0).getStringCellValue();
				if(cargoNum==null)throw new Exception(rowNum+"行货号为空");
				//处理表头
				GenericValue headEntity;
				if(headEntityMap.containsKey(cargoNum)){//存在表头记录
					headEntity=headEntityMap.get(cargoNum);
				}else{
					//生成新表头实体
					headEntity=delegator.makeValue("ProductOutNotification");
					//设置表头字段值
					String billId=UUID.randomUUID().toString();//id
					headEntity.set("id", billId);
					headEntity.set("goodNumber", cargoNum);//货号
					//编号
					String billNumber=snh.getSerialNumber(request, "ProductOutNotification");
					headEntity.set("number", billNumber);
					//业务日期
					Timestamp nowStmp=new Timestamp(System.currentTimeMillis());
					headEntity.put("bizDate", nowStmp);
					//计划出货时间
					headEntity.put("planDeliveryDate", nowStmp);
					//到厂时间
					headEntity.put("arrivedTime", nowStmp);
					//离厂时间
					headEntity.put("leaveTime", nowStmp);
					
					headEntityMap.put(cargoNum, headEntity);
					headEntityList.add(headEntity);
				}
				//处理表体
				GenericValue entryEntity=delegator.makeValue("ProductOutNotificationEntry");
				//设置分录字段
				entryEntity.set("id", UUID.randomUUID().toString());
				entryEntity.set("parentId", headEntity.getString("id"));
				
				entryEntity.set("orderNumber", curRow.getCell(1).getStringCellValue());//订单号
				entryEntity.set("orderType", curRow.getCell(2).getStringCellValue());//订单类型
				entryEntity.set("destinationId", curRow.getCell(3).getStringCellValue());//目的地编码
				
				entryEntity.set("requireReceiveDate", new Timestamp(curRow.getCell(4).getDateCellValue().getTime()));//客户要求收货日期
				entryEntity.set("orderGetDate", new Timestamp(curRow.getCell(5).getDateCellValue().getTime()));//订单收单日 
				
				
				//宜家编码，转化为富桥产品id
				String ikeaNum=curRow.getCell(6).getStringCellValue();
				String materialId=isExist(delegator,"ProductMap","entryMaterialId","ikeaId", ikeaNum);
				if(materialId==null){
					throw new Exception("第"+rowNum+"行产品资料表没找到对应的物料");
				}
				entryEntity.set("materialId", materialId);//产品编码
				
				
				entryEntity.set("volume", new BigDecimal(curRow.getCell(7).getNumericCellValue()));//订单数量
				entryEntity.set("grossWeight", new BigDecimal(curRow.getCell(8).getNumericCellValue()));//订单毛重
				entryEntity.set("grossSize", new BigDecimal(curRow.getCell(9).getNumericCellValue()));//订单毛体积
				entryEntity.set("sumBoardVolume", new BigDecimal(curRow.getCell(10).getNumericCellValue()));//总托盘数量
				entryEntity.set("paperBoxVolume", new BigDecimal(curRow.getCell(11).getNumericCellValue()));//纸箱数量
				
				//目的地
				String regionNum=curRow.getCell(12).getStringCellValue();
				String regionId=isExist(delegator,"Region","id","number", regionNum);
				if(regionId==null){
					throw new Exception("第"+rowNum+"行没找到对应的目的地");
				}
				entryEntity.set("regionId", regionId);//目的地
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
		}finally{
			/**
			 * 3. 删除临时目录的数据文件
			 */
			tmpFile.delete();
		}
		
		JSONObject jsonStr = new JSONObject();
		jsonStr.put("success", true);
		CommonEvents.writeJsonDataToExt(response, jsonStr.toString(),"text/html");
		return "success";
	}

	private static String isExist(Delegator delegator,String entityName,String rtField, Object... cond) throws GenericEntityException {
		
		List<GenericValue> rs=delegator.findByAnd(entityName, cond);
		
		if(rs!=null&&rs.size()>0){
			return rs.get(0).getString(rtField);
		}else{
			return null;
		}
		
	}
	
}