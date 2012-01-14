Ext.namespace('SCM');

/**
 * 系统默认尺寸
 */
SCM.MinSize = Ext.apply({//label等于3－4个中文字
			WINDOW_WIDTH : 300,
			FORM_WIDTH : 300,
			FIELD_WIDTH : 260,
			LABEL_WIDTH : 40,
			COMBOGRID_WIDTH : 210,
			COMBOGRID_HEIGTH : 250
		}, SCM.MinSize || {});
		
SCM.DefaultSize = Ext.apply({//label等于3－4个中文字
			WINDOW_WIDTH : 320,
			FORM_WIDTH : 320,
			FIELD_WIDTH : 280,
			LABEL_WIDTH : 60,
			COMBOGRID_WIDTH : 210,
			COMBOGRID_HEIGTH : 250
		}, SCM.DefaultSize || {});
		
SCM.MaxSize = Ext.apply({//label等于5－6个中文字
			WINDOW_WIDTH : 340,
			FORM_WIDTH : 340,
			FIELD_WIDTH : 300,
			LABEL_WIDTH : 80,
			COMBOGRID_WIDTH : 210,
			COMBOGRID_HEIGTH : 250
		}, SCM.MaxSize || {});