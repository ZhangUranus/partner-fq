Ext.namespace('SCM');

/**
 * 系统全局参数
 */
SCM.CurrentUser="";
SCM.SystemMonthlyYear=2012;
SCM.SystemMonthlyMonth=1;
/**
 * 系统默认尺寸
 */
SCM.MinSize = Ext.apply({//label等于3－4个中文字
			WINDOW_WIDTH : 300,
			WINDOW_HEIGHT : 350,
			FORM_WIDTH : 300,
			FIELD_WIDTH : 260,
			LABEL_WIDTH : 40,
			COMBOGRID_WIDTH : 200,
			COMBOGRID_HEIGHT : 250,
			COMBOGRID_EXTRA_WIDTH : 320
		}, SCM.MinSize || {});
		
SCM.DefaultSize = Ext.apply({//label等于3－4个中文字
			WINDOW_WIDTH : 320,
			WINDOW_HEIGHT : 400,
			FORM_WIDTH : 320,
			FIELD_WIDTH : 280,
			LABEL_WIDTH : 60,
			COMBOGRID_WIDTH : 200,
			COMBOGRID_HEIGHT : 250,
			COMBOGRID_EXTRA_WIDTH : 320
		}, SCM.DefaultSize || {});
		
SCM.MaxSize = Ext.apply({//label等于5－6个中文字
			WINDOW_WIDTH : 340,
			WINDOW_HEIGHT : 450,
			FORM_WIDTH : 340,
			FIELD_WIDTH : 300,
			LABEL_WIDTH : 80,
			COMBOGRID_WIDTH : 200,
			COMBOGRID_HEIGHT : 250,
			COMBOGRID_EXTRA_WIDTH : 320
		}, SCM.MaxSize || {});

/**
 * 列表每页条数配置
 */
SCM.pageSize=20;		//整页面页大小
SCM.halfPageSize=10;	//一半页面页大小
SCM.billPageSize=15;	//单据页大小
SCM.comboPageSize=50;		//下拉框最大条数
SCM.unpageSize=10000;	//不分页大小