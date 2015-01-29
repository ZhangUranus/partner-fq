--1.清理数据
delete FROM consign_draw_material_entry where parent_id in (SELECT id FROM consign_draw_material where BIZ_DATE >'2014-09-01 01:01:01');
delete FROM consign_draw_material where BIZ_DATE >'2014-09-01 01:01:01';
delete FROM consign_return_material_entry where parent_id in (SELECT id FROM consign_return_material where BIZ_DATE >'2014-09-01 01:01:01');
delete FROM consign_return_material where BIZ_DATE >'2014-09-01 01:01:01';
delete FROM consign_return_product_entry where parent_id in (SELECT id FROM consign_return_product where BIZ_DATE >'2014-09-01 01:01:01');
delete FROM consign_return_product where BIZ_DATE >'2014-09-01 01:01:01';
delete FROM consign_price_detail where PARENT_ID in (SELECT id FROM consign_warehousing_entry where parent_id in (SELECT id FROM consign_warehousing where BIZ_DATE >'2014-09-01 01:01:01'));
delete FROM consign_warehousing_entry where parent_id in (SELECT id FROM consign_warehousing where BIZ_DATE >'2014-09-01 01:01:01');
delete FROM consign_warehousing where BIZ_DATE >'2014-09-01 01:01:01';

delete FROM his_consign_price where (year > '2013' and month >'08');
delete FROM his_consign_processed_price where (year > '2013' and month >'08');
delete FROM his_material_balance where (year > '2013' and month >'08');
delete FROM his_product_balance where (year > '2013' and month >'08');
delete FROM his_purchase_price where (year > '2013' and month >'08');
delete FROM his_workshop_price where (year > '2013' and month >'08');

delete FROM workshop_draw_material_entry where parent_id in (SELECT id FROM workshop_draw_material where BIZ_DATE >'2014-09-01 01:01:01');
delete FROM workshop_draw_material where BIZ_DATE >'2014-09-01 01:01:01';
delete FROM workshop_other_draw_bill_entry where parent_id in (SELECT id FROM workshop_other_draw_bill where BIZ_DATE >'2014-09-01 01:01:01');
delete FROM workshop_other_draw_bill where BIZ_DATE >'2014-09-01 01:01:01';
delete FROM workshop_return_material_entry where parent_id in (SELECT id FROM workshop_return_material where BIZ_DATE >'2014-09-01 01:01:01');
delete FROM workshop_return_material where BIZ_DATE >'2014-09-01 01:01:01';
delete FROM workshop_return_product_entry where parent_id in (SELECT id FROM workshop_return_product where BIZ_DATE >'2014-09-01 01:01:01');
delete FROM workshop_return_product where BIZ_DATE >'2014-09-01 01:01:01';
delete FROM workshop_stock_adjust_entry where parent_id in (SELECT id FROM workshop_stock_adjust where BIZ_DATE >'2014-09-01 01:01:01');
delete FROM workshop_stock_adjust where BIZ_DATE >'2014-09-01 01:01:01';
delete FROM workshop_price_detail where PARENT_ID in (SELECT id FROM workshop_warehousing_entry where parent_id in (SELECT id FROM workshop_warehousing where BIZ_DATE >'2014-09-01 01:01:01'));
delete FROM workshop_warehousing_entry where parent_id in (SELECT id FROM workshop_warehousing where BIZ_DATE >'2014-09-01 01:01:01');
delete FROM workshop_warehousing where BIZ_DATE >'2014-09-01 01:01:01';

delete FROM pro_in_out_date_detail where TRAD_DATE >'20140901';
delete FROM stock_adjust_entry where parent_id in (SELECT id FROM stock_adjust where BIZ_DATE >'2014-09-01 01:01:01');
delete FROM stock_adjust where BIZ_DATE >'2014-09-01 01:01:01';
delete FROM supplier_stock_adjust_entry where parent_id in (SELECT id FROM supplier_stock_adjust where BIZ_DATE >'2014-09-01 01:01:01');
delete FROM supplier_stock_adjust where BIZ_DATE >'2014-09-01 01:01:01';
delete FROM return_product_warehousing_entry where parent_id in (SELECT id FROM return_product_warehousing where BIZ_DATE >'2014-09-01 01:01:01');
delete FROM return_product_warehousing where BIZ_DATE >'2014-09-01 01:01:01';
delete FROM purchase_bill_entry where parent_id in (SELECT id FROM purchase_bill where BIZ_DATE >'2014-09-01 01:01:01');
delete FROM purchase_bill where BIZ_DATE >'2014-09-01 01:01:01';
delete FROM purchase_return_entry where parent_id in (SELECT id FROM purchase_return where BIZ_DATE >'2014-09-01 01:01:01');
delete FROM purchase_return where BIZ_DATE >'2014-09-01 01:01:01';
delete FROM purchase_warehousing_entry where parent_id in (SELECT id FROM purchase_warehousing where BIZ_DATE >'2014-09-01 01:01:01');
delete FROM purchase_warehousing where BIZ_DATE >'2014-09-01 01:01:01';
delete FROM product_return_entry where parent_id in (SELECT id FROM product_return where BIZ_DATE >'2014-09-01 01:01:01');
delete FROM product_return where BIZ_DATE >'2014-09-01 01:01:01';

delete FROM product_manual_outwarehouse_entry where parent_id in (SELECT id FROM product_manual_outwarehouse where BIZ_DATE >'2014-09-01 01:01:01');
delete FROM product_manual_outwarehouse where BIZ_DATE >'2014-09-01 01:01:01';
delete FROM product_outwarehouse_entry where parent_id in (SELECT id FROM product_outwarehouse where BIZ_DATE >'2014-09-01 01:01:01');
delete FROM product_outwarehouse where BIZ_DATE >'2014-09-01 01:01:01';

--进仓单出仓时需要使用，还存在2013年12月未出库的数据，所有日期是2013-12-01之前。
delete FROM product_inwarehouse_entry where parent_id in (SELECT id FROM product_inwarehouse where BIZ_DATE >'2013-12-01 01:01:01');
delete FROM product_inwarehouse where BIZ_DATE >'2013-12-01 01:01:01';

--为出货对数表增加临时字段，以便删除数据
ALTER TABLE product_out_verify_entry ADD COLUMN `TEMP` DATETIME NULL DEFAULT NULL AFTER `SORT`;
update product_out_verify_entry pv,(SELECT distinct BIZ_DATE,DELIVER_NUMBER FROM ofbiz.product_out_notification) po set pv.temp = po.biz_date where pv.DELIVER_NUMBER = po.DELIVER_NUMBER;
delete FROM product_out_verify_entry where TEMP >'2014-09-01 01:01:01';

ALTER TABLE product_out_verify_head ADD COLUMN `TEMP` DATETIME NULL DEFAULT NULL AFTER `IS_FINISHED`;
update product_out_verify_head pv,(SELECT distinct BIZ_DATE,DELIVER_NUMBER FROM ofbiz.product_out_notification) po set pv.temp = po.biz_date where pv.DELIVER_NUMBER = po.DELIVER_NUMBER;
delete FROM product_out_verify_head where TEMP >'2014-09-01 01:01:01';

delete FROM product_out_notification_entry where parent_id in (SELECT id FROM product_out_notification where BIZ_DATE >'2014-09-01 01:01:01');
delete FROM product_out_notification where BIZ_DATE >'2014-09-01 01:01:01';