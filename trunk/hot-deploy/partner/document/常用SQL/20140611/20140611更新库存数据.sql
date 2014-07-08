1.20140606修改库存sql如下：
update ofbiz.cur_product_balance set volume = volume+1 ,total_sum = total_sum+1531.42422 where material_id  ='48e46997-4ed7-4b7b-8d77-52f8cc0d2fba';
update ofbiz.cur_material_balance set volume = volume+1 ,total_sum = total_sum+1531.42422 where material_id  ='48e46997-4ed7-4b7b-8d77-52f8cc0d2fba';


物料编码	库存数量	库存金额	进程单数量	进程单金额	差
48e46997-4ed7-4b7b-8d77-52f8cc0d2fba	0.000000	1333.775202	2	2884.002243	-2
6f49ba55-6eb9-4897-96ee-016e8b7bbee1	13.000000	54192.599626	16	66232.445949	-3
73aaec86-72bc-4983-bc5b-88f03788bfc7	58.000000	68106.087093	56	65723.146936	2
--870c3a49-9e1a-4999-846e-125a1cbbafd9	3.000000	11518.382402	6	11518.382373	-3
ed37cb36-da89-4c04-9a55-f90eb07231e1	29.000000	170186.281563	28	164318.081755	1
--f9267588-fc44-4faf-9337-7ce60e46e837	3.000000	9893.075163	6	9893.075136	-3


2.20140611修改库存sql如下：
update ofbiz.cur_product_balance set volume = 2 ,total_sum = 2884.002243 where material_id  ='48e46997-4ed7-4b7b-8d77-52f8cc0d2fba';
update ofbiz.cur_material_balance set volume = 2 ,total_sum = 2884.002243 where material_id  ='48e46997-4ed7-4b7b-8d77-52f8cc0d2fba';

update ofbiz.cur_product_balance set volume = 16 ,total_sum = 66232.445949 where material_id  ='6f49ba55-6eb9-4897-96ee-016e8b7bbee1';
update ofbiz.cur_material_balance set volume = 16 ,total_sum = 66232.445949 where material_id  ='6f49ba55-6eb9-4897-96ee-016e8b7bbee1';

update ofbiz.cur_product_balance set volume = 56 ,total_sum = 65723.146936 where material_id  ='73aaec86-72bc-4983-bc5b-88f03788bfc7';
update ofbiz.cur_material_balance set volume = 56 ,total_sum = 65723.146936 where material_id  ='73aaec86-72bc-4983-bc5b-88f03788bfc7';

update ofbiz.cur_product_balance set volume = 28 ,total_sum = 164318.081755 where material_id  ='ed37cb36-da89-4c04-9a55-f90eb07231e1';
update ofbiz.cur_material_balance set volume = 28 ,total_sum = 164318.081755 where material_id  ='ed37cb36-da89-4c04-9a55-f90eb07231e1';

