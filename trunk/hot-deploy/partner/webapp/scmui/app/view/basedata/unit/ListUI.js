/*
 * 定义列表界面
 * Mark
 */
Ext.define('SCM.view.basedata.unit.ListUI' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.unitlist',

    title : '计量单位',
    
    store: 'basedata.UnitStore',
    
    initComponent: function() {
        this.initColumns();
        this.initToolBar();
        //this.initStore();
        this.callParent(arguments);
        this.store.load();
    },

	//初始化列
	initColumns: function(){
    	 this.columns = [
    	                 {header: 'id',  dataIndex: 'id', width:200,hidden:true},
    	                 {header: '编码',  dataIndex: 'number', width:200},
    	                 {header: '名称', dataIndex: 'name', width:200}
    	 ];
    },
    //初始化工具栏
    initToolBar: function(){
    	this.dockedItems=[
    	   {xtype:'toolbar',
    		items:[{text:'新增',cls:'x-btn-text-icon',icon:'/scmui/images/icons/add.png',action:'addNew'},
    		       {text:'修改',cls:'x-btn-text-icon',icon:'/scmui/images/icons/edit.png',action:'modify'},
    		       {text:'删除',cls:'x-btn-text-icon',icon:'/scmui/images/icons/delete.png',action:'delete'},
    		       {text:'刷新',cls:'x-btn-text-icon',icon:'/scmui/images/icons/refresh.png',action:'refresh'},
    		       '->',{xtype:'textfield'},{text:'查询'}]}
    	];
    },
    //初始化数据
    initStore: function(){
    	
    }
});
