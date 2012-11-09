package org.ofbiz.partner.scm.services;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Map;

import org.ofbiz.base.util.Debug;
import org.ofbiz.entity.jdbc.ConnectionFactory;
import org.ofbiz.partner.scm.common.Utils;
import org.ofbiz.service.DispatchContext;
import org.ofbiz.service.ServiceUtil;

public class CommonServices {
	public static final String module = CommonServices.class.getName();
	
	/**
	 * 清理系统日志服务
	 * @param dctx
	 * @param context
	 * @return
	 */
	public static Map<String, Object> logCleanJobService(DispatchContext dctx, Map<String, ? extends Object> context) {
		Connection conn = null;
		try {
			conn = ConnectionFactory.getConnection(Utils.getConnectionHelperName());
			
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Calendar calendar = Calendar.getInstance();
			calendar.add(Calendar.MONTH, -6);	//6个月前
			String dateStr = sdf.format(calendar.getTime());
			
			//清理多余的日志信息
			String deleteExtraLogSql = " DELETE FROM SERVER_HIT WHERE ID NOT IN (" +
					"   SELECT SH.ID" +
					"   FROM (SELECT SHI.ID,SHI.REQUEST_URL FROM SERVER_HIT SHI) SH, T_SYSTEM_LOG_TYPE TSLT" +
					"   WHERE TSLT.VALID = '1'" +
					"   AND SH.REQUEST_URL LIKE CONCAT('%',TSLT.KEY_WORD,'%')" +
					" )";
			
			//清理半年前的日志信息
			String deleteLogByTimeSql = " DELETE FROM SERVER_HIT WHERE HIT_START_DATE_TIME < '" + dateStr + "'";
			
			Statement st = conn.createStatement();
			st.addBatch(deleteExtraLogSql);
			st.addBatch(deleteLogByTimeSql);
			st.executeBatch();
			
			Debug.logInfo("完成日志清除任务！", module);
		} catch (Exception e) {
			e.printStackTrace();
			return ServiceUtil.returnError(e.getMessage());
		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
					return ServiceUtil.returnError(e.getMessage());
				}
			}
		}
		return ServiceUtil.returnSuccess();
	}
}
