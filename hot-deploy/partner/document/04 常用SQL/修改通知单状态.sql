ECIS40984

SELECT * FROM ofbiz.product_out_notification_entry where parent_id = (SELECT id FROM ofbiz.product_out_notification where GOOD_NUMBER ='ECIS40984');
SELECT * FROM ofbiz.product_out_verify_head where MATERIAL_ID='93c17133-c014-49da-9220-542346636222' and deliver_number = 'ECIS40984';
SELECT * FROM ofbiz.product_out_verify_entry where  deliver_number = 'ECIS40984';

ECIS41180

SELECT * FROM ofbiz.product_out_notification_entry 
where parent_id = (SELECT id FROM ofbiz.product_out_notification where GOOD_NUMBER ='ECIS41180') 
and MATERIAL_ID='4e61776b-3330-4ae2-a54d-491b6c210e89';
SELECT * FROM ofbiz.product_out_verify_head where MATERIAL_ID='4e61776b-3330-4ae2-a54d-491b6c210e89' and deliver_number = 'ECIS41180';
SELECT * FROM ofbiz.product_out_verify_entry where  deliver_number = 'ECIS41180';


