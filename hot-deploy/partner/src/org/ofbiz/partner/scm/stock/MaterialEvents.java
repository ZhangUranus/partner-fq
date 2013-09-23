package org.ofbiz.partner.scm.stock;

import java.io.File;
import java.io.FileInputStream;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.sf.json.JSONObject;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.HttpRequestFileUpload;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.transaction.GenericTransactionException;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.partner.scm.common.CommonEvents;

/**
 * 出货通知单业务事件类
 * 
 * @author Mark
 * 
 */
public class MaterialEvents {
	private static final String module = org.ofbiz.partner.scm.stock.MaterialEvents.class.getName();

	/**
	 * 导入发货通知单
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String importMaterialSafeStock(HttpServletRequest request, HttpServletResponse response) throws Exception {
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

			HSSFWorkbook wb = new HSSFWorkbook(new FileInputStream(tmpFile));
			Delegator delegator = (Delegator) request.getAttribute("delegator");
			HSSFSheet sheet = wb.getSheetAt(0);
			Iterator<Row> ir = sheet.iterator();

			boolean beganTransaction = false;
			try {
				beganTransaction = TransactionUtil.begin();
				
				while (ir.hasNext()) {
					Row curRow = ir.next();
					int rowNum = curRow.getRowNum();
					if (rowNum < 1 || curRow.getCell(0) == null)
						continue;
					String number = curRow.getCell(0).getStringCellValue();
					if (number == null)
						throw new Exception(rowNum + "物料编码为空！");
					
					Map<String, Object> fieldSet = new HashMap<String, Object>();
					fieldSet.put("safeStock", new BigDecimal(curRow.getCell(1).getNumericCellValue()));// 设置为审核状态
					delegator.storeByCondition("TMaterial", fieldSet, EntityCondition.makeConditionWhere("number='" + number + "'"));
					
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
}
