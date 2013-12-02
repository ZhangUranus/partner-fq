insert into bill_job_list(id,number,bill_type,operation_type,status,parameter,created_stamp) 
select id,number,'PurchaseWarehousing','0','0','N','2013-11-25 12:00:01' from Purchase_Warehousing where biz_date>'2013-09-01 00:00:01' and status = '0';

insert into bill_job_list(id,number,bill_type,operation_type,status,parameter,created_stamp) 
select id,number,'PurchaseReturn','0','0','N','2013-11-25 12:00:01' from Purchase_Return where biz_date>'2013-09-01 00:00:01' and status = '0';

insert into bill_job_list(id,number,bill_type,operation_type,status,parameter,created_stamp) 
select id,number,'ConsignDrawMaterial','0','0','N','2013-11-25 12:00:01' from consign_draw_material where biz_date>'2013-09-01 00:00:01' and  status = '0';

insert into bill_job_list(id,number,bill_type,operation_type,status,parameter,created_stamp) 
select id,number,'ConsignReturnMaterial','0','0','N','2013-11-25 12:00:01' from consign_return_material where biz_date>'2013-09-01 00:00:01' and  status = '0';

insert into bill_job_list(id,number,bill_type,operation_type,status,parameter,created_stamp) 
select id,number,'ConsignReturnProduct','0','0','N','2013-11-25 12:00:01' from consign_return_product where biz_date>'2013-09-01 00:00:01' and  status = '0';

insert into bill_job_list(id,number,bill_type,operation_type,status,parameter,created_stamp) 
select id,number,'ConsignWarehousing','0','0','N','2013-11-25 12:00:01' from consign_warehousing where biz_date>'2013-09-01 00:00:01' and  status = '0';

insert into bill_job_list(id,number,bill_type,operation_type,status,parameter,created_stamp) 
select id,number,'WorkshopDrawMaterial','0','0','N','2013-11-25 12:00:01' from Workshop_Draw_Material where biz_date>'2013-09-01 00:00:01' and  status = '0';

insert into bill_job_list(id,number,bill_type,operation_type,status,parameter,created_stamp) 
select id,number,'WorkshopReturnMaterial','0','0','N','2013-11-25 12:00:01' from Workshop_Return_Material where biz_date>'2013-09-01 00:00:01' and  status = '0';

insert into bill_job_list(id,number,bill_type,operation_type,status,parameter,created_stamp) 
select id,number,'WorkshopWarehousing','0','0','N','2013-11-25 12:00:01' from Workshop_Warehousing where biz_date>'2013-09-01 00:00:01' and  status = '0';

insert into bill_job_list(id,number,bill_type,operation_type,status,parameter,created_stamp) 
select id,number,'WorkshopReturnProduct','0','0','N','2013-11-25 12:00:01' from Workshop_Return_Product where biz_date>'2013-09-01 00:00:01' and  status = '0';

insert into bill_job_list(id,number,bill_type,operation_type,status,parameter,created_stamp) 
select id,number,'WorkshopOtherDrawBill','0','0','N','2013-11-25 12:00:01' from Workshop_Other_Draw_Bill where biz_date>'2013-09-01 00:00:01' and  status = '0';

insert into bill_job_list(id,number,bill_type,operation_type,status,parameter,created_stamp) 
select pie.id,pi.number,'ProductInwarehouse','0','0',pie.id,'2013-11-25 12:00:01' 
from product_inwarehouse pi left join product_inwarehouse_entry pie on pi.id=pie.parent_id where pi.biz_date>'2013-09-01 00:00:01' and pi.status = '0';

insert into bill_job_list(id,number,bill_type,operation_type,status,parameter,created_stamp) 
select poe.id,po.number,'ProductOutwarehouse','0','0',poe.id,'2013-11-25 12:00:01' 
from Product_Outwarehouse po left join Product_Outwarehouse_entry poe on po.id=poe.parent_id where po.biz_date>'2013-09-01 00:00:01' and po.status = '0';

insert into bill_job_list(id,number,bill_type,operation_type,status,parameter,created_stamp) 
select id,number,'ProductManualOutwarehouse','0','0','N','2013-11-25 12:00:01' from Product_Manual_Outwarehouse where biz_date>'2013-09-01 00:00:01' and status = '0';




