package org.ofbiz.partner.scm.tools;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javolution.util.FastMap;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.jdbc.ConnectionFactory;
import org.ofbiz.entity.util.EntityFindOptions;
import org.ofbiz.partner.scm.common.BillBaseEvent;
import org.ofbiz.partner.scm.common.Utils;
import org.ofbiz.service.ServiceUtil;
/**
 * 迁移明细数据类
 * 
 * 将product_inwarehouse_entry_detail数据重新设计迁移到product_inwarehouse_entry_detail和product_inwarehouse_entry_detail_his
 * 
 * @author Jeff
 * 
 */
public class MoveDetailDataEvents {
	private static final String module = MoveDetailDataEvents.class.getName();

	/**
	 * --备份数据                                            
	 * create table product_inwarehouse_entry_detail_temp    
	 * select * from product_inwarehouse_entry_detail;       
	 * create table product_inwarehouse_entry_detail_temp_bak
	 * select * from product_inwarehouse_entry_detail;       
	 * 
	 * --删除原表，通过启动服务器重启两个新表
	 * drop table product_inwarehouse_entry_detail;
	 * 
	 * --迁移现有仓库数据                                                                                                                                                                                                                                                                        
	 * insert into product_inwarehouse_entry_detail                                                                                                                                                                                                                                          
	 * SELECT pied.id,pi.biz_date,pi.id,pie.id,'2010-01-01 10:00:01','','',pied.barcode1,pied.barcode2,pied.material_id,pied.model,pied.quantity,pied.unit_unit_id,pied.price,pied.amount,'1','0',pied.last_updated_stamp,pied.last_updated_tx_stamp,pied.created_stamp,pied.created_tx_stamp
	 * FROM product_barcode_box pbb                                                                                                                                                                                                                                                          
	 * join product_inwarehouse_entry_detail_temp pied on pied.barcode1 = pbb.barcode1 and pied.barcode2 = pbb.barcode2                                                                                                                                                                      
	 * join product_inwarehouse_entry pie on pie.id = pied.parent_id                                                                                                                                                                                                                         
	 * join product_inwarehouse pi on pi.id = pie.parent_id;                                                                                                                                                                                                                                 
	 * 
	 * --删除临时表原来仓库数据                                                                                                                                              
	 * delete from product_inwarehouse_entry_detail_temp using product_inwarehouse_entry_detail_temp , product_barcode_box                                                   
	 * where product_inwarehouse_entry_detail_temp.barcode1 = product_barcode_box.barcode1 and product_inwarehouse_entry_detail_temp.barcode2 = product_barcode_box.barcode2;
	 * 
	 * --迁移已经扫描，但是未提交单据数据                                                                                                                                                                                                                                                    
	 * insert into product_inwarehouse_entry_detail                                                                                                                                                                                                                                          
	 * SELECT pied.id,pi.biz_date,pi.id,pie.id,'2010-01-01 10:00:01','','',pied.barcode1,pied.barcode2,pied.material_id,pied.model,pied.quantity,pied.unit_unit_id,pied.price,pied.amount,'1','0',pied.last_updated_stamp,pied.last_updated_tx_stamp,pied.created_stamp,pied.created_tx_stamp
	 * FROM (SELECT distinct barcode1,barcode2 FROM product_outwarehouse po                                                                                                                                                                                                                  
	 * left join product_outwarehouse_entry poe on po.id = poe.parent_id where po.status=0) pbb                                                                                                                                                                                              
	 * join product_inwarehouse_entry_detail_temp pied on pied.barcode1 = pbb.barcode1 and pied.barcode2 = pbb.barcode2                                                                                                                                                                      
	 * join product_inwarehouse_entry pie on pie.id = pied.parent_id                                                                                                                                                                                                                         
	 * join product_inwarehouse pi on pi.id = pie.parent_id;                                                                                                                                                                                                                                 
	 *                                                                                                                                                                                                                                                                                       
	 * --删除临时表已经扫描，但是为提交数据                                                                                                                                                                                                                                                  
	 * delete from product_inwarehouse_entry_detail_temp using product_inwarehouse_entry_detail_temp , (SELECT distinct barcode1,barcode2 FROM product_outwarehouse po left join product_outwarehouse_entry poe on po.id = poe.parent_id where po.status=0) pbb                              
	 * where product_inwarehouse_entry_detail_temp.barcode1 = pbb.barcode1 and product_inwarehouse_entry_detail_temp.barcode2 = pbb.barcode2;                                                                                                                                                
	 * 
	 * --迁移已经出仓数据(剩余全量)                                                                                                                                                                                                                                                          
	 * insert into product_inwarehouse_entry_detail_his                                                                                                                                                                                                                                      
	 * SELECT pied.id,pi.biz_date,pi.id,pie.id,'2010-01-01 10:00:01','','',pied.barcode1,pied.barcode2,pied.material_id,pied.model,pied.quantity,pied.unit_unit_id,pied.price,pied.amount,'1','1',pied.last_updated_stamp,pied.last_updated_tx_stamp,pied.created_stamp,pied.created_tx_stamp
	 * FROM product_inwarehouse_entry_detail_temp pied                                                                                                                                                                                                                                       
	 * join product_inwarehouse_entry pie on pie.id = pied.parent_id                                                                                                                                                                                                                         
	 * join product_inwarehouse pi on pi.id = pie.parent_id;                                                                                                                                                                                                                                 
	 * 
	 */
	
	
	private static boolean readyRun(){
		Connection conn = null;
		try {
			conn = ConnectionFactory.getConnection(Utils.getConnectionHelperName());

			Debug.log("开始表数据准备#################################", module);
			
			//清理半年前的日志信息
			
			String renameSql = "RENAME TABLE PRODUCT_INWAREHOUSE_ENTRY_DETAIL TO PRODUCT_INWAREHOUSE_ENTRY_DETAIL_TEMP";
			
			String optimize1Sql = "OPTIMIZE TABLE PRODUCT_INWAREHOUSE_ENTRY_DETAIL_TEMP";
			String optimize2Sql = "OPTIMIZE TABLE PRODUCT_INWAREHOUSE_ENTRY";
			String optimize3Sql = "OPTIMIZE TABLE PRODUCT_INWAREHOUSE";
			String optimize4Sql = "OPTIMIZE TABLE PRODUCT_BARCODE_BOX";

			String insertInSql = " insert into product_inwarehouse_entry_detail "+
											" SELECT pied.id,pi.biz_date,pi.id,pie.id,'2010-01-01 10:00:01','','',pied.barcode1,pied.barcode2,pied.material_id,pied.model,pied.quantity,pied.unit_unit_id,pied.price,pied.amount,'1','0',pied.last_updated_stamp,pied.last_updated_tx_stamp,pied.created_stamp,pied.created_tx_stamp "+
											" FROM product_barcode_box pbb "+
											" join product_inwarehouse_entry_detail_temp pied on pied.barcode1 = pbb.barcode1 and pied.barcode2 = pbb.barcode2 "+
											" join product_inwarehouse_entry pie on pie.id = pied.parent_id "+
											" join product_inwarehouse pi on pi.id = pie.parent_id";

			String deleteInSql = " delete from product_inwarehouse_entry_detail_temp using product_inwarehouse_entry_detail_temp , product_barcode_box "+
										" where product_inwarehouse_entry_detail_temp.barcode1 = product_barcode_box.barcode1 and product_inwarehouse_entry_detail_temp.barcode2 = product_barcode_box.barcode2";

			String insertScanSql = " insert into product_inwarehouse_entry_detail "+
									" SELECT pied.id,pi.biz_date,pi.id,pie.id,'2010-01-01 10:00:01','','',pied.barcode1,pied.barcode2,pied.material_id,pied.model,pied.quantity,pied.unit_unit_id,pied.price,pied.amount,'1','0',pied.last_updated_stamp,pied.last_updated_tx_stamp,pied.created_stamp,pied.created_tx_stamp "+
									" FROM (SELECT distinct barcode1,barcode2 FROM product_outwarehouse po "+
									" left join product_outwarehouse_entry poe on po.id = poe.parent_id where po.status=0) pbb "+
									" join product_inwarehouse_entry_detail_temp pied on pied.barcode1 = pbb.barcode1 and pied.barcode2 = pbb.barcode2 "+
									" join product_inwarehouse_entry pie on pie.id = pied.parent_id "+
									" join product_inwarehouse pi on pi.id = pie.parent_id";
			String deleteScanSql = "delete from product_inwarehouse_entry_detail_temp using product_inwarehouse_entry_detail_temp , (SELECT distinct barcode1,barcode2 FROM product_outwarehouse po left join product_outwarehouse_entry poe on po.id = poe.parent_id where po.status=0) pbb " +
									" where product_inwarehouse_entry_detail_temp.barcode1 = pbb.barcode1 and product_inwarehouse_entry_detail_temp.barcode2 = pbb.barcode2";
			
			String insertAllSql = " insert into product_inwarehouse_entry_detail_his "+
									" SELECT pied.id,pi.biz_date,pi.id,pie.id,'2010-01-01 10:00:01','','',pied.barcode1,pied.barcode2,pied.material_id,pied.model,pied.quantity,pied.unit_unit_id,pied.price,pied.amount,'1','1',pied.last_updated_stamp,pied.last_updated_tx_stamp,pied.created_stamp,pied.created_tx_stamp "+
									" FROM product_inwarehouse_entry_detail_temp pied  "+
									" join product_inwarehouse_entry pie on pie.id = pied.parent_id "+
									" join product_inwarehouse pi on pi.id = pie.parent_id";

			String optimize5Sql = "OPTIMIZE TABLE PRODUCT_INWAREHOUSE_ENTRY_DETAIL";
			String optimize6Sql = "OPTIMIZE TABLE PRODUCT_INWAREHOUSE_ENTRY_DETAIL_HIS";
			
//			String insertOtherSql = " insert into product_inwarehouse_entry_detail_backup SELECT * FROM product_inwarehouse_entry_detail_his where out_biz_date <'2013-04-30 23:59:59' ";
//			String deleteOtherSql = " delete FROM product_inwarehouse_entry_detail_his where out_biz_date <'2013-04-30 23:59:59' ";
			
			Statement st = conn.createStatement();
			st.addBatch(renameSql);
			st.addBatch(optimize1Sql);
			st.addBatch(optimize2Sql);
			st.addBatch(optimize3Sql);
			st.addBatch(optimize4Sql);
			st.addBatch(insertInSql);
			st.addBatch(deleteInSql);
			st.addBatch(insertScanSql);
			st.addBatch(deleteScanSql);
			st.addBatch(insertAllSql);
			st.addBatch(optimize5Sql);
			st.addBatch(optimize6Sql);
			
			st.executeBatch();
			
			Debug.log("完成表数据准备#################################", module);
			
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	
	/**
	 * 根据出仓单据数据，返填业务日期、单据编码、分录编码到product_inwarehouse_entry_detail_his表
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String writeInOutDateToDetail(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Delegator delegator = (Delegator) request.getAttribute("delegator");

		Debug.log("开始跑数前准备-----------------------------",module);
		
		if(!readyRun()){
			BillBaseEvent.writeSuccessMessageToExt(response, "返填失败！");
			return "success";
		}
		
		Debug.log("完成跑数前准备-----------------------------",module);
		
		// 1.设置查找未处理记录条件，按照业务时间排序
		int runtime=0;
		while (1==1) {
			EntityFindOptions findOptions = new EntityFindOptions();
			findOptions.setMaxRows(1000);
			
			// 2.获取所有未处理的明细数据
			List<GenericValue> entryList = delegator.findList("ProductInwarehouseEntry", EntityCondition.makeCondition("isOut",0),null,null,findOptions,false);
			int total = entryList.size();
			
			// 3.开始处理数据
			Debug.log("开始返填数据-----------------------------",module);
			int count = 0;
			for(GenericValue value : entryList){
				count++;
				List<String> orderOut = UtilMisc.toList("bizDate");
				Map<String, Object> fieldsOut = FastMap.newInstance();
				fieldsOut.put("barcode1", value.get("barcode1"));
				fieldsOut.put("barcode2", value.get("barcode2"));
				
				GenericValue inValue = delegator.findOne("ProductInwarehouse", UtilMisc.toMap("id", value.getString("parentId")), false);
				Date inDate = (Date) inValue.get("bizDate");
				
				// 3.1 获取所有未处理的明细数据
				List<GenericValue> entryOutList = delegator.findByAnd("ProductOutwarehouseEntryDetailView", fieldsOut, orderOut);
				boolean isModify = false;
				for(GenericValue outValue : entryOutList){
					Date outDate = (Date) outValue.get("bizDate");
					if(inDate.before(outDate)){
						runtime++;
						Map<String, Object> fieldsToSet = FastMap.newInstance();
						fieldsToSet.put("outBizDate", (Date) outValue.get("bizDate"));
						fieldsToSet.put("outParentParentId", outValue.getString("id"));
						fieldsToSet.put("outParentId", outValue.getString("entryId"));
						fieldsToSet.put("isOut", 1);
						
						delegator.storeByCondition("ProductInwarehouseEntryDetailHis",fieldsToSet, EntityCondition.makeCondition("inParentId",value.getString("id")));
						value.set("isOut", 1);
						value.store();
						
						isModify = true;
						Debug.log("Number : " + count + " / "+ total);
						fieldsToSet = null;
						break;
					}
				}
				if(!isModify){
					value.set("isOut", 2);
					value.store();
					Debug.log("Number : " + count + " / "+ total);
				}
				entryOutList = null;
				orderOut = null;
				fieldsOut = null;
				
				inValue = null;
				inDate = null;
			}

			entryList = null;
			findOptions = null;
			System.gc();
			if(runtime==0){
				break;
			}
		}
		
		
		Debug.log("结束返填数据-----------------------------",module);
		
		BillBaseEvent.writeSuccessMessageToExt(response, "返填数据成功！");
		return "success";
	}
	
}