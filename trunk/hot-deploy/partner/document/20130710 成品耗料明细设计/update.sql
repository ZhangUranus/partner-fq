--备份数据(将数据库备份为文件)
--create table product_inwarehouse_entry_detail_temp
--select * from product_inwarehouse_entry_detail;
--create table product_inwarehouse_entry_detail_temp_bak
--select * from product_inwarehouse_entry_detail;

--重复编码的问题已经解决
--重复编码
SELECT parent_id,barcode2,count(*) FROM product_inwarehouse_entry pie group by parent_id,barcode2 order by count(*) desc;
select * FROM product_inwarehouse_entry where barcode2 in('00373116408704332161','00373116408704325057','00373116408704329024','00373116408704161440','00373116408703740264');

--00373116408704329024
delete from product_inwarehouse_entry where id ='de5927e8-3c1f-4b7d-bfd0-9c4c474f118f';
delete from product_inwarehouse_entry_detail_temp where parent_id = 'de5927e8-3c1f-4b7d-bfd0-9c4c474f118f';
update product_inwarehouse set totalsum = totalsum-3697.966269 where id ='6e58216a-2e89-4dbb-a602-0c4dff1cf465';

--00373116408704325057
delete from product_inwarehouse_entry where id ='89e9c36a-9b3e-46bc-abd1-41fce836dbcf';
delete from product_inwarehouse_entry_detail_temp where parent_id = '89e9c36a-9b3e-46bc-abd1-41fce836dbcf';
update product_inwarehouse set totalsum = totalsum-1371.531668 where id ='96cb1c09-de1c-4e0a-b472-0585f5e60d87';

--00373116408704332161
delete from product_inwarehouse_entry where id ='8a6547b7-4d26-475c-b205-d750a15c254b';
delete from product_inwarehouse_entry_detail_temp where parent_id = '8a6547b7-4d26-475c-b205-d750a15c254b';
update product_inwarehouse set totalsum = totalsum-1317.572565 where id ='96cb1c09-de1c-4e0a-b472-0585f5e60d87';

--00373116408704161440
delete from product_inwarehouse_entry where id ='bec5c428-7c14-4813-b841-ad5bfdc4b766';
delete from product_inwarehouse_entry_detail_temp where parent_id = 'bec5c428-7c14-4813-b841-ad5bfdc4b766';
update product_inwarehouse set totalsum = totalsum-1308.409318 where id ='ff33c1e3-ec82-4cae-beff-a3b823b6a99f';

--00373116408703740264
delete from product_inwarehouse_entry where id ='d5726811-a3a8-41cb-b7a1-e0f1cee43f15';
delete from product_inwarehouse_entry_detail_temp where parent_id = 'd5726811-a3a8-41cb-b7a1-e0f1cee43f15';
update product_inwarehouse set totalsum = totalsum-971.186437 where id ='9056e689-5418-41fc-89d2-ab51a9f80c9f';


--处理出仓单重复
SELECT parent_id,barcode2,count(*) FROM product_outwarehouse_entry poe group by parent_id,barcode2 order by count(*) desc;
select * From product_outwarehouse_entry where barcode2='00373116408704205144';

--00373116408704205144
delete from product_outwarehouse_entry where id ='13341e80-95b7-427e-992f-c2e051d77069';
update product_outwarehouse set totalsum = totalsum-1435.263642 where id ='653fae10-376f-49b3-85f0-a15177d9c068';




--第一步：
RENAME TABLE PRODUCT_INWAREHOUSE_ENTRY_DETAIL TO PRODUCT_INWAREHOUSE_ENTRY_DETAIL_TEMP;


--迁移仓库数据
insert into product_inwarehouse_entry_detail
SELECT pied.id,pi.biz_date,pi.id,pie.id,'2010-01-01 10:00:01','','',pied.barcode1,pied.barcode2,pied.material_id,pied.model,pied.quantity,pied.unit_unit_id,pied.price,pied.amount,'1','0',pied.last_updated_stamp,pied.last_updated_tx_stamp,pied.created_stamp,pied.created_tx_stamp
FROM product_barcode_box pbb
join product_inwarehouse_entry_detail_temp pied on pied.barcode1 = pbb.barcode1 and pied.barcode2 = pbb.barcode2
join product_inwarehouse_entry pie on pie.id = pied.parent_id
join product_inwarehouse pi on pi.id = pie.parent_id;

--删除临时表原来仓库数据
delete from product_inwarehouse_entry_detail_temp using product_inwarehouse_entry_detail_temp , product_barcode_box
where product_inwarehouse_entry_detail_temp.barcode1 = product_barcode_box.barcode1 and product_inwarehouse_entry_detail_temp.barcode2 = product_barcode_box.barcode2;


