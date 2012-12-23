Ext.namespace('SCM.store.basiccode');

SCM.store.basiccode.sexStore = new Ext.data.Store({
			fields : ['id', 'name'],
			data : [{
						'id' : '0',
						'name' : '男'
					}, {
						'id' : '1',
						'name' : '女'
					}]
		});
SCM.store.basiccode.sexRenderer = function(value) {
	if (value == "0") {
		return "男";
	} else
		return "女"
};

SCM.store.basiccode.validStore = new Ext.data.Store({
			fields : ['id', 'name'],
			data : [{
						'id' : 'Y',
						'name' : '是'
					}, {
						'id' : 'N',
						'name' : '否'
					}]
		});
SCM.store.basiccode.validRenderer = function(value) {
	if (value == "Y") {
		return "是";
	} else
		return "否"
};

SCM.store.basiccode.validColorRenderer = function(value) {
	if (value == "Y") {
		return "<font color='green'><b>是</b></font>";
	} else
		return "<font color='red'><b>否</b></font>";
};

SCM.store.basiccode.billStatusStore = new Ext.data.Store({
			fields : ['id', 'name'],
			data : [{
						'id' : -1,
						'name' : '未保存'
					}, {
						'id' : 0,
						'name' : '保存'
					}, {
						'id' : 1,
						'name' : '已审核'
					}, {
						'id' : 2,
						'name' : '审核不通过'
					}, {
						'id' : 4,
						'name' : '已提交'
					}]
		});
SCM.store.basiccode.billStatusRenderer = function(value) {
	if (value == -1) {
		return '未保存';
	} else if (value == 0) {
		return '保存';
	} else if (value == 1) {
		return '已审核';
	} else if (value == 2) {
		return '审核不通过';
	} else if (value == 4) {
		return '已提交';
	}
};

SCM.store.basiccode.approverStore = new Ext.data.Store({
			fields : ['id', 'name'],
			data : [{
						'id' : 1,
						'name' : '通过'
					}, {
						'id' : 2,
						'name' : '不通过'
					}]
		});
SCM.store.basiccode.approverRenderer = function(value) {
	if (value == 1) {
		return "通过";
	} else
		return "不通过"
};

SCM.store.basiccode.purchaseTypeStore = new Ext.data.Store({
			fields : ['id', 'name'],
			data : [{
						'id' : 1,
						'name' : '采购单'
					}, {
						'id' : 2,
						'name' : '调整单'
					}]
		});
SCM.store.basiccode.purchaseTypeRenderer = function(value) {
	if (value == 1) {
		return "采购单";
	} else
		return "调整单"
};

SCM.store.basiccode.warehousingBillTypeStore = new Ext.data.Store({
			fields : ['id', 'name'],
			data : [{
						'id' : 1,
						'name' : '普通单据'
					}, {
						'id' : 2,
						'name' : '扫描单据'
					}]
		});
SCM.store.basiccode.warehousingBillTypeRenderer = function(value) {
	if (value == 1) {
		return "普通单据";
	} else
		return "扫描单据"
};

SCM.store.basiccode.billTypeStore = new Ext.data.Store({
			fields : ['id', 'name'],
			data : [{
						'id' : '0',
						'name' : '盈'
					}, {
						'id' : '1',
						'name' : '亏'
					}]
		});
SCM.store.basiccode.billTypeRenderer = function(value) {
	if (value == '0') {
		return "盈";
	} else
		return "亏"
};

SCM.store.basiccode.checkStatusStore = new Ext.data.Store({
			fields : ['id', 'name'],
			data : [{
						'id' : 0,
						'name' : '未验收'
					}, {
						'id' : 1,
						'name' : '验收中'
					}, {
						'id' : 2,
						'name' : '已完成'
					}]
		});
SCM.store.basiccode.checkStatusRenderer = function(value) {
	if (value == 0) {
		return '未验收';
	} else if (value == 1) {
		return '验收中';
	} else if (value == 2) {
		return '已完成';
	}
};

