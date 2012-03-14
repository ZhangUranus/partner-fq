package org.ofbiz.partner.scm.services;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.jdbc.ConnectionFactory;
import org.ofbiz.entity.transaction.GenericTransactionException;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.partner.scm.pricemgr.Utils;
import org.ofbiz.service.DispatchContext;
import org.ofbiz.service.ServiceUtil;

public class ProductInwarehouseServices {
	
	public static final String module = ProductInwarehouseServices.class.getName();
	//配置成品数据库数据源名称
	public static final String midDatabaseHelperName="localmysql";
	
	private static final SimpleDateFormat df= new SimpleDateFormat("yyyyMMdd");
	
	//料品编码和物料对象对应表
	private static Map<String, GenericValue> matrerialNbr2ObjMap=null;
	//private static Object mtrMapLock=new Object();//对应matrerialNbr2IdMap的更新锁
	
	//刷新matrerialNbr2ObjMap表
	private static void refreshMtrMap(){
		Delegator delegator=org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
		try {
			List<GenericValue> mtrList=delegator.findByAnd("TMaterial", null,false);
			if(mtrList!=null){
				matrerialNbr2ObjMap=new HashMap<String, GenericValue>(mtrList.size());
				for(GenericValue mtrValue:mtrList){
					matrerialNbr2ObjMap.put(mtrValue.getString("number"), mtrValue);
				}
			}
		} catch (GenericEntityException e) {
			Debug.logError("刷新物料列表出错", module);
			e.printStackTrace();
		}
	}
	/**
	 * 同步车间成品入库
	 * @param dctx
	 * @param context
	 * @return
	 */
	public synchronized static Map<String, Object> syncProduct(DispatchContext dctx, Map<String, ? extends Object> context) {
		
		//获取本期间开始结束时间
		Date fromDate=null;//开始时间
		Date endDate=null;//结束时间
		
		String fromStr=null;//开始时间年月日
		String endStr=null;//结束时间年月日
		
		Calendar cal=Calendar.getInstance();
		Date curDate=Utils.getCurDate();
		cal.setTime(curDate);
		cal.set(Calendar.DATE, 1);
		cal.set(Calendar.HOUR, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);
		fromDate=cal.getTime();
		fromStr=df.format(fromDate);
		
		cal.add(Calendar.MONDAY, 1);
		cal.add(Calendar.DATE, -1);
		cal.set(Calendar.HOUR, 23);
		cal.set(Calendar.MINUTE, 59);
		cal.set(Calendar.SECOND, 59);
		cal.set(Calendar.MILLISECOND, 999);
		endDate=cal.getTime();
		endStr=df.format(endDate);
		
		
		//获取库存系统车间入库 LA004 和LA005字段过滤字符串
		String[] idStrArr=getSysExistWhr(fromDate, endDate); 
		if(idStrArr==null)return ServiceUtil.returnError("获取LA004 和 LA005 过滤字符串出错"); 
		
		
		//读取中间表车间成品入库记录
		Connection midconn=null;
		try {
			midconn=ConnectionFactory.getConnection(midDatabaseHelperName);
		} catch (GenericEntityException e) {
			Debug.logError("获取成品入库数据库连接出错", module);
			e.printStackTrace();
			return ServiceUtil.returnError(e.getMessage());
		} catch (SQLException e) {
			Debug.logError("获取成品入库数据库连接出错", module);
			e.printStackTrace();
			return ServiceUtil.returnError(e.getMessage());
		}

		
		//获取时间段记录，排除已经处理过的记录
		ResultSet rs=null;
		try {
			Debug.logInfo("开始查询成品库入库记录，排除已经处理过的记录，开始时间"+fromStr+"  结束时间"+endStr, module);
			
			PreparedStatement ps=midconn.prepareStatement("select * from jxcla where LA002>=? and LA002<=? and LA008='A' and LA011='1' and LA004 not in "+idStrArr[0]+" and LA005 not in "+idStrArr[1]);
			ps.setString(1, fromStr);
			ps.setString(2, endStr);
			rs=ps.executeQuery();
			
			//启动事务
			TransactionUtil.begin();
			Delegator delegator=org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
			
			//获取默认车间id
			GenericValue defaultWorkshop=delegator.findOne("Workshop", UtilMisc.toMap("number", "002"), false);
			String defaultWorkshopId=defaultWorkshop.getString("id");
			
			//获取默认仓库id
			GenericValue defaultWarehouse=delegator.findOne("Warehouse", UtilMisc.toMap("number", "002"), false);
			String defaultWarehouseId=defaultWarehouse.getString("id");
			
			//生成车间入库单
			while(rs.next()){
				String headId=UUID.randomUUID().toString();//单头id
				Date bizDate=df.parse(rs.getString("LA002"));//单头日期
				int perPkg=rs.getInt("LA010");//每板数量
				String mtrNbr=null;//物料编码
				if(perPkg>1){
					mtrNbr=rs.getString("LA001")+"("+perPkg+")";
				}else{
					mtrNbr=rs.getString("LA001");
				}
				
				
				GenericValue workPrdHead= delegator.makeValue("WorkshopReturnProduct");
				workPrdHead.set("id", headId);//设置id
				workPrdHead.set("number", rs.getString("LA004")+rs.getString("LA005"));//设置编码
				workPrdHead.set("bizDate", bizDate);//设置业务日期
				workPrdHead.set("workshopWorkshopId",defaultWorkshopId);//设置车间
				delegator.store(workPrdHead);//保存表头
				
				GenericValue workPrdEntry=delegator.makeValue("WorkshopReturnProductEntry");
				workPrdEntry.set("id", UUID.randomUUID());//设置分录id
				workPrdEntry.set("parentId", headId);//设置表头id
				
				//根据编码从缓存取物料对象
				GenericValue materialValue=matrerialNbr2ObjMap.get(mtrNbr);
				if(materialValue==null){
					refreshMtrMap();
				}
				//再次根据编码从缓存取物料对象
				materialValue=matrerialNbr2ObjMap.get(mtrNbr);
				if(materialValue==null){
					Debug.logError("获取不了料品id："+mtrNbr,module);
					continue;
				}
				
				workPrdEntry.set("warehouseWarehouseId", defaultWarehouseId);//设置默认仓库id
				workPrdEntry.set("materialMaterialId", materialValue.get("id"));//设置物料id
				workPrdEntry.set("materialMaterialModel", materialValue.get("model"));//设置物料型号
				workPrdEntry.set("volume", rs.getBigDecimal("LA007"));//设置入库数量
				workPrdEntry.set("unitUnitId", materialValue.get("defaultUnitId"));//设置计量单位id
				delegator.store(workPrdEntry);//保存分录
				
			}
			//事务提交
			TransactionUtil.commit();
		} catch (Exception e) {
			Debug.logError("查询成品库或者生成车间入库单出错", module);
			e.printStackTrace();
			//事务回滚
			try {
				TransactionUtil.rollback();
			} catch (GenericTransactionException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
				Debug.logError("事务回滚失败~", module);
			}
			return ServiceUtil.returnError(e.getMessage());
		}
		
		
		
		return ServiceUtil.returnSuccess();
	}
	
