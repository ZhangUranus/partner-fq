// 定义数据模型
Ext.define('SCM.model.WorkshopOtherDrawBill.WorkshopOtherDrawBillEditEntryModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'WorkshopOtherDrawBillEditEntryModel',
			// 字段
			fields: [
	             {name: 'id',  type: 'string'}
				 ,{name: 'parentId',  type: 'string'}
				 				 // \n
				 ,{name: 'warehouseWarehouseId',type:'string'  }
				 ,{name: 'warehouseWarehouseName',type:'string',persist:false }
				 				 				 // \n
				 ,{name: 'materialMaterialId',type:'string'  }
				 ,{name: 'materialMaterialName',type:'string',persist:false }
				 , {
						name : 'materialMaterialModel',
						type : 'string'
					}
				 ,{name: 'volume' ,type:'float'  }
				 				 				 // \n
				 ,{name: 'unitUnitId',type:'string'  }
				 ,{name: 'unitUnitName',type:'string',persist:false }
				 				 				 // \n
				 ,{name: 'price' ,type:'float'  }
				 				 				 // \n
				 ,{name: 'refPrice' ,type:'float'  }
				 				 				 // \n
				 ,{name: 'entrysum' ,type:'float'  }
				 				 // \n
			],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=WorkshopOtherDrawBillEntryView'
				},
				remoteFilter : true
			}
		});