SCM.store.basiccode.auditStatusStore = new Ext.data.Store({
			fields : ['id', 'name'],
			data : [{
						'id' : 0,
						'name' : '未核准'
					}, {
						'id' : 1,
						'name' : '已核准'
					}]
		});
SCM.store.basiccode.auditStatusRenderer = function(value) {
	if (value == 0) {
		return '未核准';
	} else if (value == 1) {
		return '已核准';
	}
};

SCM.store.basiccode.productInStatusStore = new Ext.data.Store({
			fields : ['id', 'name'],
			data : [{
						'id' : '1',
						'name' : '正常进仓'
					}, {
						'id' : '2',
						'name' : '改板进仓'
					}, {
						'id' : '3',
						'name' : '返工进仓'
					}]
		});
SCM.store.basiccode.productInStatusRenderer = function(value) {
	if (value == '1') {
		return '正常进仓';
	} else if (value == '2') {
		return '改板进仓';
	} else if (value == '3') {
		return '返工进仓';
	}
};

SCM.store.basiccode.productOutStatusStore = new Ext.data.Store({
			fields : ['id', 'name'],
			data : [{
						'id' : '1',
						'name' : '正常出仓'
					}, {
						'id' : '2',
						'name' : '改板出仓'
					}, {
						'id' : '3',
						'name' : '返工出仓'
					}]
		});
SCM.store.basiccode.productOutStatusRenderer = function(value) {
	if (value == '1') {
		return '正常出仓';
	} else if (value == '2') {
		return '改板出仓';
	} else if (value == '3') {
		return '返工出仓';
	}
};

SCM.store.basiccode.packageTypeStore = new Ext.data.Store({
			fields : ['id', 'name'],
			data : [{
						'id' : 'P',
						'name' : '普通'
					}, {
						'id' : 'Y',
						'name' : '亚中'
					}]
		});
SCM.store.basiccode.packageTypeRenderer = function(value) {
	if (value == 'P') {
		return '普通';
	} else if (value == 'Y') {
		return '亚中';
	}
};


SCM.store.basiccode.warningRenderer = function(value) {
	if (value) {
		return '<span class="flag-red" >&nbsp&nbsp&nbsp&nbsp</span>';
	} else {
		return '<span class="flag-green" >&nbsp&nbsp&nbsp&nbsp</span>';
	}
};

/**
 * 用于处理提交数据 封装表头标题数据
 */
function processOneEntryModel(oneEntryModel, record, entryStore) {
	var createAr = new Array();
	var updateAr = new Array();
	var deleteAr = new Array();

	var removed = entryStore.getRemovedRecords();
	var updated = entryStore.getUpdatedRecords();
	var newed = entryStore.getNewRecords();
	Ext.each(removed, function(record) {
				deleteAr.push(record.data);
			});
	Ext.each(updated, function(record) {
				updateAr.push(record.data);
			});
	Ext.each(newed, function(record) {
				createAr.push(record.data);
			});
	oneEntryModel.set('updateEntrys', updateAr);
	oneEntryModel.set('createEntrys', createAr);
	oneEntryModel.set('deleteEntrys', deleteAr);
	oneEntryModel.set('head', record.data);

	oneEntryModel.phantom = record.phantom;// 新增，或者更新
	return oneEntryModel;
};

/**
 * 修改date对象数据的JSON提交方式
 */
Ext.JSON.encodeDate = function(d) {
	time = d.getTime();
	return time;
};

showInfo = function(msg) {
	Ext.Msg.show({
				title : '提示',
				msg : msg,
				buttons : Ext.Msg.YES,
				icon : Ext.Msg.INFO
			});
};
showError = function(msg) {
	Ext.MessageBox.show({
				title : '错误',
				msg : msg,
				icon : Ext.MessageBox.ERROR,
				buttons : Ext.Msg.OK
			});
};

showWarning = function(msg) {
	Ext.MessageBox.show({
				title : '警告',
				msg : msg,
				icon : Ext.MessageBox.WARNING,
				buttons : Ext.Msg.OK
			});
};

