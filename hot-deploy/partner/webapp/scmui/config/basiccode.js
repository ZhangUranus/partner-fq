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

SCM.store.basiccode.billStatusStore = new Ext.data.Store({
			fields : ['id', 'name'],
			data : [{
						'id' : 0,
						'name' : '保存'
					}, {
						'id' : 1,
						'name' : '已审核'
					}, {
						'id' : 2,
						'name' : '审核不通过'
					}, {
						'id' : 3,
						'name' : '已结算'
					}, {
						'id' : 4,
						'name' : '已提交'
					}]
		});
SCM.store.basiccode.billStatusRenderer = function(value) {
	if (value == 0) {
		return '保存';
	} else if (value == 1) {
		return '已审核';
	} else if (value == 2) {
		return '审核不通过';
	} else if (value == 3) {
		return '已结算';
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
