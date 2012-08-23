package org.ofbiz.partner.scm.stock;

import java.math.BigDecimal;
import java.util.Calendar;
import java.util.Date;

import org.ofbiz.base.util.Debug;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.partner.scm.common.Utils;



/**
 * 成品周汇总表维护类，提供该表操作接口
 * @author mark 2012-7-11
 *
 */
public class WeeklyStockMgr {
	private static final String module = org.ofbiz.partner.scm.stock.WeeklyStockMgr.class.getName();
	private WeeklyStockMgr(){}
	
	private static WeeklyStockMgr instance;
	public static WeeklyStockMgr getInstance(){
		if(instance==null){
			instance=new WeeklyStockMgr();
		}
		return instance;
	}
	
	/**
	 * 更新周汇总表，记录每周进仓、出仓、改板数
	 * @param materialId 物料id
	 * @param date   
	 * @param type   业务类型 ，进仓，出仓，改板
	 * @param qty    
	 * @param isCancel
	 * @throws Exception
	 * @author mark 2012-7-12
	 */
	public synchronized void updateStock(String materialId,Date date,ProductStockType type,BigDecimal qty,boolean isCancel) throws Exception{
		      if(materialId==null||date==null||qty==null){
		    	  Debug.logError("物料id或者日期或者数量 为空！", module);
		    	  throw new IllegalArgumentException("物料id或者日期或者数量 为空！");
		      }
		     //周数
		      String week=org.ofbiz.partner.scm.pricemgr.Utils.getYearWeekStr(date);
		      //星期几
		      Calendar cal=Calendar.getInstance();
		      cal.setTime(date);
		      int dayOfWeek=cal.get(Calendar.DAY_OF_WEEK);
		      
		      Delegator delegator=Utils.getDefaultDelegator();
		      
		      /*1.  查询是否存在该物料的记录*/
		      GenericValue record=delegator.findOne("PrdInOutWeekDetail", false, "materialId",materialId,"week",week);
		      
		      BigDecimal curQty=BigDecimal.ZERO;
		      BigDecimal curBalQty=BigDecimal.ZERO;
		      
		      String updateFieldName=getFieldName(type, dayOfWeek);
		      if(record==null){
		    	  record=delegator.makeValue("PrdInOutWeekDetail");
		    	  record.setString("materialId", materialId);
		    	  record.setString("week", week);
		      }else{
		    	  curQty=record.getBigDecimal(updateFieldName);
		    	  if(curQty==null)curQty=BigDecimal.ZERO;
		    	  
		    	  curBalQty=record.getBigDecimal("weekBalQty");
		    	  if(curBalQty==null)curBalQty=BigDecimal.ZERO;
		    	  
		      }
		      /*2.  如果是反操作需要减数量*/
		      if(isCancel) qty=qty.negate();
		      
		      /*3. 更新数据库记录*/
		      record.set(updateFieldName, curQty.add(qty));
		      
		      //added by mark 2012-8-22 
		      switch (type) {
				case IN:
					record.set("weekBalQty", curBalQty.add(qty));
					break;
				case OUT:
					record.set("weekBalQty", curBalQty.add(qty.negate()));
					break;
				case CHG:
					record.set("weekBalQty", curBalQty.add(qty));
					break;	
				default:
					break;
				}
		      
		      /*4. 新增或者更新*/
		      delegator.createOrStore(record);
		      
	}
	
	//tool methods ------------------
	/**
	 * 获取字段名
	 */
	private String getFieldName(ProductStockType type,int dayOfWeek ){
		switch(type){
			case IN:
				switch(dayOfWeek){
				case(Calendar.SUNDAY):
					return "sunNorInQty";
				case(Calendar.MONDAY):
					return "monNorInQty";
				case(Calendar.TUESDAY):
					return "tueNorInQty";
				case(Calendar.WEDNESDAY):
					return "wenNorInQty";
				case(Calendar.THURSDAY):
					return "thuNorInQty";
				case(Calendar.FRIDAY):
					return "friNorInQty";
				case(Calendar.SATURDAY):
					return "staNorInQty";
				}
			case OUT:
				switch(dayOfWeek){
				case(Calendar.SUNDAY):
					return "sunNorOutQty";
				case(Calendar.MONDAY):
					return "monNorOutQty";
				case(Calendar.TUESDAY):
					return "tueNorOutQty";
				case(Calendar.WEDNESDAY):
					return "wenNorOutQty";
				case(Calendar.THURSDAY):
					return "thuNorOutQty";
				case(Calendar.FRIDAY):
					return "friNorOutQty";
				case(Calendar.SATURDAY):
					return "staNorOutQty";
				}
			case CHG:
				switch(dayOfWeek){
				case(Calendar.SUNDAY):
					return "sunChgBrdQty";
				case(Calendar.MONDAY):
					return "monChgBrdQty";
				case(Calendar.TUESDAY):
					return "tueChgBrdQty";
				case(Calendar.WEDNESDAY):
					return "wenChgBrdQty";
				case(Calendar.THURSDAY):
					return "thuChgBrdQty";
				case(Calendar.FRIDAY):
					return "friChgBrdQty";
				case(Calendar.SATURDAY):
					return "staChgBrdQty";
				}
			default:return null;
		}
		
	}
	
}
