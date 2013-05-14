/**
 * @Purpose 导出功能类
 * @author jeff-liu
 * @Date 2011-11-24
 * @description 子类需要必须存在getParams()方法，返回的必要参数如下：
 * {
 * 	sort : 排序方式，非必须。例如：Ext.encode(getSorters())
 * 	filter : 过滤字段，非必须。例如：Ext.encode(filters.items)
 * 
 * 	entity : 实体名称，必须。例如：'Unit'
 * 	title : sheet名称，非必须。例如：'计量单位'
 * 	header : 列名,必须。例如：'编码,名称,数量'
 * 	dataIndex : 数据标签，必须与数据库字段一致，必须。例如：'id,name,count'
 * 	type : 导出类型，非必须，默认为'EXCEL'。暂时只支持'EXCEL'。,
 * 	whereStr : 其它查找条件，非必须。例如：'id = "aaa"'
 * }
 * 
 */
Ext.define('SCM.extend.exporter.Exporter', {
			exportExcel : function() {
				Ext.Ajax.request({
							url : '../scm/control/export',
							timeout : SCM.normalTimes,
							params : this.getParams(),

							success : function(response, option) {
								var result = Ext.decode(response.responseText);
								if (result.success) {
									window.location.href = '../scm/control/download?type=EXCEL&filename=' + result.filename;
								} else {
									Ext.Msg.alert("错误", result.message);
								}
							}
						});

			},
			
			exportDetailExcel : function() {
				Ext.Ajax.request({
							url : '../scm/control/export',
							timeout : SCM.normalTimes,
							params : this.getDetailParams(),

							success : function(response, option) {
								var result = Ext.decode(response.responseText);
								if (result.success) {
									window.location.href = '../scm/control/download?type=EXCEL&filename=' + result.filename;
								} else {
									Ext.Msg.alert("错误", result.message);
								}
							}
						});

			}
		})