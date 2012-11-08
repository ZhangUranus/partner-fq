package org.ofbiz.partner.scm.stock;

import java.io.File;
import java.sql.Connection;
import java.sql.ResultSet;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javolution.util.FastList;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.condition.EntityCondition;
import org.ofbiz.entity.condition.EntityConditionList;
import org.ofbiz.entity.condition.EntityOperator;
import org.ofbiz.entity.jdbc.ConnectionFactory;
import org.ofbiz.entity.transaction.TransactionUtil;
import org.ofbiz.partner.scm.common.BillBaseEvent;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.common.MultiEntryCRUDEvent;

/**
 * 出货对数单业务事件类
 * 
 * @author Mark
 * 
 */
public class ProductOutVerifyEvents {
	private static final String module = ProductOutVerifyEvents.class.getName();

	/**
	 * 获取单号，汇总发货通知单
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String getDeliverNumber(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String filterDeliverNum=request.getParameter("query");
		//构建汇总单号查询语句
		StringBuffer sql=new StringBuffer();
		sql.append("SELECT deliver_number FROM product_out_notification where status=4 group by deliver_number having deliver_number is not null ");
		if(filterDeliverNum!=null&&filterDeliverNum.trim().length()>0){
			sql.append(" and deliver_number like '%").append(filterDeliverNum).append("%' ");
		}
		
		Connection conn = ConnectionFactory.getConnection(org.ofbiz.partner.scm.common.Utils.getConnectionHelperName());
		
//		结果json字符串
		StringBuffer jsonRs=new StringBuffer();
		try {
			ResultSet rs=conn.createStatement().executeQuery(sql.toString());
			
			//构建json结果
			jsonRs.append("{'success':true,'records':[");
			while(rs.next()){
				jsonRs.append("{number:'").append(rs.getString(1)).append("'}");
			}
			jsonRs.append("]}");
		} catch (Exception e) {
			throw e;
		}finally{
			if(conn!=null){
				conn.close();
			}
		}
		CommonEvents.writeJsonDataToExt(response, jsonRs.toString()); // 将结果返回前端Ext
		return "success";
	}
	/**
	 * 获取对数单头
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 
	select
	notification.deliverNumber deliverNumber,
	notification.bizdate bizDate,
	notification.materialId materialId,
	notification.sumVolume sumVolume,
	notification.sumGrossWeight sumGrossWeight,
	notification.sumGrossSize sumGrossSize,
	verify.sum_board_volume sumBoardVolume,
	verify.paper_box_volume paperBoxVolume,
	verify.status status
	from
	(SELECT
	t1.deliver_number deliverNumber,
	t2.material_id materialId,
	min(t1.biz_date) bizdate,
	sum(t2.volume) sumVolume,
	sum(t2.gross_weight) sumGrossWeight,
	sum(t2.gross_size) sumGrossSize

	FROM product_out_notification t1
	inner join product_out_notification_entry t2 on t1.id=t2.parent_id
	where date_format(t1.biz_date,'%Y-%m-%d')='2012-10-24'
	group by t1.deliver_number,t2.material_id having deliverNumber is not null) notification
	left outer join product_out_verify_head  verify on (notification.deliverNumber=verify.deliver_number and notification.materialId=verify.material_id)
	left outer join t_material  material on notification.materialId=material.id

*/
	
