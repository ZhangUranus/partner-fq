package org.ofbiz.partner.scm.export;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.export.util.ExcelStyleFormatter;
import org.ofbiz.partner.scm.export.util.ExportType;
import org.ofbiz.partner.scm.export.util.ExportUtil;

/**
 * 导出助手类，负责所有导出功能的实现
 * 
 * @author jeff
 * 
 */
public class ExportHelper {
	private ExportType exportType;

	public ExportHelper(ExportType exportType) {
		this.exportType = exportType;
	}

	public void exportToExcel(HttpServletResponse response, HSSFWorkbook workbook, HSSFSheet sheet, String[] header, String[] dataIndex, List<Map<String, Object>> valueList) throws Exception {
		// 产生表格标题行
		HSSFRow row = sheet.createRow(0);

		HSSFCellStyle style = ExcelStyleFormatter.getDefaultStyle(workbook);
		HSSFCellStyle titleStyle = ExcelStyleFormatter.getTitleDefaultStyle(workbook);

		// 标题行写入
		if (header != null) {
			for (int i = 0; i < header.length; i++) {
				HSSFCell cell = row.createCell(i);
				cell.setCellStyle(titleStyle);
				HSSFRichTextString text = new HSSFRichTextString(header[i]);
				cell.setCellValue(text);
			}
		}

		// 数据写入
		int index = 0;
		for (Map<String ,Object> v : valueList) {
			index++;
			row = sheet.createRow(index);
			if (dataIndex != null) {
				for (int i = 0; i < dataIndex.length; i++) {
					HSSFCell cell = row.createCell(i);
					cell.setCellStyle(style);
					String tempText = "";
					if(v.get(dataIndex[i]) != null){
						if ("status".equals(dataIndex[i].toLowerCase())) {
							if ("0".equals(v.get(dataIndex[i]).toString())) {
								tempText = "保存";
							} else if ("1".equals(v.get(dataIndex[i]).toString())) {
								tempText = "已审核";
							} else if ("2".equals(v.get(dataIndex[i]).toString())) {
								tempText = "审核不通过";
							} else if ("3".equals(v.get(dataIndex[i]).toString())) {
								tempText = "已结算";
							} else if ("4".equals(v.get(dataIndex[i]).toString())) {
								tempText = "已提交";
							} else {
								tempText = "未知";
							}
						} else if ("billType".equals(dataIndex[i].toLowerCase())) {
							if ("1".equals(v.get(dataIndex[i]).toString())) {
								tempText = "普通单据";
							} else if ("2".equals(v.get(dataIndex[i]).toString())) {
								tempText = "扫描单据";
							} else {
								tempText = "未知";
							}
						} else {
							tempText = v.get(dataIndex[i]).toString();
						}
					} else {
						tempText = "";
					}
					HSSFRichTextString text = new HSSFRichTextString(tempText);
					cell.setCellValue(text);
				}
			}
		}
		ExportUtil.getInstance().createDefaultFolder();

		String filename = UUID.randomUUID().toString() + "." + this.exportType.getExtension();
		OutputStream out = new FileOutputStream(ExportUtil.PATH + File.separator + filename);
		workbook.write(out);
		out.flush();
		out.close();
		CommonEvents.writeJsonDataToExt(response, "{'success':true,filename:'" + filename + "'}");
	}
}
