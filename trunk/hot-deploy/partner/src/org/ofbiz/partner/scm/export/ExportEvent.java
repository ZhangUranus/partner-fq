package org.ofbiz.partner.scm.export;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.ofbiz.partner.scm.common.EntityCRUDEvent;
import org.ofbiz.partner.scm.common.Utils;
import org.ofbiz.partner.scm.export.util.*;
import org.ofbiz.partner.scm.rpt.DataFetchEvents;

/**
 * 导出事件类
 * 说明：负责接收前端请求
 * @author Administrator
 *
 */
public class ExportEvent {
	public static String export(HttpServletRequest request, HttpServletResponse response) throws Exception {
		List<Map<String, Object>> list = null;
		if("SQL".equals(request.getParameter("pattern"))){
			list = DataFetchEvents.getListWithReportName(request);
		}else{
			list = Utils.changeListFormGenericValue(EntityCRUDEvent.getValueList(request));
		}
		AbstractExporter exporter = ExportUtil.getInstance().getExportInstance(ExportType.valueOf(request.getParameter("type").toUpperCase()));
		exporter.export(request, response ,list);
		return "success";
	}
	
	public static String download(HttpServletRequest request, HttpServletResponse response) throws Exception {
		ExportUtil.getInstance().downFile(response, request.getParameter("filename"),request.getParameter("type"));
		return "success";
	}
}
