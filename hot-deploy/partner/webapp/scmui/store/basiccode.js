Ext.namespace('Ext.partner.basiccode');

Ext.partner.basiccode.sexStore = new Ext.data.Store({
	fields: ['id', 'name'],
	data : [
		{'id':'0', 'name':'男'},
		{'id':'1', 'name':'女'}
	]
});
Ext.partner.basiccode.sexRenderer = function(value){
	if(value=="0"){
		return "男";
	}else 
		return "女"
};

Ext.partner.basiccode.validStore = new Ext.data.Store({
	fields: ['id', 'name'],
	data : [
		{'id':'Y', 'name':'是'},
		{'id':'N', 'name':'否'}
	]
});
Ext.partner.basiccode.validRenderer = function(value){
	if(value=="Y"){
		return "是";
	}else 
		return "否"
};

Ext.partner.basiccode.billStatusStore = new Ext.data.Store({
	fields: ['id', 'name'],
	data : [
		{'id':'0', 'name':'保存'},
		{'id':'1', 'name':'已审核'},
		{'id':'2', 'name':'审核不通过'},
		{'id':'3', 'name':'已结算'}
	]
});
Ext.partner.basiccode.billStatusRenderer = function(value){
	if(value=='0'){
		return '保存';
	}else if(value=='1'){
		return '已审核';
	}else if(value=='2'){
		return '审核不通过';
	}else if(value=='3'){
		return '已结算';
	}
		
};

/**  
 * 用于处理提交数据  封装表头标题数据
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

	oneEntryModel.phantom=record.phantom;//新增，或者更新
    return oneEntryModel;   
};

/** 
 * 修改date对象数据的JSON提交方式 
 */  
Ext.JSON.encodeDate = function(d) {  
	time=d.getTime();
    return   time;
};  

showError= function(msg){
	Ext.MessageBox.show({
                    title: '错误',
                    msg: msg,
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.Msg.OK
                });
};
