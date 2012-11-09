package org.ofbiz.partner.scm.services;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Map;
import java.util.UUID;

import org.ofbiz.base.util.Debug;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.jdbc.ConnectionFactory;
import org.ofbiz.entity.transaction.GenericTransactionException;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.service.DispatchContext;
import org.ofbiz.service.ServiceUtil;

public class SyncScanDataServices {

	public static final String module = SyncScanDataServices.class.getName();
	// 配置成品数据库数据源名称
	private static String midDatabaseHelperName = "localscan";
	private static final SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");

	/**
	 * 同步车间成品扫描情况 服务
	 * 
	 * @param dctx
	 * @param context
	 * @return
	 */
	public synchronized static Map<String, Object> syncService(DispatchContext dctx, Map<String, ? extends Object> context) {
		try {
			syncRecord();
		} catch (Exception e) {
			e.printStackTrace();
			ServiceUtil.returnFailure();
		}
		return ServiceUtil.returnSuccess();
	}

	/**
	 * 同步进仓单记录，处理当期月份的数据
	 * 1.从扫描库中获取新增扫描记录，将状态为0（初始状态）更新为1（处理中）。
	 * 2.将扫描库中状态为1（处理中）的数据同步到仓库管理系统数据库中。
	 * 3.将扫描库中状态为1（处理中）的数据更新为状态2（已处理）。
	 */
	public static synchronized void syncRecord() throws Exception {
		Delegator delegator = org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();

		// 读取中间表车间成品入库记录
		Connection midconn = null;
		try {
			midconn = ConnectionFactory.getConnection(midDatabaseHelperName);
		} catch (GenericEntityException e) {
			Debug.logError("获取成品入库数据库连接出错", module);
			e.printStackTrace();
			throw new Exception("获取成品入库数据库连接出错");
		} catch (SQLException e) {
			Debug.logError("获取成品入库数据库连接出错", module);
			e.printStackTrace();
			throw new Exception("获取成品入库数据库连接出错");
		}

		// 获取时间段记录，排除已经处理过的记录
		ResultSet rs = null;
		try {
			Debug.logInfo("开始更新扫描数据，更新数据状态为1（处理中）", module);
			String updateSql1 = "update jxcla set LA012 = 1 where LA012 = 0";
			PreparedStatement ps = midconn.prepareStatement(updateSql1);
			int updateCount = ps.executeUpdate();
			Debug.logInfo("完成更新扫描数据，更新数据状态1（处理中），总共更新" + updateCount + "条记录", module);
			
			Debug.logInfo("开始查询成品库入库记录，排除已经处理过的记录", module);
			String selectSql = "select * from jxcla where LA012 = 1";
			ps = midconn.prepareStatement(selectSql);
			rs = ps.executeQuery();

			// 启动事务
			TransactionUtil.begin();
			// 生成成品进仓确认单
			while (rs.next()) {
				GenericValue productScan = delegator.makeValue("ProductScan");
				productScan.set("id", UUID.randomUUID().toString());// 设置id
				productScan.set("productId", rs.getString("LA001"));// 设置产品编码
				productScan.set("bizDate", new Timestamp(df.parse(rs.getString("LA002")).getTime()));// 设置业务日期
				productScan.set("qantityC", rs.getString("LA003"));// 板数量（字符）
				productScan.set("barcode1", rs.getString("LA004"));// 条形码
				productScan.set("barcode2", rs.getString("LA005"));// 流水号
				productScan.set("type", rs.getInt("LA006"));// 类型（减或调拨单性质的出写入为-1,其余为+1）
				productScan.set("volume", rs.getBigDecimal("LA007"));// 数量（代表每次扫描一个托板，基本值为1）
				productScan.set("inOutType", rs.getString("LA008"));// 出入类别（A正常出入，B非正常出入）
				productScan.set("description", rs.getString("LA009"));// 描述（产品范围，客户要求的，本系统用于区分包装类型的文字描述）
				productScan.set("qantity", rs.getLong("LA010"));// 板数量
				productScan.set("warehouseType", rs.getInt("LA011"));// 交易类别(按单据性质的交易类别判断码(1.入库,2.销货,3.领用,4.调拨,5.调整))
				productScan.set("status", 0);// 状态(0：待处理，1：处理中，2：已处理) 
				delegator.create(productScan);// 保存分录
			}
			// 事务提交
			TransactionUtil.commit();
			Debug.logInfo("完成查询成品库入库记录，排除已经处理过的记录", module);
			
			Debug.logInfo("开始更新扫描数据，更新数据状态为2（已处理）", module);
			String updateSql2 = "update jxcla set LA012 = 2 where LA012 = 1";
			ps = midconn.prepareStatement(updateSql2);
			updateCount = ps.executeUpdate();
			Debug.logInfo("完成更新扫描数据，更新数据状态2（已处理），总共更新" + updateCount + "条记录", module);
		} catch (Exception e) {
			Debug.logError("查询成品库或者生成车间出入库单出错", module);
			e.printStackTrace();
			// 事务回滚
			try {
				TransactionUtil.rollback();
			} catch (GenericTransactionException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
				Debug.logError("事务回滚失败~", module);
			}
		}
	}
}
