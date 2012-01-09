package org.ofbiz.partner.scm.export;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.export.util.ExportType;

/**
 * Excel导出类
 * 
 * @author jeff
 * 
 */
public class ExcelExporter extends AbstractExporter {

	@Override
	public ExportType getExportType() {
		return ExportType.EXCEL;
	}

	@Override
	public void export(HttpServletRequest request, HttpServletResponse response, List<GenericValue> valueList) throws Exception {
		String title = "Sheet1";
		String[] header = null;
		String[] dataIndex = null;
		if (request.getParameter("title") != null) {
			title = request.getParameter("title");
		}
		if (request.getParameter("header") != null) {
			header = request.getParameter("header").toString().split(",");
			dataIndex = request.getParameter("dataIndex").toString().split(",");
		}

		// 声明一个工作薄
		HSSFWorkbook workbook = new HSSFWorkbook();
		// 生成一个表格
		HSSFSheet sheet = workbook.createSheet(title);
		
		ExportHelper exportHelper = new ExportHelper(getExportType());
		exportHelper.exportToExcel(response, workbook, sheet, header, dataIndex, valueList);
	}

}
