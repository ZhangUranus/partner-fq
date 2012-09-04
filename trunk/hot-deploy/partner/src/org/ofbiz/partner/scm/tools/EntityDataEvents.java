package org.ofbiz.partner.scm.tools;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.base.util.Debug;
import org.ofbiz.partner.scm.common.BillBaseEvent;
import org.ofbiz.service.LocalDispatcher;
/**
 * 实体数据工具类
 * 
 * @author Mark
 * 
 */
public class EntityDataEvents {
	private static final String module = org.ofbiz.partner.scm.stock.ConsignDrawMaterialEvents.class.getName();

	/**
	 * 导出数据库所有实体数据
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String entityExportAll(HttpServletRequest request, HttpServletResponse response) throws Exception {
		LocalDispatcher dispatcher = (LocalDispatcher) request.getAttribute("dispatcher");
		Map<String, String> paramMap = new HashMap<String, String>();	//参数
		String outpath = request.getParameter("outpath");
		if(outpath != null && !"".equals(outpath)){
			paramMap.put("outpath", outpath);
		} else {
			outpath = "export/data";
			paramMap.put("outpath", "export/data");
		}
		Debug.log("调用到出数据文件服务，导出路径：" + outpath, module);
		dispatcher.runAsync("SCMEntityExportAll", paramMap);	//导出所有数据
		BillBaseEvent.writeSuccessMessageToExt(response, "导出成功，数据路径："+outpath);
		return "success";
	}
}