--迁移已经扫描，但是未提交单据数据
insert into product_inwarehouse_entry_detail
SELECT pied.id,pi.biz_date,pi.id,pie.id,'2010-01-01 10:00:01','','',pied.barcode1,pied.barcode2,pied.material_id,pied.model,pied.quantity,pied.unit_unit_id,pied.price,pied.amount,'1','0',pied.last_updated_stamp,pied.last_updated_tx_stamp,pied.created_stamp,pied.created_tx_stamp
FROM (SELECT distinct barcode1,barcode2 FROM product_outwarehouse po
left join product_outwarehouse_entry poe on po.id = poe.parent_id where po.status=0) pbb
join product_inwarehouse_entry_detail_temp pied on pied.barcode1 = pbb.barcode1 and pied.barcode2 = pbb.barcode2
join product_inwarehouse_entry pie on pie.id = pied.parent_id
join product_inwarehouse pi on pi.id = pie.parent_id;

--删除临时表已经扫描，但是为提交数据
delete from product_inwarehouse_entry_detail_temp using product_inwarehouse_entry_detail_temp , (SELECT distinct barcode1,barcode2 FROM product_outwarehouse po left join product_outwarehouse_entry poe on po.id = poe.parent_id where po.status=0) pbb
where product_inwarehouse_entry_detail_temp.barcode1 = pbb.barcode1 and product_inwarehouse_entry_detail_temp.barcode2 = pbb.barcode2;


--迁移已经出仓数据(剩余全量)
insert into product_inwarehouse_entry_detail_his
SELECT pied.id,pi.biz_date,pi.id,pie.id,'2010-01-01 10:00:01','','',pied.barcode1,pied.barcode2,pied.material_id,pied.model,pied.quantity,pied.unit_unit_id,pied.price,pied.amount,'1','1',pied.last_updated_stamp,pied.last_updated_tx_stamp,pied.created_stamp,pied.created_tx_stamp
FROM product_inwarehouse_entry_detail_temp pied 
join product_inwarehouse_entry pie on pie.id = pied.parent_id
join product_inwarehouse pi on pi.id = pie.parent_id;

--迁移已经出仓数据(补充出仓单时间、父单据编码、分录编码)
--跑程序实现


--将出仓超过3个月历史数据迁移到备份表
INSERT INTO PRODUCT_INWAREHOUSE_ENTRY_DETAIL_BACKUP SELECT * FROM PRODUCT_INWAREHOUSE_ENTRY_DETAIL_HIS WHERE OUT_BIZ_DATE <'2013-04-25 23:59:59';

--删除出仓超过3个月历史数据
DELETE FROM PRODUCT_INWAREHOUSE_ENTRY_DETAIL_HIS WHERE OUT_BIZ_DATE <'2013-04-25 23:59:59';




--报表查询语句
SELECT
	MD.ID AS ID,
	TM.NUMBER AS NUMBER,
	TM.NAME AS NAME,
	ROUND(IFNULL(SUM(MD.VOLUME),0),4) VOLUME,
	ROUND(IFNULL(SUM(MD.SUM)/SUM(MD.VOLUME),0),4) AS PRICE,
	ROUND(IFNULL(SUM(MD.SUM),0),4) AS SUM 
FROM
(
	SELECT 
		MATERIAL_ID AS ID,
		QUANTITY AS VOLUME,
		AMOUNT AS SUM 
	FROM PRODUCT_INWAREHOUSE_ENTRY_DETAIL
	WHERE IN_BIZ_DATE > '2013-07-01 00:00:01'
		AND SUBSTR(BARCODE1,4,8) = '30227912'
	UNION
	SELECT 
		MATERIAL_ID AS ID,
		QUANTITY AS VOLUME,
		AMOUNT AS SUM 
	FROM PRODUCT_INWAREHOUSE_ENTRY_DETAIL_HIS
	WHERE IN_BIZ_DATE > '2013-07-01 00:00:01'
		AND SUBSTR(BARCODE1,4,8) = '30227912'
	UNION
	SELECT 
		PIED.MATERIAL_ID AS ID,
		-PIED.QUANTITY AS VOLUME,
		-PIED.AMOUNT AS SUM 
	FROM PRODUCT_OUTWAREHOUSE_ENTRY POE 
	LEFT JOIN PRODUCT_INWAREHOUSE_ENTRY_DETAIL PIED ON POE.ID = PIED.OUT_PARENT_ID
	WHERE PIED.OUT_BIZ_DATE > '2013-07-01 00:00:01'
		AND SUBSTR(PIED.BARCODE1,4,8) = '30227912'
		AND POE.OUTWAREHOUSE_TYPE != 1
	UNION
	SELECT 
		PIED.MATERIAL_ID AS ID,
		-PIED.QUANTITY AS VOLUME,
		-PIED.AMOUNT AS SUM 
	FROM PRODUCT_OUTWAREHOUSE_ENTRY POE 
	LEFT JOIN PRODUCT_INWAREHOUSE_ENTRY_DETAIL_HIS PIED ON POE.ID = PIED.OUT_PARENT_ID
	WHERE PIED.OUT_BIZ_DATE > '2013-07-01 00:00:01'
		AND SUBSTR(PIED.BARCODE1,4,8) = '30227912'
		AND POE.OUTWAREHOUSE_TYPE != 1
) AS MD 
LEFT JOIN T_MATERIAL TM ON MD.ID = TM.ID
WHERE TM.NAME LIKE '%'
GROUP BY MD.ID,TM.NUMBER,TM.NAME;