	/**
	 * 获取时间段日期内的车间成品入库单标记LA004  LA005两个字符串
	 * 样式如{"('444','444','444','444')","('555','555','555','555')"}
	 * @param fd
	 * @param ed
	 * @return
	 */
	public static String[] getSysExistWhr(Date fd,Date ed){
		
		Debug.logInfo("获取车间成品库记录，时间段 从 "+fd.toString()+" 至  "+ed.toString(), module);
		//库存系统连接
		Connection pnconn=null;
		try {
			pnconn=ConnectionFactory.getConnection(org.ofbiz.partner.scm.common.Utils.getConnectionHelperName());
		} catch (GenericEntityException e) {
			Debug.logError("获取库存数据库连接出错", module);
			e.printStackTrace();
			return null;
		} catch (SQLException e) {
			Debug.logError("获取库存数据库连接出错", module);
			e.printStackTrace();
			return null;
		}
		StringBuffer la4Str=new StringBuffer();
		la4Str.append("('emptyholder'");
		StringBuffer la5Str=new StringBuffer();
		la5Str.append("('emptyholder'");
		try {
			PreparedStatement ps=pnconn.prepareStatement("select LA004 ,LA005 from Workshop_Return_Product_Entry where parent_id = (select id from Workshop_Return_Product where biz_Date>=? and biz_Date<=?) and LA004 is not null and LA005 is not null");
			ps.setTimestamp(1, new Timestamp(fd.getTime()));
			ps.setTimestamp(2, new Timestamp(ed.getTime()));
			ResultSet rs=ps.executeQuery();
			Debug.logInfo("获取成品记录完成，开始拼凑LA004和LA005字段过滤字符串", module);
			while(rs.next()){
				la4Str.append(",'").append(rs.getString("LA004")).append("'");
				la5Str.append(",'").append(rs.getString("LA005")).append("'");
			}
			la4Str.append(")");
			la5Str.append(")");
			
			Debug.logInfo("拼凑LA004和LA005字段过滤字符串完成", module);
			return new String[]{la4Str.toString(),la5Str.toString()};
		} catch (SQLException e) {
			Debug.logError("查询车间成品入库记录出错", module);
			e.printStackTrace();
			return null;
		}finally{
			if(pnconn!=null){
				try {
					pnconn.close();
				} catch (SQLException e) {
					Debug.logError("关闭连接出错", module);
					e.printStackTrace();
				}
			}
		}
		
	}
}
