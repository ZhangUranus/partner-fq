<script type="text/javascript">
Ext.require([
    'Ext.form.*'
]);

var MyPanel;

Ext.onReady(function() {
	MyPanel = Ext.create('Ext.form.Panel', {
		frame:true,
        title: '新增订单',
        bodyStyle:'padding:5px 5px 0',
        width: 600,
        fieldDefaults: {
            labelAlign: 'top',
            msgTarget: 'side'
        },
        items: [{
            xtype: 'container',
            anchor: '100%',
            layout:'column',
            items:[{
                xtype: 'container',
                columnWidth:.5,
                layout: 'anchor',
                items: [{
                    xtype:'textfield',
                    fieldLabel: '编码',
                    name: 'testId',
                    anchor:'96%'
                },{
                    xtype:'textfield',
                    fieldLabel: '名称',
                    name: 'testName',
                    anchor:'96%'
                }]
            }]}],
	    tbar : [
	    	{
	    		text: '保存',
	    		iconCls: 'save',
            	iconAlign: 'left',
            	handler: submit
	    	},{
	    		text: '返回',
	    		iconCls: 'back',
            	iconAlign: 'left'
	    	},{
	    		text: '打印',
	    		iconCls: 'print',
            	iconAlign: 'left'
	    	}]
	});

    MyPanel.render('form-ct');

});

function submit() {
     MyPanel.getForm().submit({
         waitMsg: '正在提交数据',
         waitTitle: '提示',
         url: 'formSubmit',
         method: 'GET',
         success: function(form, action) {
         	debugger;
         	Ext.Msg.alert('Success', 'Success');
         },
         failure: function(form, action) {
         	debugger;
         	Ext.Msg.alert('failure', 'failure');
         }
     });
}
</script>

<div id="form-ct"></div>