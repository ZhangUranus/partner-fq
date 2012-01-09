package org.ofbiz.partner.scm.export;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.export.util.ExcelStyleFormatter;
import org.ofbiz.partner.scm.export.util.ExportType;
import org.ofbiz.partner.scm.export.util.ExportUtil;

/**
 * 导出助手类，负责所有导出功能的实现
 * @author jeff
 *
 */
public class ExportHelper {
	private ExportType exportType;
	
	public ExportHelper(ExportType exportType){
		this.exportType = exportType;
	}
	
	public void exportToExcel(HttpServletResponse response,HSSFWorkbook workbook,HSSFSheet sheet,String[] header,String[] dataIndex,List<GenericValue> valueList) throws Exception{
		// 产生表格标题行
		HSSFRow row = sheet.createRow(0);
		
		HSSFCellStyle style = ExcelStyleFormatter.getDefaultStyle(workbook);
		HSSFCellStyle titleStyle = ExcelStyleFormatter.getTitleDefaultStyle(workbook);
		
		//标题行写入
		if(header != null){
			for (int i = 0; i < header.length; i++) {
				HSSFCell cell = row.createCell(i);
				cell.setCellStyle(titleStyle);
				HSSFRichTextString text = new HSSFRichTextString(header[i]);
				cell.setCellValue(text);
			}
		}
		
		//数据写入
		int index = 0;
		for(GenericValue v : valueList){
			index++;
			row = sheet.createRow(index);
			if(dataIndex != null){
				for (int i = 0; i < dataIndex.length; i++) {
					HSSFCell cell = row.createCell(i);
					cell.setCellStyle(style);
					HSSFRichTextString text = new HSSFRichTextString(v.getString(dataIndex[i]));
					cell.setCellValue(text);
				}
			}
		}
		ExportUtil.getInstance().createDefaultFolder();
		
		String filename = UUID.randomUUID().toString()+"."+this.exportType.getExtension();
		OutputStream out = new FileOutputStream(ExportUtil.PATH+File.separator+filename);
		workbook.write(out);
		out.flush();
		out.close();
		CommonEvents.writeJsonDataToExt(response, "{'success':true,filename:'"+filename+"'}");
	}
}
