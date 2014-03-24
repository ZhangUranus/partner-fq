package org.ofbiz.partner.scm.services;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
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
			

			Debug.log("开始日志清除任务！", module);
			
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Calendar calendar = Calendar.getInstance();
			calendar.add(Calendar.DATE, -10);	//10天前
			String dateStr = sdf.format(calendar.getTime());
			
			
			//清理半年前的日志信息
			String deleteLogByTimeSql = " DELETE FROM SERVER_HIT WHERE HIT_START_DATE_TIME < '" + dateStr + "'";

			String deleteLogbinByTimeSql = " DELETE FROM SERVER_HIT_BIN WHERE BIN_START_DATE_TIME < '" + dateStr + "'";

			String deleteVisitByTimeSql = " DELETE FROM VISIT WHERE FROM_DATE < '" + dateStr + "'";

			//String deleteVisitorByTimeSql = " DELETE FROM VISITOR WHERE LAST_UPDATED_STAMP < '" + dateStr + "'";
			
			Statement st = conn.createStatement();
			st.addBatch(deleteLogByTimeSql);
			st.addBatch(deleteLogbinByTimeSql);
			st.addBatch(deleteVisitByTimeSql);
			//st.addBatch(deleteVisitorByTimeSql);
			
			st.executeBatch();
			
			Debug.log("完成日志清除任务！", module);
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
	
	/**
	 * 整理大表索引
	 * @param dctx
	 * @param context
	 * @return
	 */
	public static Map<String, Object> optimizeTableService(DispatchContext dctx, Map<String, ? extends Object> context) {
		Connection conn = null;
		try {
			conn = ConnectionFactory.getConnection(Utils.getConnectionHelperName());

			Debug.log("开始整理大表索引任务！", module);
			
			// 整理大表索引
			String optimizeSql1 = "OPTIMIZE TABLE PRODUCT_INWAREHOUSE_ENTRY_DETAIL";
			String optimizeSql2 = "OPTIMIZE TABLE PRODUCT_INWAREHOUSE_ENTRY_DETAIL_HIS";
			String optimizeSql3 = "OPTIMIZE TABLE PRODUCT_INWAREHOUSE_ENTRY_DETAIL_BACKUP";
			String optimizeSql4 = "OPTIMIZE TABLE PRODUCT_INWAREHOUSE_ENTRY";
			String optimizeSql5 = "OPTIMIZE TABLE PRODUCT_OUTWAREHOUSE_ENTRY";
			String optimizeSql6 = "OPTIMIZE TABLE SERVER_HIT";
			String optimizeSql7 = "OPTIMIZE TABLE SERVER_HIT_BIN";
			String optimizeSql8 = "OPTIMIZE TABLE VISIT";
			String optimizeSql9 = "OPTIMIZE TABLE WORKSHOP_DRAW_MATERIAL_ENTRY";
			
			Statement st = conn.createStatement();
			st.addBatch(optimizeSql1);
			st.addBatch(optimizeSql2);
			st.addBatch(optimizeSql3);
			st.addBatch(optimizeSql4);
			st.addBatch(optimizeSql5);
			st.addBatch(optimizeSql6);
			st.addBatch(optimizeSql7);
			st.addBatch(optimizeSql8);
			st.addBatch(optimizeSql9);
			st.executeBatch();
			
			Debug.log("完成整理大表索引任务！", module);
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
	
	
	/**
	 * 备份大表数据，并清理
	 * @param dctx
	 * @param context
	 * @return
	 */
	public static Map<String, Object> backupAndClearTableData(DispatchContext dctx, Map<String, ? extends Object> context) {
		Connection conn = null;
		try {
			conn = ConnectionFactory.getConnection(Utils.getConnectionHelperName());

			Debug.log("开始备份大表数据任务！", module);

			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
			String dateStr = sdf.format(new Date());
			
			SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Calendar calendar = Calendar.getInstance();
			calendar.add(Calendar.MONTH, -3);	//3个月前
			String dateStr2 = sdf2.format(calendar.getTime());
			
			// 整理大表索引
			String moveSql = "INSERT INTO PRODUCT_INWAREHOUSE_ENTRY_DETAIL_BACKUP SELECT * FROM PRODUCT_INWAREHOUSE_ENTRY_DETAIL_HIS WHERE OUT_BIZ_DATE <'"+dateStr2+"'";
			String deleteSql = "DELETE FROM PRODUCT_INWAREHOUSE_ENTRY_DETAIL_HIS WHERE OUT_BIZ_DATE <'"+dateStr2+"'";
			String backupSql = "SELECT * FROM PRODUCT_INWAREHOUSE_ENTRY_DETAIL_BACKUP INTO OUTFILE \"/home/data/backdata/PRODUCT_INWAREHOUSE_ENTRY_DETAIL_BACKUP."+dateStr+"\"";
			//String backupSql = "SELECT * FROM PRODUCT_INWAREHOUSE_ENTRY_DETAIL_BACKUP INTO OUTFILE \"D:/partner/data_backup/02/PRODUCT_INWAREHOUSE_ENTRY_DETAIL_BACKUP."+dateStr+"\"";//02系统
			//String backupSql = "SELECT * FROM PRODUCT_INWAREHOUSE_ENTRY_DETAIL_BACKUP INTO OUTFILE \"D:/partner/data_backup/03/PRODUCT_INWAREHOUSE_ENTRY_DETAIL_BACKUP."+dateStr+"\"";//03系统
			String clearSql = "TRUNCATE TABLE PRODUCT_INWAREHOUSE_ENTRY_DETAIL_BACKUP";
			
			Statement st = conn.createStatement();
			
			st.execute(moveSql);
			st.execute(deleteSql);
			st.execute(backupSql);
			st.execute(clearSql);
			
//			st.addBatch(moveSql);
//			st.addBatch(deleteSql);
//			st.addBatch(backupSql);
//			st.addBatch(clearSql);
//			st.executeBatch();
			
			Debug.log("完成备份大表数据任务！", module);
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