SELECT
	MD.ID AS ID,
	TM.NUMBER AS NUMBER,
  	TM.NAME AS NAME,
  	ROUND(IFNULL(SUM(MD.VOLUME),0),4) VOLUME,
  	ROUND(IFNULL(SUM(MD.SUM)/SUM(MD.VOLUME),0),4) AS PRICE,
  	ROUND(IFNULL(SUM(MD.SUM),0),4) AS SUM   
FROM  (  	
	SELECT   		
		MATERIAL_ID AS ID,
		QUANTITY AS VOLUME,
		AMOUNT AS SUM   	
	FROM PRODUCT_INWAREHOUSE_ENTRY_DETAIL  
	WHERE IN_BIZ_DATE between '2013-07-25 00:00:00' AND '2013-07-25 23:59:59' 
		AND SUBSTR(BARCODE1,4,8) = '90218523'  	
	UNION ALL  	
	SELECT
		MATERIAL_ID AS ID,
  		QUANTITY AS VOLUME,
  		AMOUNT AS SUM   	
	FROM PRODUCT_INWAREHOUSE_ENTRY_DETAIL_HIS  
	WHERE IN_BIZ_DATE between '2013-07-25 00:00:00' AND '2013-07-25 23:59:59' 
		AND SUBSTR(BARCODE1,4,8) = '90218523'  	
	UNION ALL  	
	SELECT
		PIED.MATERIAL_ID AS ID,
  		-PIED.QUANTITY AS VOLUME,
  		-PIED.AMOUNT AS SUM   	
	FROM PRODUCT_OUTWAREHOUSE_ENTRY POE   	
	LEFT JOIN PRODUCT_INWAREHOUSE_ENTRY_DETAIL PIED ON POE.ID = PIED.OUT_PARENT_ID  	
	WHERE PIED.OUT_BIZ_DATE between '2013-07-25 00:00:00' AND '2013-07-25 23:59:59'  		
	  AND (POE.OUTWAREHOUSE_TYPE = 2 OR POE.OUTWAREHOUSE_TYPE = 3)  		
	  AND SUBSTR(PIED.BARCODE1,4,8) = '90218523'  	
	UNION ALL
	SELECT   		
		PIED.MATERIAL_ID AS ID,
  		-PIED.QUANTITY AS VOLUME,
  		-PIED.AMOUNT AS SUM   	
	FROM PRODUCT_OUTWAREHOUSE_ENTRY POE   	
	LEFT JOIN PRODUCT_INWAREHOUSE_ENTRY_DETAIL_HIS PIED ON POE.ID = PIED.OUT_PARENT_ID  	
	WHERE PIED.OUT_BIZ_DATE between '2013-07-25 00:00:00' AND '2013-07-25 23:59:59' 
	AND (POE.OUTWAREHOUSE_TYPE = 2 OR POE.OUTWAREHOUSE_TYPE = 3)  		
	AND SUBSTR(PIED.BARCODE1,4,8) = '90218523'  
) AS MD   
LEFT JOIN T_MATERIAL TM ON MD.ID = TM.ID  
GROUP BY MD.ID,TM.NUMBER,TM.NAME;



SELECT
	MD.ID AS ID,
	TM.NUMBER AS NUMBER,
  	TM.NAME AS NAME,
  	ROUND(IFNULL(SUM(MD.VOLUME),0),4) VOLUME,
  	ROUND(IFNULL(SUM(MD.SUM)/SUM(MD.VOLUME),0),4) AS PRICE,
  	ROUND(IFNULL(SUM(MD.SUM),0),4) AS SUM   