var defaultPrintCss = '<style type="text/css">' + '.base' + '{' +
/* 绝对定位 */
		'position: absolute; ' +
		/* 绝对定位是的左边距离 */
		'left:50px; ' +
		/* 绝对定位是的上边距离 */
		'top:100px; ' + 'width:300px;' +
		/* 内容超过规定宽度时是否换行 */
		'white-space: nowrap; ' +
		/* 内容超过规定宽度时是否截取超长部分 */
		'overflow:hidden;' +
		/* 分页 page-break-before:always; */
		'}' + '</style>';

/*
 * 打印数据 @win 输出窗口 @data 打印的内容，json对象
 * {billNumber:'001',bizDate:'2012-08-09',supplierName:'江门开发'
 * ,entries:[{materialName:'钢条',volume:10},{materialName:'钢条',volume:10}]}
 * @printTemplate 打印模板，定义打印内容的打印样式
 * [{dataIndex:'data.billNumber',style:'left:0px;top:150px'},
 * {dataIndex:'data.supplierName',style:'left:0px;top:100px'},{dataIndex:'data.entries[0].materialName',style:'left:0px;top:150px'}]
 */
function appendData2Win(win, data, printTemplate) {

	var records = new Array(printTemplate.length);
	for (var t in printTemplate) {
		var item = printTemplate[t];
		try {
			var text = eval(item.dataIndex);/* 查找data对象的打印值 */
			records[t] = {
				style : item.style,
				text : text
			};
		} catch (err) {
			/* 没有查找到对象值，忽略 */
		}
	}
	insertPrintContent(win, records);
}
/* jason 对象转化为html字符添加到页面上，[{style:'',text:''},{}....] */
function insertPrintContent(win, records) {
	win.document.write(defaultPrintCss);
	if (Ext.isArray(records) && win.document != undefined) {
		for (var i in records) {
			win.document.write(getBlock(records[i]));
		}
	}
};
/* jason 对象转化为div，{style:'',text:''} */
function getBlock(jo) {
	jo = jo || {};
	var str = '<div class=base ';
	if (jo.style != undefined) {
		str = str + ' style=\'' + jo.style + ' \' ';
	}
	str = str + '>' + jo.text + '</div>';
	return str;
};
/*多页打印实现
 1. 多页打印时有且只能有一个循环体(table)，并定义table最大行数即是循环值；
 2. 用户可以独立定义主页，循环页，尾页的样式。一定要定义一个主页，循环页或者尾页没有定义时，
 系统会使用主页样式生成循环页或者尾页；如果只有两页，则最后一页使用尾页样式。
 */

function PrintConfig() {
	this.mainBodyDiv = '';//主页样式
	this.loopBodyDiv = '';//循环页样式
	this.tailDiv = '';//尾页样式
	this.loopCount = 7; //循环数
	this.useTailWhenOnePage = false;//当打印只有一页的时候，如果tailDiv!=undefinded 就使用tailDiv打印
	this.loopEntryIndex = 'data.entry';//循环体数据索引
};

