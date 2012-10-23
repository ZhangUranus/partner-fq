package org.ofbiz.partner.scm.services;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.ofbiz.base.util.Debug;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.jdbc.ConnectionFactory;
import org.ofbiz.entity.transaction.GenericTransactionException;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.partner.scm.pricemgr.Utils;
import org.ofbiz.service.DispatchContext;
import org.ofbiz.service.ServiceUtil;

public class ProductInwarehouseServices {
	
	public static final String module = ProductInwarehouseServices.class.getName();
	//配置成品数据库数据源名称
	private static String midDatabaseHelperName="localscan";
	
	
	private static final SimpleDateFormat df= new SimpleDateFormat("yyyyMMdd");
	
	//宜家产品对照表
	private static Map<String, String> ikeaNum2Material=new HashMap<String, String>();
	private static Object ikeaMapLock=new Object();//对应ikeaNum2Material的更新锁
	private static  void refreshIkeaMap(){
		synchronized (ikeaMapLock) {
			Delegator delegator=org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
			try {
				List<GenericValue> ikeaList=delegator.findList("ProductMap", null, null, null, null, false);
				if(ikeaList!=null){
					ikeaNum2Material=new HashMap<String, String>(ikeaList.size());
					for(GenericValue ikeamap:ikeaList){
						ikeaNum2Material.put(ikeamap.getString("ikeaId")+ikeamap.getString("boardCount"), ikeamap.getString("materialId"));
					}
				}
			} catch (GenericEntityException e) {
				Debug.logError("宜家产品对照列表出错", module);
				e.printStackTrace();
			}
		}
	}
	
	//料品id和物料对象对应表
	private static Map<String, GenericValue> material2ObjMap=new HashMap<String, GenericValue>();
	private static Object mtrMapLock=new Object();//对应material2ObjMap的更新锁
	
