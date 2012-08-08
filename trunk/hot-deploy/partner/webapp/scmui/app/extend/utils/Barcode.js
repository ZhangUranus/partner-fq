/**
 * 产品条形码工具类
 * 类型1：宜家
 * 	条码1：240200569151673991120630104
 *		240 － 无意义
 *		20056915 － 宜家产品号
 *		16739 － 供应商编码
 *		91 － 无意义
 *		1206 － 2012年06周
 *		30 － 无意义
 *		104 － 代表一板54件产品
 *
 * 	条码2：00373116408702688673 －－无特殊意义
 * 
 * 类型2：其它
 * 	条码1：40099792201202270627
 * 		40099792 - 宜家产品代号
 * 		20120227 - 日期
 * 		06 - 第12周
 * 		？ - 希望可以加多一个字段 - 分别打板类型（1. 顶充，2. 侧充） *现时未加，将会加上。
 * 		27 - 打板数量（长度有可能变化）
 * 
 *  条码2：A2201202270071
 * 		A2 - 车间代号。（A1-安1车间， A2- 安2车间）
 * 		20120227 - 日期
 * 		0071 - 流水号，当日第几板（整够4位数）
 * 
 */
Ext.define('SCM.extend.utils.Barcode', {
			code : '',
			serie : '',
			type : 1,
			
			/**
			 * 初始化条形码
			 */
		    constructor: function(barcode1,barcode2,codeType) {
		    	var me = this;
		    	if(Ext.isEmpty(barcode1) || Ext.isEmpty(barcode2)){
		    		showWarning('产品条码不能为空！');
		    		return ;
		    	}
				me.code = barcode1 ;
				me.serie = barcode2 ;
				if(Ext.isEmpty(codeType)){
					if(me.code.indexOf('240') != 0){
						codeType = 2;
					} else {
						codeType = 1;
					}
				}
				me.type = codeType ;  //编码类型
				if(me.type == 1){
					if(!(me.code.length > 24)){
						showWarning('产品条码格式错误，请检查后重新输入！');
					}
				} else {
					if(!(me.code.length > 18)){
						showWarning('产品条码格式错误，请检查后重新输入！');
					}
				}
		    },
			
			/**
			 * 获取宜家产品号
			 */
			getCodeForIkea : function() {
				if(this.type == 1){
					return this.code.substring(3,11);
				} else {
					return this.code.substring(0,8);
				}
			},
			
			/**
			 * 获取供应商编码
			 */
			getSupplierId : function() {
				if(this.type == 1){
					return this.code.substring(11,16);		//供应商
				} else {
					return this.serie.substring(0,2);		//车间
				}
				
			},
			
			/**
			 * 获取生产周
			 */
			getProductWeek : function() {
				if(this.type == 1){
					return '20' + this.code.substring(18,20) + '-' + this.code.substring(20,22) + 'W';
				} else {
					return this.code.substring(8,12) + '-' + this.code.substring(16,18) + 'W';
				}
			},
			
			/**
			 * 获取板数量
			 */
			getQuantity : function() {
				if(this.type == 1){
					return this.code.substring(24,this.code.length);
				} else {
					return this.code.substring(18,this.code.length);
				}
			}
		})