--将无法关联的数据删除（已更新）
delete From cur_material_balance where warehouse_id = '77245dcd-9823-4328-8496-8f8c172f0753';
delete From cur_material_balance where material_id in('4cce6fda-64c4-4150-9c05-5986d4c54303','d35e9a55-75de-47ee-b600-cfede1b10d72');
delete From cur_workshop_price where workshop_id in('72aca0f5-b91a-47d7-8113-44e94af4e76c','f6aa47b9-d6e8-4921-9e0c-757ac4091d7e');
delete From cur_workshop_price where material_id in('','1513ec6a-e071-42a5-acc6-6e1eb234ac18','9503f6b0-7281-4820-9cd0-f9c7f3849381','2e3f1ae7-7159-4d04-9c35-d8dac053008f','44b9e1d1-4dca-4735-a0b0-2d770c63135b','4cce6fda-64c4-4150-9c05-5986d4c54303');
delete From cur_purchase_price where material_id in('d35e9a55-75de-47ee-b600-cfede1b10d72','');
delete From cur_consign_price where material_id in('4cce6fda-64c4-4150-9c05-5986d4c54303');
delete From cur_consign_processed_price where material_id in('4cce6fda-64c4-4150-9c05-5986d4c54303','11f4ee1f-d4d8-456f-9229-045ee6adc17d');
delete From cur_consign_processed_price where supplier_id in('52');

--更新库存为0而金额不为0的数据
update cur_material_balance set total_sum=0 where volume = 0;
update cur_consign_price set totalsum=0 where volume = 0;
update cur_product_balance set total_sum=0 where volume = 0;
update cur_workshop_price set totalsum=0 where volume = 0;


select * From ofbiz.cur_product_balance where material_id  ='6f49ba55-6eb9-4897-96ee-016e8b7bbee1';
select * From ofbiz.cur_material_balance where material_id  ='6f49ba55-6eb9-4897-96ee-016e8b7bbee1';

--更新库存数据
update ofbiz.cur_product_balance set beginvolume = 0 ,beginsum = 0,volume = 0 ,total_sum = 0 where material_id  ='4d9b52f3-a6cc-4d2a-a4c8-19a8350cab32';
update ofbiz.cur_material_balance set beginvolume = 0 ,beginsum = 0,volume = 0 ,total_sum = 0 where material_id  ='4d9b52f3-a6cc-4d2a-a4c8-19a8350cab32';
update ofbiz.cur_product_balance set beginvolume = beginvolume-1 ,volume = volume-1 where material_id  ='6f49ba55-6eb9-4897-96ee-016e8b7bbee1';
update ofbiz.cur_material_balance set beginvolume = beginvolume-1 ,volume = volume-1 where material_id  ='6f49ba55-6eb9-4897-96ee-016e8b7bbee1';

update ofbiz.cur_product_balance set beginvolume = 54 ,beginsum = 62814.878346,volume = 54 ,total_sum = 62814.878346 where material_id  ='73aaec86-72bc-4983-bc5b-88f03788bfc7';
update ofbiz.cur_material_balance set beginvolume = 54 ,beginsum = 62814.878346,volume = 54 ,total_sum = 62814.878346 where material_id  ='73aaec86-72bc-4983-bc5b-88f03788bfc7';

update ofbiz.cur_product_balance set beginvolume = 16 ,beginsum = 12133.16203,volume = 16 ,total_sum = 12133.16203 where material_id  ='d1690aa9-4a01-4497-a1f9-f446ce2c3bfe';
update ofbiz.cur_material_balance set beginvolume = 16 ,beginsum = 12133.16203,volume = 16 ,total_sum = 12133.16203 where material_id  ='d1690aa9-4a01-4497-a1f9-f446ce2c3bfe';

update ofbiz.cur_product_balance set beginvolume = 90 ,beginsum = 45866.93068,volume = 90 ,total_sum = 45866.93068 where material_id  ='e7d75f26-439d-4e45-888e-43960dc3d2f4';
update ofbiz.cur_material_balance set beginvolume = 90 ,beginsum = 45866.93068,volume = 90 ,total_sum = 45866.93068 where material_id  ='e7d75f26-439d-4e45-888e-43960dc3d2f4';

update ofbiz.cur_product_balance set beginvolume = 28 ,beginsum = 164310.9175,volume = 27 ,total_sum = 158442.7005 where material_id  ='ed37cb36-da89-4c04-9a55-f90eb07231e1';
update ofbiz.cur_material_balance set beginvolume = 28 ,beginsum = 164310.9175,volume = 27 ,total_sum = 158442.7005 where material_id  ='ed37cb36-da89-4c04-9a55-f90eb07231e1';

158442.7005 


