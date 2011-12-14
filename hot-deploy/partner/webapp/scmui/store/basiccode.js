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
}  