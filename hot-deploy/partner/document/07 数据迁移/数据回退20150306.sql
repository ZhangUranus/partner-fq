SELECT * FROM ofbiz.his_material_balance where year = 2015 and month =1 INTO OUTFILE 'D:\\tmp\\his_material_balance.txt';
LOAD DATA INFILE '/home/tools/his_material_balance.txt' INTO TABLE his_material_balance ;

SELECT * FROM ofbiz.his_material_balance where year = 2015 and month =1 INTO OUTFILE 'D:\\tmp\\his_consign_price.txt';
LOAD DATA INFILE '/home/tools/his_consign_price.txt' INTO TABLE his_material_balance ;

SELECT * FROM ofbiz.his_material_balance where year = 2015 and month =1 INTO OUTFILE 'D:\\tmp\\his_consign_processed_price.txt';
LOAD DATA INFILE '/home/tools/his_consign_processed_price.txt' INTO TABLE his_material_balance ;

SELECT * FROM ofbiz.his_material_balance where year = 2015 and month =1 INTO OUTFILE 'D:\\tmp\\his_product_balance.txt';
LOAD DATA INFILE '/home/tools/his_product_balance.txt' INTO TABLE his_material_balance ;

SELECT * FROM ofbiz.his_material_balance where year = 2015 and month =1 INTO OUTFILE 'D:\\tmp\\his_purchase_price.txt';
LOAD DATA INFILE '/home/tools/his_purchase_price.txt' INTO TABLE his_material_balance ;

SELECT * FROM ofbiz.his_material_balance where year = 2015 and month =1 INTO OUTFILE 'D:\\tmp\\his_workshop_price.txt';
LOAD DATA INFILE '/home/tools/his_workshop_price.txt' INTO TABLE his_material_balance ;



select * FROM product_out_verify_head where TEMP <'2014-09-01 01:01:01' INTO OUTFILE 'D:\\tmp\\product_out_verify_head.txt';
LOAD DATA INFILE '/home/tools/product_out_verify_head.txt' INTO TABLE product_out_verify_head ;

select * FROM product_out_verify_entry where TEMP <'2014-09-01 01:01:01' INTO OUTFILE 'D:\\tmp\\product_out_verify_entry.txt';
LOAD DATA INFILE '/home/tools/product_out_verify_entry.txt' INTO TABLE product_out_verify_entry ;

select * FROM product_out_notification_entry where parent_id in (SELECT id FROM product_out_notification where BIZ_DATE <'2014-09-01 01:01:01') INTO OUTFILE 'D:\\tmp\\product_out_notification_entry.txt';
LOAD DATA INFILE '/home/tools/product_out_notification_entry.txt' INTO TABLE product_out_notification_entry ;

select * FROM product_out_notification where BIZ_DATE <'2014-09-01 01:01:01' INTO OUTFILE 'D:\\tmp\\product_out_notification.txt';
LOAD DATA INFILE '/home/tools/product_out_notification.txt' INTO TABLE product_out_notification ;
