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
