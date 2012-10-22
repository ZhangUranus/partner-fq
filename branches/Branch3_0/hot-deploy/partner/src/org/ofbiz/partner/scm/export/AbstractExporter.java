package org.ofbiz.partner.scm.export;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.partner.scm.export.util.ExportType;

/**
 * 导出抽象类 说明：所有导出类必须基础该类。
 * 
 * @author jeff
 * 
 */
public abstract class AbstractExporter {
	public abstract ExportType getExportType();

	public abstract void export(HttpServletRequest request, HttpServletResponse response, List<Map<String, Object>> valueList) throws Exception;
}