	//刷新matrerial2ObjMap表
	private static void refreshMtrMap(){
		synchronized (mtrMapLock) {
			Delegator delegator=org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
			try {
				List<GenericValue> mtrList=delegator.findList("TMaterial", null, null, null, null, false);
				if(mtrList!=null){
					material2ObjMap=new HashMap<String, GenericValue>(mtrList.size());
					for(GenericValue mtrValue:mtrList){
						material2ObjMap.put(mtrValue.getString("id"), mtrValue);
					}
				}
			} catch (GenericEntityException e) {
				Debug.logError("刷新物料列表出错", module);
				e.printStackTrace();
			}
		}
	}
	/**
	 * 同步车间成品入库 服务
	 * @param dctx
	 * @param context
	 * @return
	 */
	public synchronized static Map<String, Object> syncProductService(DispatchContext dctx, Map<String, ? extends Object> context) {
		try {
			syncRecord();
		} catch (Exception e) {
			e.printStackTrace();
			ServiceUtil.returnFailure();
		}
		return ServiceUtil.returnSuccess();
	}
	
	
	/**
	 * 获取时间段日期内的成品入库确认单标记barcode1  barcode2两个字符串
	 * 样式如{"('444','444','444','444')","('555','555','555','555')"}
	 * @param fd
	 * @param ed
	 * @return
	 */
	public static String[] getSysExistWhr(Date fd,Date ed){
		
		Debug.logInfo("获取车间成品库确认记录，时间段 从 "+fd.toString()+" 至  "+ed.toString(), module);
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
			PreparedStatement ps=pnconn.prepareStatement("select barcode1 ,barcode2 from Product_Inwarehouse_Confirm where biz_Date>=? and biz_Date<=? and barcode1 is not null and barcode1 is not null");
			ps.setTimestamp(1, new Timestamp(fd.getTime()));
			ps.setTimestamp(2, new Timestamp(ed.getTime()));
			ResultSet rs=ps.executeQuery();
			Debug.logInfo("获取成品记录确认单完成，开始拼凑barcode1和barcode2字段过滤字符串", module);
			while(rs.next()){
				la4Str.append(",'").append(rs.getString("barcode1")).append("'");
				la5Str.append(",'").append(rs.getString("barcode2")).append("'");
			}
			la4Str.append(")");
			la5Str.append(")");
			
			Debug.logInfo("拼凑barcode1和barcode2字段过滤字符串完成", module);
			return new String[]{la4Str.toString(),la5Str.toString()};
		} catch (SQLException e) {
			Debug.logError("查询车间成品入库确认单记录出错", module);
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
	
	
	/**
	 * 同步进仓单记录，处理当期月份的数据
	 */
	
	
	public static synchronized void syncRecord() throws Exception{

		//获取同步开始时间
		Date fromDate=Utils.getLastPrdInhouseConfDate();//开始时间
		
		if(fromDate==null)throw new Exception("成品进仓确认单开始时间为空");
		
		String fromStr=df.format(fromDate);;//开始时间年月日
		
	
		
		//读取中间表车间成品入库记录
		Connection midconn=null;
		try {
			midconn=ConnectionFactory.getConnection(midDatabaseHelperName);
		} catch (GenericEntityException e) {
			Debug.logError("获取成品入库数据库连接出错", module);
			e.printStackTrace();
			throw new Exception("获取成品入库数据库连接出错");
		} catch (SQLException e) {
			Debug.logError("获取成品入库数据库连接出错", module);
			e.printStackTrace();
			throw new Exception("获取成品入库数据库连接出错");
		}

		
		//获取时间段记录，排除已经处理过的记录
		ResultSet rs=null;
		try {
			Debug.logInfo("开始查询成品库入库记录，开始时间"+fromStr, module);
			String sql="select * from jxcla where LA002>='"+fromStr+"' and LA011='1' order by LA002 desc";//降序排序
			PreparedStatement ps=midconn.prepareStatement(sql);
			rs=ps.executeQuery();
			

			Delegator delegator=org.ofbiz.partner.scm.common.Utils.getDefaultDelegator();
			
			//启动事务
			TransactionUtil.begin();
			//生成成品进仓确认单
			
			Date lastUpdateDate=null;//最新更新日期
			
			while(rs.next()){
				Date bizDate=df.parse(rs.getString("LA002"));//单头日期
				
				if(lastUpdateDate==null)lastUpdateDate=bizDate;
				
//				int perPkg=rs.getInt("LA010");//每板数量
				
				GenericValue materialValue=getLocalMaterialNbr(rs.getString("LA004"));//本地系统物料
				
				//判断是否有相同的标签1、2，如果标签相同，认为已经同步过
				long isLocalExist=delegator.findCountByCondition("ProductInwarehouseConfirm", EntityCondition.makeCondition("id", rs.getString("LA004")+rs.getString("LA005")), null, null);
				if(isLocalExist>0)continue;//已经存在相同标签的记录
				
				if(materialValue!=null){
					GenericValue prdInConf= delegator.makeValue("ProductInwarehouseConfirm");
					prdInConf.set("id", rs.getString("LA004")+rs.getString("LA005"));//使用标签组合作为主键
					prdInConf.set("number", rs.getString("LA004")+rs.getString("LA005"));//设置编码
					prdInConf.set("bizDate", new Timestamp(bizDate.getTime()));//设置业务日期
					prdInConf.set("materialMaterialId", materialValue.get("id"));//设置物料id
					prdInConf.set("volume", rs.getBigDecimal("LA007"));//设置入库数量
					prdInConf.set("barcode1", rs.getString("LA004"));//标签1
					prdInConf.set("barcode2", rs.getString("LA004"));//标签2
					prdInConf.set("unitUnitId", materialValue.get("defaultUnitId"));//设置计量单位id
					delegator.create(prdInConf);//保存分录
				}
				
				
			}
			//更新最新日期
			Utils.updateLastPrdInhouseConfDate(lastUpdateDate);
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
				throw e1;
			}
			throw e;
		}
		
		
	}
	/**
	 * 根据条码信息获取物料信息
	 * @param string
	 * @return
	 */
	private static GenericValue getLocalMaterialNbr(String barcode1) {
		if(barcode1==null||barcode1.length()!=32){
			Debug.logError("barcode1 为空，或者barcode1长度不为32错误", module);
			return null;
		}

		try {
			//解析宜家产品编码
			String ikeaNum=barcode1.substring(5,13);
			//每板数量
			String pkgCountStr=barcode1.substring(30);
			
			//查找物料编码
			String materialId=ikeaNum2Material.get(ikeaNum+pkgCountStr);
			if(materialId==null){
				refreshIkeaMap();
				materialId=ikeaNum2Material.get(ikeaNum+pkgCountStr);
				if(materialId==null){
					Debug.logError("找不到对应宜家产品的物料", module);
					return null;
				}
			}
			
			//返回物料值对象
			GenericValue materialV=material2ObjMap.get(materialId);
			if(materialV==null){
				refreshMtrMap();
				materialV=material2ObjMap.get(materialId);
				if(materialV==null){
					Debug.logError("找不到物料值对象", module);
					return null;
				}
			}
			return materialV;
		} catch (Exception e) {
			e.printStackTrace();
			Debug.logError(e.getMessage(), module);
			return null;
		}
	}
	
	
	
}