function PrintHelper() {
};
// 根据属性map获取fieldindex的值
PrintHelper.prototype.getIndex = function(attrMap, index) {
	if (attrMap.getNamedItem) {
		var fa = attrMap.getNamedItem(index);
		if (fa != null && fa.value != undefined) {
			return fa.value;
		}
	}
};
// 填充打印内容
PrintHelper.prototype.writePrintContent = function(doc, data, printConfig) {
	if (doc == null || doc == undefined || data == null || data == undefined || printConfig == null || printConfig == undefined)
		return;
	var commHtml = "<html>" + "<head>" + "    <title>打印页面</title>" + "   <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>"
			+ "   <link rel='stylesheet' type='text/css' href='css/print.css'>" + "</head>" + "<body> </body>" + "</html>";
	doc.write(commHtml);
	//分页符
	var nextPageDiv = "<div class='nextPage'></div>";

	//计算需要打印多少页
	var pagesCount;
	var loopEntry = eval(printConfig.loopEntryIndex);
	pagesCount = Math.ceil(loopEntry.length / printConfig.loopCount);//无条件进位

	//设置总页数,转化为字符类型，这样打印出来就不显示小数位
	data.totalPages = '' + pagesCount;
	//设置当前页数
	data.curPage = '1';

	//循环体开始、结束记录位置，从1开始
	var fromCount = 1;
	var endCount = printConfig.loopCount;

	//写入第一页
	var mainBodyDiv = doc.createElement('div');

	//如果只有一页判断是否使用尾页样式
	if (pagesCount == 1 && printConfig.useTailWhenOnePage && !(printConfig.tailDiv == undefined || printConfig.tailDiv == '')) {
		mainBodyDiv.innerHTML = printConfig.tailDiv;
	} else {
		mainBodyDiv.innerHTML = printConfig.mainBodyDiv;
	}
	doc.body.appendChild(mainBodyDiv);
	this.fillPage(mainBodyDiv, data, fromCount, endCount, printConfig.loopCount);

	//开始结束位置调整
	fromCount = endCount + 1;
	endCount = fromCount + printConfig.loopCount - 1;
	if (endCount > loopEntry.length) {
		endCount = loopEntry.length;
	}

	if (pagesCount > 2) {//三页以上，循环页处理
		//写入循环页
		for (var i = 2; i <= pagesCount - 1; i++) {
			//分页
			var nextPageDiv = doc.createElement('div');
			nextPageDiv.className = 'nextPage';
			doc.body.appendChild(nextPageDiv);

			//设置当前页数
			data.curPage = '' + i;

			//写入循环页
			var loopDiv = doc.createElement('div');
			if (printConfig.loopBodyDiv == undefined || printConfig.loopBodyDiv == '') {//没有定义循环页样式
				loopDiv.innerHTML = printConfig.mainBodyDiv;
			} else {//定义循环页样式
				loopDiv.innerHTML = printConfig.loopBodyDiv;
			}
			doc.body.appendChild(loopDiv);
			this.fillPage(loopDiv, data, fromCount, endCount, printConfig.loopCount);

			//开始结束位置调整
			fromCount = endCount + 1;
			endCount = fromCount + printConfig.loopCount - 1;
		}

	}

	if (pagesCount > 1) {//大于一页尾页处理
		data.curPage = '' + pagesCount;
		//分页
		var nextPageDiv = doc.createElement('div');
		nextPageDiv.className = 'nextPage';
		doc.body.appendChild(nextPageDiv);

		//写入第二页
		var tailDiv = doc.createElement('div');
		if (printConfig.tailDiv == undefined || printConfig.tailDiv == '') {//没有定义尾页样式
			tailDiv.innerHTML = printConfig.mainBodyDiv;
		} else {//定义尾页样式
			tailDiv.innerHTML = printConfig.tailDiv;
		}
		doc.body.appendChild(tailDiv);
		this.fillPage(tailDiv, data, fromCount, loopEntry.length, printConfig.loopCount);

	}

};

