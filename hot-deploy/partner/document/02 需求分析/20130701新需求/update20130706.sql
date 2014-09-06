insert into cur_product_balance(year,month,warehouse_id,material_id,beginvolume,beginsum,in_Volume,in_Sum,out_Volume,out_Sum,volume,total_Sum)
SELECT year,month,warehouse_id,material_id,beginvolume,beginsum,in_Volume,in_Sum,out_Volume,out_Sum,volume,total_Sum FROM cur_material_balance cmb
left join t_material tm on cmb.material_id =tm.id
left join t_material_type tmt on tmt.id = tm.material_type_id
where tmt.number='MTT100005';

insert into his_product_balance(year,month,warehouse_id,material_id,beginvolume,beginsum,in_Volume,in_Sum,out_Volume,out_Sum,volume,total_Sum)
SELECT year,month,warehouse_id,material_id,beginvolume,beginsum,in_Volume,in_Sum,out_Volume,out_Sum,volume,total_Sum FROM his_material_balance cmb
left join t_material tm on cmb.material_id =tm.id
left join t_material_type tmt on tmt.id = tm.material_type_id
where tmt.number='MTT100005';

--检查数据
SELECT cpb.beginvolume,cpbb.beginvolume ,cpbb.beginvolume -cpb.beginvolume,cpbb.volume -cpb.volume  FROM cur_product_balance cpb
left join (
SELECT year,month,warehouse_id,material_id,beginvolume,beginsum,in_Volume,in_Sum,out_Volume,out_Sum,volume,total_Sum FROM cur_material_balance cmb
left join t_material tm on cmb.material_id =tm.id
left join t_material_type tmt on tmt.id = tm.material_type_id
where tmt.number='MTT100005'
) cpbb on cpb.material_id= cpbb.material_id
order by cpb.material_id;


SELECT cpb.beginvolume,cpbb.beginvolume ,cpbb.beginvolume -cpb.beginvolume,cpbb.volume -cpb.volume  FROM his_product_balance cpb
left join (
SELECT year,month,warehouse_id,material_id,beginvolume,beginsum,in_Volume,in_Sum,out_Volume,out_Sum,volume,total_Sum FROM his_material_balance cmb
left join t_material tm on cmb.material_id =tm.id
left join t_material_type tmt on tmt.id = tm.material_type_id
where tmt.number='MTT100005'
) cpbb on cpb.material_id= cpbb.material_id
order by cpb.material_id;



--将数据更新为正确
UPDATE cur_product_balance cpb,(
SELECT year,month,warehouse_id,material_id,beginvolume,beginsum,in_Volume,in_Sum,out_Volume,out_Sum,volume,total_Sum FROM cur_material_balance cmb
left join t_material tm on cmb.material_id =tm.id
left join t_material_type tmt on tmt.id = tm.material_type_id
where tmt.number='MTT100005'
) cpbb SET cpb.beginvolume=cpbb.beginvolume,cpb.beginsum=cpbb.beginsum,cpb.volume=cpbb.volume,cpb.total_Sum=cpbb.total_Sum
WHERE cpb.material_id= cpbb.material_id and cpb.warehouse_id = cpbb.warehouse_id;





--update cur_product_balance set in_Volume=0,in_Sum=0,out_Volume=0,out_Sum=0,volume=beginvolume,total_Sum=beginsum,change_Begin_Volume=0,change_Begin_Sum=0,change_In_Volume=0,change_In_Sum=0,change_Out_Volume=0,change_Out_Sum=0,change_Volume=0,change_Total_Sum=0,rework_Begin_Volume=0,rework_Begin_Sum=0,rework_In_Volume=0,rework_In_Sum=0,rework_Out_Volume=0,rework_Out_Sum=0,rework_Volume=0,rework_Total_Sum=0;
update cur_product_balance set change_Begin_Volume=0,change_Begin_Sum=0,change_In_Volume=0,change_In_Sum=0,change_Out_Volume=0,change_Out_Sum=0,change_Volume=0,change_Total_Sum=0,rework_Begin_Volume=0,rework_Begin_Sum=0,rework_In_Volume=0,rework_In_Sum=0,rework_Out_Volume=0,rework_Out_Sum=0,rework_Volume=0,rework_Total_Sum=0;


测试：

正常入仓
2406024995516739911326306 00373116408704511299
8020444220130518204 A2201305180999


改板出仓
24070222979167399112433015	00373116408703631081
24010219135167399112423035	00373116408703595048
24070222979167399112433015	00373116408703631241


返工出仓
24070222979167399112263015	00373116408703105100
24010219135167399112423035	00373116408703595055
24070222979167399112433015	00373116408703631173
