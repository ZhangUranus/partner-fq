/*
 * 仓库类型列表界面
 * Mark
 */
Ext.define('SCM.view.basedata.warehousetype.ListUI' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.warehousetypelist',

    title : '仓库类型',
    
    store: 'basedata.WarehouseTypeStore',
    
    initComponent: function() {
        this.initColumns();
        this.initToolBar();
//        this.initStore();
        this.callParent(arguments);
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
    		       {text:'刷新',cls:'x-btn-text-icon',icon:'/scmui/images/icons/refresh.png',action:'refresh'}
    		       ]}
    	];
    },
    //初始化数据缓存，定义数据格式
    initStore: function(){

    }
});
