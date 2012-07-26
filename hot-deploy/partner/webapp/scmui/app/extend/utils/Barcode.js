/**
 * 产品条形码工具类
 */
Ext.define('SCM.extend.utils.Barcode', {
			code : '',
			type : '',
			
			/**
			 * 初始化条形码
			 */
		    constructor: function(barcode,codeType) {
				this.code = barcode ;
				this.type = codeType ;  //编码类型，保留字段
		    },
			
			/**
			 * 获取宜家产品号
			 */
			getCodeForIkea : function() {
				return this.code.substring(5,13);
			},
			
			/**
			 * 获取供应商编码
			 */
			getSupplierId : function() {
				return this.code.substring(13,18);
			},
			
			/**
			 * 获取生产周
			 */
			getProductWeek : function() {
				return '20' + this.code.substring(22,24) + '-' + this.code.substring(24,26) + 'W';
			},
			
			/**
			 * 获取板数量
			 */
			getQantity : function() {
				return this.code.substring(30,this.code.length);
			}
		})