Ext.define('SCM.controller.${TemplateName}.${TemplateName}Controller', {
    extend: 'Ext.app.Controller',
    mixins:['SCM.extend.controller.BillCommonController'],
	views: [
        '${TemplateName}.ListUI',
		'${TemplateName}.EditUI'
    ],
	
	stores:[
		'${TemplateName}.${TemplateName}Store',
		'${TemplateName}.${TemplateName}EditStore',
		'${TemplateName}.${TemplateName}EditEntryStore'
	],
	requires:['SCM.model.${TemplateName}.${TemplateName}ActionModel'],
	editName:'${TemplateName}edit',
	editStoreName:'${TemplateName}EditStore',
	entityName:'${TemplateName}',
	modelName:'${TemplateName}EditModel',
	entryModelName:'${TemplateName}EditEntryModel',
	actionModelName:'${TemplateName}ActionModel',
    init: function() {
		this.control({
			'${TemplateName}list':{
	        	afterrender: this.initComponent
	        },
			//列表新增按钮
	        '${TemplateName}list button[action=addNew]':{
	        	click: this.addNewRecord
	        },
			//列表事件
	        '${TemplateName}list gridpanel[region=center]': {
	    		select: this.showDetail //列表选择事件，显示明细
	        },
	        //列表修改按钮
	        '${TemplateName}list button[action=modify]':{
	        	click: this.editRecord
	        },
	        //列表删除按钮
	        '${TemplateName}list button[action=delete]':{
	        	click: this.deleteRecord
	        },
			//列表界面刷新
			'${TemplateName}list button[action=refresh]':{
	        	click: this.refreshRecord
	        },
	        //列表审核按钮
	        '${TemplateName}list button[action=audit]':{
	        	click: this.auditBill
	        },
	        //列表反审核按钮
	        '${TemplateName}list button[action=unaudit]':{
	        	click: this.unauditBill
	        },
	        //列表打印按钮
	        '${TemplateName}list button[action=print]':{
	        	click: this.print
	        },
			//编辑界面分录新增
	        '${TemplateName}edit  gridpanel button[action=addLine]':{
	        	click: this.addLine
	        },
			//编辑界面分录删除
	        '${TemplateName}edit  gridpanel button[action=deleteLine]':{
	        	click: this.deleteLine
	        },
			
			//编辑界面保存
			'${TemplateName}edit button[action=save]':{
				click: this.saveRecord
			},
			//编辑界面打印
			'${TemplateName}edit button[action=print]':{
				click: this.print
			}
		}
		);
    }

});