package org.ofbiz.partner.scm.export;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.export.util.ExportType;

/**
 * 导出抽象类
 * 说明：所有导出类必须基础该类。
 * @author jeff
 *
 */
public abstract class AbstractExporter {
	public abstract ExportType getExportType();

	public abstract void export(HttpServletRequest request, HttpServletResponse response, List<GenericValue> valueList) throws Exception;
}
