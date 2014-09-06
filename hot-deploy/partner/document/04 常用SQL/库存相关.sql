--扫描未提交的
SELECT tm.name ,count(*) FROM product_inwarehouse pi
left join product_inwarehouse_entry pie on pi.id = pie.parent_id 
left join t_material tm on pie.material_material_id =tm.id
where pi.status !=4
group by tm.name;

SELECT tm.name ,count(*) FROM product_outwarehouse po
left join product_outwarehouse_entry poe on po.id = poe.parent_id 
left join t_material tm on poe.material_material_id =tm.id
where po.status !=4
group by tm.name;


--查询未出仓产品和仓库库存产品差异数据
SELECT cpb.material_id,cpb.volume,cpb.total_sum,cmb.volume,cmb.total_sum 
FROM cur_material_balance cpb
left join 
(
	SELECT pie.material_material_id as material_id,count(pie.volume) as volume,sum(pie.price) as total_sum FROM product_inwarehouse pi 
	left join product_inwarehouse_entry pie on pi.id = pie.parent_id
	and pi.status = 4
	and pie.is_out is null
	group by pie.material_material_id
) cmb on cmb.material_id = cpb.material_id 
where cpb.total_sum !=cmb.total_sum or cmb.volume != cpb.volume;


--将仓库库存数据更新为时间未出仓单据汇总
UPDATE cur_material_balance cpb,
(
	SELECT pie.material_material_id as material_id,count(pie.volume) as volume,sum(pie.price) as total_sum FROM product_inwarehouse pi 
	left join product_inwarehouse_entry pie on pi.id = pie.parent_id
	and pi.status = 4
	and pie.is_out is null
	group by pie.material_material_id
) cpbb SET cpb.volume=cpbb.volume,cpb.total_Sum=cpbb.total_Sum
where cpb.material_id = cpbb.material_id ;


--查询产品库存表和仓库库存数据是否一致
SELECT cpb.material_id,cpb.volume,cpb.total_sum,cmb.volume,cmb.total_sum 
FROM `ofbiz`.`cur_product_balance` cpb
left join `ofbiz`.`cur_material_balance` cmb on cmb.material_id = cpb.material_id and cmb.warehouse_id = cpb.warehouse_id
where cpb.total_sum !=cmb.total_sum or cmb.volume != cpb.volume



--更新产品库存表，和仓库库存数据保持一致
UPDATE cur_product_balance cpb,(
SELECT year,month,warehouse_id,material_id,beginvolume,beginsum,in_Volume,in_Sum,out_Volume,out_Sum,volume,total_Sum FROM cur_material_balance cmb
left join t_material tm on cmb.material_id =tm.id
left join t_material_type tmt on tmt.id = tm.material_type_id
where tmt.number='MTT100005'
) cpbb SET cpb.beginvolume=cpbb.beginvolume,cpb.beginsum=cpbb.beginsum,cpb.volume=cpbb.volume,cpb.total_Sum=cpbb.total_Sum
WHERE cpb.material_id= cpbb.material_id and cpb.warehouse_id = cpbb.warehouse_id;