FROM  (  	
	SELECT 
		PIE.MATERIAL_MATERIAL_ID AS M_ID,
		PIED.MATERIAL_ID AS ID,
		PIED.QUANTITY AS VOLUME,
		PIED.AMOUNT AS SUM   	
	FROM PRODUCT_OUTWAREHOUSE_ENTRY PIE   	
	LEFT JOIN PRODUCT_INWAREHOUSE_ENTRY_DETAIL PIED ON PIE.ID = PIED.IN_PARENT_ID
	WHERE PIED.IN_BIZ_DATE between '2013-07-25 00:00:00' AND '2013-07-25 23:59:59' 
	UNION ALL  	
	SELECT
		PIE.MATERIAL_MATERIAL_ID AS M_ID,
		PIED.MATERIAL_ID AS ID,
  		PIED.QUANTITY AS VOLUME,
  		PIED.AMOUNT AS SUM   	
	FROM PRODUCT_OUTWAREHOUSE_ENTRY PIE   	
	LEFT JOIN PRODUCT_INWAREHOUSE_ENTRY_DETAIL_HIS  PIED ON PIE.ID = PIED.IN_PARENT_ID
	WHERE IN_BIZ_DATE between '2013-07-25 00:00:00' AND '2013-07-25 23:59:59' 
	UNION ALL  	
	SELECT
		POE.MATERIAL_MATERIAL_ID AS M_ID,
		PIED.MATERIAL_ID AS ID,
  		-PIED.QUANTITY AS VOLUME,
  		-PIED.AMOUNT AS SUM   	
	FROM PRODUCT_OUTWAREHOUSE_ENTRY POE   	
	LEFT JOIN PRODUCT_INWAREHOUSE_ENTRY_DETAIL PIED ON POE.ID = PIED.OUT_PARENT_ID  	
	WHERE PIED.OUT_BIZ_DATE between '2013-07-25 00:00:00' AND '2013-07-25 23:59:59'  		
	  AND (POE.OUTWAREHOUSE_TYPE = 2 OR POE.OUTWAREHOUSE_TYPE = 3)
	UNION ALL
	SELECT  
		POE.MATERIAL_MATERIAL_ID AS M_ID,
		PIED.MATERIAL_ID AS ID,
  		-PIED.QUANTITY AS VOLUME,
  		-PIED.AMOUNT AS SUM   	
	FROM PRODUCT_OUTWAREHOUSE_ENTRY POE   	
	LEFT JOIN PRODUCT_INWAREHOUSE_ENTRY_DETAIL_HIS PIED ON POE.ID = PIED.OUT_PARENT_ID  	
	WHERE PIED.OUT_BIZ_DATE between '2013-07-25 00:00:00' AND '2013-07-25 23:59:59' 
	AND (POE.OUTWAREHOUSE_TYPE = 2 OR POE.OUTWAREHOUSE_TYPE = 3)
) AS MD   
LEFT JOIN T_MATERIAL TM ON MD.ID = TM.ID  
LEFT JOIN PRODUCT_MAP PM ON MD.M_ID = PM.MATERIAL_ID  
WHERE PM.IKEA_ID = '90218523'
GROUP BY MD.ID,TM.NUMBER,TM.NAME;


--测试
--1.进仓测试

--1.1正常进仓 手工耗料
24030227912167399113283016 00373116408704559999
测试结果：正常

--1.2返工进仓 手工耗料
24090218523167399113153024 00373116408704269999
测试结果：正常

--1.3改板进仓
240600997911673991132730128 00373116408704539999
测试结果：正常

--1.4正常进仓
24030142003167399113283028 00373116408704579999
测试结果：正常

--1.5正常进仓后撤销扫描
24030142003167399113283028 00373116408704578888
测试结果：正常


--2.出仓测试

--2.1正常出仓
24030227912167399113283016 00373116408704559999
测试结果：正常

--2.2返工出仓
24090218523167399113153024 00373116408704269999
测试结果：正常
进行撤销，撤销扫描操作

--3.3改板出仓
240600997911673991132730128 00373116408704539999
测试结果：正常


RENAME TABLE PRODUCT_INWAREHOUSE_ENTRY_DETAIL_HIS TO PRODUCT_INWAREHOUSE_ENTRY_DETAIL_HIS_TEMP;

insert into ofbiz.PRODUCT_INWAREHOUSE_ENTRY_DETAIL_HIS SELECT * FROM ofbiz.PRODUCT_INWAREHOUSE_ENTRY_DETAIL_HIS_TEMP where out_biz_date >'2013-04-30 23:59:59';

LOAD DATA LOCAL INFILE 'D:\\ddd.csv' INTO TABLE ofbiz.PRODUCT_INWAREHOUSE_ENTRY_DETAIL_HIS;
