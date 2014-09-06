物料编码	库存数量	库存金额	进程单数量	进程单金额	差
48e46997-4ed7-4b7b-8d77-52f8cc0d2fba	6	8056.079	63	90425.542112


2.20140630修改库存sql如下：
update ofbiz.cur_product_balance set volume = 63 ,total_sum = 90425.542112 where material_id  ='48e46997-4ed7-4b7b-8d77-52f8cc0d2fba';
update ofbiz.cur_material_balance set volume = 63 ,total_sum = 90425.542112 where material_id  ='48e46997-4ed7-4b7b-8d77-52f8cc0d2fba';