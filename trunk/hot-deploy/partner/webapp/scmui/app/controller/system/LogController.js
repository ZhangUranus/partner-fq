Ext.define('SCM.controller.system.LogController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter'],
			views : ['system.log.ListUI'],
			stores : ['system.LogStore'],
			models : ['system.LogModel'],

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							// 完成日志界面初始化后调用
							'logmanagement' : {
								afterrender : this.initComponent
							},
							// 列表界面刷新
							'logmanagement button[action=search]' : {
								click : this.refreshRecord
							},
							// 数据导出
							'logmanagement button[action=export]' : {
								click : this.exportExcel
							}
						});
			},

			/**
			 * 页面初始化方法
			 * 
			 * @param {}
			 *            grid 事件触发控件
			 */
			initComponent : function(view) {
				this.listPanel = view;
				this.initWhereStr = "TSystemLogType.valid = '1' and ServerHit.request_url like CONCAT('%',TSystemLogType.key_word,'%')";
				this.searchStartDate = this.listPanel.down('datefield[name=searchStartDate]');
				this.searchEndDate = this.listPanel.down('datefield[name=searchEndDate]');
				this.searchUserId = this.listPanel.down('combogrid[name=searchUserId]');
				this.refreshRecord();
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				tempString += this.initWhereStr;
				if (this.searchStartDate.getValue()) {
					tempString += ' and ServerHit.hit_start_date_time >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if (this.searchEndDate.getValue()) {
					if (this.searchStartDate.getRawValue() > this.searchEndDate.getRawValue()) {
						showWarning('开始日期不允许大于结束日期，请重新选择！');
						return;
					}
					tempString += ' and ServerHit.hit_start_date_time <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
				if (!Ext.isEmpty(this.searchUserId.getValue())) {
					tempString += ' and ServerHit.user_login_id = \'' + this.searchUserId.getValue() + '\'';
				}
				this.listPanel.store.getProxy().extraParams.whereStr = tempString;
				this.listPanel.store.load();
			},

			/**
			 * 获取报表参数
			 * 
			 * @return {}
			 */
			getParams : function() {
				var tempheader = this.listPanel.headerCt.query('{isVisible()}');
				var header = "";
				var dataIndex = "";
				var count = 0;
				Ext.each(tempheader, function(column, index, length) {
							if (column.xtype != 'rownumberer') {
								if (count != 0) {
									header += ",";
									dataIndex += ",";
								}
								header += column.text;
								dataIndex += column.dataIndex;
								count++;
							}
						})
				with (this.listPanel.store) {
					var params = {
						// Store参数
						sort : Ext.encode(getSorters()),
						filter : Ext.encode(filters.items),

						// 页面参数
						entity : 'VSystemLog', // 导出实体名称，一般为视图名称。
						title : '系统日志', // sheet页名称
						header : header, // 表头
						dataIndex : dataIndex, // 数据引用
						type : 'EXCEL',
						whereStr : getProxy().extraParams.whereStr
					}
					return params;
				}
			}
		});