// 填充page里面的数据
PrintHelper.prototype.fillPage = function(/* 填充数据的Element对象 */page, data,/* 循环体取数范围，从1开始 */fromCount, endCount,/*打印显示的行数，填充数量不够插入空行*/maxCount) {
	// 填充表头字段-------------------
	var fields = page.getElementsByClassName('dataField');
	for (var i = 0; i < fields.length; i++) {
		var field = fields.item(i);
		var fi = this.getIndex(field.attributes, 'fieldindex');// 返回数据索引字符串
		var cbScript=this.getIndex(field.attributes, 'script');//返回后置处理脚本
		if (fi) {
			try {
				var value = eval(fi);/* 查找data对象的打印值 */
				if ((typeof value) == 'number') {
					value = value.toFixed(4);//显示四位小数
				}
				//added by mark 2012-11-25 处理获取值之后调用后置处理脚本，解决问题，例如一些数值字段序号，不显示小数位，其他数值字段显示小数位
				if(cbScript){
					value=eval(cbScript.replace('$',value));
				}
				
				if (value != undefined) {
					field.innerText = value;
				}
			} catch (err) {
				/* 没有查找到对象值，忽略 */
			}
		}

	}

	// 填充表头字段结束-------------------

	// 填充循环体字段-------------------
	var loopTables = page.getElementsByClassName('dataEntry');
	if (loopTables != null && loopTables.length > 0) {
		for (var i = 0; i < loopTables.length; i++) {
			var ltable = loopTables.item(i);
			// 获取循环表对应的数据索引
			var bindEntryIndex = this.getIndex(ltable.attributes, 'fieldindex');

			// 获取列信息列表
			var columns = ltable.getElementsByTagName('th');

			// 按顺序记录绑定的字段
			var fieldMapArr = new Array(columns.length);
			//按顺序记录后置脚本,获取值之后再执行一次
			var entryCallbackScript=new  Array(columns.length);
			for (var j = 0; j < columns.length; j++) {
				var tc = columns.item(j);
				fieldMapArr[j] = this.getIndex(tc.attributes, 'bindfield');
				entryCallbackScript[j] = this.getIndex(tc.attributes, 'script');
			}

			var bindEntryData;
			try {
				bindEntryData = eval(bindEntryIndex);/* 查找data对象的打印值 */
			} catch (err) {
				/* 没有查找到对象值，忽略 */
				continue;
			}
			if (bindEntryData != null && bindEntryData.length != undefined) {
				// 判断是否符合分页输出条件
				if (fromCount != null && endCount != null && fromCount != undefined && endCount != undefined && fromCount > 0 && endCount >= fromCount && endCount <= bindEntryData.length) {

				} else {
					fromCount = 1;
					endCount = bindEntryData.length;
				}

				// 循环每行数据，在table上添加对应的行记录
				var insertPos = 1;
				for (var k = fromCount - 1; k < endCount; k++) {
					var row = ltable.insertRow(insertPos);// 向最后插入一行
					insertPos++;

					// 插入列
					for (var cn = 0; cn < fieldMapArr.length; cn++) {
						var cell = row.insertCell(cn);
						// 获取每列的值
						try {
							var value = eval(bindEntryIndex + "[" + k + "]." + fieldMapArr[cn]);/* 查找data对象的打印值 */
							if ((typeof value) == 'number') {
								value = value.toFixed(4);//显示四位小数
							}
							
							//added by mark 2012-11-25 处理获取值之后调用后置处理脚本，解决问题，例如一些数值字段序号，不显示小数位，其他数值字段显示小数位
							if(entryCallbackScript[cn]){
								var rawScript=entryCallbackScript[cn];
								value=eval(rawScript.replace('$',value));
							}
							if (value != undefined) {
								cell.innerText = value;
							}
						} catch (err) {
							/* 没有查找到对象值，忽略 */
							continue;
						}
					}
				}

				//插入空行 
				if (endCount - fromCount >= 0 && endCount - fromCount < maxCount - 1) {
					var emptyRowCount = maxCount - (endCount - fromCount + 1);//空行数量
					for (var i = 0; i < emptyRowCount; i++) {
						var emptyRow = ltable.insertRow(insertPos);// 向最后插入一行
						for (var cn = 0; cn < columns.length; cn++) {
							var cell = emptyRow.insertCell(cn);
							cell.innerHTML = '&nbsp;';
						}
					}
				}

			}

		}
	}
	// 填充循环体字段结束-------------------

};
// 获取当前时间yyyy-MM-dd hh:mi:ss 格式
PrintHelper.prototype.getPrintTime = function() {
	var nd = new Date();
	var tStr = nd.getFullYear();
	tStr += "-" + (nd.getMonth() + 1);
	tStr += "-" + nd.getDate();

	tStr += " " + nd.getHours();
	tStr += ":" + nd.getMinutes();
	tStr += ":" + nd.getSeconds();

	return tStr;
};
var printHelper = new PrintHelper();
