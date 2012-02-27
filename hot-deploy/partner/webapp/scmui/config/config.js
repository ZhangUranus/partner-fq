Ext.namespace('SCM');

/**
 * 系统全局参数
 */
SCM.CurrentUserUID="";
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
			COMBOGRID_HEIGHT : 250
		}, SCM.MinSize || {});
		
SCM.DefaultSize = Ext.apply({//label等于3－4个中文字
			WINDOW_WIDTH : 320,
			WINDOW_HEIGHT : 400,
			FORM_WIDTH : 320,
			FIELD_WIDTH : 280,
			LABEL_WIDTH : 60,
			COMBOGRID_WIDTH : 200,
			COMBOGRID_HEIGHT : 250
		}, SCM.DefaultSize || {});
		
SCM.MaxSize = Ext.apply({//label等于5－6个中文字
			WINDOW_WIDTH : 340,
			WINDOW_HEIGHT : 450,
			FORM_WIDTH : 340,
			FIELD_WIDTH : 300,
			LABEL_WIDTH : 80,
			COMBOGRID_WIDTH : 200,
			COMBOGRID_HEIGHT : 250
		}, SCM.MaxSize || {});