/*
 * 仓库列表界面
 * Mark
 */
Ext.define('SCM.view.basedata.warehouse.ListUI' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.warehouseinfomaintaince',//对应菜单link

    title : '仓库',
    
    store: 'basedata.WarehouseStore',
    
    initComponent: function() {
        this.initColumns();
        this.initToolBar();
//        this.initStore();
        this.callParent(arguments);
        this.store.load();
    },

	//初始化列
	initColumns: function(){
    	 this.columns = [
    	                 {header: 'id',  dataIndex: 'id', width:200,hidden:true},
    	                 {header: '仓库类型id',  dataIndex: 'wsTypeId', width:200,hidden:true},
    	                 {header: '仓库类型',  dataIndex: 'warehouseTypeName', width:200},
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
