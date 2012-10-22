package org.ofbiz.partner.scm.export.util;

/**
 * 导出类型枚举类
 * 
 * @author jeff
 *
 */
public enum ExportType {
	EXCEL("application/vnd.ms-excel", "xls"),
	EXCELXML("application/vnd.ms-excel", "xls"),
	CSV("text/csv", "csv"),
	PDF("application/pdf", "pdf"),
	TXT("text/plain", "txt"),
	WORD("application/vnd.ms-word", "doc"),
	JPEG("image/jpeg", "jpeg");

	private final String contentType;
	private final String extension;

	private ExportType(String contentType, String extension) {
		this.contentType = contentType;
		this.extension = extension;
	}

	public String getContentType() {
		return contentType;
	}

	public String getExtension() {
		return extension;
	}
}
