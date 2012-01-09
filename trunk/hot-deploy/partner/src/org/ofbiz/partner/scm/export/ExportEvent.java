package org.ofbiz.partner.scm.export;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.common.EntityCRUDEvent;
import org.ofbiz.partner.scm.export.util.*;

/**
 * 导出事件类
 * 说明：负责接收前端请求
 * @author Administrator
 *
 */
public class ExportEvent {
	public static String export(HttpServletRequest request, HttpServletResponse response) throws Exception {
		List<GenericValue> valueList = EntityCRUDEvent.getValueList(request);
		AbstractExporter exporter = ExportUtil.getInstance().getExportInstance(ExportType.valueOf(request.getParameter("type").toUpperCase()));
		exporter.export(request, response ,valueList);
		return "success";
	}
	
	public static String download(HttpServletRequest request, HttpServletResponse response) throws Exception {
		ExportUtil.getInstance().downFile(response, request.getParameter("filename"),request.getParameter("type"));
		return "success";
	}
}
