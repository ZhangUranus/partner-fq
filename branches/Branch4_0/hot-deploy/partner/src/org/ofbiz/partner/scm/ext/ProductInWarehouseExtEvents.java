package org.ofbiz.partner.scm.ext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.ofbiz.partner.scm.common.CommonEvents;
import org.ofbiz.partner.scm.rpt.DataFetchEvents;

public class ProductInWarehouseExtEvents {
	/**
	 * 通过sql语句查询成品入仓单分录
	 * 
	 * 取最近新增记录20条 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String queryProductInEntry(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		StringBuffer sql=new StringBuffer();
		sql.append("SELECT workshopWorkshopV.NAME as workshopWorkshopName,  \r\n");
		sql.append("warehouseWarehouseV.NAME as warehouseWarehouseName,  \r\n");
		sql.append("materialMaterialV.TMaterialV_NAME as materialMaterialName,  \r\n");
		sql.append("materialMaterialV.TMaterialV_MODEL as materialModel,  \r\n");
		sql.append("unitUnitV.NAME as unitUnitName,  \r\n");
		sql.append("ProductInwarehouseEntryV.ID as id,  \r\n");
		sql.append("ProductInwarehouseEntryV.PARENT_ID as parentId,  \r\n");
		sql.append("ProductInwarehouseEntryV.PRODUCT_WEEK asproductWeek,  \r\n");
		sql.append("ProductInwarehouseEntryV.WORKSHOP_WORKSHOP_ID as workshopWorkshopId,  \r\n");
		sql.append("ProductInwarehouseEntryV.WAREHOUSE_WAREHOUSE_ID as warehouseWarehouseId,  \r\n");
		sql.append("ProductInwarehouseEntryV.MATERIAL_MATERIAL_ID as materialMaterialId,  \r\n");
		sql.append("ProductInwarehouseEntryV.VOLUME as volume,  \r\n");
		sql.append("ProductInwarehouseEntryV.UNIT_UNIT_ID as unitUnitId,  \r\n");
		sql.append("ProductInwarehouseEntryV.PRICE as price,  \r\n");
		sql.append("ProductInwarehouseEntryV.ENTRYSUM as entrysum,  \r\n");
		sql.append("ProductInwarehouseEntryV.BARCODE1 as barcode1,  \r\n");
		sql.append("ProductInwarehouseEntryV.BARCODE2 as barcode2, \r\n");
		sql.append("ProductInwarehouseEntryV.QANTITY as qantity,  \r\n");
		sql.append("ProductInwarehouseEntryV.INWAREHOUSE_TYPE as inwarehouseType,  \r\n");
		sql.append("ProductInwarehouseEntryV.SORT as sort,  \r\n");
		sql.append("ProductInwarehouseEntryV.LAST_UPDATED_STAMP as lastUpdatedStamp \r\n");
		sql.append("FROM (select * from PRODUCT_INWAREHOUSE_ENTRY order by last_Updated_Stamp DESC limit 20) ProductInwarehouseEntryV \r\n");
		sql.append("LEFT OUTER JOIN WORKSHOP workshopWorkshopV ON ProductInwarehouseEntryV.WORKSHOP_WORKSHOP_ID = workshopWorkshopV.ID \r\n");
		sql.append("LEFT OUTER JOIN WAREHOUSE warehouseWarehouseV ON ProductInwarehouseEntryV.WAREHOUSE_WAREHOUSE_ID = warehouseWarehouseV.ID \r\n");
		sql.append("LEFT OUTER JOIN (SELECT TMaterialV.ID AS TMaterialV_ID, TMaterialV.NUMBER AS TMaterialV_NUMBER, TMaterialV.NAME AS TMaterialV_NAME, TMaterialV.MODEL AS TMaterialV_MODEL, TMaterialV.DEFAULT_PRICE AS TMaterialV_DEFAULT_PRICE, TMaterialV.DEFAULT_SUPPLIER_ID AS TMaterialV_DEFAULT_SUPPLIER_ID, TMaterialV.SAFE_STOCK AS TMaterialV_SAFE_STOCK, TMaterialV.DEFAULT_UNIT_ID AS TMaterialV_DEFAULT_UNIT_ID, TMaterialV.MATERIAL_TYPE_ID AS TMaterialV_MATERIAL_TYPE_ID, TMaterialV.QUALITY AS TMaterialV_QUALITY, TMaterialV.DESCRIPTION AS TMaterialV_DESCRIPTION FROM T_MATERIAL TMaterialV) materialMaterialV ON ProductInwarehouseEntryV.MATERIAL_MATERIAL_ID = materialMaterialV.TMaterialV_ID \r\n");
		sql.append("LEFT OUTER JOIN UNIT unitUnitV ON ProductInwarehouseEntryV.UNIT_UNIT_ID = unitUnitV.ID ORDER BY ProductInwarehouseEntryV.LAST_UPDATED_STAMP DESC \r\n");
		CommonEvents.writeJsonDataToExt(response, DataFetchEvents.executeSelectSQL(request,sql.toString()));
		
		return "success";
	}
		
}
