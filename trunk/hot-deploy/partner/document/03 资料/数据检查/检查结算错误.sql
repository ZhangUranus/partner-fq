SELECT id,number,biz_date,submit_stamp FROM Purchase_Warehousing where status=4 and Biz_date between '2012-09-01 00:00:00' and '2012-09-30 23:59:59'
union all
SELECT id,number,biz_date,submit_stamp FROM Purchase_Return where status=4 and Biz_date between '2012-09-01 00:00:00' and '2012-09-30 23:59:59'
union all
SELECT id,number,biz_date,submit_stamp FROM Consign_Draw_Material where status=4 and Biz_date between '2012-09-01 00:00:00' and '2012-09-30 23:59:59'
union all
SELECT id,number,biz_date,submit_stamp FROM Consign_Return_Material where status=4 and Biz_date between '2012-09-01 00:00:00' and '2012-09-30 23:59:59'
union all
SELECT id,number,biz_date,submit_stamp FROM Consign_Warehousing where status=4 and Biz_date between '2012-09-01 00:00:00' and '2012-09-30 23:59:59'
union all
SELECT id,number,biz_date,submit_stamp FROM Consign_Return_Product where status=4 and Biz_date between '2012-09-01 00:00:00' and '2012-09-30 23:59:59'
union all
SELECT id,number,biz_date,submit_stamp FROM Workshop_Draw_Material where status=4 and Biz_date between '2012-09-01 00:00:00' and '2012-09-30 23:59:59'
union all
SELECT id,number,biz_date,submit_stamp FROM Workshop_Return_Material where status=4 and Biz_date between '2012-09-01 00:00:00' and '2012-09-30 23:59:59'
union all
SELECT id,number,biz_date,submit_stamp FROM Workshop_Warehousing where status=4 and Biz_date between '2012-09-01 00:00:00' and '2012-09-30 23:59:59'
union all
SELECT id,number,biz_date,submit_stamp FROM Workshop_Return_Product where status=4 and Biz_date between '2012-09-01 00:00:00' and '2012-09-30 23:59:59'
union all
SELECT id,number,biz_date,submit_stamp FROM Workshop_Other_Draw_Bill where status=4 and Biz_date between '2012-09-01 00:00:00' and '2012-09-30 23:59:59'
union all
SELECT id,number,biz_date,submit_stamp FROM Return_Product_Warehousing where status=4 and Biz_date between '2012-09-01 00:00:00' and '2012-09-30 23:59:59'
union all
SELECT id,number,biz_date,submit_stamp FROM Stock_Adjust where status=4 and Biz_date between '2012-09-01 00:00:00' and '2012-09-30 23:59:59'
union all
SELECT id,number,biz_date,submit_stamp FROM Workshop_Stock_Adjust where status=4 and Biz_date between '2012-09-01 00:00:00' and '2012-09-30 23:59:59'
union all
SELECT id,number,biz_date,submit_stamp FROM Supplier_Stock_Adjust where status=4 and Biz_date between '2012-09-01 00:00:00' and '2012-09-30 23:59:59'
union all
SELECT id,number,biz_date,submit_stamp FROM Product_Inwarehouse where status=4 and Biz_date between '2012-09-01 00:00:00' and '2012-09-30 23:59:59'
union all
SELECT id,number,biz_date,submit_stamp FROM Product_Outwarehouse where status=4 and Biz_date between '2012-09-01 00:00:00' and '2012-09-30 23:59:59'
union all
SELECT id,number,biz_date,submit_stamp FROM Product_Manual_Outwarehouse where status=4 and Biz_date between '2012-09-01 00:00:00' and '2012-09-30 23:59:59'
order by submit_stamp