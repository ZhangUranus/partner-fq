SELECT * FROM ofbiz.cur_material_balance where material_id ='ed37cb36-da89-4c04-9a55-f90eb07231e1'; 
SELECT * FROM cur_product_balance where material_id ='ed37cb36-da89-4c04-9a55-f90eb07231e1'; 
调整前：1  5,764.518
调整后：2 11632.734388




select pie.material_material_id,pie.QANTITY,pie.volume,pie.price,cpb.material_id,cpb.volume,cpb.total_sum
from cur_product_balance cpb 
left join (SELECT material_material_id,QANTITY,sum(volume) as volume,sum(price) as price FROM product_inwarehouse_entry 
where price is not null
and is_out is null
group by material_material_id,QANTITY) pie on cpb.material_id = pie.material_material_id
where pie.material_material_id is not null
order by pie.material_material_id