	public static String getProductOutVerifyHead(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String bizDate=request.getParameter("bizDate");
		String filterDeliverNum=request.getParameter("deliverNum");
		
		//构建汇总单号查询语句
		StringBuffer sql=new StringBuffer();
		sql.append("select ");
		sql.append("notification.deliverNumber deliverNumber, ");
		sql.append("notification.bizdate bizDate, ");
		sql.append("notification.materialId materialId, ");
		sql.append("material.name materialName, ");
		sql.append("notification.sumVolume sumVolume, ");
		sql.append("notification.sumGrossWeight sumGrossWeight, ");
		sql.append("notification.sumGrossSize sumGrossSize, ");
		sql.append("verify.sum_board_volume sumBoardVolume, ");
		sql.append("verify.paper_box_volume paperBoxVolume, ");
		sql.append("IFNULL(verify.status,-1) status ");
		sql.append("from ");
		sql.append("(SELECT ");
		sql.append("t1.deliver_number deliverNumber, ");
		sql.append("t2.material_id materialId, ");
		sql.append("min(t1.biz_date) bizdate, ");
		sql.append("sum(t2.volume) sumVolume, ");
		sql.append("sum(t2.gross_weight) sumGrossWeight, ");
		sql.append("sum(t2.gross_size) sumGrossSize ");
		sql.append("FROM product_out_notification t1 ");
		sql.append("inner join product_out_notification_entry t2 on t1.id=t2.parent_id ");
		//过滤日期
		sql.append("where status=4 ");
		
		if(bizDate!=null&&bizDate.trim().length()>0){
			sql.append("and date_format(t1.biz_date,'%Y-%m-%d')='").append(bizDate).append("' ");
		}
		sql.append("group by t1.deliver_number,t2.material_id having deliverNumber is not null   ");
		//过滤单号
		if(filterDeliverNum!=null&&filterDeliverNum.trim().length()>0){
			sql.append(" and deliverNumber='").append(filterDeliverNum).append("'");
		}
		sql.append(" ) notification left outer join product_out_verify_head  verify on (notification.deliverNumber=verify.deliver_number and notification.materialId=verify.material_id) ");
		sql.append("left outer join t_material  material on notification.materialId=material.id");
		
		Connection conn = ConnectionFactory.getConnection(org.ofbiz.partner.scm.common.Utils.getConnectionHelperName());
		
//		结果json字符串
		JSONObject json=null;
		try {
			ResultSet rs=conn.createStatement().executeQuery(sql.toString());
			json=org.ofbiz.partner.scm.common.Utils.getJsonArr4ResultSet(rs, request);
		} catch (Exception e) {
			throw e;
		}finally{
			if(conn!=null){
				conn.close();
			}
		}
		CommonEvents.writeJsonDataToExt(response, json.toString()); // 将结果返回前端Ext
		return "success";
	}
	
	
	/**
	 * 保存对数单
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String saveProductOutVerify(HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(request.getParameter("record")==null){
			throw new Exception("新建带分录实体时参数(record)无效");
		}
		//构建总实体json
		JSONObject record=JSONObject.fromObject(request.getParameter("record").toString());
		JSONObject headRecord=record.getJSONObject("head");//取表头信息
		JSONArray  newEntryRecords=record.getJSONArray("createEntrys");//取新增单据体信息
		JSONArray  deleteEntryRecords=record.getJSONArray("deleteEntrys");//取刪除单据体信息
		JSONArray  updateEntryRecords=record.getJSONArray("updateEntrys");//取修改单据体信息
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		String headEntityName = "ProductOutVerifyHead";
		String entryEntityName = "ProductOutVerifyEntry";

		try {
			TransactionUtil.begin();
			//更新表头
			GenericValue v = delegator.makeValue(headEntityName);// 新建一个值对象	
			MultiEntryCRUDEvent.setGenValFromJsonObj(headRecord, v);
			GenericValue originValue=delegator.findByPrimaryKey(headEntityName, UtilMisc.toMap("deliverNumber", v.get("deliverNumber"), "materialId", v.get("materialId")));
			if(originValue!=null&&originValue.getInteger("status").equals(Integer.valueOf(4))){
				throw new Exception("单据已经提交，不能修改！");
			}
			v.set("status", Integer.valueOf(0));
			delegator.createOrStore(v);
			
			//新增分录
		    for(Object o:newEntryRecords){
		    	JSONObject jo=(JSONObject) o;
		    	GenericValue ev = delegator.makeValue(entryEntityName);
		    	MultiEntryCRUDEvent.setGenValFromJsonObj(jo, ev);
				delegator.create(ev);
		    }
		  //更新分录
		    List<GenericValue> updateList=FastList.newInstance();
		    for(Object o:updateEntryRecords){
		    	JSONObject jo=(JSONObject) o;
		    	GenericValue ev = delegator.makeValue(entryEntityName);
		    	MultiEntryCRUDEvent.setGenValFromJsonObj(jo, ev);
				updateList.add(ev);
		    }
		    delegator.storeAll(updateList);
		  //删除分录以及级联的实体
		    for(Object o:deleteEntryRecords){
		    	JSONObject jo=(JSONObject) o;
		    	GenericValue ev = delegator.makeValue(entryEntityName);
		    	MultiEntryCRUDEvent.setGenValFromJsonObj(jo, ev);
				delegator.removeValue(ev);
		    }
			
			TransactionUtil.commit();
		} catch (Exception e) {
			TransactionUtil.rollback();
			throw e;
		}
		return "success";
	}
	
	/**
	 * 删除出货对数单
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String removeVerifyHead(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String deliverNum=request.getParameter("deliverNumber");
		String materialId=request.getParameter("materialId");
		if(deliverNum==null||materialId==null){
			throw new Exception("单号或者产品id为空");
		}
		EntityConditionList<EntityCondition> condition = null;
		List<EntityCondition> conds = FastList.newInstance();
		conds.add(EntityCondition.makeCondition("deliverNumber",deliverNum));
		conds.add(EntityCondition.makeCondition("parentMaterialId",materialId));
		conds.add(EntityCondition.makeCondition("sentQty", EntityOperator.GREATER_THAN, 0));
		condition = EntityCondition.makeCondition(conds);
		
		Delegator delegator = (Delegator) request.getAttribute("delegator");
		
		List<GenericValue> valueList  = delegator.findList("ProductOutVerifyEntry", condition, null, null, null, false);
		if(valueList.size()>0){
			throw new Exception("该对数单已存在扫描出库的板，不允许删除，请撤销相应扫描后再进行删除！");
		}
		
		delegator.removeByAnd("ProductOutVerifyHead", "deliverNumber" ,deliverNum ,"materialId",materialId);
		
		delegator.removeByAnd("ProductOutVerifyEntry", "deliverNumber" ,deliverNum ,"materialId",materialId);

		BillBaseEvent.writeSuccessMessageToExt(response, "提交成功");
		return "success";
	}
	
	/**
	 * 导出相同单号对数单
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String export(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		String filterDeliverNum=request.getParameter("deliverNumber");
		//过滤单号
		if(filterDeliverNum==null||filterDeliverNum.trim().length()<1){
			throw new Exception("单号为空");
		}

		Connection conn = ConnectionFactory.getConnection(org.ofbiz.partner.scm.common.Utils.getConnectionHelperName());
		
		
		//构建汇总单号查询语句
		StringBuffer sql=new StringBuffer();
		sql.append("select ");
		sql.append("notification.deliverNumber deliverNumber, ");
		sql.append("notification.bizdate bizDate, ");
		sql.append("notification.materialId materialId, ");
		sql.append("material.name materialName, ");
		sql.append("notification.sumVolume sumVolume, ");
		sql.append("notification.sumGrossWeight sumGrossWeight, ");
		sql.append("notification.sumGrossSize sumGrossSize, ");
		sql.append("verify.sum_board_volume sumBoardVolume, ");
		sql.append("verify.paper_box_volume paperBoxVolume, ");
		sql.append("IFNULL(verify.status,-1) status ");
		sql.append("from ");
		sql.append("(SELECT ");
		sql.append("t1.deliver_number deliverNumber, ");
		sql.append("t2.material_id materialId, ");
		sql.append("min(t1.biz_date) bizdate, ");
		sql.append("sum(t2.volume) sumVolume, ");
		sql.append("sum(t2.gross_weight) sumGrossWeight, ");
		sql.append("sum(t2.gross_size) sumGrossSize ");
		sql.append("FROM product_out_notification t1 ");
		sql.append("inner join product_out_notification_entry t2 on t1.id=t2.parent_id ");
		sql.append("group by t1.deliver_number,t2.material_id having deliverNumber is not null   ");
		sql.append(" and deliverNumber='").append(filterDeliverNum).append("'");
		sql.append(" ) notification left outer join product_out_verify_head  verify on (notification.deliverNumber=verify.deliver_number and notification.materialId=verify.material_id) ");
		sql.append("left outer join t_material  material on notification.materialId=material.id");
		
//		结果json字符串
		JSONObject json=null;
		try {
			ResultSet rs=conn.createStatement().executeQuery(sql.toString());
			json=org.ofbiz.partner.scm.common.Utils.getJsonArr4ResultSet(rs, request);
		} catch (Exception e) {
			throw e;
		}finally{
			if(conn!=null){
				conn.close();
			}
		}
		
		
		// 声明一个工作薄
		HSSFWorkbook workbook = new HSSFWorkbook();
		// 生成一个表格
		HSSFSheet sheet = workbook.createSheet("sheet1");
		HSSFRow headRow=sheet.createRow(0);
		headRow.createCell(0).setCellValue("filterDeliverNum");
		
		
//		response.reset();
//		response.setContentType("application/vnd.ms-excel");
//		response.setHeader("Content-Disposition", "attachment; filename=dddd.xls" );
//		
		// 
		File file=new File("c:/t.xls");
		
//		BufferedInputStream bis = new BufferedInputStream(new FileInputStream(file));
//		OutputStream bos = response.getOutputStream();
//		byte[] buff = new byte[1024];
//		int readCount = 0;
//		// 每次从文件流中读1024个字节到缓冲里。
//		readCount = bis.read(buff);
//		while (readCount != -1) {
//			// 把缓冲里的数据写入浏览器
//			bos.write(buff, 0, readCount);
//			readCount = bis.read(buff);
//		}
//		
//		if(bis!=null){
//			bis.close(); 
//		}
//		if(bos!=null){
//			bos.close();
//		}
//		response.setStatus(HttpServletResponse.SC_OK);
//		response.flushBuffer();
//		CommonEvents.writeJsonDataToExt(response, json.toString()); // 将结果返回前端Ext
		return "success";
	}
}
