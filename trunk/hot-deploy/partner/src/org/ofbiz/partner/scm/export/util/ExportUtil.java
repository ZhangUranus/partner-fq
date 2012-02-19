package org.ofbiz.partner.scm.export.util;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.ofbiz.partner.scm.export.*;
/**
 * 导出工具类
 * @author jeff
 * 
 */
public class ExportUtil {
	private static ExportUtil instance;
	
	public static String PATH="export";
	private Map<ExportType, AbstractExporter> map = new HashMap<ExportType, AbstractExporter>();
	
	
	private ExportUtil() {
		/**
		 * 增加导出类时，需要在该map中添加相应的代码
		 */
		map.put(ExportType.EXCEL, new ExcelExporter());
	}

	public static ExportUtil getInstance() {
		if (instance == null)
			instance = new ExportUtil();
		return instance;
	}
	
	public AbstractExporter getExportInstance(ExportType exportType){
		if(exportType == null ){
			exportType = ExportType.EXCEL;
		}
		return map.get(exportType);
	}
	
	public void createDefaultFolder(){
		File file = new File(PATH);
		if(!file.exists()){
			file.mkdir();
		}
	}

	public void downFile(HttpServletResponse response,String fileName,String type) throws IOException {
		File file = new File(PATH+File.separator+fileName);
		if (file.exists()) {
			ExportType exportType = ExportType.valueOf(type);
			if(exportType != null){
				response.setContentType(exportType.getContentType());
			}else{
				response.setContentType("application/x-msexcel");
			}
			// 保存文件名称
			fileName = fileName.substring(fileName.lastIndexOf("/") + 1);
			
			// servlet中，要在 header中设置下载方式
			response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
			// FileInputStream输入流
			// FileInputStream bis = new FileInputStream(file);
			// 缓冲流(BufferedStream)可以一次读写一批数据，,缓冲流(Buffered
			// Stream)大大提高了I/O的性能。
			BufferedInputStream bis = new BufferedInputStream(new FileInputStream(file));
			// OutputStream输出流
			OutputStream bos = response.getOutputStream();
			byte[] buff = new byte[1024];
			int readCount = 0;
			// 每次从文件流中读1024个字节到缓冲里。
			readCount = bis.read(buff);
			while (readCount != -1) {
				// 把缓冲里的数据写入浏览器
				bos.write(buff, 0, readCount);
				readCount = bis.read(buff);
			}
			if (bis != null) {
				bis.close();
			}
			if (bos != null) {
				bos.close();
			}
			// 下载完毕，给浏览器发给完毕的头
			response.setStatus(HttpServletResponse.SC_OK);
			response.flushBuffer();
			file.delete();		//删除已经下载的文件
		}
	}

}
