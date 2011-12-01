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